import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get("userId") || null
        const refreshToken = req.headers.get("x-access-token");
        if (!!userId && !!refreshToken) {
            console.log(userId, refreshToken)
            return NextResponse.json({ status: true })
        } else {
            console.log(userId, refreshToken)
            return NextResponse.json({ status: false, msg: "Invalid requests" })
        }

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ status: false })
    }
}
