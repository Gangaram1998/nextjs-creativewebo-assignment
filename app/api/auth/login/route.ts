import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcryptjs');
const db = require('@/lib/dbConnect');
const jwt = require("jsonwebtoken")

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !password) {
            return NextResponse.json({ status: 201, message: 'Email and password are required' });
        }

        // Check if email exists
        const [user]: any = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (err: any, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (!user) {
            return NextResponse.json({ status: 201, message: 'User not found' });
        }

        // Verify password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ status: 201, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!, // Use an environment variable for the secret key
            { expiresIn: '1d' }
        );

        // Successful login
        const response = NextResponse.json({ status: 200, message: 'Login successful', user: user });
        response.cookies.set("token", token, { httpOnly: true });
        return response;

    } catch (error: any) {
        return NextResponse.json({ status: 400, error: error.toString() });
    }
}
