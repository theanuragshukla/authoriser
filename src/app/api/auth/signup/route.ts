import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/utils/zodSchemas";
import {
    checkDupUser,
    generateTokens,
    generateUid,
    hashFunc,
    saveUser,
} from "@/utils/helpers";
import { SignupReq } from "@/utils/interfaces/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN, UID } from "@/app/data/constants";

interface Response {
    status: Boolean;
    errors?: SignupReq;
    msg: String;
    data?: {
        accessToken: String;
        refreshToken: String;
        userId: String;
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = signupSchema.safeParse(body);
        if (validation.success) {
            const { email, password } = body;
            const { isDup } = await checkDupUser(email);
            if (isDup) {
                return NextResponse.json({
                    status: false,
                    msg: "Email already in use",
                });
            }
            body.uid = generateUid();
            body.password = await hashFunc(password);
            const { status, user } = await saveUser(body);
            if (status && !!user) {
                const tokens = await generateTokens(user);
                const response = NextResponse.json({
                    status: true,
                    msg: "Signup Success",
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
                response.cookies.set(UID, user.uid, {
                    secure: true,
                    sameSite: true,
                    maxAge: 3600 * 24 * 30,
                    httpOnly: true,
                });

                return response;
            } else
                return NextResponse.json({
                    status: false,
                    msg: "Something unexpected happened",
                });
        } else {
            const errors = validation.error.formErrors.fieldErrors;
            return NextResponse.json({ status: false, errors });
        }
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            msg: error.message || "Unexpected server error",
        });
    }
}
