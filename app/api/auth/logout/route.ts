import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const response = NextResponse.json({ status: 200, message: "Logged out successfully!" });
        response.cookies.set('token', "", { httpOnly: true, expires: new Date(0) });
        return response;
    }
    catch (error: any) {
        return NextResponse.json({ status: 400, error: error.toString() })
    }
}