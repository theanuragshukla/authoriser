import { isAuthenticated } from "@/utils/helpers";
import { cookies, headers } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { REFRESH_TOKEN, UID } from "../data/constants";
import React from "react";

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
}) {
    const header = headers();
    const pathname = header.get("x-pathname") || null;
    if (!!pathname && exception[pathname] === null) {
        return children;
    }

    const reqCookies = cookies();
    const { status: isLoggedIn } = await isAuthenticated(reqCookies);
    if (requireLogin) {
        if (isLoggedIn) return children;
        else if (reqCookies.has(REFRESH_TOKEN) && reqCookies.has(UID)) {
            redirect("/token", RedirectType.push);
        }else{

        }
    }else{
        if (isLoggedIn) redirect("/dashboard");
        else if (reqCookies.has(REFRESH_TOKEN) && reqCookies.has(UID)) {
            redirect(`/token`);
        } else {
            return children;
        }
    }
    return "gaehrguioae;rg";
}
