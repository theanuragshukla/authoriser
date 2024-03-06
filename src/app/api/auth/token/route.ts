import { ACCESS_TOKEN, REFRESH_TOKEN, UID } from "@/app/data/constants";
import { refreshTokens } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const refresh = req.cookies.get(REFRESH_TOKEN)?.value;
        const userid = req.cookies.get(UID)?.value;
        const { status, tokens = null } = await refreshTokens(refresh, userid);
        if (status && !!tokens) {
            const response = NextResponse.json({
                status: true,
                msg: "tokens refreshed",
            });
            response.cookies.set(ACCESS_TOKEN, tokens.access_token, {
                secure: true,
                sameSite: true,
                maxAge: 3600,
                httpOnly: true,
            });
            response.cookies.set(REFRESH_TOKEN, tokens.refresh_token, {
                secure: true,
                sameSite: true,
                maxAge: 3600 * 24 * 30,
                httpOnly: true,
            });
            response.cookies.set(UID, tokens.uid as string, {
                secure: true,
                sameSite: true,
                maxAge: 3600 * 24 * 30,
                httpOnly: true,
            });
            return response;
        } else {
            const response = NextResponse.json({
                status: false,
                msg: "tokens cannot be refreshed",
            });
            response.cookies.delete(ACCESS_TOKEN);
            response.cookies.delete(REFRESH_TOKEN);
            response.cookies.delete(UID);
            return response;
        }
    } catch (error: any) {
        const response = NextResponse.json({
            status: false,
            msg: error.message || "tokens cannot be refreshed",
        });
        response.cookies.delete(ACCESS_TOKEN);
        response.cookies.delete(REFRESH_TOKEN);
        response.cookies.delete(UID);
        return response;
    }
}
