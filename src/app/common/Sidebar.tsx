"use client";

import React from "react";
import { Flex, Icon, Spacer } from "@chakra-ui/react";
import { SIDEBAR_WIDTH } from "../../constants";
import { Home, Key } from "iconsax-react";
import { MdApps } from "react-icons/md";
import { useRouter } from "next/navigation";

export const SIDEBAR = {
    HOME: {
        name: "Home",
        icon: Home,
        path: "/dashboard",
    },
    APPS: {
        name: "Apps",
        icon: MdApps,
        path: "/apps",
    },
    THIRD_PARTY: {
        name: "Third Party",
        icon: Key,
        path: "/third-party",
    },
};

export default function Sidebar() {
    const router = useRouter();
    return (
        <Flex
            bg="nord.snow1"
            alignItems="center"
            w={SIDEBAR_WIDTH}
            flexDir="column"
            justifyContent="center"
        >
            <Home />
            <Spacer h="100%" />
            {Object.keys(SIDEBAR).map((key) => {
                const icon = SIDEBAR[key].icon;
                return (
                    <Icon
                        as={icon}
                        boxSize={8}
                        onClick={() => {
                            router.push(SIDEBAR[key].path);
                        }}
                    />
                );
            })}
            <Spacer h="100%" />
        </Flex>
    );
}
