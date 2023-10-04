import React, { ReactNode } from "react";
import { Grid, GridItem } from "@chakra-ui/react";

interface Props {
    children: ReactNode
}

export default function HomeLayout({ children }: Props) {
    return (
        <Grid templateRows=" 1fr" minH="100vh">
            <GridItem>
                {children}
            </GridItem>
        </Grid>
    )
}
