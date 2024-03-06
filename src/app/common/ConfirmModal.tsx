import React from "react";
import {
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    UseDisclosureReturn,
} from "@chakra-ui/react";

export const ConfirmModel = ({
    disclosure,
    loading,
    onConfirm,
}: {
    disclosure: UseDisclosureReturn;
    loading: boolean;
    onConfirm: ()=>{};
}) => {
    return (
        <Modal
            isOpen={disclosure.isOpen}
            onClose={disclosure.onClose}
            onEsc={disclosure.onClose}
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
                            onClick={disclosure.onClose}
                        >
                            No
                        </Button>
                        <Button
                            isLoading={loading}
                            loadingText="Please wait ..."
                            size="md"
                            colorScheme="green"
                            variant="outline"
                            onClick={onConfirm}
                        >
                            Yes, Give me superpowers
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
