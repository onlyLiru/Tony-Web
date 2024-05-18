import { Box, Text } from '@chakra-ui/react';

export const ConfHeader = () => {
  return (
    <>
      <Box p={{ base: '4vw', md: '30px' }} pt="8vw">
        <Text
          fontSize={{ base: '5.5vw', md: '16px' }}
          color="white"
          fontFamily="Helvetica-Bold, Helvetica"
          fontWeight="bold"
        >
          From Sketch to Screen Japanese Anime Art And Manuscript Grand
          Exhibition
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
