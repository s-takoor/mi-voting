import { Flex, Link, Text, Spacer, Box, IconButton, Stack } from '@chakra-ui/react';
import { FiHome, FiUser, FiFileText, FiTrendingUp, FiInfo } from 'react-icons/fi';

const Navbar = () => {
  return (
    <Flex bg="teal.500" p={4} align="center" justify="space-between">
      <Box as="div">
        <Link href="/">
          <Flex direction="column" align="center">
            <IconButton
              as="div"
              icon={<FiHome />}
              aria-label="Home"
              fontSize="lg"
              color="white"
              _hover={{ color: 'teal.300' }}
            />
            <Text fontSize="sm" color="white">
              Home
            </Text>
          </Flex>
        </Link>
      </Box>
      <Spacer />
      <Stack direction="row" spacing={4}>
        <Box as="div">
          <Link href="/candidate">
            <Flex direction="column" align="center">
              <IconButton
                as="div"
                icon={<FiUser />}
                aria-label="Candidate Dashboard"
                fontSize="lg"
                color="white"
                _hover={{ color: 'teal.300' }}
              />
              <Text fontSize="sm" color="white">
                Candidate 
              </Text>
            </Flex>
          </Link>
        </Box>
        <Box as="div">
          <Link href="/voter">
            <Flex direction="column" align="center">
              <IconButton
                as="div"
                icon={<FiUser />}
                aria-label="Voter Dashboard"
                fontSize="lg"
                color="white"
                _hover={{ color: 'teal.300' }}
              />
              <Text fontSize="sm" color="white">
                Voter
              </Text>
            </Flex>
          </Link>
        </Box>
        <Box as="div">
          <Link href="/results">
            <Flex direction="column" align="center">
              <IconButton
                as="div"
                icon={<FiTrendingUp />}
                aria-label="Voting Results"
                fontSize="lg"
                color="white"
                _hover={{ color: 'teal.300' }}
              />
              <Text fontSize="sm" color="white">
                Results
              </Text>
            </Flex>
          </Link>
        </Box>
        <Box as="div">
          <Link href="/guidelines">
            <Flex direction="column" align="center">
              <IconButton
                as="div"
                icon={<FiFileText />}
                aria-label="Guidelines"
                fontSize="lg"
                color="white"
                _hover={{ color: 'teal.300' }}
              />
              <Text fontSize="sm" color="white">
                Guidelines
              </Text>
            </Flex>
          </Link>
        </Box>
        <Box as="div">
          <Link href="/about">
            <Flex direction="column" align="center">
              <IconButton
                as="div"
                icon={<FiInfo />}
                aria-label="About"
                fontSize="lg"
                color="white"
                _hover={{ color: 'teal.300' }}
              />
              <Text fontSize="sm" color="white">
                About
              </Text>
            </Flex>
          </Link>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Navbar;

