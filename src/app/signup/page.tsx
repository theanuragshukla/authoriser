'use client'
import HomeLayout from "../layouts/HomeLayout";
import { Box, Button, Flex, HStack, Heading, Stack, Text, } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "@chakra-ui/next-js";
import { Formik } from "formik";
import * as Yup from 'yup'
import CustomTextField from "../common/CustomTextField";
import { InfoCircle } from "iconsax-react";

const signupSchema = Yup.object({
    firstName: Yup.string().required("First name is required").max(50, "First name should be less than 50 chars"),
    lastName: Yup.string().max(50, "Last name should be less than 50 chars"),
    email: Yup.string().required("Email is required").email("Enter a valid email Address"),
    password: Yup.string().required("Password is required").max(128, "Password can contain maximum 128 characters").min(8, "Password should contain atleast 9 characters")
})

interface Values {
    firstName: String,
    lastName: String,
    email: String,
    password: String
}

const handleSubmit = (values: Values) => {
    console.log(values)
}
export default function Signup() {
    return (
        <HomeLayout>

            <Flex h="auto" px={2} color="white" justify="flex-start" pt={4} align="center" flexDir="column" bgGradient="linear(to-r,  #0f0c29, #302b63, #24243e)" height="100%">
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={8} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Create a new Account
                        </Heading>
                        <Text fontSize={'lg'} >
                            We need some basic information about you to get started
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        boxShadow={'lg'}
                        bg="whiteAlpha.300"
                        p={8}
                        color="white"
                    >

                        <Formik validationSchema={signupSchema} onSubmit={handleSubmit} initialValues={{
                            firstName: "",
                            lastName: "",
                            email: "",
                            password: ""
                        }} validateOnBlur={false} validateOnChange={false} >
                            {
                                (formik) => (
                                    <Stack spacing={4}>
                                        <Box display={formik.isValid ? "none" : "block"}>
                                            <Text color="orange">
                                                {[Object.values(formik.errors)[0]].map((e) => (<Flex gap={1}><InfoCircle /> {e}</Flex>))}
                                            </Text>
                                        </Box>
                                        <HStack>
                                            <CustomTextField formik={formik} name="firstName" label="First Name" />
                                            <CustomTextField required={false} formik={formik} name="lastName" label="last Name" />
                                        </HStack>
                                        <CustomTextField formik={formik} name="email" label="Email" />
                                        <CustomTextField formik={formik} name="password" type="password" label="Password" />
                                        <Stack spacing={10} pt={2}>
                                            <Button
                                                loadingText="Submitting"
                                                onClick={formik.handleSubmit}
                                                size="lg"
                                                bg={'blue.500'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'blue.400',
                                                }}>
                                                Sign up
                                            </Button>
                                        </Stack>
                                        <Stack pt={6}>
                                            <Text align={'center'}>
                                                Already a user? <Link href="/login" color="yellow.100">Login</Link>
                                            </Text>
                                        </Stack>
                                    </Stack>
                                )
                            }
                        </Formik>
                    </Box>
                </Stack>
            </Flex>

        </HomeLayout>
    )
}
