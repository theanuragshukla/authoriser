"use client";
import { Button } from "@chakra-ui/react";
import { ArrowRight } from "iconsax-react";

export default function CustomButton({
    text,
    link,
}: {
    text: string;
    link: string;
}) {
    return (
        <Button
            colorScheme="red"
            rightIcon={<ArrowRight />}
            onClick={() => (location.href = link)}
        >
            {text}
        </Button>
    );
}
