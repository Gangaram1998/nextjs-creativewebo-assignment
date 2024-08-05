import { NextRequest, NextResponse } from "next/server";
const db = require("../../../lib/dbConnect");
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                status: 400,
                message: "Slide ID is required"
            });
        }

        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM slides WHERE id = ?', [id], (err: any, results: any) => {
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
            message: "Slide details successfully",
            data: results
        });
    } catch (error: any) {
        return NextResponse.json({ status: 400, error: error.toString() });
    }
}


export async function PATCH(req: NextRequest, res: NextResponse) {
    try {
        const { searchParams } = new URL(req.url);
        const slideId = searchParams.get('id');
        const formData = await req.formData();
        const body = Object.fromEntries(formData);

        if (!slideId) {
            return NextResponse.json({
                status: 201,
                message: "Slide ID is required.",
            });
        }

        const file = body.file as Blob;
        const updatedFields = {
            title: body.title as string || null,
            slide: body.file ? (body.file as File).name : null,
        };

        // Connect to the database and get the existing slide data
        const [slide]: any = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM slides WHERE id = ?', [slideId], (err: any, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });


        if (!slide) {
            return NextResponse.json({
                status: 201,
                message: "Slide not found.",
            });
        }

        const oldImagePath = path.resolve('public' + slide.slide);

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());

            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR);
            }

            const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
            const newFilename = `${uniqueSuffix}-${(body.file as File).name}`;
            const newFilePath = path.resolve(UPLOAD_DIR, newFilename);

            fs.writeFileSync(newFilePath, buffer);


            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            updatedFields.slide = `/uploads/${newFilename}`;
        } else {
            updatedFields.slide = slide.slide;
        }

        await db.query(
            "UPDATE slides SET title = ?, slide = ? WHERE id = ?",
            [updatedFields.title, updatedFields.slide, slideId]
        );

        return NextResponse.json({
            status: 200,
            message: "Slide updated successfully!",
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 201,
            error: error.toString(),
        });
    }
}