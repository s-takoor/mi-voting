import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CandidateCard from '../components/CandidateCard';
import VotingContract from '../utils/VotingContract.json';
import ipfs from '../utils/ipfs';
import {
  Box,
  VStack,
  Text,
  CircularProgress,
} from '@chakra-ui/react';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [votingEnded, setVotingEnded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const contractAddress = process.env.VOTING_CONTRACT_ADDRESS;

  useEffect(() => {
    fetchResults();
  }, []);

  const checkVotingStatus = async () => {
    const provider = ethers.getDefaultProvider('http://localhost:8545');
    const signer = await provider.getSigner();
    const votingContract = new ethers.Contract(
      contractAddress,
      VotingContract.abi,
      signer
    );

    const votingEndTimeBN = await votingContract.votingEndTime();
    const votingEndTime = votingEndTimeBN;

    const votingOpen = Date.now() < votingEndTime;
    setVotingEnded(!votingOpen);
  };

  const fetchResults = async () => {
    try {
      setIsLoading(true);

      await checkVotingStatus();

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

      setResults(candidates);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      {isLoading ? (
        <CircularProgress isIndeterminate color="teal" />
      ) : (
        <VStack spacing={4} alignItems="stretch">
          <Text fontSize="3xl" fontWeight="bold">
            Election Results
          </Text>
          {results.map((result) => (
            <CandidateCard
              key={result.id}
              candidate={result}
              isVotingOpen={!votingEnded}
              showVoteCount={votingEnded}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ResultsPage;
