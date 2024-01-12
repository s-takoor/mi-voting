import { Box, Container, Flex, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.200" py={8}>
      <Container maxW="container.lg">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between">
          <Box flex="1" pr={{ md: 8 }}>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Mi-Voting DApp
            </Text>
            <Text>Your trusted platform for secure and transparent elections in Mauritius.</Text>
          </Box>
          <Box flex="1" mt={{ base: 4, md: 0 }}>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Contact Us
            </Text>
            <Text>If you have any questions or need assistance:</Text>
            <Text>Email: info@mivoting.mu</Text>
            <Text>Phone: +230 1234 5678</Text>
          </Box>
        </Flex>
        <Box textAlign="center" mt={8}>
          <Text fontSize="sm" color="gray.600">
            &copy; {new Date().getFullYear()} Mi-Voting DApp. All rights reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;


