/* eslint-disable react/jsx-key */
import {
  Box,
  Button,
  Center,
  createIcon,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { StarIcon } from './YourNotPromoter';

const Step1Icon = createIcon({
  displayName: 'step1',
  defaultProps: {
    viewBox: '0 0 48 48',
  },
  path: [
    <rect x="11" y="6" width="4" height="35" rx="2" fill="#4285F4" />,
    <rect x="23" y="6" width="4" height="35" rx="2" fill="#4285F4" />,
    <rect x="34" y="6" width="4" height="35" rx="2" fill="#4285F4" />,
    <circle cx="13" cy="25" r="5" fill="#99BFFF" />,
    <circle cx="25" cy="18" r="5" fill="#99BFFF" />,
    <circle cx="36" cy="31" r="5" fill="#99BFFF" />,
  ],
});

const Step2Icon = createIcon({
  displayName: 'step2',
  defaultProps: {
    viewBox: '0 0 48 48',
  },
  path: [
    <path
      d="M19.673 5.67358H9.15377C7.57217 5.67358 6.29297 6.95518 6.29297 8.53438V18.9672C6.29297 20.5488 7.57457 21.828 9.15377 21.828H19.673C21.2546 21.828 22.5338 20.5464 22.5338 18.9672V8.53438C22.5338 6.95518 21.2522 5.67358 19.673 5.67358Z"
      fill="#93BBFF"
    />,
    <path
      d="M19.673 25.3488H9.15377C7.57217 25.3488 6.29297 26.6304 6.29297 28.2096V38.6424C6.29297 40.224 7.57457 41.5032 9.15377 41.5032H19.673C21.2546 41.5032 22.5338 40.2216 22.5338 38.6424V28.2096C22.5338 26.6304 21.2522 25.3488 19.673 25.3488ZM28.9082 21.8304H39.4274C41.009 21.8304 42.2882 20.5488 42.2882 18.9696V8.53438C42.2882 6.95278 41.0066 5.67358 39.4274 5.67358H28.9082C27.3266 5.67358 26.0474 6.95518 26.0474 8.53438V18.9672C26.045 20.5488 27.3266 21.8304 28.9082 21.8304Z"
      fill="#376DDF"
    />,
    <path
      d="M28.1472 25.1687C27.8702 25.1687 27.5958 25.2233 27.3399 25.3293C27.0839 25.4353 26.8514 25.5907 26.6555 25.7866C26.4596 25.9825 26.3042 26.215 26.1982 26.471C26.0922 26.7269 26.0376 27.0013 26.0376 27.2783V40.2407C26.0376 40.5177 26.0922 40.7921 26.1982 41.048C26.3042 41.304 26.4596 41.5365 26.6555 41.7324C26.8514 41.9283 27.0839 42.0837 27.3399 42.1897C27.5958 42.2957 27.8702 42.3503 28.1472 42.3503C28.4242 42.3503 28.6986 42.2957 28.9545 42.1897C29.2105 42.0837 29.443 41.9283 29.6389 41.7324C29.8348 41.5365 29.9902 41.304 30.0962 41.048C30.2022 40.7921 30.2568 40.5177 30.2568 40.2407V27.2783C30.2544 26.1119 29.3112 25.1687 28.1472 25.1687ZM40.1976 25.1687C39.9206 25.1687 39.6462 25.2233 39.3903 25.3293C39.1343 25.4353 38.9018 25.5907 38.7059 25.7866C38.51 25.9825 38.3546 26.215 38.2486 26.471C38.1426 26.7269 38.088 27.0013 38.088 27.2783V40.2407C38.088 40.5177 38.1426 40.7921 38.2486 41.048C38.3546 41.304 38.51 41.5365 38.7059 41.7324C38.9018 41.9283 39.1343 42.0837 39.3903 42.1897C39.6462 42.2957 39.9206 42.3503 40.1976 42.3503C40.4746 42.3503 40.749 42.2957 41.0049 42.1897C41.2609 42.0837 41.4934 41.9283 41.6893 41.7324C41.8852 41.5365 42.0406 41.304 42.1466 41.048C42.2526 40.7921 42.3072 40.5177 42.3072 40.2407V27.2783C42.3048 26.1119 41.3616 25.1687 40.1976 25.1687ZM34.3464 29.2535C33.7869 29.2535 33.2503 29.4758 32.8547 29.8714C32.4591 30.267 32.2368 30.8036 32.2368 31.3631V40.2407C32.2368 40.8002 32.4591 41.3368 32.8547 41.7324C33.2503 42.128 33.7869 42.3503 34.3464 42.3503C34.9059 42.3503 35.4425 42.128 35.8381 41.7324C36.2337 41.3368 36.456 40.8002 36.456 40.2407V31.3631C36.456 30.8036 36.2337 30.267 35.8381 29.8714C35.4425 29.4758 34.9059 29.2535 34.3464 29.2535Z"
      fill="#93BBFF"
    />,
  ],
});

const Step3Icon = createIcon({
  displayName: 'step3',
  defaultProps: {
    viewBox: '0 0 48 48',
  },
  path: [
    <g clipPath="url(#clip0_617_3328)">
      <path
        d="M0.758377 11.8994H47.2721C47.6892 11.8994 48.0305 12.2407 48.0305 12.6578V21.7078C48.0305 22.1249 47.6892 22.4661 47.2721 22.4661H0.758377C0.341269 22.4661 0 22.1249 0 21.7078V12.6578C0 12.2407 0.341269 11.8994 0.758377 11.8994V11.8994Z"
        fill="#CDDAF6"
      />
      <path
        d="M6.03537 22.4661H41.9951C42.2731 22.4661 42.5006 22.6936 42.5006 22.9716V45.2047C42.5006 45.4828 42.2731 45.7103 41.9951 45.7103H6.03537C5.7573 45.7103 5.52979 45.4828 5.52979 45.2047V22.9716C5.52979 22.6936 5.7573 22.4661 6.03537 22.4661V22.4661Z"
        fill="#376DDF"
      />
      <path
        d="M10.9586 9.09966C10.9586 9.09966 5.44772 8.03794 4.34807 7.65875L6.29457 10.4584L2.78076 11.8551C2.78076 11.8551 11.0028 13.3782 19.8632 12.0637L15.5973 10.1298L10.9586 9.09966V9.09966ZM14.9211 2.43227C12.1214 1.933 10.788 2.90625 10.788 2.90625L10.0233 7.7409C10.0233 7.7409 12.0014 6.39479 14.346 6.97621C17.3985 7.7409 21.2156 12.0637 21.2156 12.0637V8.75839C21.2156 8.75839 18.713 3.10849 14.9211 2.43227ZM41.9636 10.4584L43.9164 7.65875C42.8167 8.03794 37.3059 9.09966 37.3059 9.09966L32.6671 10.1298L28.4012 12.07C37.2616 13.3845 45.4837 11.8551 45.4837 11.8551L41.9636 10.4584ZM38.2349 7.7409L37.4765 2.91257C37.4765 2.91257 36.143 1.93932 33.3433 2.43859C29.5515 3.11481 27.0488 8.76471 27.0488 8.76471V12.07C27.0488 12.07 30.8597 7.74722 33.9121 6.98253C36.2504 6.39479 38.2349 7.7409 38.2349 7.7409Z"
        fill="#FFDD85"
      />
      <path
        d="M20.8555 8.29077H27.1753V45.7103H20.8555V8.29077Z"
        fill="#FFCA3E"
      />
      <path
        d="M20.8555 22.6431H27.1753V45.7104H20.8555V22.6431Z"
        fill="#FFB82C"
      />
      <path
        d="M16.4189 7.71569C13.6634 6.1231 10.3898 6.66028 10.0295 7.74729C9.63139 8.94173 11.5842 10.212 14.4092 11.6908C16.2672 12.6641 21.2219 12.07 21.2219 12.07C21.2219 12.07 19.1743 9.30196 16.4189 7.71569V7.71569ZM38.2348 7.74097C37.8746 6.65396 34.6009 6.11678 31.8455 7.70937C29.0901 9.30196 27.0425 12.0637 27.0425 12.0637C27.0425 12.0637 32.0035 12.6578 33.8552 11.6845C36.6802 10.212 38.633 8.93541 38.2348 7.74097Z"
        fill="#FFB82C"
      />
    </g>,
    <defs>
      <clipPath id="clip0_617_3328">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>,
  ],
});

const LineIcon = createIcon({
  displayName: 'line',
  defaultProps: {
    viewBox: '0 0 2 60',
  },
  path: [
    <line
      x1="1"
      y1="1"
      x2="1"
      y2="59"
      stroke="#D9D9D9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="8 8"
    />,
  ],
});

export const HowToEarnCoins = () => {
  const { openConnectModal } = useConnectModal();
  return (
    <>
      <Box
        w="full"
        bg="#161C21"
        minH={{ base: 'auto', md: '540px' }}
        px={{ base: '18px', md: 0 }}
        py={{ base: '20px', md: '50px' }}
      >
        <Stack
          mx="auto"
          spacing={['20px', '30px']}
          direction={{ base: 'column', md: 'row' }}
          maxW={{ base: 'full', md: 'draft' }}
        >
          <Box pt="25px" color="white" fontFamily={'Inter'} mb={['10px', 0]}>
            <Heading
              wordBreak="break-word"
              fontWeight={700}
              fontSize={{ base: '32px', md: '64px' }}
              lineHeight={{ base: '40px', md: '80px' }}
              mb={['14px', '40px']}
            >
              Invite friends and earn coins together
            </Heading>
            <Box
              fontSize={['13px', '20px']}
              lineHeight={['20px', '30px']}
              maxW={['full', '460px']}
            >
              Invite friends to enjoy up to 80% transaction rebate, and make
              easy money with friends.
            </Box>

            <HStack mt="40px" spacing={'20px'} display={['none', 'flex']}>
              <Button
                w="200px"
                h="60px"
                fontSize={'18px'}
                fontWeight={700}
                bg="white"
                color="#1F2148"
                rounded="full"
                border="1px solid #00000"
                _hover={{ opacity: 0.8 }}
                _active={{
                  bg: 'white',
                }}
              >
                Detailed Rules
              </Button>
            </HStack>
          </Box>

          <Flex
            display={['none', 'flex']}
            direction={'column'}
            flexShrink={0}
            w={{ base: 'full', md: '600px' }}
            h={{ base: '335px', md: '440px' }}
            pos="relative"
          >
            <Image
              src="/images/agent/15k.png"
              pos="absolute"
              w="104px"
              top="100px"
              left="120px"
            />
            <Image
              src="/images/agent/10k.png"
              pos="absolute"
              w="114px"
              bottom="30px"
              right="80px"
            />
          </Flex>
        </Stack>
      </Box>
      <Box bg={['#161C21', 'transparent']} px={['18px', 0]}>
        <Box
          mx="auto"
          pos="relative"
          w="full"
          bg={['white', 'none']}
          rounded="12px"
          px={{ base: '18px', md: 0 }}
          py={{ base: '30px', md: '60px' }}
          maxW={{ base: 'full', md: 'draft' }}
        >
          <Heading
            fontFamily="Inter"
            fontSize={['18px', '40px']}
            fontWeight={700}
            lineHeight={['22px', '48px']}
            mb={['20px', '40px']}
            textAlign={['left', 'center']}
          >
            How to earn coins？
          </Heading>
          <Flex
            py={['0px', '60px']}
            pl={['40px', '0']}
            w="full"
            color="#161C21"
            border={['none', '1px solid rgba(18, 38, 62, 0.1)']}
            pos="relative"
            direction={['column', 'row']}
          >
            <StarIcon
              display={['none', 'block']}
              fontSize="32px"
              pos="absolute"
              top="-60px"
              left="-18px"
              color="#614FE1"
              transform="matrix(0.74, 0.68, -0.68, 0.74, 0, 0);"
            />
            <StarIcon
              display={['none', 'block']}
              fontSize="32px"
              pos="absolute"
              bottom="-80px"
              right="0px"
              color="#00C9BD"
              transform="matrix(0.9, 0.44, -0.44, 0.9, 0, 0);"
            />

            <Flex
              direction="column"
              align="flex-start"
              px={[0, '30px']}
              py={[0, '10px']}
              mb={['42px', 0]}
              pos="relative"
            >
              <Step1Icon
                pos={['absolute', 'unset']}
                top="0"
                left="-40px"
                fontSize={['30px', '48px']}
              />
              <LineIcon
                display={['block', 'none']}
                pos="absolute"
                fontSize="60px"
                top="40px"
                left="-54px"
              />
              <Text
                fontWeight={700}
                fontSize={['14px', '20px']}
                lineHeight={['16px', '24px']}
                mt={['7px', '60px']}
                mb="10px"
              >
                Step1：Share transaction rebate
              </Text>
              <Text
                fontSize={['14px', '20px']}
                lineHeight={['16px', '24px']}
                fontWeight={500}
                color={['#777E90', '#161C21']}
              >
                Set the transaction rebate rate which you want to share with
                your friend.
              </Text>
            </Flex>
            <Flex
              direction="column"
              align="flex-start"
              px={[0, '60px']}
              py={[0, '10px']}
              mb={['42px', 0]}
              pos="relative"
              borderLeft={['none', '1px solid rgba(0, 0, 0, 0.1);']}
              borderRight={['none', '1px solid rgba(0, 0, 0, 0.1);']}
            >
              <Step2Icon
                pos={['absolute', 'unset']}
                top="0"
                left="-40px"
                fontSize={['30px', '48px']}
              />
              <LineIcon
                display={['block', 'none']}
                pos="absolute"
                fontSize="60px"
                top="40px"
                left="-54px"
              />
              <Text
                fontWeight={700}
                fontSize={['14px', '20px']}
                lineHeight={['16px', '24px']}
                mt={['7px', '60px']}
                mb="10px"
              >
                Step2：Invite friends
              </Text>
              <Text
                fontSize={['14px', '20px']}
                lineHeight={['16px', '24px']}
                fontWeight={500}
                color={['#777E90', '#161C21']}
              >
                Share your invite link or QR code on social media/with your
                friend .
              </Text>
            </Flex>
            <Flex
              direction="column"
              align="flex-start"
              px={[0, '30px']}
              py={[0, '10px']}
              mb={0}
              pos="relative"
            >
              <Step3Icon
                pos={['absolute', 'unset']}
                top="0"
                left="-40px"
                fontSize={['30px', '48px']}
              />
              <Text
                fontWeight={700}
                fontSize={['14px', '20px']}
                lineHeight={['16px', '24px']}
                mt={['7px', '60px']}
                mb="10px"
              >
                Step3：Get rebate
              </Text>
              <Text
                fontSize={['14px', '20px']}
                lineHeight={['16px', '24px']}
                fontWeight={500}
                color={['#777E90', '#161C21']}
              >
                Earn transaction rebate after your friends' transactions
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Center py={['40px', '88px']}>
          <Button
            onClick={() => openConnectModal?.()}
            w={['200px', '400px']}
            h={['40px', '60px']}
            rounded="full"
            bg={['white', '#161C21']}
            _hover={{
              opacity: '0.6',
            }}
            _active={{
              opacity: '0.6',
            }}
            color={['#161C21', 'white']}
            fontSize={['16px', '18px']}
          >
            Earn money now
          </Button>
        </Center>
      </Box>
    </>
  );
};
