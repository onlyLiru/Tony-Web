import { useMounted } from '@/hooks/useMounted';
import { serverSideTranslations } from '@/i18n';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useRequest } from 'ahooks';
import { Formik, Form, Field, FieldProps } from 'formik';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUserDataValue } from '@/store';
import { Footer } from '@/components/PageLayout';
import { CloseIcon, SmallAddIcon } from '@chakra-ui/icons';
import { FallbackImage, ShimmerImage } from '@/components/Image';
import {
  activityList,
  activityReview,
  activityReviewHistory,
  ActivityReviewStatus,
  activityReviewStatus,
  ActivityStatus,
  ApiUser,
} from '@/services/user';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Upload from '@/components/Upload';
import CommonHead from '@/components/PageLayout/CommonHead';

const FullSpiner = () => (
  <Center minH="75vh">
    <Spinner size="xl" thickness="4px" />
  </Center>
);

enum Stage {
  /** 展示活动信息 */
  ActivityInfo,
  /** 填写表单 */
  AcitvityForm,
}

type FormValueType = {
  twitter: string;
  discord: string;
  img_url: string[];
};

function Content({
  activityListData,
}: {
  activityListData: ApiUser.ActivityListItem;
}) {
  const { locale } = useRouter();
  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();
  const toast = useToast();
  const contactT = useTranslations('tempContact');
  const t = useTranslations('tempActivity');
  const [stage, setStage] = useState<Stage>(Stage.ActivityInfo);

  const [initialValues, setInitialValues] = useState<FormValueType>({
    img_url: [],
    twitter: '',
    discord: '',
  });

  const activityStatus = useMemo(() => {
    return activityListData.status;
  }, [activityListData]);

  const activityLocale = useMemo(
    () => t.raw('content').find((el: any) => el.id === +activityListData.id),
    [activityListData.id, locale],
  );

  const activityDate = useMemo(() => {
    return {
      start: format(
        new Date(activityListData.start_time * 1000),
        'yyyy/MM/dd HH:mm',
      ),
      end: format(
        new Date(activityListData.end_time * 1000),
        'yyyy/MM/dd HH:mm OOOO',
      ),
    };
  }, [activityListData]);

  // 获取用户活动状态
  const {
    data,
    refresh,
    runAsync,
    loading: userActivityLoading,
  } = useRequest(activityReviewStatus, {
    manual: true,
  });

  // 历史填写表单信息
  const historySubmitReq = useRequest(activityReviewHistory, {
    manual: true,
    onSuccess: ({ data: historySubmitValues }) => {
      setInitialValues({
        twitter: historySubmitValues.twitter,
        discord: historySubmitValues.discord,
        img_url: Array.isArray(historySubmitValues.img_url)
          ? historySubmitValues.img_url
          : [],
      });
    },
  });

  useEffect(() => {
    if (!userData?.wallet_address) return;
    runAsync({ id: activityListData.id });
  }, [userData?.wallet_address]);

  if (stage === Stage.ActivityInfo)
    return (
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
          flexShrink={0}
        >
          <ShimmerImage
            src={`/images/temp/activity/${activityListData.id}.png`}
            rounded="8px"
            w={{ base: '335px', md: '360px' }}
            h={{ base: '335px', md: '360px' }}
            mb={{ base: '0', md: '26px' }}
            placeholder="blur"
          />
          <Flex
            px="36px"
            py={{ base: '24px', md: '0' }}
            direction={{ base: 'column', md: 'column-reverse' }}
            align={'center'}
            bg="white"
            boxShadow={{
              base: '0px -4px 4px rgba(0, 0, 0, 0.05);',
              md: 'none',
            }}
            position={{ base: 'fixed', md: 'relative' }}
            bottom="0"
            left="0"
            right="0"
            zIndex={2}
          >
            {(data?.data.status === ActivityReviewStatus.FailedToPass ||
              data?.data.status === ActivityReviewStatus.Pass) && (
              <Text
                mb={{ base: '8px', md: '0' }}
                mt={{ base: '0', md: '20px' }}
                fontSize={'16px'}
                color={
                  data?.data.status === ActivityReviewStatus.FailedToPass
                    ? '#FF0000'
                    : '#0AFF40'
                }
              >
                {data?.data.status === ActivityReviewStatus.FailedToPass
                  ? t('reviewNotPassed')
                  : t('reviewPassed')}
              </Text>
            )}

            <Button
              isLoading={userActivityLoading || historySubmitReq.loading}
              disabled={
                // 活动非进行中状态、用户已提交状态 按钮禁用
                activityStatus !== ActivityStatus.InProgress ||
                data?.data.status === ActivityReviewStatus.Submitted ||
                data?.data.status === ActivityReviewStatus.Pass
              }
              variant={'primary'}
              size="lg"
              w={{ base: 'full', md: '240px' }}
              onClick={async () => {
                // 未登录
                if (!userData?.wallet_address) return openConnectModal?.();
                // 未提交、审核不通过，可进入表单提交stage
                if (
                  data?.data.status === ActivityReviewStatus.NotSubmitted ||
                  data?.data.status === ActivityReviewStatus.FailedToPass
                ) {
                  await historySubmitReq.runAsync({
                    activity_id: activityListData.id,
                  });
                  setStage(Stage.AcitvityForm);
                }
              }}
            >
              {(() => {
                if (activityStatus === ActivityStatus.NotStarted)
                  return t('eventComingSoon');
                if (activityStatus === ActivityStatus.Finished)
                  return t('eventHasEnded');
                if (
                  data?.data.status === ActivityReviewStatus.Submitted ||
                  data?.data.status === ActivityReviewStatus.Pass
                )
                  return t('submitted');
                if (data?.data.status === ActivityReviewStatus.FailedToPass)
                  return t('reupload');
                return t('joinNow');
              })()}
            </Button>
          </Flex>
        </Flex>
        <Flex
          direction={'column'}
          align="flex-start"
          flexGrow={1}
          p={{ base: '30px 20px', md: '20px 24px 20px 114px' }}
        >
          <Heading
            fontWeight={700}
            color="black"
            fontSize={'20px'}
            lineHeight="44px"
            mb="20px"
          >
            {activityLocale.title}
          </Heading>
          <Text color="black" fontSize={'18px'} fontWeight="500" mb="16px">
            {t('eventTime')}
          </Text>
          <Text color="#777E90" fontSize={'18px'} fontWeight="500" mb="34px">
            {activityDate.start} - {activityDate.end}
          </Text>
          <Text color="black" fontSize={'18px'} fontWeight="500" mb="16px">
            {t('eventRules')}
          </Text>
          <Text
            color="#777E90"
            fontSize={'18px'}
            fontWeight="500"
            mb="20px"
            dangerouslySetInnerHTML={{ __html: activityLocale.desc }}
          />
          {Array.isArray(activityLocale.texts) && (
            <List mb="40px" color="#777E90" fontSize={'18px'} fontWeight="500">
              {activityLocale.texts.map((el: string, idx: number) => (
                <ListItem key={idx}>
                  {el.replace('{link}', `<a href="/">UneMeta</a>`)}
                </ListItem>
              ))}
            </List>
          )}
          <Text color="black" fontSize={'18px'} fontWeight="500" mb="16px">
            {t('prize')}
          </Text>
          <Text color="#777E90" fontSize={'18px'} fontWeight="500">
            {activityLocale.prizeContent}
          </Text>
        </Flex>
      </Flex>
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
            {contactT('contactInfo')}
          </Heading>
          <Text
            fontSize={{ base: '14px', md: '16px' }}
            color="primary.lightGray"
            textAlign={'center'}
          >
            {contactT('contactInfoDesc')}
          </Text>
        </VStack>
        <Formik<FormValueType>
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              await activityReview({
                activity_id: activityListData.id,
                review_id: historySubmitReq.data?.data?.review_id,
                ...values,
              });
              refresh();
              setStage(Stage.ActivityInfo);
              toast({
                status: 'success',
                title: contactT('transactionSuccess'),
                variant: 'subtle',
              });
            } catch (error) {
              toast({
                status: 'error',
                title: contactT('transactionCancel'),
                variant: 'subtle',
              });
            }
          }}
        >
          {({ errors, touched, isSubmitting, isValid }) => (
            <>
              <Form>
                <VStack spacing={'28px'} maxW={{ base: 'full', md: '656px' }}>
                  <FormControl
                    isInvalid={!!(errors.twitter && touched.twitter)}
                  >
                    <FormLabel>Twitter</FormLabel>
                    <Field
                      w={{ base: 'full', md: '316px' }}
                      as={Input}
                      name="twitter"
                      size="lg"
                      fontSize="md"
                      placeholder="Your twitter"
                      validate={(val: string) => {
                        if (!val) {
                          return 'field is require!';
                        }
                      }}
                    />
                  </FormControl>

                  <FormControl
                    isInvalid={!!(errors.discord && touched.discord)}
                  >
                    <FormLabel>Discord</FormLabel>
                    <Field
                      as={Input}
                      name="discord"
                      w={{ base: 'full', md: '316px' }}
                      placeholder="Your discord name"
                      size="lg"
                      fontSize="md"
                      validate={(val: string) => {
                        if (!val) {
                          return 'field is require!';
                        }
                      }}
                    />
                  </FormControl>
                  <Field
                    name="img_url"
                    validate={(val: string) => {
                      if (!val) {
                        return 'field is require!';
                      }
                    }}
                  >
                    {(filedProps: FieldProps) => (
                      <FormControl>
                        <FormLabel>Image</FormLabel>
                        <FormHelperText
                          color="#8C8C8C"
                          fontSize={'16px'}
                          mb="20px"
                        >
                          {t('pleaseUploadScreenshot')}
                        </FormHelperText>
                        <Upload.Multiple
                          value={filedProps.field.value}
                          onChange={(v) =>
                            filedProps.form.setFieldValue(
                              filedProps.field.name,
                              v,
                            )
                          }
                        >
                          {({ value, loading }, actions) => (
                            <Flex wrap={'wrap'}>
                              {value.map((img) => (
                                <Box
                                  mr="8px"
                                  mb="8px"
                                  key={img}
                                  pos="relative"
                                  w="120px"
                                  h="120px"
                                  rounded="4px"
                                  overflow={'hidden'}
                                  border="2px solid"
                                  borderColor="#D9D9D9"
                                >
                                  <Center
                                    pos="absolute"
                                    zIndex={2}
                                    top="0"
                                    right="0"
                                    w="24px"
                                    h="24px"
                                    bg="blackAlpha.500"
                                    onClick={() => actions.remove(img)}
                                    rounded="0 0 0 10px"
                                  >
                                    <CloseIcon
                                      fontSize={'12px'}
                                      color="white"
                                    />
                                  </Center>
                                  <FallbackImage src={img} w="full" h="full" />
                                </Box>
                              ))}
                              {value?.length < 9 && (
                                <Center
                                  w="120px"
                                  h="120px"
                                  mb="8px"
                                  rounded={'4px'}
                                  border="2px dashed"
                                  borderColor="#D9D9D9"
                                  bg="#F4F4F4"
                                  onClick={() => actions.chooseFile()}
                                >
                                  {loading ? (
                                    <Spinner />
                                  ) : (
                                    <SmallAddIcon
                                      color="#D9D9D9"
                                      fontSize={'56px'}
                                    />
                                  )}
                                </Center>
                              )}
                            </Flex>
                          )}
                        </Upload.Multiple>
                      </FormControl>
                    )}
                  </Field>
                </VStack>
                <Button
                  disabled={!isValid}
                  fontSize={{ base: '14px', md: '16px' }}
                  isLoading={isSubmitting}
                  type="submit"
                  w="full"
                  variant={'primary'}
                  size="lg"
                  mt="40px"
                >
                  {contactT('confirm')}
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </Container>
  );
}

const ACTIVITY_PATH_MAP: Record<string, number> = {
  meeting: 1,
  yuliverse: 2,
};

function Contact() {
  const isMounted = useMounted();
  const t = useTranslations('common');
  const { query } = useRouter();
  const pagePath = query.id as string;
  const pageId = ACTIVITY_PATH_MAP[pagePath]!;
  const { data: listData, loading } = useRequest(activityList, {
    manual: !pageId,
  });

  const activityData = useMemo(() => {
    if (!listData?.data) return undefined;
    return listData.data.list?.find((el) => +el.id === pageId);
  }, [listData?.data]);

  if (!isMounted || loading) return <FullSpiner />;

  if (!activityData || !pageId)
    return <Center minH={'75vh'}>{t('noItems')}</Center>;
  return (
    <>
      <CommonHead title={activityData.name} />
      <Content activityListData={activityData} />
    </>
  );
}

export default function ContactWithFooter() {
  return (
    <>
      <Box py={{ base: '20px', md: '80px' }}>
        <Contact />
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
  const messages = await serverSideTranslations(locale, [
    'tempContact',
    'tempActivity',
  ]);
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
