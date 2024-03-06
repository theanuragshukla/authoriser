import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest, NextResponse } from "next/server";
import { Profile } from "./utils/interfaces/auth";
import { ACCESS_TOKEN } from "./app/data/constants";
import * as jose from "jose";
import { JwtPayload } from "jsonwebtoken";

const isAuthenticatedUnsafe = async (
    cookies: ReadonlyRequestCookies | RequestCookies,
    includeProfile: boolean = false
): Promise<{
    status: boolean;
    msg: string;
    data?: Profile;
}> => {
    try {
        const access = cookies.get(ACCESS_TOKEN)?.value;
        if (!!access) {
            const { data, usage, uid } = jose.decodeJwt(access) as JwtPayload;
            if (usage !== "access")
                return { status: false, msg: "Invalid Access Token" };
            return {
                status: true,
                msg: "authorised",
                ...(includeProfile ? { data: { ...data, uid } } : {}),
            };
        } else {
            return { status: false, msg: "unauthorised" };
        }
    } catch (error: any) {
        return {
            status: false,
            msg: error.message || "Unexpected server error",
        };
    }
};

export async function middleware(req: NextRequest) {
    const url = new URL(req.url);
    const origin = url.origin;
    const pathname = url.pathname;
    const searchParams = url.searchParams.toString();
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-url", req.url);
    requestHeaders.set("x-origin", origin);
    requestHeaders.set("x-pathname", pathname);
    requestHeaders.set("x-params", searchParams);
    console.log(url.toString());
    const data = await isAuthenticatedUnsafe(req.cookies, true);
    requestHeaders.set("profile", JSON.stringify(data.data));
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    //  matcher:[]
};
