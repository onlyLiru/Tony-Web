import { Box, Flex, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import Image from '@/components/Image';
import 'keen-slider/keen-slider.min.css';

export const HowToUseNFTickets = () => {
  const t = useTranslations('teamz') as any;

  return (
    <Box
      boxSizing="content-box"
      paddingY={{
        md: '60px',
        lg: '100px',
        xl: '110px',
        '2xl': '120px',
        base: '57px',
      }}
      bgImage="url('/images/teamz/HowToUseNFTickets/bg.png')"
      bgSize={{ base: '100% 375px', md: 'cover' }}
      justifyContent="space-around"
    >
      {/* WEB3 SPEAKER标题 */}
      <Text
        fontSize={{ md: '40px', lg: '50px', xl: '60px', base: '30px' }}
        fontWeight={'Bold'}
        textAlign="center"
        color="#AAFF01"
      >
        {t('howToUseNFTTickets')}
      </Text>
      <Flex
        w="100%"
        maxW={1432}
        margin="0 auto"
        mt={84}
        flexWrap="wrap"
        justifyContent={{
          md: 'space-between',
          lg: 'space-between',
          xl: 'space-between',
          base: 'center',
        }}
      >
        {/* step1 */}
        <Flex
          flexDirection="column"
          alignItems="center"
          w={312}
          fontSize={{ md: '16px', lg: '16px', xl: '20px', base: '12px' }}
          color="white"
        >
          <Image
            src="/images/teamz/HowToUseNFTickets/step1.png"
            width="64px"
            mb={{ md: '85px', lg: '70px', xl: '96px', base: '32px' }}
          ></Image>
          <Flex
            mt={{ md: '24px', lg: '36px', xl: '36px', base: '18px' }}
            alignItems="center"
            w="100%"
          >
            <Image
              src="/images/teamz/HowToUseNFTickets/icon1.png"
              width="80px"
            ></Image>
            <Text ml="16px">{t('howToUseNFTTicketsStep1Intro1')}</Text>
          </Flex>
          <Flex
            w="100%"
            mt={{ md: '85px', lg: '70px', xl: '99px', base: '54px' }}
            alignItems="center"
          >
            <Image
              src="/images/teamz/HowToUseNFTickets/icon2.png"
              width="80px"
            ></Image>
            <Text ml="16px">{t('howToUseNFTTicketsStep1Intro2')}</Text>
          </Flex>
          <Text w="100%" ml="32px" mt={19}>
            {t('or')}
          </Text>
          <Flex mt="19px" alignItems="center" w="100%">
            <Image
              src="/images/teamz/HowToUseNFTickets/icon3.png"
              width="80px"
            ></Image>
            <Text ml="16px">{t('howToUseNFTTicketsStep1Intro3')}</Text>
          </Flex>
          <Flex
            w="100%"
            mt={{ md: '85px', lg: '70px', xl: '99px', base: '54px' }}
            alignItems="center"
          >
            <Image
              src="/images/teamz/HowToUseNFTickets/icon4.png"
              width="80px"
            ></Image>
            <Text ml="16px">{t('howToUseNFTTicketsStep1Intro4')}</Text>
          </Flex>
        </Flex>
        {/* step2 */}
        <Flex
          mt={{ md: '0', lg: '0', xl: '0', base: '40px' }}
          flexDirection="column"
          alignItems="center"
          w={312}
          fontSize={{ md: '16px', lg: '16px', xl: '20px', base: '12px' }}
          color="white"
        >
          <Image
            src="/images/teamz/HowToUseNFTickets/step2.png"
            width="64px"
          ></Image>
          <Text mt="21px" h="60px" textAlign="center">
            {t('howToUseNFTTicketsStep2Intro1')}
          </Text>
          <Image
            src={`/images/teamz/HowToUseNFTickets/${t('step2-example')}.png`}
            width="100%"
            mt="15px"
          ></Image>
        </Flex>
        {/* step3 */}
        <Flex
          mt={{ md: '0', lg: '0', xl: '0', base: '40px' }}
          flexDirection="column"
          alignItems="center"
          w={312}
          fontSize={{ md: '16px', lg: '16px', xl: '20px', base: '12px' }}
          color="white"
        >
          <Image
            src="/images/teamz/HowToUseNFTickets/step3.png"
            width="64px"
          ></Image>
          <Text mt="21px" h="60px" textAlign="center">
            {t('howToUseNFTTicketsStep3Intro1')}
          </Text>
          <Image
            src={`/images/teamz/HowToUseNFTickets/${t('step3-example')}.png`}
            width="100%"
            mt="15px"
          ></Image>
        </Flex>
        {/* step4 */}
        <Flex
          mt={{ md: '0', lg: '0', xl: '0', base: '40px' }}
          flexDirection="column"
          alignItems="center"
          w={312}
          fontSize={{ md: '16px', lg: '16px', xl: '20px', base: '12px' }}
          color="white"
        >
          <Image
            src="/images/teamz/HowToUseNFTickets/step4.png"
            width="64px"
          ></Image>
          <Text mt="21px" h="60px" textAlign="center">
            {t('howToUseNFTTicketsStep4Intro1')}
          </Text>
          <Image
            src={`/images/teamz/HowToUseNFTickets/${t('step4-example')}.png`}
            width="100%"
            mt="15px"
          ></Image>
        </Flex>
      </Flex>
    </Box>
  );
};
