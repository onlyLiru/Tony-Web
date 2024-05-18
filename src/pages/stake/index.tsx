import { Footer } from '@/components/PageLayout';
import { serverSideTranslations } from '@/i18n';
import { Center, Heading, Text, VStack } from '@chakra-ui/react';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import React from 'react';

export default function Stake() {
  const t = useTranslations('stake');
  return (
    <>
      <Center
        minH={{ base: '65vh', md: '75vh' }}
        w="full"
        bg="radial-gradient(82.91% 100% at 50% 0%, #8D39D4 23.4%, #410785 62.02%, #23015B 91.67%);"
      >
        <VStack
          mb={10}
          textAlign={'center'}
          spacing={5}
          justify={'center'}
          fontFamily={'Inter'}
          w={{ base: 'full', md: '640px' }}
        >
          <Text
            color="#A074D1"
            fontWeight={600}
            fontSize={{ base: '20px', md: '36px' }}
          >
            {t('commintSoonSub')}
          </Text>
          <Heading
            textShadow={'0px 0px 45px rgba(0, 0, 0, 0.5);'}
            color="#24C4E6"
            fontWeight={900}
            lineHeight={{ base: '56px', md: '150px' }}
            fontSize={{ base: '56px', md: '150px' }}
            as="h1"
            size="lg"
          >
            {t('commintSoon')}
          </Heading>
        </VStack>
      </Center>
      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const messages = await serverSideTranslations(locale, ['stake']);

  return {
    props: {
      messages,
    },
  };
}
