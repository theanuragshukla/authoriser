import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const url = new URL(req.url);
    const origin = url.origin;
    const pathname = url.pathname;
    const searchParams = url.searchParams.toString()
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-url", req.url);
    requestHeaders.set("x-origin", origin);
    requestHeaders.set("x-pathname", pathname);
    requestHeaders.set("x-params", searchParams);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    //  matcher:[]
};
