"use client";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    HStack,
    Heading,
    Stack,
    Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import {  useFormik } from "formik";
import * as Yup from "yup";
import { InfoCircle } from "iconsax-react";
import { SignupReq } from "@/utils/interfaces/auth";
import HomeLayout from "@/app/layouts/HomeLayout";
import CustomTextField from "@/app/common/CustomTextField";
import { signup } from "@/app/data/managers/auth";

const signupSchema = Yup.object({
    firstName: Yup.string()
        .required("First name is required")
        .max(50, "First name should be less than 50 chars"),
    lastName: Yup.string().max(50, "Last name should be less than 50 chars"),
    email: Yup.string()
        .required("Email is required")
        .email("Enter a valid email Address"),
    password: Yup.string()
        .required("Password is required")
        .max(128, "Password can contain maximum 128 characters")
        .min(8, "Password should contain atleast 8 characters"),
});

const handleSubmit = async (values: SignupReq) => {
    const { status, msg } = await signup(values);
    if (status) {
    } else {
        alert(msg);
    }
};
export default function Signup() {
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: handleSubmit,
        validationSchema: signupSchema,
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
                <Stack spacing={8} mx={"auto"} maxW={"lg"} py={8} px={6}>
                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"} textAlign={"center"}>
                            Create a new Account
                        </Heading>
                        <Text fontSize={"lg"}>
                            We need some basic information about you to get
                            started
                        </Text>
                    </Stack>
                    <Box
                        rounded={"lg"}
                        boxShadow={"lg"}
                        bg="whiteAlpha.300"
                        p={8}
                        color="white"
                    >
                        <Stack spacing={4}>
                            <Box display={formik.isValid ? "none" : "block"}>
                                <Text color="orange">
                                    {[Object.values(formik.errors)[0]].map(
                                        (e, i) => (
                                            <Flex gap={1} key={`error${i}`}>
                                                <InfoCircle /> {e}
                                            </Flex>
                                        )
                                    )}
                                </Text>
                            </Box>
                            <HStack>
                                <CustomTextField
                                    formik={formik}
                                    name="firstName"
                                    label="First Name"
                                />
                                <CustomTextField
                                    required={false}
                                    formik={formik}
                                    name="lastName"
                                    label="Last Name"
                                />
                            </HStack>
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
                            <Checkbox>
                                I agree to Terms and Contitions.
                            </Checkbox>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText="Submitting"
                                    onClick={() => formik.handleSubmit()}
                                    size="lg"
                                    bg={"blue.500"}
                                    color={"white"}
                                    _hover={{
                                        bg: "blue.400",
                                    }}
                                >
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={"center"}>
                                    Already a user?{" "}
                                    <Link href="/login" color="yellow.100">
                                        Login
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
