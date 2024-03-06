import React, { ReactNode } from "react";
import {
  Grid,
  GridItem,
  Show,
} from "@chakra-ui/react";
import Sidebar from "../common/Sidebar";

interface Props {
  children: ReactNode;
}

export default function DashLayout({ children }: Props) {
  return (
    <Grid
      templateRows=" 1fr"
      h="100vh"
      templateColumns={{ base: "1fr", md: "auto 1fr" }}
      bg="nord.aurora2"
    >
      <Show above="md">
        <Sidebar />
      </Show>
      <GridItem>{children}</GridItem>
    </Grid>
  );
}
