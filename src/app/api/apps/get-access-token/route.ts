import { getAccessTokenSchema } from "@/utils/zodSchemas";
import db from "@/db/connection";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { appCreds } from "@/db/schema";
import jwt from "jsonwebtoken";
import { generateClientTokens } from "@/utils/helpers";
import { AuthCodeModel } from "../../user/authorize/route";
const JWT_SECRET = process.env.JWT_SECRET || "";
import redis from "@/db/redis";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validate = getAccessTokenSchema.safeParse(body);
  if (!validate.success) {
    return NextResponse.json({
      status: false,
      msg: "Invalid request",
      errors: validate.error,
    });
  }
  const { code, client_id, client_secret } = body;
  const redisCode = await redis.get(code);
  if (redisCode !== "valid")
    return NextResponse.json({ status: false, msg: "Invalid code" });
  await redis.del(code);
  const payload = jwt.verify(code, JWT_SECRET) as AuthCodeModel;
  if (!payload)
    return NextResponse.json({ status: false, msg: "Invalid code" });
  const rows = await db
    .select()
    .from(appCreds)
    .where(eq(appCreds.clientId, client_id))
    .limit(1);
  if (rows.length < 1)
    return NextResponse.json({ status: false, msg: "Invalid client_id" });
  const client = rows[0];
  if (client.clientSecret !== client_secret)
    return NextResponse.json({ status: false, msg: "unauthorized" });

  const tokens = await generateClientTokens(
    payload.userId,
    client.appId,
    client_id
  );

  return NextResponse.json({
    status: true,
    msg: "Access token generated",
    data: tokens,
  });
}
