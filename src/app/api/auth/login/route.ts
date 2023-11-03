import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/utils/zodSchemas";
import { checkDupUser, generateTokens, verifyHash } from "@/utils/helpers";
import { ACCESS_TOKEN, REFRESH_TOKEN, UID } from "@/app/data/constants";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = loginSchema.safeParse(body);
        if (validation.success) {
            const { email, password } = body;
            const { isDup: exists, user } = await checkDupUser(email);
            if (exists) {
                const isMatch = await verifyHash(password, user.password);
                if (isMatch) {
                    const tokens = await generateTokens(user);
                    const response = NextResponse.json({
                        status: true,
                        msg: "Login Success",
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
                }
            }
            return NextResponse.json({
                status: false,
                msg: "Wrong email or password",
            });
        } else {
            const errors = validation.error.formErrors.fieldErrors;
            return NextResponse.json({
                status: false,
                errors,
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            status: false,
            msg: error.message || "Unexpected server error",
        });
    }
}
