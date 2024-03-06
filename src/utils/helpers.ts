import crypto, { createHash, secureHeapUsed } from "crypto";
import { and, eq } from "drizzle-orm";
import { DbUser, Profile, Seeds, Session, User } from "./interfaces/auth";
import { authseed, clientSeeds, users } from "@/db/schema";
import bcrypt from "bcryptjs";
import db from "@/db/connection";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN, REFRESH_TOKEN, UID } from "@/app/data/constants";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/server";
const saltRounds = 10;
const secret = process.env.JWT_SECRET || "nosecret";

export const hashAuthRequest = (
    clientId: String,
    state: String,
    secret: String
) => {
    const hash = createHash("sha256");
    hash.update(`${clientId}${secret}`);
    hash.update(`${state}${secret}`);
    const digest = hash.digest("hex");
    const nonce = digest.toString().substring(0, 32);
    return nonce;
};

export const isAuthenticated = async (
    cookies: ReadonlyRequestCookies | RequestCookies,
    includeProfile: boolean = false
): Promise<{
    status: boolean;
    msg: string;
    data?: Profile;
}> => {
    const secret = process.env.JWT_SECRET || "";
    try {
        const access = cookies.get(ACCESS_TOKEN)?.value;
        if (!!access) {
            const { data, seed, usage, uid } = jwt.verify(
                access,
                secret
            ) as JwtPayload;
            if (usage !== "access")
                return { status: false, msg: "Invalid Access Token" };

            // generally, the access token shouldn't be verified again by a db query and it can be trusted blindly
            // but, In this case I'm doing it to avoid the time window where refresh_token expires but access_token is
            // not.

            //            const row = await db
            //               .select()
            //              .from(authseed)
            //            .where(eq(authseed.uid, data));
            //      if (row.length === 0) return { status: false, msg: "unauthorised" };
            //          const seeds = row[0].sessions as Session;
            //          if (!seeds[seed]?.valid)
            //             return { status: false, msg: "unauthorised" };
            return {
                status: true,
                msg: "authorised",
                ...(includeProfile ? { data: { ...data, uid } } : {}),
            };
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

export const profile = async (
    uid: string
): Promise<{
    status: boolean;
    msg: string;
    data?: Profile;
}> => {
    const row = await db.select().from(users).where(eq(users.uid, uid));
    if (row.length === 0) return { status: false, msg: "unauthorised" };
    const { firstName, lastName, email, isDeveloper, isVerified } =
        row[0] as DbUser;
    return {
        status: true,
        msg: "success",
        data: {
            uid,
            firstName,
            lastName,
            email,
            isVerified,
            isDeveloper,
        },
    };
};

export const upgradeAccount = async (uid: string) => {
    const row = await db
        .update(users)
        .set({
            isDeveloper: true,
        })
        .where(eq(users.uid, uid));
    if (row.rowCount === 1) {
        return await profile(uid);
    }
    return {
        status: false,
        msg: "something's wrong",
    };
};

export const refreshTokens = async (refresh?: string, userid?: string) => {
    const secret = process.env.JWT_SECRET || "";
    if (!!refresh && !!userid) {
        const { uid, seed, usage } = jwt.verify(refresh, secret) as JwtPayload;
        if (usage !== "refresh")
            return { status: false, msg: "Invalid Refresh Token" };
        const row = await db
            .select()
            .from(authseed)
            .where(eq(authseed.uid, uid));
        if (row.length === 0) return { status: false, msg: "unauthorised" };
        const seeds = row[0].sessions as Session;
        if (!seeds[seed].valid) return { status: false, msg: "unauthorised" };
        const res = await db.select().from(users).where(eq(users.uid, uid));
        if (res.length !== 0) {
            const tokens = await generateTokens(res[0] as DbUser);
            return { status: true, msg: "authorised", tokens, refreshed: true };
        }
    } else {
        return { status: false, msg: "unauthorised" };
    }
    return { status: false, msg: "unauthorised" };
};


export const refreshClientTokens = async (refresh?: string, userid?: string, appId?: string) => {
    const secret = process.env.JWT_SECRET || "";
    if (!!refresh && !!userid && !!appId){
        const { uid, seed, usage, client_id, appId } = jwt.verify(refresh, secret) as JwtPayload;
        if (usage !== "refresh")
            return { status: false, msg: "Invalid Refresh Token" };
        const row = await db
            .select()
            .from(clientSeeds)
            .where(and(eq(clientSeeds.uid, uid), eq(clientSeeds.appId, appId)));
        if (row.length === 0) return { status: false, msg: "unauthorised" };
        const seeds = row[0].seeds as Seeds;
        if (!seeds[seed].valid) return { status: false, msg: "unauthorised" };
        const res = await db.select().from(users).where(eq(users.uid, uid));
        if (res.length !== 0) {
            const tokens = await generateClientTokens(uid, appId, client_id)
            return { status: true, msg: "authorised", tokens, refreshed: true };
        }
    } else {
        return { status: false, msg: "unauthorised" };
    }
    return { status: false, msg: "unauthorised" };
};

export const generateUid = (length = 32) =>
    crypto.randomBytes(256).toString("hex").substring(0, length);

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

export const updateClientTokens = async (
    uid: string,
    appId: string,
    seed: string
) => {
    const res = await db
        .insert(clientSeeds)
        .values({
            uid,
            appId,
            seeds: { [seed]: { start: Date.now(), valid: true } },
        })
        .onConflictDoUpdate({
            target: [clientSeeds.uid, clientSeeds.appId],
            set: { seeds: { [seed]: { start: Date.now(), valid: true } } },
        })
        .returning();
    if (!!res && res.length !== 0) return { status: true };
    return { status: false };
};

export const generateClientTokens = async (
    uid: string,
    appId: string,
    client_id: string
) => {
    const seed = generateUid(16);
    const payload = (usage: string) => ({
        uid: uid,
        seed,
        appId,
        client_id,
        usage,
    });
    if (!secret) {
        throw new Error("JWT_KEY must be defined");
    }
    const access_token = jwt.sign(payload("access")!, secret, {
        issuer: "https://auth.anurags.tech",
        expiresIn: "5m",
    });
    const refresh_token = jwt.sign(payload("refresh"), secret, {
        issuer: "https://auth.anurags.tech",
        expiresIn: "30d",
    });
    const { status } = await updateClientTokens(uid, appId, seed);
    if (!status) throw new Error("Error while updating refresh_token");
    return { access_token, refresh_token, uid };
};

export const generateTokens = async (user: DbUser) => {
    const seed = generateUid(16);
    const payload = (usage: string) => ({
        uid: user.uid,
        ...(usage !== "refresh"
            ? {
                  data: {
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                      isDeveloper: user.isDeveloper,
                  },
              }
            : {}),
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
    const { status } = await updateTokens(user.uid, seed);
    if (!status) throw new Error("Error while updating refresh_token");
    return { access_token, refresh_token, uid: user.uid };
};
