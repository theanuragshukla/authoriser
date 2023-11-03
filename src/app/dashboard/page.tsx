"use client";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    HStack,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import DashLayout from "../layouts/DashLayout";
import { useEffect, useState } from "react";
import { profile, upgradeAccount } from "../data/managers/auth";
import { redirect } from "next/navigation";
import { Add, User } from "iconsax-react";
import { MdOutlineEmail } from "react-icons/md";

export default function Login() {
    const [user, setUser] = useState({
        firstName: "User",
        lastName: "",
        email: "No email provided",
        isVerified: false,
        isDeveloper: false,
    });
    const [loading, setLoading] = useState(false);
    const upgrading = useDisclosure();
    const toast = useToast();

    const confirmUpgrade = async () => {
        upgrading.onOpen();
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
    }, []);

    return (
        <DashLayout>
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
                                <Input
                                    size="md"
                                    value={`${user.email}`}
                                    readOnly
                                />
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
                            bg="green.100"
                            p={2}
                        >
                            <Heading fontSize={16}>Add New Application</Heading>
                            <Button
                                size="md"
                                variant="outline"
                                colorScheme="green"
                            >
                                <Add /> Add New
                            </Button>
                        </Flex>
                    </CardBody>
                </Card>

                <Card
                    w="100%"
                    maxW="800px"
                    display={user.isDeveloper ? "none" : "flex"}
                >
                    <CardBody>
                        At the Moment, for a Normal user like you, There is
                        nothing to do here. Upgrade your account to get access
                        to developer settings
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
            </Flex>

            <Modal
                isOpen={upgrading.isOpen}
                onClose={upgrading.onClose}
                onEsc={upgrading.onClose}
                size="md"
                isCentered
            >
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
                <ModalContent>
                    <ModalHeader>Upgrading to developer</ModalHeader>
                    <ModalBody>
                        Do you really want to upgrade your account ?
                    </ModalBody>
                    <ModalFooter>
                        <HStack gap={4}>
                            <Button
                                size="md"
                                colorScheme="red"
                                variant="outline"
                                onClick={upgrading.onClose}
                            >
                                No
                            </Button>
                            <Button
                                isLoading={loading}
                                loadingText="Please wait ..."
                                size="md"
                                colorScheme="green"
                                variant="outline"
                                onClick={upgrade}
                            >
                                Yes, Give me superpowers
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </DashLayout>
    );
}
