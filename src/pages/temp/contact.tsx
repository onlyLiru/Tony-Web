import { useMounted } from '@/hooks/useMounted';
import { serverSideTranslations } from '@/i18n';
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useRequest } from 'ahooks';
import { Formik, Form, Field } from 'formik';
import { GetStaticPropsContext } from 'next';
import React from 'react';
import { useAccount } from 'wagmi';
import * as userApis from '@/services/user';
import { useTranslations } from 'next-intl';
import { useUserDataValue } from '@/store';
import { emailReg } from '@/utils';
import { Footer } from '@/components/PageLayout';

const FullSpiner = () => (
  <Center minH="75vh">
    <Spinner size="xl" thickness="4px" />
  </Center>
);

function Content() {
  const toast = useToast();
  const t = useTranslations('tempContact');
  const { loading, data, refresh } = useRequest(userApis.getLuckydog);

  if (loading) return <FullSpiner />;

  if (!data?.data.is_lucky_dog)
    return (
      <Center
        minH={'75vh'}
        px="10vw"
        textAlign={'center'}
        maxW={{ base: 'full', md: '960px' }}
        mx="auto"
      >
        <Heading
          as="h1"
          textAlign={'center'}
          fontSize={{ base: '16px', md: '26px' }}
        >
          {t('notWinnerDesc')}
        </Heading>
      </Center>
    );

  if (data?.data.already_written)
    return (
      <Center
        minH={'75vh'}
        maxW={{ base: 'full', md: '960px' }}
        mx="auto"
        textAlign="center"
        px="10vw"
      >
        <Heading as="h1" fontSize={{ base: '16px', md: '26px' }}>
          {t('submitedDesc')}
          <Link pl={1} color="#a29aff" href="mailto:ops@unemeta.com">
            ops@unemeta.com
          </Link>
        </Heading>
      </Center>
    );

  return (
    <Container
      py={{ base: '20px', md: '40px' }}
      maxW={{ base: 'full', md: '660px' }}
      minH={'70vh'}
      w="full"
    >
      <>
        <VStack
          align={'center'}
          spacing={'10px'}
          mb={{ base: '40px', md: '90px' }}
        >
          <Heading
            size="h1"
            fontSize={{ base: '18px', md: '30px' }}
            textAlign="center"
          >
            {t('contactInfo')}
          </Heading>
          <Text
            fontSize={{ base: '14px', md: '16px' }}
            color="primary.lightGray"
            textAlign={'center'}
          >
            {t('contactInfoDesc')}
          </Text>
        </VStack>
        <Formik<userApis.ApiUser.LuckydogPayload>
          initialValues={{
            name: '',
            phone: '',
            email: '',
            discord: '',
          }}
          onSubmit={async (values) => {
            console.log(
              '🚀 ~ file: contact.tsx ~ line 59 ~ onSubmit={ ~ values',
              values,
            );
            try {
              await userApis.luckydog(values);
              refresh();
              toast({
                status: 'success',
                title: t('transactionSuccess'),
                variant: 'subtle',
              });
            } catch (error) {
              toast({
                status: 'error',
                title: t('transactionCancel'),
                variant: 'subtle',
              });
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <>
              <Form>
                <Grid
                  templateColumns={{
                    base: 'repeat(2, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}
                  gap={'30px 24px'}
                >
                  <GridItem colSpan={{ base: 2, md: 2 }}>
                    <FormControl isInvalid={!!(errors.name && touched.name)}>
                      <FormLabel>{t('name')}</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        size="lg"
                        fontSize="md"
                        placeholder={t('yourName')}
                        validate={(val: string) => {
                          if (!val) {
                            return 'field is require!';
                          }
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 2 }}>
                    <FormControl isInvalid={!!(errors.phone && touched.phone)}>
                      <FormLabel>{t('phone')}</FormLabel>
                      <Field
                        as={Input}
                        name="phone"
                        placeholder={t('yourPhone')}
                        size="lg"
                        fontSize="md"
                        validate={(val: string) => {
                          if (!val) {
                            return 'field is require!';
                          }
                        }}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl isInvalid={!!(errors.email && touched.email)}>
                      <FormLabel>{t('email')}</FormLabel>
                      <Field
                        as={Input}
                        name="email"
                        placeholder={t('yourEmail')}
                        size="lg"
                        fontSize="md"
                        validate={(val: string) => {
                          if (!val) {
                            return 'field is require!';
                          }
                          if (!emailReg.test(val)) return 'email is incorrect!';
                        }}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={{ base: 2, md: 1 }}>
                    <FormControl
                      isInvalid={!!(errors.discord && touched.discord)}
                    >
                      <FormLabel>Discord</FormLabel>
                      <Field
                        as={Input}
                        name="discord"
                        size="lg"
                        placeholder={t('yourDiscordId')}
                        fontSize="md"
                        validate={(val: string) => {
                          if (!val) {
                            return 'field is require!';
                          }
                        }}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
                <Button
                  fontSize={{ base: '14px', md: '16px' }}
                  isLoading={isSubmitting}
                  type="submit"
                  w="full"
                  variant={'primary'}
                  size="lg"
                  mt="40px"
                >
                  {t('confirm')}
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </Container>
  );
}

function Contact() {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const userData = useUserDataValue();
  const t = useTranslations('tempContact');
  const { openConnectModal } = useConnectModal();

  if (!isMounted) return <FullSpiner />;
  if (!isConnected || !userData?.wallet_address)
    return (
      <Center minH={'75vh'} px="10vw" textAlign={'center'}>
        <VStack align={'center'} spacing={{ base: '30px', md: '50px' }}>
          <Heading
            as="h1"
            fontSize={{ base: '18px', md: '30px' }}
            maxW={{ base: 'full', md: '540px' }}
            mx="auto"
          >
            {t('entryTitle')}
          </Heading>
          <Text
            fontSize={{ base: '14px', md: '16px' }}
            maxW={{ base: 'full', md: '640px' }}
            mx="auto"
          >
            {t('entryTitleDesc')}
          </Text>
          <Button
            size="lg"
            isLoading={isConnected && !userData?.wallet_address}
            onClick={openConnectModal}
            variant={'primary'}
            w={'320px'}
          >
            Connect
          </Button>
        </VStack>
      </Center>
    );
  return <Content />;
}

export default function ContactWithFooter() {
  return (
    <>
      <Box
        bg="linear-gradient(90deg, #ECE9E6 0%, #FFFFFF 100%)"
        py={{ base: '20px', md: '80px' }}
      >
        <Contact />
      </Box>
      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const messages = await serverSideTranslations(locale, ['tempContact']);

  return {
    props: {
      messages,
    },
  };
}
