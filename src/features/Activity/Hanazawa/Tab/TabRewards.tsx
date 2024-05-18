import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image as ChakraImage,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { PageInfoContext } from '../context';
import { useContext } from 'react';
import { staticChainId, useUserDataValue } from '@/store';
import { useRouter } from 'next/router';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useTranslations } from 'next-intl';

export default function TabRewards() {
  const router = useRouter();
  const { data } = useContext(PageInfoContext);
  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();
  const t = useTranslations('hz');

  const onListing = () => {
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    router.push(`/user/${userData?.wallet_address}?bulkList=true`);
  };

  return (
    <Box pb={{ base: 0, md: '100px' }}>
      <Box
        bgColor="rgba(255,255,255,0.05)"
        borderRadius={'8px'}
        p={{ base: '20px', md: '82px 110px' }}
      >
        <Stack
          justify={'space-between'}
          align="center"
          direction={{ base: 'column', md: 'row' }}
          px={{ base: '0', md: '15px' }}
          mb={{ base: '30px', md: '60px' }}
          spacing={{ base: '20px', md: 2 }}
        >
          <Box w="full">
            <Heading
              mb={{ base: '20px', md: '10px' }}
              display={'flex'}
              alignItems="center"
              fontWeight={'semibold'}
              fontSize={{ base: '18px', md: '28px' }}
              as="h2"
            >
              {t('rewards')}
              <ChakraImage
                ml={{ base: '5px', md: '10px' }}
                w={{ base: '22px', md: '28px' }}
                h="auto"
                src="/images/activity/hanazawa/tabs/rewards_gift_ico.svg"
              />
            </Heading>
            <Text
              fontSize={{ base: '13px', md: '18px' }}
              color={{ base: 'white', md: 'unset' }}
            >
              {t('rewardsContent')}
            </Text>
          </Box>
          <HStack spacing={'20px'}>
            <Button
              w={{ base: '130px', md: '187px' }}
              h={{ base: '34px', md: '48px' }}
              rounded="24px"
              fontSize={{ base: '13px', md: '16px' }}
              color="white"
              bg="url(/images/activity/hanazawa/tabs/btn_fill.svg)"
              bgSize="cover"
              _hover={{
                opacity: 0.8,
              }}
              onClick={onListing}
            >
              {t('list')}
            </Button>
            <NextLink
              href={`/collection/${staticChainId}/${data.address}`}
              passHref
            >
              <Link>
                <Button
                  w={{ base: '130px', md: '187px' }}
                  h={{ base: '34px', md: '48px' }}
                  rounded="24px"
                  fontSize={{ base: '13px', md: '16px' }}
                  bgColor="none"
                  bg="url(/images/activity/hanazawa/tabs/btn_outline.svg)"
                  bgSize="cover"
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  {t('buy')}
                </Button>
              </Link>
            </NextLink>
          </HStack>
        </Stack>
        <SimpleGrid
          templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
          spacing={{ base: '20px', md: '12px' }}
        >
          <Box
            borderRadius="8px"
            p="1px"
            bg="linear-gradient(to right, #6F9FF3, #473874)"
          >
            <Flex
              h="full"
              bgColor="#141726"
              borderRadius="8px"
              direction={'column'}
              p={{ base: '24px 20px', md: '40px 34px 30px' }}
            >
              <Heading
                fontWeight={'normal'}
                fontSize={'16px'}
                as="h3"
                display={'flex'}
                mb="20px"
                alignItems="flex-start"
              >
                <ChakraImage
                  w={{ base: '30px', md: '40px' }}
                  mr="2px"
                  h="auto"
                  src="/images/activity/hanazawa/tabs/rewards_feature_1.svg"
                />
                {t('rewardsItme1')}
              </Heading>
              <HStack
                mx="auto"
                fontSize={'14px'}
                lineHeight="20px"
                color="#838383"
                spacing={'35px'}
              >
                <VStack spacing={'6px'}>
                  <Text color={'#838383'} fontSize="14px">
                    {t('creatorFee')}
                  </Text>
                  <Text color="#60FFE8" fontWeight={'bold'} fontSize="28px">
                    0
                  </Text>
                </VStack>
                <VStack spacing={'6px'}>
                  <Text color={'#838383'} fontSize="14px">
                    {t('transactionFee')}
                  </Text>
                  <Text color="#60FFE8" fontWeight={'bold'} fontSize="28px">
                    0
                  </Text>
                </VStack>
              </HStack>
            </Flex>
          </Box>
          <Box
            borderRadius="8px"
            p="1px"
            bg="linear-gradient(to right, #6F9FF3, #473874)"
          >
            <Flex
              h="full"
              bgColor="#141726"
              borderRadius="8px"
              direction={'column'}
              p={{ base: '24px 20px', md: '40px 34px 30px' }}
            >
              <Heading
                fontWeight={'normal'}
                fontSize={'16px'}
                as="h3"
                display={'flex'}
                mb="20px"
                alignItems="flex-start"
              >
                <ChakraImage
                  w={{ base: '30px', md: '40px' }}
                  mr="2px"
                  h="auto"
                  src="/images/activity/hanazawa/tabs/rewards_feature_2.svg"
                />
                {t('rewardsItme2')}
              </Heading>
              <Box
                p={{ base: '0 20px 10px 32px', md: '0 10px 0px 40px' }}
                fontSize={'14px'}
                lineHeight="20px"
                color="#838383"
              >
                <Text
                  dangerouslySetInnerHTML={{
                    __html: t.raw('rewardsItme2Content'),
                  }}
                ></Text>
              </Box>
            </Flex>
          </Box>
          <Box
            borderRadius="8px"
            p="1px"
            bg="linear-gradient(to right, #6F9FF3, #473874)"
          >
            <Flex
              h="full"
              bgColor="#141726"
              borderRadius="8px"
              direction={'column'}
              p={{ base: '24px 20px', md: '40px 34px 30px' }}
            >
              <Heading
                fontWeight={'normal'}
                fontSize={'16px'}
                as="h3"
                display={'flex'}
                mb="20px"
                alignItems="flex-start"
              >
                <ChakraImage
                  w={{ base: '30px', md: '40px' }}
                  mr="2px"
                  h="auto"
                  src="/images/activity/hanazawa/tabs/rewards_feature_3.svg"
                />
                {t('rewardsItme3')}
              </Heading>
              <Box
                p={{ base: '0 20px 10px 32px', md: '0 10px 0px 40px' }}
                fontSize={'14px'}
                lineHeight="20px"
                color="#838383"
              >
                <Text as="p" mb="20px">
                  {t.raw('rewardsItme3Content')[0]}
                </Text>
                <Text as="p" mb="0">
                  {t.raw('rewardsItme3Content')[1]}
                </Text>
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
