import { Footer } from '@/components/PageLayout';
import { serverSideTranslations } from '@/i18n';
import { Heading, Image, VStack } from '@chakra-ui/react';
import { GetStaticPropsContext } from 'next';
import React from 'react';

export default function PageErr() {
  return (
    <>
      <VStack spacing={5} justify={'center'} minH={'70vh'} w="full">
        <Heading size="lg">
          <Image w="500px" h="340px" src={'/images/login/ip_no.png'}></Image>
        </Heading>
      </VStack>
      {/* <Footer /> */}
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
