import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated,  } from "@/utils/helpers";


export async function GET(req: NextRequest) {
    const profile = await isAuthenticated(req.cookies, true);
    return NextResponse.json(profile)

}
