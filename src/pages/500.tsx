import { Footer } from '@/components/PageLayout';
import { serverSideTranslations } from '@/i18n';
import { Heading, Text, VStack } from '@chakra-ui/react';
import { GetStaticPropsContext } from 'next';
import React from 'react';

export default function Page500() {
  return (
    <>
      <VStack spacing={5} justify={'center'} minH={'70vh'} w="full">
        <Heading size="lg">Error 500 - Server Unhealthy...</Heading>
        <Text> Can’t Find That Page :(</Text>
      </VStack>
      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const messages = await serverSideTranslations(locale);

  return {
    props: {
      messages,
    },
  };
}
