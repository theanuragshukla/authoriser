import crypto from "crypto";
import { eq } from "drizzle-orm";
import { DbUser, Session, User } from "./interfaces/auth";
import { authseed, users } from "@/db/schema";
import bcrypt from "bcryptjs";
import db from "@/db/connection";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN, REFRESH_TOKEN, UID } from "@/app/data/constants";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";

const saltRounds = 10;
const secret = process.env.JWT_SECRET || "nosecret";

export const isAuthenticated = async (
    cookies: ReadonlyRequestCookies | RequestCookies
) => {
    const secret = process.env.JWT_SECRET || "";
    try {
        const access = cookies.get(ACCESS_TOKEN)?.value;
        if (!!access) {
            const { data, seed, usage } = jwt.verify(
                access,
                secret
            ) as JwtPayload;
            if (usage !== "access")
                return { status: false, msg: "Invalid Access Token" };

            // generally, the access token shouldn't be verified again by a db query and it can be trusted blindly
            // but, In this case I'm doing it to avoid the time window where refresh_token expires but access_token is
            // not.

            const row = await db
                .select()
                .from(authseed)
                .where(eq(authseed.uid, data));
            if (row.length === 0) return { status: false, msg: "unauthorised" };
            const session = row[0].sessions as Session;
            if (!session[seed]?.valid)
                return { status: false, msg: "unauthorised" };
            return { status: true, msg: "authorised" };
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

export const refreshTokens = async (req: NextRequest) => {
    const secret = process.env.JWT_SECRET || "";
    const refresh = req.cookies.get(REFRESH_TOKEN)?.value;
    const userid = req.cookies.get(UID)?.value;
    if (!!refresh && !!userid) {
        const { data, seed, usage } = jwt.verify(refresh, secret) as JwtPayload;
        if (usage !== "refresh")
            return { status: false, msg: "Invalid Refresh Token" };
        const row = await db
            .select()
            .from(authseed)
            .where(eq(authseed.uid, data));
        if (row.length === 0) return { status: false, msg: "unauthorised" };
        const session = row[0].sessions as Session;
        if (!session[seed].valid) return { status: false, msg: "unauthorised" };
        const tokens = await generateTokens(userid);
        return { status: true, msg: "authorised", tokens, refreshed: true };
    } else {
        return { status: false, msg: "unauthorised" };
    }
};

export const generateUid = (length = 32) =>
    crypto.randomBytes(128).toString("hex").substring(0, length);

export const saveUser = async (user: User) => {
    const res = await db.insert(users).values(user).returning();
    if (!!res && res.length !== 0) return { status: true, user: res[0] };
    return { status: false };
};

export const checkDupUser = async (email: string) => {
    const res = await db.select().from(users).where(eq(users.email, email));
    return { isDup: res.length !== 0, user: res[0] as DbUser };
};

export const hashFunc = async (clearText: string) => {
    const hash = await bcrypt.hash(clearText, saltRounds);
    return hash;
};
export const verifyHash = async (clearText: string, hash: string) => {
    return await bcrypt.compare(clearText, hash);
};

export const updateTokens = async (uid: string, seed: string) => {
    const res = await db
        .insert(authseed)
        .values({
            uid,
            sessions: { [seed]: { start: Date.now(), valid: true } },
        })
        .onConflictDoUpdate({
            target: authseed.uid,
            set: { sessions: { [seed]: { start: Date.now(), valid: true } } },
        })
        .returning();
    if (!!res && res.length !== 0) return { status: true };
    return { status: false };
};

export const generateTokens = async (uid: string) => {
    const seed = generateUid(16);
    const payload = (usage: string) => ({
        data: uid,
        seed,
        usage,
    });
    if (!secret) {
        throw new Error("JWT_KEY must be defined");
    }
    const access_token = jwt.sign(payload("access")!, secret, {
        issuer: "https://auth.anurags.tech",
        expiresIn: "1h",
    });
    const refresh_token = jwt.sign(payload("refresh"), secret, {
        issuer: "https://auth.anurags.tech",
        expiresIn: "30d",
    });
    const { status } = await updateTokens(uid, seed);
    if (!status) throw new Error("Error while updating refresh_token");
    return { access_token, refresh_token, uid };
};
