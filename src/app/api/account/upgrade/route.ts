import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated, upgradeAccount,  } from "@/utils/helpers";


export async function GET(req: NextRequest) {
    const data = await isAuthenticated(req.cookies, true);
    if(data.status && !!data.data){
        const upgrade = await upgradeAccount(data.data.uid )
        return NextResponse.json(upgrade)
    }
    else{
        return NextResponse.json(data)
    }


}
