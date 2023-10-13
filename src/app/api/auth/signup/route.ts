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
                const tokens = await generateTokens(body.uid);
                return NextResponse.json({
                    status: true,
                    msg: "signup success",
                    data: {
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token,
                        userId: user.uid,
                    },
                });
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
