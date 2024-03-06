import { Profile } from "@/utils/interfaces/auth";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../db/connection";
import { appCreds, appInfo, apps } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (req: NextRequest) => {
  const profile = JSON.parse(req.headers.get("profile") || "") as Profile;
  if (!!profile.uid) {
    const allApps = await db
      .select({
        appId: apps.appId,
        appName: appInfo.appName,
        clientId: appCreds.clientId,
        clientSecret: appCreds.clientSecret,
        last_updated: apps.updatedAt,
      })
      .from(apps)
      .where(eq(apps.uid, profile.uid))
      .leftJoin(appInfo, eq(apps.appId, appInfo.appId))
      .leftJoin(appCreds, eq(appCreds.appId, apps.appId));
    if (allApps.length === 0)
      return NextResponse.json({ status: false, msg: "no apps found" });
    return NextResponse.json({ status: true, msg: "success", data: allApps });
  } else return NextResponse.json({ status: false, msg: "unauthorised" });
};
