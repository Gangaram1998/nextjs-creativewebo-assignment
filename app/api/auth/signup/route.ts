import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcryptjs');
const db = require("../../../../lib/dbConnect")

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const data = await req.formData();
        const name = data.get('name');
        const email = data.get('email');
        const password = data.get('password');
        const phone = data.get('phone');

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ status: 201, message: 'All fields are required' });
        }

        // Check for existing email
        const emailCheck = await new Promise<any[]>((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (err: any, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (emailCheck.length > 0) {
            return NextResponse.json({ status: 201, message: 'Email already in use' });
        }

        // Check for existing phone number
        const phoneCheck = await new Promise<any[]>((resolve, reject) => {
            db.query('SELECT * FROM users WHERE phone = ?', [phone], (err: any, results: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (phoneCheck.length > 0) {
            return NextResponse.json({ status: 201, message: 'Phone number already in use' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const result = await new Promise((resolve, reject) => {
            db.query('INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)', [email, hash, name, phone], (err: any, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        return NextResponse.json({ status: 200, message: "User Created successfully!" })
    }
    catch (error: any) {
        return NextResponse.json({ status: 400, error: error.toString() })
    }
}