
'use client'
import { Card, CardBody, Flex } from "@chakra-ui/react";
import HomeLayout from "../layouts/HomeLayout";


export default function Login() {
    return (
        <HomeLayout>

            <Flex h="auto" px={2} color="white" justify="flex-start" pt={4} align="center" flexDir="column" bgGradient="linear(to-r,  #0f0c29, #302b63, #24243e)" height="100%">
                <Card bg="whiteAlpha.200">
                    <CardBody color="white">
                        Hello World
                    </CardBody>

                </Card>
            </Flex>

        </HomeLayout>


    )
}

