"use client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { AddAppModal } from "@/utils/interfaces/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InfoCircle } from "iconsax-react";
import HomeLayout from "@/app/layouts/HomeLayout";
import CustomTextField from "@/app/common/CustomTextField";
import { addNewApp } from "@/app/data/managers/apps";

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

  const handleSubmit = async (values: AddAppModal) => {
    setLoading(true);
    setLoginErr(() => ({ msg: "", errors: {} }));
    const { status, msg, errors = {} } = await addNewApp(values);
    if (status) {
      toast({
        status: "success",
        title: "App added successfully",
      });
      router.push("/dashboard")
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
      name: "",
      description: "",
      logo: "",
      redirectUri: "",
      homepage: "",
      tosUrl: "",
      privacyPolicyUrl: "",
      supportEmail: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  const formFields = [
    {
      type: "text",
      label: "Name",
      required: true,
      name: "name",
    },
    {
      type: "text",
      label: "Description",
      required: true,
      name: "description",
    },
    {
      type: "text",
      label: "Logo",
      required: true,
      name: "logo",
    },
    {
      type: "text",
      label: "Redirect URI",
      required: true,
      name: "redirectUri",
    },
    {
      type: "text",
      label: "Homepage",
      required: true,
      name: "homepage",
    },
    {
      type: "text",
      label: "Terms of Service URL",
      required: true,
      name: "tosUrl",
    },
    {
      type: "text",
      label: "Privacy Policy URL",
      required: true,
      name: "privacyPolicyUrl",
    },
    {
      type: "email",
      label: "Support Email",
      required: true,
      name: "supportEmail",
    },
  ];

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
        <Stack spacing={8} mx="auto" maxW="800px" w="100%" py={8} px={6}>
          <Stack align="center">
            <Heading fontSize="4xl" textAlign="center">
              Add new App
            </Heading>
            <Text fontSize="lg">fill in all the details</Text>
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
                  Object.keys(loginErr.errors!).length === 0 &&
                  loginErr.msg?.length === 0
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
                        : Object.values(loginErr.errors!)?.[0]?.[0]}
                    </Text>
                  </Flex>
                </Text>
              </Box>
              {formFields.map((o) => (
                <CustomTextField
                  formik={formik}
                  name={o.name}
                  type={o.type}
                  label={o.label}
                  required={o.required}
                />
              ))}
              <Stack spacing={10}>
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
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </HomeLayout>
  );
}
