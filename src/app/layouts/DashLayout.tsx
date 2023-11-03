import React, { ReactNode } from "react";
import {
    Box,
    Center,
    Flex,
    Grid,
    GridItem,
    Icon,
    Show,
    useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeft2 } from "iconsax-react";

interface Props {
    children: ReactNode;
}

export default function DashLayout({ children }: Props) {
    const sidebar = useDisclosure();
    return (
        <Grid
            templateRows=" 1fr"
            h="100vh"
            templateColumns={{ base: "1fr", md: "auto 1fr" }}
        >
            <Show above="md">
                <Flex
                    border="2px solid red"
                    borderRightRadius="2xl"
                    w={sidebar.isOpen ? "300px" : "60px"}
                    h="100%"
                    pos="relative"
                >
                    <Box
                        pos="absolute"
                        right={0}
                        bottom={4}
                        translateX="100%"
                        transform={
                            sidebar.isOpen ? "rotate(0deg)" : "rotate(180deg)"
                        }
                    >
                        <Center h="100%">
                            <Icon
                                onClick={sidebar.onToggle}
                                as={ArrowLeft2}
                                boxSize={6}
                            />
                        </Center>
                    </Box>
                </Flex>
            </Show>
            <GridItem>{children}</GridItem>
        </Grid>
    );
}
