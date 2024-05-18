import { Box, Flex, Text, Divider, Stack } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';

export const PointsReward = (props: any) => {
  const t = useTranslations('teamz');
  return (
    <Stack
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgImage="url('/images/teamz/pointsRewardBg.png')"
      bgSize={{ base: '100% 375px', md: 'cover' }}
      w={'full'}
    >
      <Text
        fontSize={{ md: '60px', base: '30px' }}
        fontWeight={'Bold'}
        color="#AAFF01"
        mb={{ md: '36px', base: '32px' }}
        mt={{ md: '79px', base: '24px' }}
      >
        {t('pointsReward')}
      </Text>
      <Text
        fontSize={{ md: '20px', base: '12px' }}
        color="#fff"
        maxW={992}
        minW={318}
        textAlign="center"
        mb={78}
      >
        {t('rewardInfo')}
      </Text>
      <Stack
        direction={['column', 'row']}
        alignItems="start"
        flexWrap="wrap"
        pb={142}
      >
        {/* <Box mr={{ md: '97px', base: '0' }} mb={{ md: '0', base: '80px' }}> */}
        <Box m={{ md: '0 auto 97px', base: '0 auto 80px' }}>
          <Text
            color="#fff"
            fontSize={{ md: '30px', base: '14px' }}
            mb={'31px'}
            textAlign={{ base: 'center', md: undefined }}
          >
            {t('projectScore')}
          </Text>
          <Box
            border={{ md: '2px dashed grey', base: '' }}
            pl={{ md: '88px', base: '0px' }}
            pt={{ md: '108px', base: '0px' }}
            pr={{ md: '131px', base: '0px' }}
            pb={{ md: '87px', base: '0px' }}
            pos="relative"
            w={{ md: '602px', base: '213px' }}
            h={{ md: '560px', base: '203px' }}
          >
            <Text
              color="#fff"
              fontSize={{ md: '20px', base: '12px' }}
              pos="absolute"
              top={{ md: '50px', base: '-20px' }}
              left={{ md: '260px', base: '95px' }}
            >
              {t('international')}
            </Text>
            <Text
              color="#fff"
              fontSize={{ md: '20px', base: '12px' }}
              pos="absolute"
              top={{ md: '230px', base: '65px' }}
              left={{ md: '480px', base: '219px' }}
              minW={'60px'}
            >
              {t('otherAspects')}
            </Text>
            <Text
              color="#fff"
              fontSize={{ md: '20px', base: '12px' }}
              pos="absolute"
              top={{ md: '470px', base: '210px' }}
              left={{ md: '360px', base: '150px' }}
            >
              {t('supporters')}
            </Text>
            <Text
              color="#fff"
              fontSize={{ md: '20px', base: '12px' }}
              pos="absolute"
              top={{ md: '470px', base: '210px' }}
              left={{ md: '120px', base: '10px' }}
            >
              {t('nftUsage')}
            </Text>
            <Text
              color="#fff"
              fontSize={{ md: '20px', base: '12px' }}
              pos="absolute"
              top={{ md: '230px', base: '65px' }}
              left={{ md: '30px', base: '-30px' }}
            >
              {t('community')}
            </Text>
            <Image
              src="/images/teamz/pointsChart.png"
              w={{ md: '383px', base: '213px' }}
              h={{ md: '365px', base: '203px' }}
              border="2px dashed grey"
            ></Image>
          </Box>
        </Box>
        <Box>
          <Text
            color="#fff"
            fontSize={{ md: '30px', base: '14px' }}
            mb={'31px'}
            textAlign={{ md: undefined, base: 'center' }}
          >
            {t('projectInformation')}
          </Text>
          <Box
            border="2px dashed grey"
            pt={{ md: '69px', base: '32px' }}
            pl={{ md: '57px', base: '26px' }}
            pr={{ md: '55px', base: '25px' }}
            pb={{ md: '55px', base: '25px' }}
            w={{ md: '744px', base: '336px' }}
            h={{ md: '560px', base: '253px' }}
          >
            <Flex justifyContent="space-between">
              <Box>
                <Text
                  fontSize={{ md: '20px', base: '9px' }}
                  color="grey"
                  mb={{ md: '30px', base: '12px' }}
                >
                  {t('contractAddress')}
                </Text>
                <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                  0XBDASD…ac10
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize={{ md: '20px', base: '9px' }}
                  color="grey"
                  mb={{ md: '30px', base: '12px' }}
                >
                  {t('storageMethod')}
                </Text>
                <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                  IPFS
                </Text>
              </Box>
            </Flex>
            <Divider
              mb={{ md: '31px', base: '15px' }}
              mt={{ md: '22px', base: '5px' }}
            />
            <Flex justifyContent="space-between">
              <Box>
                <Text
                  fontSize={{ md: '20px', base: '9px' }}
                  color="grey"
                  mb={{ md: '30px', base: '12px' }}
                >
                  {t('totalSupply')}
                </Text>
                <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                  1800
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize={{ md: '20px', base: '9px' }}
                  color="grey"
                  mb={{ md: '30px', base: '12px' }}
                >
                  {t('tokenStandard')}
                </Text>
                <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                  IP8802
                </Text>
              </Box>
            </Flex>
            <Divider
              mb={{ md: '31px', base: '15px' }}
              mt={{ md: '22px', base: '5px' }}
            />
            <Flex justifyContent="space-between">
              <Box>
                <Text
                  fontSize={{ md: '20px', base: '9px' }}
                  color="grey"
                  mb={{ md: '30px', base: '12px' }}
                >
                  {t('blockchain')}
                </Text>
                <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                  Ethereum
                </Text>
              </Box>
              <Box>
                <Text
                  fontSize={{ md: '20px', base: '9px' }}
                  color="grey"
                  mb={{ md: '30px', base: '12px' }}
                >
                  {t('royalty')}
                </Text>
                <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                  5%
                </Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};
