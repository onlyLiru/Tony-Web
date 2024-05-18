import {
  Box,
  Heading,
  HStack,
  Tooltip,
  Text,
  Image as ChakraImage,
  SimpleGrid,
  Flex,
  VStack,
  Link,
  Center,
} from '@chakra-ui/react';
import { ChevronRightIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { useContext, useRef } from 'react';
import { PageContext } from './context';
import { RuleModal } from './RuleModal';
import { useListingLink } from '../help';
import { staticChainId, useUserDataValue } from '@/store';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';

const InsightsChart = () => {
  const t = useTranslations('fmex');
  const ct = useTranslations('common');

  return (
    <Box pos="relative" fontSize="14px" lineHeight="17px" color="white">
      <Tooltip label={t('teamTip')} placement="top">
        <Text
          pos="absolute"
          top="-28px"
          left="50%"
          transform={'translateX(-50%)'}
        >
          {ct('project.team')}
        </Text>
      </Tooltip>
      <Tooltip label={t('otherFactorsTip')} placement="top">
        <Text pos="absolute" top="45px" right="-105px" w="100px" align="left">
          {ct('project.otherFactors')}
        </Text>
      </Tooltip>
      <Tooltip label={t('backersTip')} placement="top">
        <Text
          pos="absolute"
          bottom="-22px"
          right="-25px"
          transform={'translateX(-50%)'}
        >
          {ct('project.backers')}
        </Text>
      </Tooltip>
      <Tooltip label={t('utilitiesTip')} placement="top">
        <Text
          pos="absolute"
          bottom="-22px"
          left="12px"
          transform={'translateX(-50%)'}
        >
          {ct('project.utilities')}
        </Text>
      </Tooltip>
      <Tooltip label={t('communityTip')} placement="top">
        <Text
          pos="absolute"
          top="45px"
          left="-40px"
          transform={'translateX(-50%)'}
        >
          {ct('project.community')}
        </Text>
      </Tooltip>
      <ChakraImage
        w={{ md: '154px', base: '140px' }}
        src="/images/activity/fmex/chart.svg"
      />
    </Box>
  );
};

export const Dashboard = () => {
  const { data } = useContext(PageContext);
  const ruleRef = useRef<any>();
  const userData = useUserDataValue();
  const t = useTranslations('fmex');

  const { handleListing } = useListingLink(userData?.wallet_address);

  return (
    <>
      <Box
        bgColor="#330A4E"
        pt={{ md: '54px', base: '21px' }}
        pb={{ md: '92px', base: '26' }}
        px={{ md: 0, base: '20px' }}
      >
        <Box maxW="1140px" mx="auto">
          <Heading
            fontSize={{ md: '40px', base: '16px' }}
            lineHeight={{ md: '48px', base: '19px' }}
            color="white"
            mb={{ md: '42px', base: '23px' }}
          >
            {`${t('insights')} & ${t('rewards')}`}
          </Heading>
          <SimpleGrid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            spacing={{ base: '16px', md: '54px' }}
            // mb={{ base: '20px', md: '40px' }}
          >
            <Box
              bgColor="#420E64"
              rounded="16px"
              p={{ md: '14px 0 0 36px', base: '10px 10px 0' }}
            >
              <Tooltip label={t('insightsTip')} placement="top">
                <Heading
                  fontSize={{ md: '28px', base: '16px' }}
                  lineHeight="34px"
                  color="white"
                >
                  {t('insights')}
                </Heading>
              </Tooltip>
              <Flex
                justify={{ base: 'center', md: 'center' }}
                p={{ base: '40px 0', md: '56px 0 65px 0' }}
              >
                <InsightsChart />
              </Flex>
            </Box>
            <Box
              bgColor="#420E64"
              rounded="16px"
              p={{ md: '14px 36px 40px 36px', base: '10px 10px 27px' }}
              color="white"
            >
              <Heading
                fontSize={{ md: '28px', base: '16px' }}
                fontWeight="bold"
                lineHeight="34px"
                color="white"
                mb={{ md: '10px', base: '6px' }}
              >
                {t('rewards')}
                <QuestionOutlineIcon
                  fontSize={{ md: '24px', base: '16px' }}
                  ml={3}
                  onClick={ruleRef.current?.open}
                />
              </Heading>
              <Text
                fontSize={{ md: '14px', base: '12px' }}
                lineHeight="16px"
                mb={{ md: '40px', base: '16px' }}
              >
                {t('rewardDesc')}
              </Text>
              <HStack mb={{ md: '48px', base: '22px' }}>
                <Text fontSize={{ md: '20px', base: '14px' }} fontWeight={600}>
                  {t('pool')}
                </Text>
                <Text
                  flex={1}
                  fontSize={{ md: '56px', base: '42px' }}
                  lineHeight={{ md: '60px', base: '56px' }}
                  fontWeight={900}
                  bg="linear-gradient(180deg, #FFFFFF 0%, #EC9F34 100%)"
                  bgClip="text"
                  textShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
                  textAlign="center"
                >
                  {data.integral}
                </Text>
              </HStack>
              <VStack spacing={{ md: '16px', base: '8px' }}>
                <HStack
                  spacing={{ md: '16px', base: '10px' }}
                  w="full"
                  cursor="pointer"
                  onClick={handleListing}
                >
                  <Center
                    w={{ md: '28px', base: '24px' }}
                    h={{ md: '28px', base: '24px' }}
                    rounded="full"
                    bgColor="#159700"
                    fontSize="20px"
                    fontFamily="Urbanist"
                  >
                    1
                  </Center>
                  <HStack justify="space-between" flex={1}>
                    <Text
                      fontSize={{ md: '20px', base: '14px' }}
                      fontWeight="bold"
                      lineHeight={{ base: '20px', md: '24px' }}
                    >
                      {t('listReward')}
                    </Text>
                    <ChevronRightIcon
                      color="white"
                      fontSize={{ md: '32px', base: '24px' }}
                    />
                  </HStack>
                </HStack>
                <NextLink
                  href={`/collection/${staticChainId}/${data.contract_address}`}
                  passHref
                >
                  <Link w="full">
                    <HStack spacing={{ md: '16px', base: '10px' }} w="full">
                      <Center
                        w={{ md: '28px', base: '24px' }}
                        h={{ md: '28px', base: '24px' }}
                        rounded="full"
                        bgColor="#159700"
                        fontSize="20px"
                        fontFamily="Urbanist"
                      >
                        2
                      </Center>
                      <HStack justify="space-between" flex={1}>
                        <Text
                          fontSize={{ md: '20px', base: '14px' }}
                          fontWeight="bold"
                          lineHeight={{ base: '20px', md: '24px' }}
                        >
                          {t('tradeReward')}
                        </Text>
                        <ChevronRightIcon
                          color="white"
                          fontSize={{ md: '32px', base: '24px' }}
                        />
                      </HStack>
                    </HStack>
                  </Link>
                </NextLink>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
      <RuleModal ref={ruleRef} />
    </>
  );
};
