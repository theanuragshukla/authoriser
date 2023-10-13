import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/utils/helpers";


export async function GET(req: NextRequest) {
    const isLoggedIn = await isAuthenticated(req.cookies);
    return NextResponse.json(isLoggedIn);
}
