import {
  Box,
  HStack,
  VStack,
  Text,
  Tooltip,
  Image as ChakraImage,
  Stack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import useCopy from '@/hooks/useCopy';
import { MdOutlineCopyAll } from 'react-icons/md';

export const Dashboard = () => {
  const t = useTranslations('cpt');
  const toast = useToast();
  const [_, copy] = useCopy();

  return (
    <Box
      bg={{
        md: 'url(/images/activity/cpt/dashboard_bg.png)',
        base: 'url(/images/activity/cpt/dashboard_bg_small.png)',
      }}
      bgSize="100% 100%"
      pb={{ md: '120px', base: '34px' }}
      bgRepeat="no-repeat"
    >
      <Stack
        direction={{ md: 'row', base: 'column' }}
        w="full"
        maxW={'1400px'}
        px="40px"
        mx="auto"
        // h={{ md: "940px", base: 'auto' }}
        spacing={{ md: '0', base: '30px' }}
        justify={{ md: 'space-between', base: 'center' }}
        flexWrap="wrap"
      >
        <VStack
          pt={{ md: '110px', base: '20px' }}
          align={{ md: 'flex-start', base: 'center' }}
          spacing={{ md: '90px', base: '10px' }}
        >
          <Text
            bgColor="#fff"
            fontSize={{ md: '48px', base: '24px' }}
            fontFamily=" SourceHanSansCN-Heavy, SourceHanSansCN"
            fontWeight={800}
            overflowWrap="break-word"
            sx={{
              WebkitTextStroke: '1px #000000',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('collectionScore')}
          </Text>
          <Box
            w={{ md: '600px', base: '300px' }}
            h={{ md: '558px', base: '279px' }}
            bg="url(/images/activity/cpt/card_bg.png)"
            bgColor="#fff"
            bgSize="contain"
            bgRepeat="no-repeat"
            pt={{ md: '109px', base: '54px' }}
            fontSize={{ md: '28px', base: '12px' }}
            lineHeight={{ md: '28px', base: '14px' }}
          >
            <InsightsChart />
          </Box>
        </VStack>

        <VStack
          pt={{ md: '110px', base: '20px' }}
          align={{ md: 'flex-start', base: 'center' }}
          spacing={{ md: '90px', base: '30px' }}
        >
          <Text
            bgColor="#fff"
            fontSize={{ md: '48px', base: '24px' }}
            fontFamily="SourceHanSansCN-Heavy, SourceHanSansCN;"
            fontWeight={800}
            sx={{
              WebkitTextStroke: '1px #000000',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('collectionDetail')}
          </Text>
          <Box
            w={{ md: '600px', base: '300px' }}
            h={{ md: '558px', base: '279px' }}
            bg="url(/images/activity/cpt/card_bg.png)"
            bgColor="#fff"
            bgSize="contain"
            bgRepeat="no-repeat"
            px={{ md: '55px', base: '30px' }}
            pt={{ md: '68px', base: '27px' }}
            fontSize={{ md: '28px', base: '14px' }}
            lineHeight={{ md: '28px', base: '14px' }}
          >
            <HStack
              borderBottom={{
                md: '2px solid #D5D2E1',
                base: '1px solid #D5D2E1',
              }}
              pb={{ md: '40px', base: '20px' }}
            >
              <VStack
                flex={{ md: 1, base: 2 }}
                align="flex-start"
                spacing={{ md: '30px', base: '15px' }}
              >
                <Text
                  fontSize={{ md: '20px', base: ' 10px' }}
                  lineHeight={{ md: '20px', base: ' 10px' }}
                  color="#A181FF"
                >
                  {t('contractAddress')}
                </Text>
                <HStack>
                  <Text>0x341D7…C401</Text>
                  <Icon
                    onClick={async () => {
                      await copy('0x341D7957E73dce4307b5c9240B33C29D2089C401');
                      toast({
                        status: 'success',
                        title: 'Contract address copied!',
                      });
                    }}
                    as={MdOutlineCopyAll}
                    fontSize="22px"
                  />
                </HStack>
              </VStack>
              <VStack
                flex={1}
                align="flex-start"
                spacing={{ md: '30px', base: '15px' }}
              >
                <Text
                  fontSize={{ md: '20px', base: ' 10px' }}
                  lineHeight={{ md: '20px', base: ' 10px' }}
                  color="#A181FF"
                >
                  {t('fileHosting')}
                </Text>
                <Text>Amazon S3</Text>
              </VStack>
            </HStack>
            <HStack
              borderBottom={{
                md: '2px solid #D5D2E1',
                base: '1px solid #D5D2E1',
              }}
              py={{ md: '60px', base: '30px' }}
            >
              <VStack
                flex={{ md: 1, base: 2 }}
                align="flex-start"
                spacing={{ md: '30px', base: '15px' }}
              >
                <Text
                  fontSize={{ md: '20px', base: ' 10px' }}
                  lineHeight={{ md: '20px', base: ' 10px' }}
                  color="#A181FF"
                >
                  {t('totalSupply')}
                </Text>
                <Text>1984</Text>
              </VStack>
              <VStack
                flex={1}
                align="flex-start"
                spacing={{ md: '30px', base: '15px' }}
              >
                <Text
                  fontSize={{ md: '20px', base: ' 10px' }}
                  lineHeight={{ md: '20px', base: ' 10px' }}
                  color="#A181FF"
                >
                  {t('tokenStandard')}
                </Text>
                <Text>ERC721</Text>
              </VStack>
            </HStack>
            <HStack pt={{ md: '50px', base: '26px' }}>
              <VStack
                flex={{ md: 1, base: 2 }}
                align="flex-start"
                spacing={{ md: '30px', base: '15px' }}
              >
                <Text
                  fontSize={{ md: '20px', base: ' 10px' }}
                  lineHeight={{ md: '20px', base: ' 10px' }}
                  color="#A181FF"
                >
                  {t('blockchain')}
                </Text>
                <Text>ETHEREUM</Text>
              </VStack>
              <VStack
                flex={1}
                align="flex-start"
                spacing={{ md: '30px', base: '15px' }}
              >
                <Text
                  fontSize={{ md: '20px', base: ' 10px' }}
                  lineHeight={{ md: '20px', base: ' 10px' }}
                  color="#A181FF"
                >
                  {t('creatorFee')}
                </Text>
                <Text>7%</Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Stack>
    </Box>
  );
};

const InsightsChart = () => {
  const t = useTranslations('cpt');

  return (
    <Box
      pos="relative"
      fontSize={{ md: '20px', base: '12px' }}
      lineHeight={{ md: '28px', base: '14px' }}
      color={'#A181FF'}
      mx="auto"
      w={{ md: '399px', base: '192px' }}
    >
      {/* <Tooltip label={t('teamTip')} placement="top"> */}
      <Text
        pos="absolute"
        top={{ md: '-40px', base: '-20px' }}
        left="50%"
        transform={'translateX(-50%)'}
      >
        {t('team')}
      </Text>
      {/* </Tooltip> */}
      {/* <Tooltip label={t('otherFactorsTip')} placement="top"> */}
      <Text
        pos="absolute"
        top={{ md: '110px', base: '60px' }}
        right={{ md: '-50px', base: '-40px' }}
        w={{ md: '40px', base: '26px' }}
      >
        {t('otherFactors')}
      </Text>
      {/* </Tooltip> */}
      {/* <Tooltip label={t('backersTip')} placement="top"> */}
      <Text
        pos="absolute"
        bottom={{ md: '-35px', base: '-22px' }}
        right={{ md: '5px', base: '-5px' }}
        transform={'translateX(-50%)'}
      >
        {t('backers')}
      </Text>
      {/* </Tooltip> */}
      {/* <Tooltip label={t('utilitiesTip')} placement="top"> */}
      <Text
        pos="absolute"
        bottom={{ md: '-35px', base: '-22px' }}
        left={{ md: '70px', base: '32px' }}
        transform={'translateX(-50%)'}
      >
        {t('utilities')}
      </Text>
      {/* </Tooltip> */}
      {/* <Tooltip label={t('communityTip')} placement="top"> */}
      <Text
        pos="absolute"
        top={{ md: '114px', base: '45px' }}
        left={{ md: '-47px', base: '-22px' }}
        transform={'translateX(-50%)'}
      >
        {t('community')}
      </Text>
      {/* </Tooltip> */}
      <ChakraImage w="full" src="/images/activity/cpt/chartData.png" />
    </Box>
  );
};
