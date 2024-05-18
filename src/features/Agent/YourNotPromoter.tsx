import { Box, Button, createIcon, Flex } from '@chakra-ui/react';

export const StarIcon = createIcon({
  displayName: 'star',
  defaultProps: {
    viewBox: '0 0 32 32',
    fill: 'currentColor',
  },
  path: [
    <path
      key="d1"
      d="M14.2991 0.674775C11.7259 0.832895 10.4107 7.77025 11.3615 16.1698C12.3123 24.5693 15.169 31.2503 17.7421 31.0922C20.3153 30.9341 21.6305 23.9967 20.6797 15.5972C19.7289 7.19765 16.8722 0.516656 14.2991 0.674775Z"
      fill="currentColor"
    />,
    <path
      key="d2"
      d="M31.0087 13.945C31.4827 16.5005 25.1305 19.475 16.8207 20.5888C8.51083 21.7025 1.3901 20.5337 0.916077 17.9782C0.442056 15.4227 6.79425 12.4482 15.1041 11.3345C23.4139 10.2208 30.5347 11.3895 31.0087 13.945Z"
      fill="currentColor"
    />,
  ],
});

export const YourNotPromoter = () => {
  return (
    <>
      <Box w="full" bg="#161C21">
        <Flex
          mx="auto"
          pos="relative"
          direction="column"
          align={'center'}
          justify="center"
          w="full"
          minH={{ base: 'calc(100vh - 72px)', md: 'calc(100vh - 80px)' }}
          px={{ base: '18px', md: 0 }}
          py={{ base: '44px', md: '50px' }}
          maxW={{ base: 'full', md: 'draft' }}
        >
          <StarIcon
            fontSize="32px"
            pos="absolute"
            top="46px"
            left="30px"
            color="#614FE1"
            transform="matrix(0.74, 0.68, -0.68, 0.74, 0, 0);"
          />
          <StarIcon
            fontSize="32px"
            pos="absolute"
            bottom="20px"
            right="30px"
            color="#00C9BD"
            transform="matrix(0.9, 0.44, -0.44, 0.9, 0, 0);"
          />
          <Box
            textAlign="center"
            fontWeight={600}
            fontSize={['20px', '24px']}
            color="white"
          >
            无法查看，您还不是推广者，请联系客服申请成为推广者
          </Box>
          <Button
            as="a"
            href="mailto:ops@unemeta.com"
            target="_blank"
            mt={['60px', '100px']}
            w={['full', '400px']}
            h={['40px', '60px']}
            rounded="full"
            bg="white"
            color="#000"
            fontSize={['16px', '18px']}
          >
            联系客服
          </Button>
        </Flex>
      </Box>
    </>
  );
};
