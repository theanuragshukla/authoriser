import crypto from 'crypto'
import { eq } from 'drizzle-orm';
import { DbUser, User } from './interfaces/auth';
import { authseed, users } from '@/db/schema';
import bcrypt from 'bcryptjs'
import db from '@/db/connection';
import jwt from 'jsonwebtoken';

const saltRounds = 10
const secret = process.env.JWT_SECRET || "nosecret"

export const generateUid = (length = 32) => crypto.randomBytes(128).toString('hex').substring(0, length)

export const saveUser = async (user: User) => {
    const res = await db.insert(users).values(user).returning();
    if (!!res && res.length !== 0) return { status: true, user: res[0] }
    return { status: false }
}

export const checkDupUser = async (email: string) => {
    const res = await db.select().from(users).where(eq(users.email, email))
    return ({ isDup: res.length !== 0, user: res[0] as DbUser })
}

export const hashFunc = async (clearText: string) => {
    const hash = await bcrypt.hash(clearText, saltRounds)
    return hash
}
export const verifyHash = async (clearText: string, hash: string) => {
    return await bcrypt.compare(clearText, hash)
}

export const updateTokens = async (uid: string, seed: string) => {
    const res = await db.insert(authseed).values({ uid, seed:[seed] }).onConflictDoUpdate({ target: authseed.uid, set: { seed: [...authseed.seed.mapToDriverValue((e:string)=>`'${e}'`), seed] } }).returning();
    if (!!res && res.length !== 0) return { status: true }
    return { status: false }

}

export const generateTokens = async (user: DbUser) => {
    const { uid, email, isVerified } = user
    const seed = generateUid(16)
    const id_payload = {
        user: email,
        isVerified
    }
    const payload = (usage: string) => ({
        data: user.uid,
        seed,
        usage
    })
    const access_token = jwt.sign(payload("access"), secret, { issuer: "https://auth.anurags.tech", subject: uid, expiresIn: '1h' })
    const refresh_token = jwt.sign(payload("refresh"), secret, { issuer: "https://auth.anurags.tech", subject: uid, expiresIn: '30d' })
    const id_token = jwt.sign(id_payload, secret, { issuer: "https://auth.anurags.tech", subject: uid, expiresIn: '1h' })
    const { status } = await updateTokens(uid, seed)
    if (!status) throw (new Error("Error while updating refresh_token"))
    return { access_token, refresh_token, id_token }
}
