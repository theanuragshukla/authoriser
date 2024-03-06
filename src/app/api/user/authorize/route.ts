import { NextRequest, NextResponse } from "next/server";
import {Profile} from "@/utils/interfaces/auth";
import redis from "@/db/redis";
import jwt from "jsonwebtoken";

export interface AuthCodeModel {
  userId: string;
  clientId: string;
  scope: string;
  redirecr_uri: string;
  }


const generateToken = async (
  userId: string,
  clientId: string,
  scope: string,
  redirecr_uri: string
) => {
  const claims = {
    userId,
    clientId,
    scope,
    redirecr_uri,
  };
  const token = jwt.sign(claims, process.env.JWT_SECRET || "", {
    expiresIn:120
  });
  await redis.set(token, "valid");
  await redis.expire(token, 120)
  return token;
};

export async function GET(req: NextRequest) {
  const profile = JSON.parse(req.headers.get("profile") || "") as Profile;
  const url = new URL(req.url);
  const params = url.searchParams;
  const clientId = params.get("client_id");
  const state = params.get("state");
  const scope = params.get("scope");
  const redirect_uri = params.get("redirect_uri");
  if (!clientId || !state || !redirect_uri || !scope)
    return NextResponse.json({ status: false, msg: "Invalid request" });
  const token = await generateToken(profile.uid, clientId, scope, redirect_uri);
  return NextResponse.redirect(`${redirect_uri}?state=${state}&code=${token}`)

}
