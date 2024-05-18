import { ShimmerImage } from '@/components/Image';
import {
  Box,
  Heading,
  List,
  ListItem,
  Stack,
  AspectRatio,
  SimpleGrid,
  HStack,
  Flex,
  Text,
  VStack,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslations } from 'next-intl';
import { shortCollectionAddress } from '@/utils';

export const FmexInfo = () => {
  const t = useTranslations('fmex');
  return (
    <Box color="white">
      <Box bg="#300518">
        <Box
          maxW={{ base: '80vw', md: '1080px' }}
          mx="auto"
          py={{ base: '24px', md: '50px' }}
        >
          <Heading
            textAlign={'left'}
            mb={{ base: '16px', md: '48px' }}
            as="h2"
            fontWeight={900}
            fontSize={{ base: '16px', md: '40px' }}
          >
            {t('projectOverview')}
          </Heading>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: '10px', md: '28px' }}
          >
            <List
              spacing={{ base: '20px', md: '30px' }}
              fontSize={{ base: '15px', md: '22px' }}
              lineHeight={{ base: '20px', md: '32px' }}
            >
              {[...t.raw('projectOverviewContent')].map((v, i) => (
                <ListItem key={i}>{v}</ListItem>
              ))}
            </List>
            <ShimmerImage
              flex="1 0 auto"
              src="/images/activity/fmex/overview_1.png"
              w={{ base: 'full', md: '548px' }}
              h={{ base: '260px', md: '498px' }}
            />
          </Stack>
        </Box>
      </Box>
      <Box bg="#050F2A">
        <Box
          maxW={{ base: '85vw', md: '1080px' }}
          mx="auto"
          py={{ base: '24px', md: '50px' }}
        >
          <Heading
            textAlign={'left'}
            mb={{ base: '16px', md: '48px' }}
            as="h2"
            fontWeight={900}
            fontSize={{ base: '16px', md: '40px' }}
          >
            {t('ambassadors')}
          </Heading>
          <Stack
            mb={{ base: '28px', md: '60px' }}
            alignItems={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            spacing={0}
          >
            <ShimmerImage
              src="/images/activity/fmex/official_1.png"
              w={{ base: '132px', md: '482px' }}
              h={{ base: '100px', md: '367px' }}
            />
            <AspectRatio
              overflow={'hidden'}
              borderRadius="16px"
              w="full"
              maxW={{ base: 'full', md: '505px' }}
              ratio={1.76}
            >
              <video
                controls
                style={{ borderRadius: '16px', height: '100%' }}
                src="https://storage.googleapis.com/unemeta_jp_bucket_1/trim.F4DFF550-E0B2-48BF-A9B7-D4145D42982B.mp4"
              ></video>
            </AspectRatio>
          </Stack>
          <Stack
            alignItems={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            spacing={0}
          >
            <ShimmerImage
              src="/images/activity/fmex/official_2.png"
              w={{ base: '132px', md: '482px' }}
              h={{ base: '103px', md: '378px' }}
            />
            <AspectRatio
              w="full"
              overflow={'hidden'}
              borderRadius="16px"
              maxW={{ base: 'full', md: '505px' }}
              ratio={1.76}
            >
              <video
                controls
                style={{ borderRadius: '16px', height: '100%' }}
                src="https://storage.googleapis.com/unemeta_jp_bucket_1/trim.96EAFF6B-B8DD-43B2-AD83-05840A932367_1.mp4"
              />
            </AspectRatio>
          </Stack>
        </Box>
      </Box>
      <Box bg="#330A4E">
        <Box
          maxW={{ base: '85vw', md: '1080px' }}
          mx="auto"
          py={{ base: '24px', md: '50px' }}
        >
          <Heading
            textAlign={'left'}
            mb={{ base: '16px', md: '48px' }}
            as="h2"
            fontWeight={900}
            fontSize={{ base: '16px', md: '40px' }}
          >
            {t('utilities')}
          </Heading>
          <Box px={{ base: '10px', md: 0 }}>
            <ShimmerImage
              mx="auto"
              src="/images/activity/fmex/utilities_1.png"
              w={{ base: 'full', md: '430px' }}
              h={{ base: '134px', md: '193px' }}
              mb={{ base: '8px', md: '0' }}
            />
            <SimpleGrid
              mx="auto"
              maxW={{ base: 'full', md: '870px' }}
              spacing={{ base: '8px', md: '0' }}
              templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
            >
              {[2, 3, 4].map((el) => (
                <ShimmerImage
                  key={el}
                  mx="auto"
                  src={`/images/activity/fmex/utilities_${el}.png`}
                  w={{ base: 'full', md: '290px' }}
                  h={{ base: '408px', md: '420px' }}
                />
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>

      <Box bg="#050F2A" mx="auto">
        <Box
          maxW={{ base: '85vw', md: '1080px' }}
          mx="auto"
          py={{ base: '38px', md: '50px' }}
        >
          <Heading
            textAlign={'left'}
            mb={{ base: '30px', md: '48px' }}
            as="h2"
            fontWeight={900}
            fontSize={{ base: '16px', md: '40px' }}
          >
            {t('roadmap')}
          </Heading>
          <VStack spacing={0} w="full">
            <Box
              pl={{ base: '26px', md: 0 }}
              pos="relative"
              borderLeft={'6px solid #F9F9F9'}
              w={{ base: 'full', md: 'auto' }}
            >
              <Box
                w="24px"
                h="24px"
                bg="#159700"
                borderRadius={'full'}
                pos="absolute"
                left="-15px"
                top="-2px"
              />
              <Stack
                spacing={{ base: '10px', md: '16px' }}
                direction={{ base: 'column', md: 'row' }}
                alignItems={'flex-start'}
                pb={{ base: '40px', md: '28px' }}
              >
                <Text
                  w={{ base: 'full', md: '168px' }}
                  textAlign={{ base: 'left', md: 'right' }}
                  color="#159700"
                  fontWeight={900}
                  fontSize={{ base: '24px', md: '40px' }}
                  lineHeight="1em"
                >
                  Q1 22
                </Text>
                <Box
                  color="white"
                  bg="#142450"
                  w={{ base: 'full', md: '464px' }}
                  borderRadius={'16px'}
                  p={{ base: '18px 14px', md: '20px 26px' }}
                >
                  <Heading mb={'10px'} fontSize={{ base: '14px', md: '24px' }}>
                    {t.raw('roadmapContent')[0].title}
                  </Heading>
                  <Text fontSize={{ base: '13px', md: '14px' }}>
                    {t.raw('roadmapContent')[0].content}
                  </Text>
                  <ShimmerImage
                    mt={{ base: '35px', md: '10px' }}
                    mb={{ base: '0', md: '15px' }}
                    mx="auto"
                    src="/images/activity/fmex/roadmap_q1.png"
                    w={{ base: 'full', md: '318px' }}
                    h={{ base: '130px', md: '160px' }}
                  />
                </Box>
              </Stack>
            </Box>
            <Box
              pl={{ base: '26px', md: 0 }}
              pos="relative"
              borderLeft={'6px solid #F9F9F9'}
              w={{ base: 'full', md: 'auto' }}
            >
              <Box
                w="24px"
                h="24px"
                bg="#159700"
                borderRadius={'full'}
                pos="absolute"
                left="-15px"
                top="-2px"
              />
              <Stack
                spacing={{ base: '10px', md: '16px' }}
                direction={{ base: 'column', md: 'row' }}
                alignItems={'flex-start'}
                pb={{ base: '40px', md: '28px' }}
              >
                <Text
                  w={{ base: 'full', md: '168px' }}
                  textAlign={{ base: 'left', md: 'right' }}
                  color="#159700"
                  fontWeight={900}
                  fontSize={{ base: '24px', md: '40px' }}
                  lineHeight="1em"
                >
                  Q2 22
                </Text>
                <Box
                  color="white"
                  bg="#142450"
                  w={{ base: 'full', md: '464px' }}
                  borderRadius={'16px'}
                  p={{ base: '18px 14px', md: '20px 26px' }}
                >
                  <Heading mb={'10px'} fontSize={{ base: '14px', md: '24px' }}>
                    {t.raw('roadmapContent')[1].title}
                  </Heading>
                  <Text fontSize={{ base: '13px', md: '14px' }}>
                    {t.raw('roadmapContent')[1].content}
                  </Text>
                  <Box
                    pos="relative"
                    w="full"
                    h={{ base: '130px', md: '160px' }}
                  >
                    <ShimmerImage
                      pos="absolute"
                      top={{ base: '5px', md: '-10px' }}
                      right={{ base: '98px', md: '135px' }}
                      src="/images/activity/fmex/roadmap_q2_1.png"
                      w={{ base: '82px', md: '120px' }}
                      h={{ base: '82px', md: '120px' }}
                    />
                    <ShimmerImage
                      pos="absolute"
                      bottom={{ base: '5px', md: '0' }}
                      right={{ base: '20px', md: '75px' }}
                      src="/images/activity/fmex/roadmap_q2_2.png"
                      w={{ base: '74px', md: '100px' }}
                      h={{ base: '74px', md: '100px' }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
            <Box
              pl={{ base: '26px', md: 0 }}
              pos="relative"
              borderLeft={'6px solid transparent'}
              w={{ base: 'full', md: 'auto' }}
            >
              <Box
                w="24px"
                h="24px"
                bg="#159700"
                borderRadius={'full'}
                pos="absolute"
                left="-15px"
                top="-2px"
              />
              <Stack
                spacing={{ base: '10px', md: '16px' }}
                direction={{ base: 'column', md: 'row' }}
                alignItems={'flex-start'}
                pb={{ base: '40px', md: '28px' }}
              >
                <Text
                  w={{ base: 'full', md: '168px' }}
                  textAlign={{ base: 'left', md: 'right' }}
                  color="#159700"
                  fontWeight={900}
                  fontSize={{ base: '24px', md: '40px' }}
                  lineHeight="1em"
                >
                  Q3 22
                </Text>
                <Box
                  color="white"
                  bg="#142450"
                  w={{ base: 'full', md: '464px' }}
                  borderRadius={'16px'}
                  p={{ base: '18px 14px', md: '20px 26px' }}
                >
                  <Heading mb={'10px'} fontSize={{ base: '14px', md: '24px' }}>
                    {t.raw('roadmapContent')[2].title}
                  </Heading>
                  <Text fontSize={{ base: '13px', md: '14px' }}>
                    {t.raw('roadmapContent')[2].content}
                  </Text>
                  <HStack
                    justify={'center'}
                    mt={{ base: '30px', md: '18px' }}
                    spacing={{ base: '10px', md: '26px' }}
                  >
                    <ShimmerImage
                      src="/images/activity/fmex/roadmap_q3_1.png"
                      w={{ base: '95px', md: '124px' }}
                      h={{ base: '112px', md: '146px' }}
                    />
                    <ShimmerImage
                      src="/images/activity/fmex/roadmap_q3_2.png"
                      w={{ base: '95px', md: '124px' }}
                      h={{ base: '112px', md: '146px' }}
                    />
                  </HStack>
                </Box>
              </Stack>
            </Box>
          </VStack>
        </Box>
      </Box>

      <Box bg="#330A4E">
        <Box
          maxW={{ base: '85vw', md: '1080px' }}
          mx="auto"
          py={{ base: '30px', md: '50px' }}
        >
          <Heading
            textAlign={'left'}
            mb={{ base: '16px', md: '48px' }}
            as="h2"
            fontWeight={900}
            fontSize={{ base: '16px', md: '40px' }}
          >
            {t('keyInfo')}
          </Heading>
          <VStack
            maxW={{ base: 'full', md: '720px' }}
            mx="auto"
            spacing={{ base: '24px', md: '34px' }}
            fontSize={{ base: '14px', md: '22px' }}
          >
            <Flex w="full" align={'center'} justify="space-between">
              <Text fontWeight={{ base: 500, md: 900 }}>{t('address')}</Text>
              <Link
                textDecoration={'underline'}
                href="https://etherscan.io/address/0x2ce8e90200c02EE7f82f99708dC0DFEe9C292Bd7"
                target="_blank"
              >
                {shortCollectionAddress(
                  '0x2ce8e90200c02EE7f82f99708dC0DFEe9C292Bd7',
                )}
              </Link>
            </Flex>
            <Flex w="full" align={'center'} justify="space-between">
              <Text fontWeight={{ base: 500, md: 900 }}>{t('blockchain')}</Text>
              <Text>Ethereum</Text>
            </Flex>
            <Flex w="full" align={'center'} justify="space-between">
              <Text fontWeight={{ base: 500, md: 900 }}>
                {t('tokenStandard')}
              </Text>
              <Text>ERC721</Text>
            </Flex>
            <Flex w="full" align={'center'} justify="space-between">
              <Text fontWeight={{ base: 500, md: 900 }}>
                {t('fileHosting')}
              </Text>
              <Text>IPFS</Text>
            </Flex>
            <Flex w="full" align={'center'} justify="space-between">
              <Text fontWeight={{ base: 500, md: 900 }}>{t('creatorFee')}</Text>
              <Text>5%</Text>
            </Flex>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};
