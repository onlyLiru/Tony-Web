import { Footer } from '@/components/PageLayout';
import { serverSideTranslations } from '@/i18n';
import { Heading, Text, VStack } from '@chakra-ui/react';
import { GetStaticPropsContext } from 'next';
import React, { useEffect } from 'react';

export default function Page404() {
  useEffect(() => {
    // 404 页面统一重定向到主页
    window.location.href = '/';
  }, []);
  return (
    <>
      <VStack spacing={5} justify={'center'} minH={'70vh'} w="full">
        <Heading size="lg">Error 404 - Not Found Sorry...</Heading>
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
