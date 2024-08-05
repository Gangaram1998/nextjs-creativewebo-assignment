import { rejects } from "assert";
import { NextRequest, NextResponse } from "next/server";
const db = require("../../../lib/dbConnect");
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");




export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM slides', (err: any, results: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(results)
                }
            })
        });
        return NextResponse.json({ status: 200, slides: results })
    }
    catch (error: any) {
        return NextResponse.json({ status: 400, error: error.toString() })
    }
}

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const formData = await req.formData();
        const body = Object.fromEntries(formData);
        const file = (body.file as Blob) || null;

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR, { recursive: true });
            }

            const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
            const filename = `${uniqueSuffix}-${(body.file as File).name}`;
            const filePath = path.resolve(UPLOAD_DIR, filename);

            fs.writeFileSync(filePath, buffer);

            const results = await new Promise((resolve, reject) => {
                db.query('INSERT INTO slides (title, slide) VALUES (?, ?)', [body.title, `/uploads/${filename}`], (err: any, results: any) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(results)
                    }
                })
            });

            return NextResponse.json({
                status: 200,
                message: "Slide created successfully!",
                result: results
            });
        } else {
            return NextResponse.json({
                status: 201,
                message: "File not found"
            });
        }
    }
    catch (error: any) {
        return NextResponse.json({ status: 400, error: error.toString() })
    }

}

export async function DELETE(req: NextRequest, res: NextResponse) {
    try {
        // Extracting id from the query parameters
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                status: 400,
                message: "Slide ID is required"
            });
        }

        const [slide]: any = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM slides WHERE id = ?', [id], (err: any, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const oldImagePath = path.resolve('public' + slide.slide);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }


        const results = await new Promise((resolve, reject) => {
            db.query('DELETE FROM slides WHERE id = ?', [id], (err: any, results: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(results)
                }
            })
        });


        return NextResponse.json({
            status: 200,
            message: "Slide deleted successfully"
        });
    } catch (error: any) {
        return NextResponse.json({ status: 400, error: error.toString() });
    }
}