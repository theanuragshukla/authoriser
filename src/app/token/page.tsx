"use client";

import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { token } from "../data/managers/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function Token() {
    const router = useRouter()
  //  const query = useSearchParams()
  //  const toPath = query.get("toPath") || "/dashboard"
  //  const params = query.get("params") || ""
    useEffect(() => {
        const refreshToken = async () => {
            const { status } = await token();
            if (status) {
                //router.replace(`${toPath}?${params}`);
                router.back()
            } else {
                router.replace("/login");
            }
        };
        refreshToken();
    }, []);
    return <Text>Please wait...</Text>;
}
