import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  Grid,
  VStack,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Heading,
} from '@chakra-ui/react';
import VotingContract from '../utils/VotingContract.json';
import dotenv from 'dotenv';
import ipfs from '../utils/ipfs';
import CandidateCard from '../components/CandidateCard';
import VoterRegistrationModal from '../components/VoterRegistrationModal';
import ConfirmationDialog from '../components/ConfirmationDialog';

dotenv.config();

function VoterPage() {
  const [candidateData, setCandidateData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(true);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const toast = useToast();

  const contractAddress = process.env.VOTING_CONTRACT_ADDRESS;
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      let signer = null;
      let provider;

      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider();
      } else {
        try {
          provider = new ethers.BrowserProvider(window.ethereum);

          signer = await provider.getSigner();
        } catch (error) {
          setError("Error connecting to MetaMask: " + error.message);
        }
      }

      if (provider && signer) {
        setCurrentAccount(await signer.getAddress());
        setSigner(signer);
      } else {
        setError("Please install MetaMask or connect to a network.");
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const fetchVotingStatus = async () => {
    try {

      const provider = ethers.getDefaultProvider('http://localhost:8545');
      const signer = await provider.getSigner();
      const votingContract = new ethers.Contract(
        contractAddress,
        VotingContract.abi,
        signer
      );

      const votingStatus = await votingContract.votingOpen();

      setIsVotingOpen(votingStatus);
    } catch (error) {
      console.error('Error fetching voting status:', error);
    }
  };

  useEffect(() => {
    fetchCandidateDetails();
    fetchVotingStatus();
  }, [signer]); 

  const fetchCandidateDetails = async () => {
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
  };

  const openRegistrationModal = () => setRegistrationOpen(true);
  const closeRegistrationModal = () => setRegistrationOpen(false);

  const openConfirmationDialog = () => setConfirmationOpen(true);
  const closeConfirmationDialog = () => setConfirmationOpen(false);

  const handleVoterRegistration = async (voterAddress) => {
    try {
      setIsLoading(true);

      const votingContract = new ethers.Contract(
        contractAddress,
        VotingContract.abi,
        signer
      );

  const tx = await votingContract.registerVoter(voterAddress);

  await tx.wait();

       toast({
         title: "Success",
         description: "Voter registered successfully.",
         status: "success",
         position: "bottom",
         duration: 5000,
         isClosable: true,
       });
  
       closeRegistrationModal();
     } catch (error) {
       console.error("Error registering voter:", error);
       toast({
         title: "Error",
         description: "Failed to register voter.",
         status: "error",
         position: "bottom",
         duration: 5000,
         isClosable: true,
       });
     } finally {
       setIsLoading(false);
     }
   };

  const handleVote = async (candidateId) => {
    try {
      setIsLoading(true);

      const votingContract = new ethers.Contract(
        contractAddress,
        VotingContract.abi,
        signer
      );

      const tx = await votingContract.connect(signer).castVote(candidateId);

      await tx.wait();

      toast({
        title: "Success",
        description: "Vote cast successfully.",
        status: "success",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error casting vote:", error);
      toast({
        title: "Error",
        description: "Failed to cast your vote.",
        status: "error",
        position: "bottom",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4}>
      <Heading as="h1" size="xl">
        Voter Dashboard
      </Heading>
      {error && <p>Error: {error}</p>}
      <Button
        onClick={openRegistrationModal}
        size="md"
        colorScheme="teal"
        variant="solid"
      >
        Register Voter
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

      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationDialog}
        onConfirm={closeConfirmationDialog}
        title="Registration Success"
        body="Voter registered successfully."
      />

      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        {candidateData.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onVote={handleVote}
            isVotingOpen={isVotingOpen}
          />
        ))}
      </Grid>

      <Modal isOpen={isRegistrationOpen} onClose={closeRegistrationModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voter Registration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VoterRegistrationModal
              isOpen={isRegistrationOpen}
              onClose={closeRegistrationModal}
              onRegister={handleVoterRegistration}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default VoterPage;

