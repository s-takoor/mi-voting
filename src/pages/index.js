import React from 'react';
import {
  Heading,
  Button,
  Flex,
  VStack,
  Text,
  HStack,
} from '@chakra-ui/react';
import CountdownTimer from '../components/CountdownTimer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Link } from '@chakra-ui/react';

const HomePage = () => {
  const electionDate = new Date('2024-09-20');

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh" px={4}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        minHeight="60vh"
        bg="teal.500"
        px={8}
        py={12}
      >
        <Heading as="h1" size="2xl" textAlign="center" color="white" mb={4}>
          Shape the Future of Mauritius with Every Vote
        </Heading>
        <Text textAlign="center" color="whiteAlpha.900" fontSize="xl" mb={8}>
          Empower change, ensure transparency, and secure your voice through blockchain technology.
        </Text>
        <VStack spacing={4} alignItems="center">
          <Button
            colorScheme="whiteAlpha"
            variant="outline"
            size="lg"
            _hover={{ bg: 'teal.500', color: 'white', textDecoration: 'underline', transition: 'background-color 0.3s, color 0.3s' }}
          >
            <Link href="/candidate">Candidate Dashboard</Link>
          </Button>
          <Button
            colorScheme="whiteAlpha"
            variant="outline"
            size="lg"
            _hover={{ bg: 'teal.500', color: 'white', textDecoration: 'underline', transition: 'background-color 0.3s, color 0.3s' }}
          >
            <Link href="/voter">Voter Dashboard</Link>
          </Button>
        </VStack>

        {/* Breadcrumb links under Voter Dashboard button */}
        <VStack spacing={5} align="center" mt={4}>
          <Text color="whiteAlpha.700" fontSize="lg" textAlign="center" fontWeight={"bold"}>
          Learn More and Participate:
        </Text>
          <Breadcrumb spacing="8px" separator="-">
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                color="whiteAlpha.700"
                href="/results"
                fontSize="lg"
                _hover={{ color: 'white', textDecoration: 'underline', transition: 'color 0.3s' }}
              >
                Results
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                color="whiteAlpha.700"
                href="/guidelines"
                fontSize="lg"
                _hover={{ color: 'white', textDecoration: 'underline', transition: 'color 0.3s' }}
              >
                Guidelines
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                color="whiteAlpha.700"
                href="/about"
                fontSize="lg"
                _hover={{ color: 'white', textDecoration: 'underline', transition: 'color 0.3s' }}
              >
                About
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </VStack>
      </Flex>

      <VStack spacing={8} mt={8} align="center">
        <Text fontSize="lg" fontWeight="bold">
          Upcoming Elections:
        </Text>
        <Heading as="h2" size="xl" textAlign="center">
          Date: September 20, 2024
        </Heading>
        <HStack align="center">
          <Text fontSize="lg" fontWeight="bold">
            Election Countdown:
          </Text>
          {/* CountdownTimer component */}
          <CountdownTimer targetDate={electionDate} />
        </HStack>
        <Text textAlign="center">Type: General Elections</Text>
      </VStack>
    </Flex>
  );
};

export default HomePage;

