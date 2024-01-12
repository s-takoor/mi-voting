import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';

function VoterRegistrationModal({
  isOpen,
  onClose,
  onRegister,
}) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAddress('');
      setError('');
    }
  }, [isOpen]);

  const handleRegister = async () => {
    if (isRegistering) {
      return;
    }

    const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    if (!addressRegex.test(address)) {
      setError('Please enter a valid Ethereum address.');
      return;
    }

    setIsRegistering(true);

    try {
      await onRegister(address);
      onClose();
    } catch (error) {
      console.error('Error registering voter:', error);
      setError('Failed to register voter. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="scale">
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px) hue-rotate(90deg)'
      />
      <ModalContent>
        <ModalHeader>Register as a Voter</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            placeholder="Enter your Ethereum address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {error && (
            <Text color="red.500" mt={2}>
              {error}
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={handleRegister}
            variant="solid"
            isLoading={isRegistering}
            loadingText="Registering..."
            isDisabled={isRegistering}
          >
            Register
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default VoterRegistrationModal;
