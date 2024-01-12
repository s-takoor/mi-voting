import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  Grid,
  VStack,
  useDisclosure,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Heading,
} from '@chakra-ui/react';
import VotingContract from '../utils/VotingContract.json';
import dotenv from 'dotenv';
import ipfs from '../utils/ipfs';
import CandidateCard from '../components/CandidateCard';
import ConfirmationDialog from '../components/ConfirmationDialog';
dotenv.config();

function CandidatePage() {
  const [candidateData, setCandidateData] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationDialogProps, setConfirmationDialogProps] = useState({
    title: '',
    body: '',
    onConfirm: () => {},
  });
  const toast = useToast();

  const ownerAddress = process.env.SMART_CONTRACT_OWNER_ADDRESS;
  const ownerPrivateKey = process.env.SMART_CONTRACT_OWNER_PRIVATE_KEY;
  const contractAddress = process.env.VOTING_CONTRACT_ADDRESS;

  useEffect(() => {
    async function fetchCandidateDetails() {
      try {
        setIsLoading(true);
        const provider = ethers.getDefaultProvider('http://localhost:8545');
        const signer = await provider.getSigner();
        const votingContract = new ethers.Contract(
          contractAddress,
          VotingContract.abi,
          signer
        );

        const candidateCount = await votingContract.getCandidateCount();
        const candidates = [];

        for (let candidateId = 0; candidateId < candidateCount; candidateId++) {
          const candidateDetails = await votingContract.getCandidateDetails(candidateId);
          const ipfsHashReference = candidateDetails[3];

          if (ipfsHashReference) {
            const ipfsResponse = await ipfs.cat(ipfsHashReference);
            const ipfsData = JSON.parse(ipfsResponse.toString());

            if (ipfsData?.name !== 'N/A' && ipfsData?.party !== 'N/A') {
              candidates.push({
                id: candidateId,
                name: ipfsData?.name || 'N/A',
                party: ipfsData?.party || 'N/A',
                voteCount: candidateDetails[2].toString(),
                ipfsHashReference: ipfsHashReference || 'N/A',
              });
            }
          }
        }

        setCandidateData(candidates);
      } catch (error) {
        console.error('Error fetching candidate details:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCandidateDetails();
  }, []);

  async function handleAddCandidate() {
    try {
      setIsLoading(true);
      const provider = ethers.getDefaultProvider('http://localhost:8545');
      const signer = new ethers.Wallet(ownerPrivateKey, provider);
      const votingContract = new ethers.Contract(
        contractAddress,
        VotingContract.abi,
        signer
      );

      const userAddress = await signer.getAddress();
      if (userAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
        // Show an error toast to inform the user they are not the owner
        toast({
          title: 'Error',
          description: 'You are not the owner.',
          status: 'error',
          position: 'bottom',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const candidateData = {
        name: newCandidateName,
        party: newCandidateParty,
      };

      const bufferData = Buffer.from(JSON.stringify(candidateData));

      let ipfsHash = '';

      if (ipfs) {
        const ipfsResponse = await ipfs.add(bufferData);
        ipfsHash = ipfsResponse[0].hash;
      }

      await votingContract.addCandidate(
        newCandidateName,
        newCandidateParty,
        ipfsHash
      );

      setCandidateData((prevCandidateData) => [
        ...prevCandidateData,
        {
          id: prevCandidateData.length,
          name: newCandidateName,
          party: newCandidateParty,
          voteCount: '0',
          ipfsHashReference: ipfsHash,
        },
      ]);

      toast({
        title: 'Candidate Added',
        description: 'The candidate has been added successfully.',
        status: 'success',
        position: 'bottom',
        duration: 5000,
        isClosable: true,
      });

      setShowConfirmationDialog(false);

      onClose();

      setNewCandidateName('');
      setNewCandidateParty('');
    } catch (error) {
      console.error('Error adding candidate:', error);

      let errorMessage = 'An error occurred while adding the candidate.';

  if (error.message.includes('not the owner')) {
    errorMessage = 'Only the owner can register candidates.';
  } else if (error.message.includes('same name and party')) {
    errorMessage = 'A candidate with the same name and party already exists.';
  }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        position: 'bottom',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);

      setNewCandidateName('');
      setNewCandidateParty('');
    }
  }

  const showConfirmDialog = (title, body, onConfirm) => {
    setConfirmationDialogProps({ title, body, onConfirm });
    setShowConfirmationDialog(true);
  };

  return (
    <VStack spacing={4}>
      <Heading as="h2" size="lg" mb={4}>
        Candidate Dashboard
      </Heading>
      <Button
        onClick={onOpen}
        size="md"
        colorScheme="teal"
        variant="solid"
      >
        Register Candidate
      </Button>
      {isLoading && (
        <Spinner
          size="xl"
          color="teal.500"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
        />
      )}
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {candidateData.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate} />
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset="scale">
        <ModalOverlay 
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent>
          <ModalHeader>Candidate Registration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input
              type="text"
              placeholder="Candidate Name"
              value={newCandidateName}
              onChange={(e) => setNewCandidateName(e.target.value)}
              mb={2}
              required
            />
            <input
              type="text"
              placeholder="Candidate Party"
              value={newCandidateParty}
              onChange={(e) => setNewCandidateParty(e.target.value)}
              mb={2}
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                showConfirmDialog(
                  'Confirm Candidate Addition',
                  `Are you sure you want to add ${newCandidateName} as a candidate?`,
                  handleAddCandidate
                );
              }}
              size="md"
              colorScheme="teal"
              variant="solid"
            >
              Register Candidate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {showConfirmationDialog && (
        <ConfirmationDialog
          isOpen={showConfirmationDialog}
          onConfirm={handleAddCandidate}
          onCancel={() => setShowConfirmationDialog(false)}
          title="Confirm Candidate Addition"
          body={`Are you sure you want to add ${newCandidateName} as a candidate?`}
        />
      )}
    </VStack>
  );
}

export default CandidatePage;
