import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ArrowRight } from "iconsax-react";
import HomeLayout from "./layouts/HomeLayout";
import AnimateIt from "./common/AnimateIt";
import Router from "./common/Router";

export default function Home() {
    return (
        <HomeLayout>
            <Flex
                px={2}
                color="white"
                justify="center"
                align="center"
                flexDir="column"
                bgGradient="linear(to-r,  #0f0c29, #302b63, #24243e)"
                height="100%"
            >
                <AnimateIt>
                    <Heading
                        textAlign="center"
                        size={{ base: "xl", sm: "2xl" }}
                    >
                        Auth made Simple
                    </Heading>
                </AnimateIt>
                <AnimateIt>
                    <Text
                        textAlign="center"
                        fontSize={{ base: "md", sm: "lg" }}
                        mt={4}
                    >
                        Easy OAuth Integration in your web apps
                    </Text>
                </AnimateIt>
                <AnimateIt>
                    <Text
                        textAlign="center"
                        fontSize={{ base: "md", sm: "lg" }}
                    >
                        Focus on developing your awesome project, Let us handle
                        the Auth
                    </Text>
                </AnimateIt>
                <AnimateIt>
                    <Flex mt={4}>
                        <Router to="/login">
                            <Button
                                colorScheme="purple"
                                rightIcon={<ArrowRight />}
                            >
                                {" "}
                                Get Started{" "}
                            </Button>
                        </Router>
                    </Flex>
                </AnimateIt>
            </Flex>
        </HomeLayout>
    );
}
