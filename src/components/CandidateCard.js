import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Text,
  VStack,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

export default function CandidateCard({
  candidate,
  onVote,
  isVotingOpen,
  hasAlreadyVoted,
  showVoteCount,
}) {
  const [hasVoted, setHasVoted] = useState(hasAlreadyVoted);

  const handleVote = async () => {
    if (hasVoted) {
      console.log('You have already voted for this candidate.');
      return;
    }

    await onVote(candidate.id);

    setHasVoted(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow="lg"
        p={4}
        mb={4}
        ml={4}
        mr={4}
        transition="box-shadow 0.2s ease-in-out"
        _hover={{
          boxShadow: 'lg',
        }}
      >
        <Avatar
          name={candidate.name}
          src={candidate.imageUrl}
          bg={useColorModeValue('teal.500', 'teal.500')}
          size="xl"
          mb={2}
        />
        <VStack p={2} alignItems="center">
          <Text fontSize="xl" fontWeight="bold">
            {candidate.name}
          </Text>
          <Text fontSize="md" color="gray.500">
            Party: {candidate.party}
          </Text>
          {showVoteCount && isVotingOpen && !hasVoted && (
            <Badge
              colorScheme="teal"
              variant="solid"
              fontSize="sm"
              mt={2}
              p={1}
            >
              Vote Count: {candidate.voteCount}
            </Badge>
          )}
          {candidate.ipfsHashReference && (
            <Tooltip label={`IPFS Hash Reference: ${candidate.ipfsHashReference}`}>
              <Text fontSize="sm" color="gray.700" mt={2} wordBreak="break-all">
                IPFS Hash Reference: {candidate.ipfsHashReference.slice(0, 10)}...
              </Text>
            </Tooltip>
          )}
          {showVoteCount && (
            <Text fontSize="md" color="teal.500">
              Vote Count: {candidate.voteCount}
            </Text>
          )}
          {isVotingOpen && !hasVoted && (
            <Button
              colorScheme="teal"
              size="sm"
              onClick={handleVote}
              isDisabled={!isVotingOpen || hasAlreadyVoted}
              mt={2}
            >
              {hasAlreadyVoted ? 'Voted' : 'Vote'}
            </Button>
          )}
          {!isVotingOpen && (
            <Text fontSize="sm" color="gray.700" mt={2}>
              Voting is closed.
            </Text>
          )}
        </VStack>
      </Box>
    </motion.div>
  );
}

