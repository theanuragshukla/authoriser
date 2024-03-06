"use client";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Heading,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { useFormik } from "formik";
import { LoginModal } from "@/utils/interfaces/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InfoCircle } from "iconsax-react";
import { login } from "@/app/data/managers/auth";
import HomeLayout from "@/app/layouts/HomeLayout";
import CustomTextField from "@/app/common/CustomTextField";

interface LoginErr {
    msg: String;
    errors?: {
        email?: [String];
        password?: [String];
    };
}

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [loginErr, setLoginErr] = useState<LoginErr>({ msg: "", errors: {} });
    const router = useRouter();
    const toast = useToast();

    const handleSubmit = async (values: LoginModal) => {
        setLoading(true);
        setLoginErr(() => ({ msg: "", errors: {} }));
        const { status, msg, errors = {} } = await login(values);
        if (status) {
            toast({
                status: "success",
                title: "Login successful",
            });
            router.push("/dashboard");
        } else {
            toast({
                status: "error",
                title: msg || "Enter a valid value",
            });
            setLoginErr(() => ({ msg, errors }));
        }
        setLoading(false);
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: handleSubmit,
    });

    return (
        <HomeLayout>
            <Flex
                h="auto"
                px={2}
                color="white"
                justify="flex-start"
                pt={4}
                align="center"
                flexDir="column"
                bgGradient="linear(to-r,  #0f0c29, #302b63, #24243e)"
                height="100%"
            >
                <Stack spacing={8} mx="auto" maxW="lg" py={8} px={6}>
                    <Stack align="center">
                        <Heading fontSize="4xl" textAlign="center">
                            Sign in to your account
                        </Heading>
                        <Text fontSize="lg">
                            to enjoy all of our cool features
                        </Text>
                    </Stack>
                    <Box
                        rounded="lg"
                        boxShadow="lg"
                        bg="whiteAlpha.300"
                        p={8}
                        color="white"
                    >
                        <Stack spacing={8}>
                            <Box
                                display={
                                    Object.keys(loginErr.errors!).length ===
                                        0 && loginErr.msg?.length === 0
                                        ? "none"
                                        : "block"
                                }
                            >
                                <Text color="orange">
                                    <Flex gap={1}>
                                        <InfoCircle />
                                        <Text>
                                            {!!loginErr.msg
                                                ? loginErr.msg
                                                : Object.values(
                                                      loginErr.errors!
                                                  )?.[0]?.[0]}
                                        </Text>
                                    </Flex>
                                </Text>
                            </Box>
                            <CustomTextField
                                formik={formik}
                                name="email"
                                label="Email"
                            />
                            <CustomTextField
                                formik={formik}
                                name="password"
                                type="password"
                                label="Password"
                            />
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: "column", sm: "row" }}
                                    align="start"
                                    justify="space-between"
                                >
                                    <Checkbox>Remember me</Checkbox>
                                    <Text color="blue.400">
                                        Forgot password?
                                    </Text>
                                </Stack>
                                <Stack spacing={10} pt={2}>
                                    <Button
                                        isLoading={loading}
                                        loadingText="Submitting"
                                        onClick={() => formik.handleSubmit()}
                                        size="lg"
                                        bg="blue.500"
                                        color="white"
                                        _hover={{
                                            bg: "blue.400",
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            </Stack>
                            <Stack pt={6}>
                                <Text align="center">
                                    Don&apos;t have an account?
                                    <Link href="/signup" color="yellow.100" replace>
                                        Signup
                                    </Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </HomeLayout>
    );
}
