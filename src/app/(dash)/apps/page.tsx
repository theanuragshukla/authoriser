"use client";
import {
  Box,
  Text,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  VStack,
  useDisclosure,
  useToast,
  HStack,
} from "@chakra-ui/react";
import DashLayout from "../../layouts/DashLayout";
import { useEffect, useState } from "react";
import { profile, upgradeAccount } from "../../data/managers/auth";
import { redirect } from "next/navigation";
import { Add, AddCircle, Additem, User } from "iconsax-react";
import { MdAndroid, MdOutlineEmail, MdWeb } from "react-icons/md";
import { useRouter } from "next/navigation";
import { getAllApps } from "../../data/managers/apps";
import { ConfirmModel } from "../../common/ConfirmModal";

export default function Login() {
  const [user, setUser] = useState({
    firstName: "User",
    lastName: "",
    email: "No email provided",
    isVerified: false,
    isDeveloper: false,
  });
  interface appModel {
    appName: "";
    appId: "";
    clientId: "";
    clientSecret: "";
    last_updated: "";
  }

  const [apps, setApps] = useState<appModel[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const upgrading = useDisclosure();
  const toast = useToast();

  const confirmUpgrade = async () => {
    upgrading.onOpen();
  };

  const allApps = async () => {
    setLoading(true);
    const { status, msg, data } = await getAllApps();
    setLoading(false);
    if (status) {
      setApps(() => [...data]);
    } else {
      toast({
        title: msg,
        isClosable: true,
        status: "error",
      });
    }
  };
  const upgrade = async () => {
    setLoading(true);
    const { status, msg, data } = await upgradeAccount();
    setLoading(false);
    upgrading.onClose();
    if (status) {
      setUser((prev) => ({
        ...prev,
        ...data,
      }));
      toast({
        title: "Account upgraded successfully!",
        isClosable: true,
        status: "success",
      });
    } else {
      toast({
        title: msg,
        isClosable: true,
        status: "error",
      });
    }
  };

  useEffect(() => {
    const func = async () => {
      const { status, data } = await profile();
      if (status) {
        setUser(() => ({ ...data }));
      } else {
        redirect("/login");
      }
    };
    func();
    allApps();
  }, []);

  return (
    <Grid templateRows="auto 1fr">
      <GridItem>
        <Heading>Your Authoriser projects</Heading>
      </GridItem>
      <Flex width="100%">
        <Grid
          border="2px solid red"
          padding={8}
          gridGap={8}
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
        >
          <Card size="md" w="300px">
            <CardBody>
              <VStack width="100%" justifyContent="center" alignItems="center">
                <Icon as={AddCircle} boxSize={16} />
                <Text>Add new project</Text>
              </VStack>
            </CardBody>
          </Card>
          {[...new Array(10)].map(() => (
            <AppCard />
          ))}
        </Grid>
      </Flex>
    </Grid>
  );
}

const AppCard = () => {
  return (
    <Card size="md" w="300px">
      <CardHeader>
        <Heading fontSize={22}>Project Name</Heading>
      </CardHeader>
      <CardBody>
        <VStack width="100%" justifyContent="center" alignItems="center">
          <Text>Project description</Text>
        </VStack>
      </CardBody>
      <CardFooter>
        <HStack gap={2}>
          <MdAndroid />
          <MdAndroid />
          <MdAndroid />
        </HStack>
      </CardFooter>
    </Card>
  );
};
