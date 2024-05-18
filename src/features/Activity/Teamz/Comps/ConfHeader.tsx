import { Box, Text } from '@chakra-ui/react';

export const ConfHeader = () => {
  return (
    <>
      <Box p={{ base: '4vw', md: '30px' }} pt="8vw">
        <Text
          fontSize={{ base: '5.5vw', md: '20px' }}
          color="white"
          fontFamily="Helvetica-Bold, Helvetica"
          fontWeight="bold"
        >
          TEAMZ
          <Text as="span" color="#2EABFFFF" pl="2vw" pr="2vw">
            WEB3
          </Text>
          SUMMIT
          <Text as="span" color="black" textShadow="1px 1px 2px white" pl="2vw">
            IN JAPAN
          </Text>
        </Text>
        <Text
          fontSize={{ base: '6vw', lg: '25px' }}
          color="white"
          fontFamily="Helvetica-Bold, Helvetica"
          fontWeight="bold"
        >
          NFT TICKET
        </Text>
      </Box>
    </>
  );
};
