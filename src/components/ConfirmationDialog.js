import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";

function ConfirmationDialog({ 
  isOpen,
  onCancel,
  title = "",
  body="",
  onConfirm
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      await onConfirm();
    } catch (error) {
      console.error("Error confirming:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onCancel} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>{body}</Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onCancel}>
              No
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={handleConfirm}
              isLoading={isLoading}
              loadingText="Confirming"
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConfirmationDialog;
