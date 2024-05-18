import {
  AspectRatio,
  Box,
  Center,
  Flex,
  Heading,
  Image as ChakraImage,
  List,
  ListItem,
  SimpleGrid,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function TabDescription() {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('hz');

  return (
    <Box
      bgColor={{ base: 'none', md: 'rgba(255,255,255,0.05)' }}
      borderRadius={'8px'}
      p={{ base: 0, md: '92px 100px' }}
    >
      <SimpleGrid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        borderRadius={'8px'}
        bgColor={{ md: 'transparent', base: 'rgba(255,255,255,0.05)' }}
        spacing={{ base: '20px', md: '30px' }}
        p={{ base: '20px', md: 0 }}
        mb={{ base: '24px', md: '100px' }}
      >
        <Flex direction={'column'} pl={{ base: 0, md: '40px' }}>
          <Heading
            display={'flex'}
            alignItems="center"
            fontWeight={'semibold'}
            fontSize={{ base: '18px', md: '28px' }}
            mb={{ base: '30px', md: '60px' }}
            as="h2"
          >
            {t('highlights')}
            <ChakraImage
              ml={{ base: '5px', md: '10px' }}
              w={{ base: '22px', md: '28px' }}
              h="auto"
              src="/images/activity/hanazawa/tabs/desc_light.svg"
            />
          </Heading>
          <List
            spacing={'20px'}
            lineHeight="1.2"
            color="#838383"
            fontSize={'16px'}
          >
            {[...t.raw('highlightsContent')].map((v: string, i: number) => (
              <ListItem key={i}>{v}</ListItem>
            ))}
          </List>
        </Flex>
        <Box
          borderRadius="8px"
          p={{ base: 0, md: '1px' }}
          bg="linear-gradient(to right, #6F9FF3, #473874)"
        >
          <AspectRatio
            overflow={'hidden'}
            borderRadius="8px"
            maxW="520px"
            ratio={1.704}
            bg="#1F2232"
          >
            <Center p={{ base: 0, md: '15px' }}>
              <video
                style={{ borderRadius: '8px', height: '100%' }}
                controls
                src="https://video.twimg.com/ext_tw_video/1540231437986590721/pu/vid/640x360/8Oph1bCpe7TPMVXt.mp4?tag=12"
              />
            </Center>
          </AspectRatio>
        </Box>
      </SimpleGrid>

      <SimpleGrid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        bgColor={{ md: 'transparent', base: 'rgba(255,255,255,0.05)' }}
        spacing={{ base: '20px', md: '56px' }}
        borderRadius="8px"
        p={{ base: '20px', md: 0 }}
        mb={{ base: '20px', md: '100px' }}
      >
        <Flex direction={'column'} pl={{ base: 0, md: '40px' }}>
          <Heading
            w="full"
            fontWeight={'semibold'}
            fontSize={{ base: '18px', md: '28px' }}
            as="h2"
            pos="relative"
            display="flex"
            alignItems={'center'}
            justifyContent={{ base: 'flex-start', md: 'flex-end' }}
          >
            {t('description')}
            <ChakraImage
              ml={{ base: '5px', md: '10px' }}
              w={{ base: '22px', md: '28px' }}
              h="auto"
              src="/images/activity/hanazawa/tabs/desc_menu.svg"
            />
          </Heading>
          {isLargerThan768 && (
            <ChakraImage
              pos="relative"
              top="-38px"
              w="476px"
              h="auto"
              src="/images/activity/hanazawa/tabs/desc_description.png"
            />
          )}
        </Flex>
        <List
          spacing={{ base: '15px', md: '20px' }}
          lineHeight={{ base: '1.5', md: 1.3 }}
          color="#838383"
          fontSize={{ base: '14px', md: '16px' }}
        >
          <ListItem>{t('descriptionContent')}</ListItem>
          {!isLargerThan768 && (
            <ChakraImage
              w="full"
              h="auto"
              src="/images/activity/hanazawa/tabs/desc_description.png"
            />
          )}
        </List>
      </SimpleGrid>
      <Box
        bgColor={{ md: 'transparent', base: 'rgba(255,255,255,0.05)' }}
        borderRadius="8px"
        p={{ base: '20px 10px', md: 0 }}
      >
        <Heading
          display={'flex'}
          alignItems="center"
          fontWeight={'semibold'}
          fontSize={{ base: '18px', md: '28px' }}
          as="h2"
          pos="relative"
          mb="24px"
          px={{ base: '10px', md: '0' }}
        >
          {t('utility')}
          <ChakraImage
            ml={{ base: '5px', md: '10px' }}
            w={{ base: '22px', md: '28px' }}
            h="auto"
            src="/images/activity/hanazawa/tabs/desc_eth.svg"
          />
        </Heading>
        <Box
          p={{ base: '0 10px', md: '30px 320px 30px 38px' }}
          borderRadius={'8px'}
          bgImage="/images/activity/hanazawa/tabs/desc_eth_bg.png"
          bgRepeat={'no-repeat'}
          bgSize={{ base: 'contain', md: 'cover' }}
          bgPos={{ base: 'center bottom', md: 'center' }}
          pos="relative"
        >
          <Text
            color={{ base: '#838383', md: '#C1C1C1' }}
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight="20px"
          >
            <ChakraImage
              float={{ base: 'right', md: 'unset' }}
              pos={{ base: 'relative', md: 'absolute' }}
              top={{ base: 'unset', md: '-56px' }}
              right={{ base: 'unset', md: '56px' }}
              w={{ base: '112px', md: '215px' }}
              h="auto"
              src="/images/activity/hanazawa/tabs/desc_bottom.png"
            />
            {t('utilityContent')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
