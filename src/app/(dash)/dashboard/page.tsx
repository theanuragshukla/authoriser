"use client";
import {
    Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DashLayout from "../../layouts/DashLayout";
import { useEffect, useState } from "react";
import { profile, upgradeAccount } from "../../data/managers/auth";
import { redirect } from "next/navigation";
import { Add, User } from "iconsax-react";
import { MdOutlineEmail } from "react-icons/md";
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
  <Box>
      <Flex
        h="auto"
        px={4}
        color="white"
        justify="flex-start"
        pt={4}
        align="center"
        flexDir="column"
        bgGradient="linear(to-r,  #0f0c29, #302b63, #24243e)"
        height="100%"
        gap={8}
      >
        <Card w="100%" maxW="800px">
          <CardHeader>
            <Heading fontSize={18}>Hello {user.firstName}</Heading>
          </CardHeader>
          <CardBody>
            <VStack gap={4} w="100%">
              <InputGroup>
                <Input
                  size="md"
                  value={`${user.firstName} ${user.lastName}`}
                  readOnly
                />
                <InputLeftElement>
                  <User />
                </InputLeftElement>
              </InputGroup>
              <InputGroup>
                <Input size="md" value={`${user.email}`} readOnly />
                <InputLeftElement>
                  <MdOutlineEmail />
                </InputLeftElement>
              </InputGroup>
            </VStack>
          </CardBody>
          <CardFooter>
            <Button
              size="md"
              bg="blue.500"
              color="white"
              _hover={{
                bg: "blue.400",
              }}
            >
              Edit
            </Button>
          </CardFooter>
        </Card>

        <Card
          w="100%"
          maxW="800px"
          display={!user.isDeveloper ? "none" : "flex"}
        >
          <CardHeader>
            <Heading fontSize={18}>OAuth Applications</Heading>
          </CardHeader>
          <CardBody>
            <Flex
              w="100%"
              justifyContent="space-between"
              alignItems="center"
              p={2}
            >
              <Heading fontSize={16}>Add New Application</Heading>
              <Button
                onClick={() => router.push("/add-new-app")}
                size="md"
                variant="outline"
                colorScheme="green"
              >
                <Add /> Add New
              </Button>
            </Flex>
            <VStack gap={4} w="100%"></VStack>
          </CardBody>
        </Card>

        <Card
          w="100%"
          maxW="800px"
          display={user.isDeveloper ? "none" : "flex"}
        >
          <CardBody>
            At the Moment, for a Normal user like you, There is nothing to do
            here. Upgrade your account to get access to developer settings
          </CardBody>
          <CardFooter>
            <Button
              size="md"
              bg="blue.500"
              color="white"
              _hover={{
                bg: "blue.400",
              }}
              onClick={confirmUpgrade}
            >
              Upgrade to developer account
            </Button>
          </CardFooter>
        </Card>
        <Table>
          <thead>
            <tr>
              <th>App Name</th>
              <th>App ID</th>
              <th>ClientId</th>
              <th>Client Secret</th>
              <th>Updated at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr>
                <td>{app.appName}</td>
                <td>{app.appId}</td>
                <td>{app.clientId}</td>
                <td>{app.clientSecret}</td>
                <td>{app.last_updated}</td>
                <td>
                  <Button size="sm" colorScheme="red" variant="outline">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Flex>
    <ConfirmModel disclosure={upgrading} loading={loading} onConfirm={upgrade}/>
    </Box>
  );
}
