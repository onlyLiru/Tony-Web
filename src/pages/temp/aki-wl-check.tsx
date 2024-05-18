import NextLink from 'next/link';
import { serverSideTranslations } from '@/i18n';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Link,
  Text,
} from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import { Formik, Form, Field } from 'formik';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { Footer } from '@/components/PageLayout';
import { ShimmerImage } from '@/components/Image';
import CommonHead from '@/components/PageLayout/CommonHead';
import { FaTwitter } from 'react-icons/fa';
import { AiOutlineGlobal } from 'react-icons/ai';
import { iswhitelist } from '@/services/market';
import { AkiaAddress } from '@/contract/constants/addresses';
import { useTranslations } from 'next-intl';

type FormValueType = {
  wallet_address: string;
};

enum CheckStatus {
  Wait,
  Pass,
  Fail,
}

function Content() {
  const t = useTranslations('bellaWlCheck');
  const [checkStatus, setCheckStatus] = useState<CheckStatus>(CheckStatus.Wait);
  const checkReq = useRequest(iswhitelist, {
    manual: true,
    onSuccess: ({ data }) => {
      setCheckStatus(data.is_whitelist ? CheckStatus.Pass : CheckStatus.Fail);
    },
  });

  return (
    <>
      <CommonHead title={'Aki Whitelist'} />
      <Flex
        direction={{ base: 'column', md: 'row' }}
        fontFamily={'Inter'}
        w={{ base: 'full', md: 'draft' }}
        mx="auto"
      >
        <Flex
          direction={'column'}
          align="center"
          w={{ base: 'full', md: '360px' }}
          mr={{ base: 0, md: '62px' }}
          flexShrink={0}
        >
          <ShimmerImage
            src="/images/activity/aki/cover.jpg"
            rounded="8px"
            w={{ base: '335px', md: '360px' }}
            h={{ base: '335px', md: '360px' }}
            mb={{ base: '20px', md: '26px' }}
            placeholder="blur"
          />
          <Flex fontSize="20px" align="center" color="#000">
            <Text fontWeight={700} mr="20px">
              Aki Whitelist
            </Text>
            <Link
              mr="20px"
              href="https://twitter.com/aki_protocol"
              target="_blank"
            >
              <Icon display="block" as={FaTwitter} />
            </Link>
            <NextLink href="/projects/aki" passHref>
              <Link>
                <Icon display="block" as={AiOutlineGlobal} />
              </Link>
            </NextLink>
          </Flex>
        </Flex>
        <Flex
          direction={'column'}
          align="flex-start"
          flexGrow={1}
          borderLeft="2px solid #f2f2f2"
          p={{ base: '30px 20px', md: '20px 24px 100px 62px' }}
        >
          <Heading
            as="h4"
            color="black"
            fontSize={'18px'}
            lineHeight="22px"
            mb="16px"
          >
            {t('mintDate')}
          </Heading>
          <Text color="#777E90" fontSize={'18px'} fontWeight="500" mb="34px">
            3 AUG 12PM JST
            {/* 2023/02/14 12:00:00 - 2023/02/26 12:00:00 GMT+09:00 */}
          </Text>
          <Heading
            as="h4"
            color="black"
            fontSize={'18px'}
            lineHeight="22px"
            mb="16px"
          >
            {t('detail')}
          </Heading>
          <Box color="#777E90" fontSize={'18px'} fontWeight="500" mb="20px">
            {/* {(t.raw('detailDoc') as string[]).map((el, i) => (
              <Box key={i}>{el}</Box>
            ))} */}
            <Box> Pre-Sale</Box>
            <Box>Staring Time： 3 AUG 12PM JST</Box>
            <Box>Price：Freemint</Box>
            <Box>Public-Sale</Box>
            <Box>Staring Time： 3 AUG 2PM JST</Box>
            <Box>Price: Freemint</Box>
            <Box>Amount:300</Box>
          </Box>

          <Formik<FormValueType>
            initialValues={{
              wallet_address: '',
            }}
            onSubmit={async (values) => {
              if (checkReq.loading) return;
              await checkReq.runAsync({
                ...values,
                contract_address: AkiaAddress,
              });
            }}
          >
            {({ errors, touched, isSubmitting, isValid }) => (
              <>
                <Form style={{ width: '100%' }}>
                  <FormControl
                    isInvalid={
                      !!(errors.wallet_address && touched.wallet_address)
                    }
                  >
                    <FormLabel>{t('walletAddress')}</FormLabel>
                    <Field
                      w={{ base: 'full', md: '650px' }}
                      as={Input}
                      name="wallet_address"
                      size="lg"
                      fontSize="md"
                      placeholder={t('walletAddress')}
                      onFocus={() => setCheckStatus(CheckStatus.Wait)}
                      validate={(val: string) => {
                        if (!val) {
                          return 'field is require!';
                        }
                      }}
                    />
                  </FormControl>
                  {checkStatus !== CheckStatus.Wait && (
                    <Box
                      color={
                        checkStatus === CheckStatus.Fail ? '#FF0000' : '#00CC2D'
                      }
                      fontSize="16px"
                      mt="16px"
                    >
                      {checkStatus === CheckStatus.Fail
                        ? t('notInwl')
                        : t('inwl')}
                    </Box>
                  )}
                  <Button
                    disabled={!isValid}
                    fontSize={{ base: '14px', md: '16px' }}
                    isLoading={isSubmitting}
                    type="submit"
                    w={{ base: 'full', md: '650px' }}
                    variant={'primary'}
                    size="lg"
                    mt="40px"
                  >
                    {t('inquiry')}
                  </Button>
                </Form>
              </>
            )}
          </Formik>
        </Flex>
      </Flex>
    </>
  );
}

export default function ContactWithFooter() {
  return (
    <>
      <Box py={{ base: '20px', md: '80px' }}>
        <Content />
      </Box>
      <Footer />
    </>
  );
}
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['bellaWlCheck']);
  // 禁止国内ip
  let detectedIp = requestIp.getClientIp(req);
  // console.log(detectedIp, 'ip');
  // console.log(req.url, 'ip');
  // const ip = '156.146.56.115';

  if (detectedIp === '::1') {
    detectedIp = '156.146.56.115';
  }

  const xdbFilePath = path.join(process.cwd(), 'public', 'ip2region.xdb');
  // const dbPath = './ip2region.xdb';
  // or 'path/to/ip2region.xdb file path'
  const searcher = Searcher.newWithFileOnly(xdbFilePath);
  // 查询
  const geo = await searcher.search(detectedIp || '');

  if (geo && geo?.region?.split('|')[0] === '中国') {
    if (
      !(
        geo?.region?.split('|')[2] === '台湾省' ||
        geo?.region?.split('|')[2] === '香港'
      )
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/err',
        },
      };
    }
  }
  // console.log(geo, 'geo1');
  return {
    props: {
      messages,
    },
  };
}
