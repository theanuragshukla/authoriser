'use client'
import { Eye, EyeSlash, Login } from "iconsax-react";
import HomeLayout from "../layouts/HomeLayout";
import { Box, Button, Checkbox, Flex, FormControl, FormLabel, HStack, Heading, IconButton, Input, InputGroup, InputRightElement, Stack, Text, } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "@chakra-ui/next-js";


export default function Login() {
    return (
        <HomeLayout>

            <Flex h="auto" px={2} color="white" justify="flex-start" pt={4} align="center" flexDir="column" bgGradient="linear(to-r,  #0f0c29, #302b63, #24243e)" height="100%">
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={8} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'} textAlign={'center'}>
                            Sign in to your account
                        </Heading>
                        <Text fontSize={'lg'} >
                            to enjoy all of our cool features                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        boxShadow={'lg'}
                        bg="whiteAlpha.300"
                        p={8}
                        color="white"
                    >

                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input type="password" />
                            </FormControl>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    <Checkbox>Remember me</Checkbox>
                                    <Text color={'blue.400'}>Forgot password?</Text>
                                </Stack>
                                <Button
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Sign in
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Don't have an account? <Link href="/signup" color="yellow.100">Signup</Link>
                                </Text>
                            </Stack>    </Stack>
                    </Box>

                </Stack>
            </Flex>

        </HomeLayout>


    )
}

