"use client";

import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { FormikProps, getIn } from "formik";
import { Eye, EyeSlash } from "iconsax-react";
import { useState } from "react";

interface Props {
    name: string;
    formik: any;
    label?: string;
    placeHolder?: string;
    type?: string;
    required?: boolean;
}

export default function CustomTextField({
    name,
    formik,
    label = "",
    placeHolder = "",
    type = "text",
    required = true,
}: Props) {
    const [showPass, setshowPass] = useState(false);
    const { values, handleChange, errors, handleBlur } = formik;

    return (
        <FormControl isRequired={required} isInvalid={getIn(errors, name)}>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <InputGroup>
                <Input
                    type={showPass ? "text" : type}
                    _invalid={{ borderColor: "orange" }}
                    value={getIn(values, name)}
                    placeholder={placeHolder}
                    onChange={(x) => {
                        handleChange(x);
                    }}
                    onBlur={handleBlur}
                    name={name}
                />
                {type === "password" && (
                    <InputRightElement width="4.5rem">
                        <IconButton
                            aria-label="show password"
                            color="primary"
                            colorScheme="text"
                            onClick={() => {
                                setshowPass((show: Boolean) => !show);
                            }}
                            icon={
                                showPass ? (
                                    <Eye size={18} />
                                ) : (
                                    <EyeSlash size={18} />
                                )
                            }
                        />
                    </InputRightElement>
                )}
            </InputGroup>
        </FormControl>
    );
}
