import { isAuthenticated } from "@/utils/helpers";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { REFRESH_TOKEN, UID } from "../data/constants";
import React from "react";

// WILL FIX LATER

export async function AuthProvider({
    children,
    requireLogin = true,
    exception = {},
}: {
    children: React.ReactNode;
    requireLogin?: Boolean;
    exception?: {
        [key: string]: Boolean | null;
    };
}): Promise<JSX.Element> {
    const header = headers();
    const pathname = header.get("x-pathname") || "";
    const params = header.get("x-params") || "";
    const redirectParams = new URLSearchParams({
        toPath: pathname,
        params: params,
    });
    if (!!pathname && exception[pathname] === null) {
        return <>{children}</>;
    }

    const reqCookies = cookies();
    const { status: isLoggedIn } = await isAuthenticated(reqCookies);
    console.log(reqCookies.getAll(), isLoggedIn);
    if (requireLogin) {
        if (isLoggedIn) return <>{children}</>;
        else if (reqCookies.has(REFRESH_TOKEN) && reqCookies.has(UID)) {
            redirect(`/token?${redirectParams.toString()}`);
        } else {
            redirect(`/login?${redirectParams.toString()}`);
        }
    } else {
        if (isLoggedIn) redirect("/dashboard");
        else if (reqCookies.has(REFRESH_TOKEN) && reqCookies.has(UID)) {
            redirect(`/token?${redirectParams.toString()}`);
        } else {
            return <>{children}</>;
        }
    }
    return <>This shouldn&apos;t happen</>;
}
