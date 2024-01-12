import { useEffect, useState } from 'react';
import IPFS from 'ipfs-api';
import { Box, Heading, Text, Container, Flex, VStack, Divider } from '@chakra-ui/react';

const GuidelinesPage = () => {
  const [guidelinesContent, setGuidelinesContent] = useState('');
  const ipfsElectionGuidelinesCid = process.env.IPFS_ELECTION_GUIDELINES_CID;

  const fetchGuidelinesFromIPFS = async (ipfsHash) => {
    const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });
    try {
      const content = await ipfs.cat(ipfsHash);
      return content.toString();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (ipfsElectionGuidelinesCid) {
      fetchGuidelinesFromIPFS(ipfsElectionGuidelinesCid)
        .then((content) => setGuidelinesContent(content))
        .catch((error) => console.error('Error fetching guidelines:', error));
    } else {
      console.error('IPFS CID for election guidelines not provided in .env');
    }
  }, [ipfsElectionGuidelinesCid]);

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="flex-start">
        <Box width="100%" maxW="60em">
          <Heading as="h2" size="lg" mb={4}>
            Election Guidelines
          </Heading>
          <Divider />
          <Text fontSize="md" whiteSpace="pre-line">
            {guidelinesContent}
          </Text>
          <Divider />
        </Box>
      </VStack>
    </Container>
  );
};

export default GuidelinesPage;

