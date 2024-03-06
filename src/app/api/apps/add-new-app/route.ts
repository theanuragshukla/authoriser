import { NextRequest, NextResponse } from "next/server";
import db from "@/db/connection";
import { AddAppModal } from "@/utils/interfaces/auth";
import { appCreds, appDetails, appInfo, apps } from "@/db/schema";
import { generateUid, isAuthenticated } from "@/utils/helpers";
import { drizzle } from "drizzle-orm/node-postgres";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const body: AddAppModal = await req.json();
  try {
    const profile = await isAuthenticated(req.cookies, true)
    if(!profile.status) {
      return NextResponse.json({
        status: false,
        msg: "unauthorised",
      });
    }
    const appId = generateUid(64);
    await db.insert(apps).values({
      appId,
      uid: profile.data?.uid || "",
    });
    await db.insert(appInfo).values({
      appId,
      appTos: body.tosUrl,
      appDesc: body.description,
      appLogo: body.logo,
      appName: body.name,
      appPolicy: body.privacyPolicyUrl
    });
    await db.insert(appDetails).values({
      appId,
      homepage: body.homepage,
      redirectUri: body.redirectUri,
      supportEmail: body.supportEmail
    });
    const client_id = randomUUID()
    const client_secret = generateUid(128)

    await db.insert(appCreds).values({
      appId,
      clientId: client_id,
      clientSecret: client_secret
    });

  }catch (e: any) {
    return NextResponse.json({
      status: false,
      msg: e.message || "Something unexpected occoured",
    });
  }
  return NextResponse.json({
    status: true,
  });
}
