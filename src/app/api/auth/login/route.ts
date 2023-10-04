import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/utils/zodSchemas';
import { checkDupUser, generateTokens, verifyHash } from '@/utils/helpers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validation = loginSchema.safeParse(body)
        if (validation.success) {
            const { email, password } = body
            const { isDup: exists, user } = await checkDupUser(email)
            if (exists) {
                const isMatch = await verifyHash(password, user.password)
                if (isMatch) {
                    const tokens = await generateTokens(user)
                    return NextResponse.json({ status: true, accessToken: tokens.access_token, refreshToken: tokens.refresh_token, userId: user.uid })
                }
            }
            return NextResponse.json({ status: false, msg: "Wrong email or password" })
        } else {
            const errors = validation.error.formErrors.fieldErrors
            return NextResponse.json({ status: false, errors })
        }

    } catch (error: any) {
        return NextResponse.json({ status: false, data: error.message || "Unexpected server error" })
    }
}
