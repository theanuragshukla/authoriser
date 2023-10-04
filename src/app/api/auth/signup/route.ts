import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/utils/zodSchemas';
import { checkDupUser, generateTokens, generateUid, hashFunc, saveUser } from '@/utils/helpers';
import { DbUser } from '@/utils/interfaces/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validation = signupSchema.safeParse(body)
        if (validation.success) {
            const { email, password } = body
            const { isDup } = await checkDupUser(email)
            if (isDup) {
                return NextResponse.json({ status: false, msg: "Email already in use" })
            }
            body.uid = generateUid()
            body.password = await hashFunc(password)
            const { status, user } = await saveUser(body)
            if (status && !!user) {
                const tokens = await generateTokens(user as DbUser)
                return NextResponse.json({ status: true, accessToken: tokens.access_token, refreshToken: tokens.refresh_token, userId: user.uid })
            }
        } else {
            const errors = validation.error.formErrors.fieldErrors
            return NextResponse.json({ status: false, errors })
        }

    } catch (error: any) {
        return NextResponse.json({ status: false, data: error.message || "Unexpected server error" })
    }
}

