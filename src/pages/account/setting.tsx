import { useTranslations } from 'next-intl';
import { redirectLoginPage, serverSideTranslations } from '@/i18n';
import { GetServerSideProps } from 'next';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Input,
  Flex,
  Box,
  Text,
  Center,
  Textarea,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  useToast,
  Heading,
  InputRightElement,
  FormHelperText,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useDisclosure,
  Image,
  // AlertDialog,
  // AlertDialogBody,
  // AlertDialogFooter,
  // AlertDialogHeader,
  // AlertDialogContent,
  // AlertDialogOverlay,
  // AlertDialogCloseButton,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import * as userApis from '@/services/user';
import { useEffect, useRef, useState } from 'react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { MdContentCopy } from 'react-icons/md';
import { UploadImage } from '@/features/Create';
import { useFetchUser } from '@/store';
import useCopy from '@/hooks/useCopy';
import { JWT_HEADER_KEY } from '@/utils/jwt';
import CommonHead from '@/components/PageLayout/CommonHead';
import { Footer } from '@/components/PageLayout';
import BindEmailModal from './components/BindEmailModal';
import * as globalApi from '@/services/global';
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit';

const getErrorKey = (code: number) => {
  let errorKey = '';
  switch (code) {
    case 200019:
      errorKey = 'header.web2Login.sendTooOften';
      break;
    case 200020:
      errorKey = 'header.web2Login.verifyCodeError';
      break;
  }
  return errorKey;
};

const isValidEmail = (email: string) => {
  return /^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
};

const handleEmailCheck = (email: string) => {
  return new Promise((resolve, reject) => {
    if (isValidEmail(email)) {
      resolve('');
    } else {
      if (!email) {
        reject('header.web2Login.enterEmailTip');
      } else {
        reject('header.web2Login.errorEmailTip');
      }
    }
  });
};

const handleGetEmailValidCode = async (sendEmail: string) => {
  return globalApi
    .sendEmailValidCode({
      email: sendEmail,
    })
    .catch((e) => {
      throw getErrorKey(e.code);
    });
};

export default function Setting() {
  const t = useTranslations('settings');
  const ct = useTranslations('common');
  const { userData, fetchUser } = useFetchUser();
  const [loading, setLoading] = useState(false);
  const [sendEmailButtonLoading, setSendEmailButtonLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const [_, onCopy] = useCopy();
  const { openConnectModal } = useConnectModal();

  const formRef = useRef<
    FormikProps<
      userApis.ApiUser.saveUserInfoPayload & { twitter_name: string } & {
        discord_name: string;
      } & { login_email?: string }
    >
  >(null);
  const initialFocusRef = useRef(null);
  const initialEmailFocusRef = useRef(null);
  const bindEmailModal = useRef<any>(null);
  // eslint-disable-next-line prefer-const
  let { isOpen, onToggle, onClose } = useDisclosure();
  const {
    isOpen: isEmailFocusOpen,
    onToggle: onEmailFocusToggle,
    onClose: onEmailFocusClose,
  } = useDisclosure();
  // useEffect(() => {}, []);
  useEffect(() => {
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    // discord是标识这个code为dc授权生成的
    const { code, discord } = router.query;
    // 绑定twitter
    const handleTwitterBind = async () => {
      try {
        const { origin, pathname } = window.location;
        const redirectUrl = `${origin + pathname}`;
        const { data } = await userApis.bindTwitter({
          code: code as string,
          redirect_url: redirectUrl,
        });
        if (data.is_first) {
          toast({
            status: 'success',
            title: `save successfully,+10uuu`,
            variant: 'subtle',
          });
        }
        formRef.current?.setFieldValue('twitter_name', data.twitter_name);
      } catch (error) {
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    };
    if (code && !userData?.twitter_name && !discord) {
      handleTwitterBind();
    }
    formRef.current?.setValues(userData);
  }, [userData?.wallet_address]);

  useEffect(() => {
    // discord是标识这个code为dc授权生成的
    const { code, discord } = router.query;
    if (userData?.discord_name === '') {
      const getDcName = async () => {
        if (code) {
          const { origin, pathname } = window.location;
          const url = `${origin + pathname}?discord=true`;
          try {
            const { data } = await userApis.dcCallback({
              code: code as string,
              redirect_uri: url,
            });
            // console.log(data.discord_name);
            if (data.is_first) {
              toast({
                status: 'success',
                title: `save successfully,+10uuu`,
                variant: 'subtle',
              });
            }
            formRef.current?.setFieldValue('discord_name', data.discord_name);
          } catch (error) {
            toast({ status: 'error', title: error.message, variant: 'subtle' });
          }
        }
      };
      if (code && !userData?.discord_name && discord) {
        getDcName();
      }
    }
    if (!userData?.login_email) {
      onEmailFocusToggle();
    }
  }, [userData]);

  const onTwitterLogin = async () => {
    // if (formRef.current?.values.twitter_name || userData?.twitter_name) return;
    if (formRef.current?.values.twitter_name || userData?.twitter_name) {
      await onTwitterReconnect();
    }
    try {
      const { origin, pathname } = window.location;
      const redirectUrl = `${origin + pathname}`;
      const { data } = await userApis.getTwitterUrl({
        redirect_url: redirectUrl,
      });
      window.location.replace(data.url);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  const discordLogin = async () => {
    try {
      const { origin, pathname } = window.location;
      const redirectUrl = `${origin + pathname}?discord=true`;
      const url = `https://discord.com/api/oauth2/authorize?client_id=1124218433647685743&redirect_uri=${encodeURIComponent(
        redirectUrl,
      )}&response_type=code&scope=identify%20email`;
      window.location.replace(url);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };
  const onTwitterReconnect = async () => {
    try {
      const { data } = await userApis.unbindTw();
      console.log(data, 'onDiscordReconnect');
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };
  const onDiscordReconnect = async () => {
    try {
      const { data } = await userApis.unbindDc();
      console.log(data, 'onDiscordReconnect');
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  const onDiscordLogin = async () => {
    if (formRef.current?.values.discord_name || userData?.discord_name) {
      await onDiscordReconnect();
    }
    discordLogin();
  };
  return (
    <Box maxW="full" overflow="hidden" bg={'#2B2B2B'}>
      <CommonHead title="Settings" />
      <Box
        mx={'auto'}
        p={{ md: 10, base: 5 }}
        maxW={{ base: 'full', md: '1260px' }}
        pos="relative"
      >
        <Heading
          fontSize={{ base: '21px', md: '56px' }}
          mb={{ base: 6, md: 16 }}
          fontWeight={600}
          lineHeight="50px"
          fontFamily="PingFang HK"
          color={'rgba(255, 255, 255, 0.80)'}
        >
          {t('yourProfile')}
        </Heading>
        <Formik
          innerRef={formRef!}
          initialValues={{
            username: '',
            bio: '',
            email: '',
            twitter_name: '',
            instagram_link: '',
            site_link: '',
            profile_image: '',
            profile_banner: '',
            wallet_address: '',
            discord_name: '',
          }}
          validate={(values) => {
            const errors: any = {};
            if (!values.username) {
              errors.username = 'username cannot be empty';
            }
            if (!values.profile_image) {
              errors.profile_image = 'Profile Image cannot be empty';
            }
            return errors;
          }}
          onSubmit={async (values) => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { twitter_name, ...obj } = values;
              setLoading(true);
              await userApis.updateUserInfo(obj);
              await fetchUser();
              setLoading(false);
              router.push(`/user/${userData?.wallet_address}`);
              toast({
                status: 'success',
                title: 'Save success!',
                variant: 'subtle',
              });
            } catch (error) {
              setLoading(false);
              toast({
                status: 'error',
                title: error.message,
                variant: 'subtle',
              });
            }
          }}
        >
          {({ errors, touched, values }) => (
            <>
              <Form>
                <Stack
                  mx="auto"
                  spacing={{ base: 5, md: 20 }}
                  direction={{ base: 'column-reverse', md: 'row' }}
                >
                  <VStack
                    w="full"
                    flex={1}
                    mx="auto"
                    spacing={{ md: 5, base: 6 }}
                    align="flex-start"
                  >
                    <FormControl
                      isRequired
                      isInvalid={!!(errors.username && touched.username)}
                    >
                      <FormLabel
                        variant={{ md: 'setting', base: 'settingMobile' }}
                        color={'rgba(255, 255, 255, 0.80)'}
                      >
                        {t('userName')}
                      </FormLabel>
                      <Field
                        as={Input}
                        name="username"
                        placeholder="username"
                        _focusVisible={{
                          borderColor: 'rgba(255, 255, 255, 0.10)',
                        }}
                        bg={'transparent'}
                        borderColor="rgba(255, 255, 255, 0.10)"
                        color={'rgba(255, 255, 255, 0.40)'}
                        borderWidth={1}
                      />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        variant={{ md: 'setting', base: 'settingMobile' }}
                        color={'rgba(255, 255, 255, 0.80)'}
                      >
                        {t('bio')}
                      </FormLabel>
                      <Field
                        as={Textarea}
                        minH="210px"
                        // placeholder={t('bioDes')}
                        color="rgba(255, 255, 255, 0.40)"
                        borderColor="rgba(255, 255, 255, 0.10)"
                        backgroundColor={'transparent'}
                        name="bio"
                        _focusVisible={{
                          borderColor: 'rgba(255, 255, 255, 0.10)',
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        variant={{ md: 'setting', base: 'settingMobile' }}
                        color={'rgba(255, 255, 255, 0.80)'}
                      >
                        {t('links')}
                      </FormLabel>
                      <VStack spacing={3}>
                        <InputGroup>
                          <InputLeftElement
                            h="full"
                            w="48px"
                            pointerEvents="none"
                            children={
                              <Icon
                                as={FaTwitter}
                                fontSize={18}
                                color="rgba(255, 255, 255, 0.80)"
                              />
                            }
                          />
                          <Field
                            as={Input}
                            pl={12}
                            cursor="pointer"
                            placeholder="twitter"
                            name="twitter_name"
                            color="rgba(255, 255, 255, 0.40)"
                            borderColor="rgba(255, 255, 255, 0.10)"
                            backgroundColor={'transparent'}
                            readOnly
                            onClick={onTwitterLogin}
                            zIndex={-1}
                          />
                          <InputRightElement
                            h="full"
                            w="auto"
                            pointerEvents="none"
                            children={
                              values.twitter_name ? (
                                <>
                                  <CheckCircleIcon
                                    color="#3FCF5F"
                                    mx="12px"
                                    fontSize={{ base: 'sm', md: 'lg' }}
                                  />
                                  <Text
                                    cursor="pointer"
                                    onClick={onTwitterLogin}
                                    fontSize={{ md: '20px', base: '16px' }}
                                    lineHeight={{ md: '30px', base: '18px' }}
                                    px={{ md: '23px', base: '18px' }}
                                    color="rgba(255, 255, 255, 0.40)"
                                  >
                                    reconnect
                                  </Text>
                                </>
                              ) : (
                                <Text
                                  fontSize={{ md: '20px', base: '16px' }}
                                  lineHeight={{ md: '30px', base: '18px' }}
                                  px={{ md: '23px', base: '18px' }}
                                  color="rgba(255, 255, 255, 0.40)"
                                >
                                  connect
                                </Text>
                              )
                            }
                          />
                        </InputGroup>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            h="full"
                            w="48px"
                            children={
                              <Icon
                                as={FaDiscord}
                                fontSize={20}
                                color="rgba(255, 255, 255, 0.80)"
                              />
                            }
                          />
                          <Field
                            as={Input}
                            pl={12}
                            placeholder="discord"
                            name="discord_name"
                            cursor="pointer"
                            readOnly
                            onClick={onDiscordLogin}
                            onMouseEnter={onToggle}
                            onMouseLeave={onToggle}
                            color="rgba(255, 255, 255, 0.40)"
                            borderColor="rgba(255, 255, 255, 0.10)"
                            backgroundColor={'transparent'}
                          />
                          <InputRightElement
                            h="full"
                            w="auto"
                            pointerEvents="none"
                            children={
                              values.discord_name ? (
                                <>
                                  <CheckCircleIcon
                                    color="#3FCF5F"
                                    mx="12px"
                                    fontSize={{ base: 'sm', md: 'lg' }}
                                  />
                                  <Text
                                    cursor="pointer"
                                    fontSize={{ md: '20px', base: '16px' }}
                                    lineHeight={{ md: '30px', base: '18px' }}
                                    px={{ md: '23px', base: '18px' }}
                                    color="rgba(255, 255, 255, 0.40)"
                                  >
                                    reconnect
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Popover
                                    initialFocusRef={initialFocusRef}
                                    placement="top"
                                    trigger="hover"
                                    isOpen={isOpen}
                                    onClose={onClose}
                                  >
                                    <PopoverTrigger>
                                      <Text
                                        fontSize={{ md: '20px', base: '16px' }}
                                        lineHeight={{
                                          md: '30px',
                                          base: '18px',
                                        }}
                                        px={{ md: '23px', base: '18px' }}
                                        color="rgba(255, 255, 255, 0.40)"
                                      >
                                        connect
                                      </Text>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      bg="rgb(64,64,64)"
                                      borderColor="rgb(64,64,64)"
                                      w="260px"
                                    >
                                      <PopoverArrow bg="rgb(64,64,64)" />
                                      {/* <PopoverCloseButton /> */}
                                      <PopoverBody
                                        boxShadow="0px 2px 40px 0px rgba(0,0,0,0.12)"
                                        borderRadius="8px"
                                        color={'rgba(255, 255, 255, 0.80)'}
                                      >
                                        <VStack>
                                          <Image
                                            src="/images/home/research_icon.png"
                                            w="80px"
                                            height="80px"
                                            objectFit="cover"
                                          />
                                          <Box
                                            fontSize={16}
                                            fontWeight={500}
                                            textAlign="center"
                                          >
                                            {t('discordBindHeader')}
                                          </Box>
                                          <Box
                                            fontSize={16}
                                            fontWeight={500}
                                            textAlign="center"
                                          >
                                            {t('discordBindDes')}
                                          </Box>
                                        </VStack>
                                      </PopoverBody>
                                    </PopoverContent>
                                  </Popover>
                                </>
                              )
                            }
                          />
                        </InputGroup>

                        <InputGroup>
                          <InputLeftElement
                            h="full"
                            w="48px"
                            pointerEvents="none"
                            children={
                              <Icon
                                as={AiFillInstagram}
                                fontSize={20}
                                color="rgba(255, 255, 255, 0.80)"
                              />
                            }
                          />
                          <Field
                            as={Input}
                            pl={12}
                            placeholder="instagram"
                            name="instagram_link"
                            color="rgba(255, 255, 255, 0.40)"
                            borderColor="rgba(255, 255, 255, 0.10)"
                            backgroundColor={'transparent'}
                          />
                        </InputGroup>
                      </VStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        variant={{ md: 'setting', base: 'settingMobile' }}
                        color={'rgba(255, 255, 255, 0.80)'}
                      >
                        {t('emailAddress')}
                      </FormLabel>
                      <InputGroup>
                        <Field
                          as={Input}
                          name="login_email"
                          placeholder={t('emailAddress')}
                          color="rgba(255, 255, 255, 0.40)"
                          borderColor="rgba(255, 255, 255, 0.10)"
                          backgroundColor={'transparent'}
                          _focusVisible={{
                            borderColor: 'rgba(255, 255, 255, 0.10)',
                          }}
                        />
                        {!userData?.login_email && (
                          <>
                            <Button
                              position="absolute"
                              size="sm"
                              top="50%"
                              right="-8px"
                              transform="translateY(-50%)"
                              backgroundColor="#FB9D42"
                              mr="16px"
                              cursor="pointer"
                              _hover={{
                                bg: '#FB9D42',
                              }}
                              isLoading={sendEmailButtonLoading}
                              onMouseEnter={onEmailFocusToggle}
                              onMouseLeave={onEmailFocusClose}
                              onClick={() => {
                                console.log(formRef.current?.values);
                                const loginEmail = (formRef.current?.values
                                  .login_email || '') as string;
                                handleEmailCheck(loginEmail)
                                  .then(() => {
                                    setSendEmailButtonLoading(true);
                                    return handleGetEmailValidCode(loginEmail);
                                  })
                                  .then(() => {
                                    bindEmailModal?.current?.open();
                                  })
                                  .catch((errorKey) => {
                                    console.log(errorKey);
                                    toast({
                                      position: 'bottom',
                                      containerStyle: {
                                        //   top: '60px',
                                      },
                                      title:
                                        ct(errorKey) || 'Sending email failed',
                                      status: 'error',
                                      isClosable: true,
                                    });
                                  })
                                  .finally(() => {
                                    setSendEmailButtonLoading(false);
                                  });
                              }}
                            >
                              bind
                            </Button>
                            <InputRightElement
                              h="full"
                              w="auto"
                              pointerEvents="none"
                              children={
                                <>
                                  <Popover
                                    initialFocusRef={initialEmailFocusRef}
                                    placement="top"
                                    trigger="hover"
                                    isOpen={isEmailFocusOpen}
                                    onClose={onEmailFocusClose}
                                  >
                                    <PopoverTrigger>
                                      <Button visibility="hidden">bind</Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      bg="rgb(64,64,64)"
                                      borderColor="rgb(64,64,64)"
                                      w="220px"
                                      color="rgba(255, 255, 255, 0.80)"
                                    >
                                      <PopoverArrow bg="rgb(64,64,64)" />
                                      {/* <PopoverCloseButton /> */}
                                      <PopoverBody
                                        boxShadow="0px 2px 40px 0px rgba(0,0,0,0.12)"
                                        borderRadius="8px"
                                      >
                                        <VStack>
                                          <Image
                                            src="/images/home/research_icon.png"
                                            w="80px"
                                            height="80px"
                                            objectFit="cover"
                                          />
                                          <Box
                                            fontSize={16}
                                            fontWeight={500}
                                            textAlign="center"
                                          >
                                            {t('emailBindHeader')}
                                          </Box>
                                          <Box
                                            fontSize={16}
                                            fontWeight={500}
                                            textAlign="center"
                                          >
                                            {t('emailBindDes')}
                                          </Box>
                                        </VStack>
                                      </PopoverBody>
                                    </PopoverContent>
                                  </Popover>
                                </>
                              }
                            />
                          </>
                        )}
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        variant={{ md: 'setting', base: 'settingMobile' }}
                        color={'rgba(255, 255, 255, 0.80)'}
                      >
                        {t('walletAddress')}
                      </FormLabel>
                      <InputGroup
                        onClick={async () => {
                          await onCopy(userData?.wallet_address!);
                          toast({
                            status: 'success',
                            title: 'Address copied!',
                            variant: 'subtle',
                          });
                        }}
                      >
                        <Field
                          as={Input}
                          cursor="pointer"
                          readOnly
                          name="wallet_address"
                          fontSize="md"
                          placeholder="wallet address"
                          pr={10}
                          color="rgba(255, 255, 255, 0.40)"
                          borderColor="rgba(255, 255, 255, 0.10)"
                          backgroundColor={'transparent'}
                          _focusVisible={{
                            borderColor: 'rgba(255, 255, 255, 0.10)',
                          }}
                        />
                        <InputRightElement
                          h="full"
                          w="48px"
                          pointerEvents="none"
                          children={
                            <Icon
                              as={MdContentCopy}
                              fontSize={20}
                              color="rgba(255, 255, 255, 0.80)"
                            />
                          }
                        />
                      </InputGroup>
                    </FormControl>
                  </VStack>
                  <VStack spacing={{ md: 14, base: 6 }} flex={1}>
                    <Field name="profile_image">
                      {(filedProps: FieldProps) => (
                        <FormControl
                          isRequired
                          isInvalid={
                            !!(errors.profile_image && touched.profile_image)
                          }
                        >
                          <Flex direction="column" align="flex-start">
                            <FormLabel
                              variant={{ md: 'setting', base: 'settingMobile' }}
                              mb={10}
                              color={'rgba(255, 255, 255, 0.80)'}
                            >
                              {t('profileImage')}
                            </FormLabel>
                            <UploadImage
                              value={filedProps.field.value}
                              onChange={(v) =>
                                filedProps.form.setFieldValue(
                                  filedProps.field.name,
                                  v,
                                )
                              }
                              wrapperProps={{
                                w: { base: '72px', md: '200px' },
                                h: { base: '72px', md: '200px' },
                                backgroundColor: { base: 'transparent' },
                                borderColor: {
                                  base: 'rgba(255, 255, 255, 0.10)',
                                },
                                rounded: 'full',
                              }}
                            />
                          </Flex>
                          <FormHelperText
                            mt={{ md: 5, base: 2 }}
                            fontSize={{ base: '10px', md: 'md' }}
                            cursor="pointer"
                          >
                            <Text
                              onClick={() =>
                                router.push(`/user/${userData?.wallet_address}`)
                              }
                              dangerouslySetInnerHTML={{
                                __html: t.raw('profileImageDesc'),
                              }}
                            ></Text>
                          </FormHelperText>
                          <FormErrorMessage>
                            {errors.profile_image}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="profile_banner">
                      {(filedProps: FieldProps) => (
                        <FormControl>
                          <Flex direction="column" align="flex-start">
                            <FormLabel
                              variant={{ md: 'setting', base: 'settingMobile' }}
                              color={'rgba(255, 255, 255, 0.80)'}
                            >
                              {t('bannerImage')}
                            </FormLabel>
                            <UploadImage
                              value={filedProps.field.value}
                              onChange={(v) =>
                                filedProps.form.setFieldValue(
                                  filedProps.field.name,
                                  v,
                                )
                              }
                              wrapperProps={{
                                w: 'full',
                                h: { base: '120px', md: '208px' },
                                backgroundColor: { base: 'transparent' },
                                borderColor: {
                                  base: 'rgba(255, 255, 255, 0.10)',
                                },
                              }}
                            />
                          </Flex>
                          <FormHelperText
                            mt={{ md: 5, base: 2 }}
                            fontSize={{ base: '10px', md: 'md' }}
                          >
                            {t('bannerImageDesc')}
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                </Stack>
                <Center my={{ base: '40px', md: '100px' }}>
                  <Button
                    type="submit"
                    isLoading={loading}
                    w={{ md: '217px', base: '120px' }}
                    h={{ md: '54px', base: '30px' }}
                    fontSize={{ base: '12px', md: 'md' }}
                    bg={'#E39F5C'}
                  >
                    {ct('save')}
                  </Button>
                </Center>
              </Form>
            </>
          )}
        </Formik>
        <Box
          pos="absolute"
          right="-100px"
          top="400px"
          w="344px"
          h="700px"
          background="linear-gradient(180deg, #B095FF 0%, #80E0D0 47.42%)"
          opacity={0.2}
          filter="blur(100px)"
          transform="matrix(-0.87, 0.5, 0.5, 0.87, 0, 0)"
          zIndex={-10}
          display={{ base: 'none', md: 'block' }}
        />
        <Box
          pos="absolute"
          right="200px"
          top="400px"
          w="344px"
          h="700px"
          background="#D4CBF7"
          opacity={0.4}
          filter="blur(100px)"
          transform="rotate(30deg);"
          zIndex={-10}
          display={{ base: 'none', md: 'block' }}
        />
      </Box>
      <Footer />
      <BindEmailModal
        ref={bindEmailModal}
        email={formRef.current?.values.login_email}
      />
    </Box>
  );
}
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
  resolvedUrl,
}) => {
  if (!req.cookies?.[JWT_HEADER_KEY]) {
    // return redirectLoginPage({ locale, resolvedUrl });
    console.log('未登录不做重定向处理');
  }
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
      messages: await serverSideTranslations(locale, ['settings']),
    },
  };
};
