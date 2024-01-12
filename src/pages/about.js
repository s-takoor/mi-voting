import { Heading, Text, Flex, VStack, Container, Box, Divider } from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" px={4}>
      <Container maxW="container.lg">
        <VStack spacing={8} align="flex-start">
          <Heading as="h1" size="xl" textAlign="center">
            About the Blockchain Voting dApp
          </Heading>

          <Box>
            <Text fontSize="lg">
              <strong>Empowering Secure and Transparent Elections in Mauritius</strong>
            </Text>
            <Text>
              Discover how the Blockchain Voting dApp revolutionizes the electoral process in Mauritius, ensuring secure, transparent, and tamper-proof voting for all citizens.
            </Text>
          </Box>

          <Box>
            <Text fontSize="lg">
              <strong>Advanced Technology for Confidence in Democracy</strong>
            </Text>
            <Text>
              Learn how our innovative blockchain-based solution guarantees confidential, secure, and tamper-proof voting through the decentralized blockchain, empowering Mauritians to participate confidently in the democratic process.
            </Text>
          </Box>

          <Box>
            <Text fontSize="lg">
              <strong>Enhanced Security with Blockchain and IPFS</strong>
            </Text>
            <Text>
              Discover the advanced security features of blockchain and the InterPlanetary File System (IPFS), ensuring data integrity, privacy, and transparency in Mauritius's electoral system.
            </Text>
          </Box>

          <Box>
            <Text fontSize="lg">
              <strong>Empowering Features:</strong>
            </Text>
            <ul>
              <li>Immutable and secure vote records on the blockchain</li>
              <li>Transparent and tamper-proof election results</li>
              <li>User-friendly voting experience for all Mauritians</li>
              <li>Decentralized storage of election documents using IPFS</li>
              <li>Ensuring voter privacy and data protection</li>
            </ul>
          </Box>

          <Divider />

          <Box>
            <Text fontSize="lg">
              <strong>Promoting Confidence and Accountability</strong>
            </Text>
            <Text>
              Our app empowers Mauritians with a modern and trustworthy voting platform, promoting confidence in Mauritius's elections, accountability, and democratic principles.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
};

export default AboutPage;

