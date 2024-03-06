import { hashAuthRequest } from "@/utils/helpers";
import db from "@/db/connection";
import { appCreds, appDetails, appInfo } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UUID } from "crypto";
import { Card, CardBody, CardFooter, Text } from "@chakra-ui/react";
import CustomButton from "@/app/common/CustomButton";

const ERROR = {
  INVALID: "invalid_request",
  DENIED: "access_denied",
  UNAUTHORIZED: "unauthorized_client",
  INVALID_SCOPE: "invalid_scope",
  SERVER_ERROR: "server_error",
  TEMPORARILY_UNAVAILABLE: "temporarily_unavailable",
  UNSUPPORTED_RESPONSE_TYPE: "unsupported_response_type",
};

const permissionCode = {
  read: 1,
  write: 2,
  create: 4,
  delete: 8,
};

const permission = {
  profile: "Access your basic profile",
  repos: "Access your repositories",
  notes: "Access your notes",
};

const parsePermissionBits = (scope: string) => {
  const permissionBits = ["create", "delete", "write", "read"];
  const bits = parseInt(scope);

  let permissions = [];

  for (let i = 0; i < permissionBits.length; i++) {
    if (bits & (1 << i)) {
      permissions.push(permissionBits[i]);
    }
  }
  return permissions;
};

type Permission = {
  [key: string]: string[];
};

const parseScope = (scope: string) => {
  const allPermisions: Permission = {};
  const perms = scope.split(" ");
  perms.forEach((p) => {
    const arr = p.split("-");
    allPermisions[arr[0]] = parsePermissionBits(arr[1]);
  });
  return allPermisions;
};

export default async function Authorize({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { client_id, redirect_uri, response_type, state, scope, nonce } =
    searchParams;
  const app = await db
    .select()
    .from(appCreds)
    .where(eq(appCreds.clientId, client_id as UUID));
  if (app.length === 0) {
    return "Invalid request";
  }
  const appCred = app[0];
  const hash = hashAuthRequest(client_id, state, appCred.clientSecret || "");
  if (hash !== nonce) {
  } else {
    const appDets = await db
      .select({
        appName: appInfo.appName,
        desc: appInfo.appDesc,
        tos: appInfo.appTos,
        logo: appInfo.appLogo,
        policy: appInfo.appPolicy,
        home: appDetails.homepage,
        supportEmail: appDetails.supportEmail,
        redirect_uri: appDetails.redirectUri,
      })
      .from(appInfo)
      .where(eq(appInfo.appId, appCred.appId))
      .leftJoin(appDetails, eq(appInfo.appId, appCred.appId))
      .limit(1);
    if (appDets.length === 0) {
      return "Invalid request";
    }
    const appDet = appDets[0];

    if (redirect_uri !== appDet.redirect_uri) {
      return "Invalid request";
    }

    return (
      <Card>
        <CardBody p={4}>
          <h1>{appDet.appName}</h1>
          <p>{appDet.desc}</p>
          <p>{appDet.tos}</p>
          <p>{appDet.policy}</p>
          <p>{appDet.home}</p>
          <p>{appDet.supportEmail}</p>
          <Text>Do you want to authorize this app?</Text>
          <Text>By authorizing, you allow the app to:</Text>
          {Object.entries(parseScope(scope)).map(([key, value]) => {
            return (
              <Text key={key}>
                {key}: {value.join(", ")}
              </Text>
            );
          })}
        </CardBody>
        <CardFooter>
          <CustomButton
            text="Authorize"
            link={`/api/user/authorize?${new URLSearchParams(searchParams)}`}
          />
          <CustomButton
            text="Deny"
            link={`${redirect_uri}?code=null&error=${ERROR.DENIED}&state=${state}`}
          />
        </CardFooter>
      </Card>
    );
  }
}
