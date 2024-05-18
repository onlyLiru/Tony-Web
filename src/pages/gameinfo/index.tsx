import { serverSideTranslations } from '@/i18n';
import {
  Text,
  VStack,
  Box,
  HStack,
  Link,
  useMediaQuery,
} from '@chakra-ui/react';
import { ShimmerImage } from '@/components/Image';

import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import React from 'react';

const LinkMore = () => {
  const t = useTranslations('gameInfo');
  return (
    <HStack>
      <Link href="http://www.unemeta.one" fontSize={'16px'} color={'#2153FF'}>
        {t('link')}
      </Link>
      <ShimmerImage
        src={'/images/game/arrow.png'}
        w={'13px'}
        h={'9px'}
      ></ShimmerImage>
    </HStack>
  );
};

export default function GameInfo() {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('gameInfo');
  return (
    <>
      {isLargerThan768 ? (
        <VStack spacing={120} position="relative">
          <VStack
            w={'1290px'}
            h={'533'}
            bgImage={'/images/game/bgpc.png'}
            bgSize="cover"
            pos={'relative'}
          >
            <Text
              fontSize={'48px'}
              mt={'83px'}
              mb={'36px'}
              fontWeight={'bold'}
              color={'#885414'}
              textAlign="center"
            >
              {t('title')}
            </Text>
            <Text w={'996px'} fontSize={'18px'}>
              {t('info')}
            </Text>
            <HStack
              bgImage={'/images/game/btn.png'}
              w={'108px'}
              h={'40px'}
              justify="center"
              pos={'absolute'}
              right={'25px'}
              top={'25px'}
            >
              <Link
                href="http://www.unemeta.one"
                color={'#fff'}
                fontSize={'14px'}
              >
                {t('linkBtn')}
              </Link>
              <ShimmerImage
                src={'/images/game/arrowWhite.png'}
                w={'13px'}
                h={'9px'}
              ></ShimmerImage>
            </HStack>
          </VStack>
          <HStack spacing={150}>
            <Box w={'465px'}>
              <Text
                pb={'32px'}
                borderBottom={'2px solid'}
                fontSize={'32px'}
                fontWeight={'bold'}
              >
                {t('itemTitle1')}
              </Text>
              <Text mt={'31px'} mb={'24px'} fontSize={'18px'}>
                {t('itemInfo1')}
              </Text>
              <LinkMore></LinkMore>
            </Box>
            <ShimmerImage
              src={'/images/game/item1.png'}
              w={'510px'}
              h={'510px'}
            ></ShimmerImage>
          </HStack>
          <HStack spacing={150}>
            <ShimmerImage
              src={'/images/game/item2.png'}
              w={'510px'}
              h={'510px'}
            ></ShimmerImage>
            <Box w={'465px'}>
              <Text
                pb={'32px'}
                borderBottom={'2px solid'}
                fontSize={'32px'}
                fontWeight={'bold'}
              >
                {t('itemTitle2')}
              </Text>
              <Text mt={'31px'} fontSize={'18px'}>
                {t('itemInfo2')}
              </Text>
              <Text fontSize={'18px'} my={'10px'}>
                {t('props1')}
              </Text>
              <Text fontSize={'18px'} my={'10px'}>
                {t('props2')}
              </Text>
              <Text fontSize={'18px'} my={'10px'}>
                {t('props3')}
              </Text>
              <Text fontSize={'18px'} my={'10px'}>
                {t('props4')}
              </Text>
              <Text fontSize={'18px'} mb={'24px'} mt={'10px'}>
                {t('props5')}
              </Text>
              <LinkMore></LinkMore>
            </Box>
          </HStack>
          <Link
            bgImage={'/images/game/textBg.png'}
            w={'1280px'}
            h={'88px'}
            py={'12px'}
            href="http://www.unemeta.one"
          >
            <VStack spacing={1}>
              <Text fontSize={'16px'} color="#fff">
                www.unemeta.one
              </Text>
              <Text fontSize={'16px'} color="#fff">
                {t('linkPoint')}
              </Text>
              <ShimmerImage
                src={'/images/game/arrowWhite.png'}
                w={'13px'}
                h={'9px'}
              ></ShimmerImage>
            </VStack>
          </Link>
          <HStack spacing={150}>
            <Box w={'465px'}>
              <Text
                pb={'32px'}
                borderBottom={'2px solid'}
                fontSize={'32px'}
                fontWeight={'bold'}
              >
                {t('itemTitle3')}
              </Text>
              <Text mt={'31px'} mb={'24px'} fontSize={'18px'}>
                {t('itemInfo3')}
              </Text>
              <LinkMore></LinkMore>
            </Box>
            <ShimmerImage
              src={'/images/game/item3.png'}
              w={'510px'}
              h={'510px'}
            ></ShimmerImage>
          </HStack>
          <HStack spacing={150}>
            <ShimmerImage
              src={'/images/game/item4.png'}
              w={'510px'}
              h={'510px'}
            ></ShimmerImage>
            <Box w={'465px'}>
              <Text
                pb={'32px'}
                borderBottom={'2px solid'}
                fontSize={'32px'}
                fontWeight={'bold'}
              >
                {t('itemTitle4')}
              </Text>
              <Text mt={'31px'} mb={'24px'} fontSize={'18px'}>
                {t('itemInfo4')}
              </Text>
              <LinkMore></LinkMore>
            </Box>
          </HStack>
          <Link
            bgImage={'/images/game/textBg2.png'}
            w={'1280px'}
            h={'48px'}
            py={'12px'}
            href="http://www.unemeta.one"
          >
            <HStack spacing={1} justify="center">
              <Text fontSize={'16px'} color="#fff">
                {t('link')}
              </Text>
              <ShimmerImage
                src={'/images/game/arrowWhite.png'}
                w={'13px'}
                h={'9px'}
              ></ShimmerImage>
            </HStack>
          </Link>
        </VStack>
      ) : (
        <VStack spacing={'40px'} px={'16px'}>
          <VStack spacing={'20px'} pos={'relative'}>
            <HStack
              bgImage={'/images/game/btn.png'}
              w={'108px'}
              h={'40px'}
              justify="center"
              pos={'absolute'}
              right={'10px'}
              top={'35px'}
            >
              <Link
                href="http://www.unemeta.one"
                color={'#fff'}
                fontSize={'14px'}
              >
                {t('linkBtn')}
              </Link>
              <ShimmerImage
                src={'/images/game/arrowWhite.png'}
                w={'13px'}
                h={'9px'}
              ></ShimmerImage>
            </HStack>
            <Box
              bgImage={'/images/game/bg.png'}
              w={'full'}
              h={'230px'}
              bgSize={'cover'}
              borderRadius={'15px'}
            ></Box>
            <Text fontSize={'24px'} fontWeight={'bold'} textAlign="center">
              {t('title')}
            </Text>
            <Text fontSize={'14px'} textAlign="center">
              {t('info')}
            </Text>
          </VStack>
          <VStack spacing={'20px'}>
            <ShimmerImage
              src={'/images/game/item1.png'}
              w={'343px'}
              h={'343px'}
            ></ShimmerImage>
            <Text fontSize={'24px'} fontWeight={'bold'} textAlign="center">
              {t('itemTitle1')}
            </Text>
            <Text fontSize={'14px'} textAlign="center">
              {t('itemInfo1')}
            </Text>
          </VStack>
          <VStack spacing={'20px'}>
            <ShimmerImage
              src={'/images/game/item2.png'}
              w={'343px'}
              h={'343px'}
            ></ShimmerImage>
            <Text fontSize={'24px'} fontWeight={'bold'} textAlign="center">
              {t('itemTitle2')}
            </Text>
            <Text fontSize={'14px'} textAlign="center">
              {t('itemInfo2')}
            </Text>
            <Box>
              <Text fontSize={'14px'} my={'5px'}>
                {t('props1')}
              </Text>
              <Text fontSize={'14px'} my={'5px'}>
                {t('props2')}
              </Text>
              <Text fontSize={'14px'} my={'5px'}>
                {t('props3')}
              </Text>
              <Text fontSize={'14px'} my={'5px'}>
                {t('props4')}
              </Text>
              <Text fontSize={'14px'} my={'5px'}>
                {t('props5')}
              </Text>
            </Box>
          </VStack>
          <Link
            bgImage={'/images/game/textBgm.png'}
            w={'343px'}
            h={'88px'}
            py={'12px'}
            href="http://www.unemeta.one"
          >
            <VStack spacing={1}>
              <Text fontSize={'16px'} color="#fff">
                www.unemeta.one
              </Text>
              <Text fontSize={'16px'} color="#fff">
                {t('linkPoint')}
              </Text>
              <ShimmerImage
                src={'/images/game/arrowWhite.png'}
                w={'13px'}
                h={'9px'}
              ></ShimmerImage>
            </VStack>
          </Link>

          <VStack spacing={'20px'}>
            <ShimmerImage
              src={'/images/game/item3.png'}
              w={'343px'}
              h={'343px'}
            ></ShimmerImage>
            <Text fontSize={'24px'} fontWeight={'bold'} textAlign="center">
              {t('itemTitle3')}
            </Text>
            <Text fontSize={'14px'} textAlign="center">
              {t('itemInfo3')}
            </Text>
          </VStack>
          <VStack spacing={'20px'}>
            <ShimmerImage
              src={'/images/game/item4.png'}
              w={'343px'}
              h={'343px'}
            ></ShimmerImage>
            <Text fontSize={'24px'} fontWeight={'bold'} textAlign="center">
              {t('itemTitle4')}
            </Text>
            <Text fontSize={'14px'} textAlign="center">
              {t('itemInfo4')}
            </Text>
          </VStack>
          <Link
            bgImage={'/images/game/textBgm2.png'}
            w={'343px'}
            h={'48px'}
            py={'12px'}
            href="http://www.unemeta.one"
          >
            <HStack spacing={1} justify="center">
              <Text fontSize={'16px'} color="#fff">
                {t('link')}
              </Text>
              <ShimmerImage
                src={'/images/game/arrowWhite.png'}
                w={'13px'}
                h={'9px'}
              ></ShimmerImage>
            </HStack>
          </Link>
        </VStack>
      )}
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const messages = await serverSideTranslations(locale, ['gameInfo']);
  return {
    props: {
      messages,
    },
  };
}
