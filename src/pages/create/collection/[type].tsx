/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
import Upload, { UploadProps } from '@/components/Upload';
import Image from '@/components/Image';
import { DatePicker } from '@/features/DatePicker';
import { UploadImage } from '@/features/Create';
import {
  Box,
  Center,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Stack,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Switch,
  Button,
  useToast,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { SmallAddIcon, CloseIcon } from '@chakra-ui/icons';
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';
import { MdWeb, MdInsertLink } from 'react-icons/md';
import { useUserDataValue } from '@/store';
import { useDebounceEffect } from 'ahooks';
import * as createApis from '@/services/create';
import { useRouter } from 'next/router';
import { addressReg, emailReg } from '@/utils';
import { useRequest } from 'ahooks';
import useSignHelper from '@/hooks/helper/useSignHelper';

interface MainFormValues {
  logo_image: string; // logo图片
  featured_image?: string; // 特色图片
  banner_image?: string; // 横幅图片
  name: string; // 名称
  customize_url?: string; // 自定义url
  description?: string; // 描述
  category?: number; // 类别 1:未选择 2:art 3:trading cards 4:collectibles 5:sports 6:utility
  site_link?: string; // 个人站点
  discord_link?: string; // discord链接
  twitter_link?: string; // 推特链接
  instagram_link?: string; // instagram连接
  medium_link?: string; // medium链接
  email?: string; // 个人email
  // display_theme: 1; //显示主题 1:padded 2：contained  3：covered
  // is_release: 1; // 是否发布 1未发布 2已发布
  // pay_currency_type: currencyType; //货币类型 1：eth 2：weth 3:usdt
  currency_type?: number; // 货币类型 1：eth 2：weth 3:usdt
  royalties?: number; // 版税
  payout_wallet_address?: string; // 付款地址
  blockchain?: number; // 区块链  1：以太坊 2：polygon
  sensitive_status?: boolean; // 敏感内容开关  1:没有敏感内容 2：有敏感内容
  presale_status?: boolean; // 预售开关 1:关 2:开
  presale_time?: Date; // 预售时间戳
  white_list?: ''; // 白名单 free_mint为免费锻造开关 1:关 2:开
  separate_contract: number; //是否创建独立合约开关 1：关 2:开
}

const renderUploadFile: UploadProps['children'] = (state, actions) => {
  if (state.loading)
    return (
      <Spinner thickness="4px" speed="0.8s" emptyColor="gray.200" size="xl" />
    );
  if (state.value)
    return (
      <HStack
        pos="relative"
        w="full"
        h="full"
        zIndex={2}
        border="1px solid #E5E8EB"
        boxShadow="0px 2px 6px rgba(0, 0, 0, 0.06)"
        p={4}
      >
        <Image src="/images/user/excelIcon.png" w="80px" h="70px" mr={3} />
        <Box color="primary.main">White List</Box>
        <CloseIcon
          pos="absolute"
          cursor={'pointer'}
          right="7px"
          top="7px"
          color="#f4f4f4"
          onClick={actions.remove}
        />
      </HStack>
    );
  return <SmallAddIcon fontSize={'64px'} />;
};

export default function CreateCollection() {
  const router = useRouter();
  const isEditing = router.query.type === 'edit';
  const t = useTranslations('index');
  const userData = useUserDataValue();
  const toast = useToast();
  const { sign } = useSignHelper();
  const [checkError, setCheckError] = useState<any>({});
  const [detail, setDetail] = useState<any>({});

  const addReq = useRequest(createApis.createCollection, { manual: true });
  const editReq = useRequest(createApis.updateCollection, { manual: true });

  const createForm = useFormik<MainFormValues>({
    initialValues: {
      logo_image: '', // logo图片
      featured_image: '', // 特色图片
      banner_image: '', // 横幅图片
      name: '', // 名称
      customize_url: '', // 自定义url
      description: '', // 描述
      category: 1, // 类别 1:未选择 2:art 3:trading cards 4:collectibles 5:sports 6:utility
      site_link: '', // 个人站点
      discord_link: '', // discord链接
      twitter_link: '', // 推特链接
      instagram_link: '', // instagram连接
      medium_link: '', // medium链接
      email: '', // 个人email
      // display_theme: 1, //显示主题 1:padded 2：contained  3：covered
      // is_release: 1, // 是否发布 1未发布 2已发布
      // pay_currency_type: currencyType, //货币类型 1：eth 2：weth 3:usdt
      currency_type: 1, // 货币类型 1：eth 2：weth 3:usdt
      royalties: 0, // 版税
      payout_wallet_address: '', // 付款地址
      blockchain: 1, // 区块链  1：以太坊 2：polygon
      sensitive_status: false, // 敏感内容开关  1:没有敏感内容 2：有敏感内容
      presale_status: false, // 预售开关 1:关 2:开
      presale_time: undefined, // 预售时间戳
      white_list: '', // 白名单 free_mint为免费锻造开关 1:关 2:开
      separate_contract: 1, //是否创建独立合约开关 1：关 2:开
    },
    validate: async (values) => {
      const errors: any = {};
      if (!values.name) {
        errors.name = 'Name cannot be empty';
      }
      if (!values.logo_image) {
        errors.logo_image = 'Logo image cannot be empty';
      }
      if (values.email && !emailReg.test(values.email)) {
        errors.email = 'Email is not available';
      }
      if (values.royalties) {
        if (!values.payout_wallet_address) {
          errors.payout_wallet_address = 'Royalties Address cannot be empty';
        }
        if (
          values.payout_wallet_address &&
          !addressReg.test(values.payout_wallet_address)
        ) {
          errors.payout_wallet_address = 'Royalties Address is not invalid';
        }
      }
      return errors;
    },
    onSubmit: async ({
      sensitive_status,
      presale_status,
      presale_time,
      ...values
    }) => {
      if (JSON.stringify(checkError) !== '{}') return;
      const sign_data = await sign();
      const obj = {
        wallet_address: userData?.wallet_address, // 用户id
        sign_data, // signToken
        sensitive_status: sensitive_status ? 2 : 1,
        presale_status: presale_status ? 2 : 1,
        presale_time:
          presale_status && presale_time
            ? Math.round(presale_time.getTime() / 1000)
            : Math.round(new Date().getTime() / 1000),
        ...values,
        white_list: [],
      };
      try {
        isEditing ? await editReq.runAsync(obj) : await addReq.runAsync(obj);
        toast({
          status: 'success',
          title: `${isEditing ? 'update' : 'create'} success`,
          variant: 'subtle',
        });
        router.push('/collection');
        // if(data === 'success') {
        // } else {
        //   toast({ status: 'error', title: data });
        // }
      } catch (e) {
        throw e;
      }
    },
  });

  useEffect(() => {
    const fetch = async (id: string) => {
      try {
        const { data } = await createApis.getCollectionInfo({
          customize_url: id,
        });
        setDetail(data);
        createForm.setValues({
          ...createForm.initialValues,
          ...data,
          sensitive_status: data.sensitive_status !== 1,
          presale_status: data.presale_status !== 1,
          presale_time:
            data.presale_status !== 1 && data.presale_time
              ? data.presale_time * 1000
              : undefined,
        } as MainFormValues);
      } catch (e) {
        throw e;
      }
    };
    if (isEditing && typeof router.query.id === 'string') {
      fetch(router.query.id);
    }
  }, []);

  const checkName = async () => {
    const { data } = await createApis.checkCollectionName({
      name: createForm.values.name,
    });
    if (data && checkError.name) {
      const obj = { ...checkError };
      delete obj.name;
      setCheckError(obj);
      return;
    }
    if (!data) {
      setCheckError((pre: any) => ({
        ...pre,
        name: 'The name is already taken.',
      }));
    }
  };

  useDebounceEffect(
    () => {
      if (
        !createForm.values.name ||
        (createForm.values.name === detail.name && isEditing)
      )
        return;
      checkName();
    },
    [createForm.values.name],
    { wait: 300 },
  );

  const checkUrl = async () => {
    const obj = { ...checkError };
    if (
      !createForm.values.customize_url ||
      createForm.values.customize_url === detail.customize_url
    ) {
      delete obj.customize_url;
      setCheckError(obj);
      return;
    }
    const { data } = await createApis.checkCollectionUrl({
      customize_url: createForm.values.customize_url,
    });
    if (data && checkError.customize_url) {
      delete obj.customize_url;
      setCheckError(obj);
      return;
    }
    if (!data) {
      setCheckError((pre: any) => ({
        ...pre,
        customize_url: 'The URL is already taken.',
      }));
    }
  };

  useDebounceEffect(
    () => {
      checkUrl();
    },
    [createForm.values.customize_url],
    { wait: 300 },
  );

  return (
    <>
      <Center flexDirection="column">
        <Heading pt={6} pb={12} fontSize="30px">
          Create a Collection
        </Heading>
        <form onSubmit={createForm.handleSubmit}>
          <Flex
            justify="space-between"
            w="full"
            flexDirection={{ base: 'column', lg: 'row' }}
            pl={40}
            pr={20}
          >
            <Box flex={1} maxW="656px" mr={{ md: 12 }}>
              <Stack spacing="20px">
                <FormControl
                  isRequired
                  isInvalid={
                    !!(
                      (createForm.errors.name && createForm.touched.name) ||
                      checkError.name
                    )
                  }
                >
                  <FormLabel mb={4}>Collection Name</FormLabel>
                  <Input {...createForm.getFieldProps('name')} />
                  {checkError.name ||
                  (createForm.errors.name && createForm.touched.name) ? (
                    <FormErrorMessage>
                      {createForm.errors.name || checkError.name}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText color="teal">
                      {createForm.values.name && 'This name is available.'}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl isInvalid={!!checkError.customize_url}>
                  <FormLabel mb={4}>URL on UneMeta</FormLabel>
                  <Input {...createForm.getFieldProps('customize_url')} />
                  {checkError.customize_url ? (
                    <FormErrorMessage>
                      {checkError.customize_url}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText color="teal">
                      {createForm.values.customize_url &&
                        'This URL is available.'}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel mb={2.5}>Description</FormLabel>
                  <FormHelperText mb={4}>
                    Provide a description for this collection! Markdown syntax
                    is supported.
                  </FormHelperText>
                  <Textarea {...createForm.getFieldProps('description')} />
                </FormControl>
                <FormControl>
                  <FormLabel mb={2.5}>Category</FormLabel>
                  <FormHelperText mb={4}>
                    Assign a category to the collection. This can help make it
                    more discoverable on UneMeta.
                  </FormHelperText>
                  <Select {...createForm.getFieldProps('category')}>
                    <option value={1}>ALL</option>
                    <option value={2}>Art</option>
                    <option value={3}>Trading Cards</option>
                    <option value={4}>Collectibles</option>
                    <option value={5}>Sports</option>
                    <option value={6}>Utility</option>
                    <option value={7}>Music</option>
                    <option value={8}>Games</option>
                    <option value={9}>Domains</option>
                    <option value={10}>Curated Drops</option>
                  </Select>
                </FormControl>
                <Stack spacing={2.5}>
                  <FormControl>
                    <FormLabel mb={4}>External Links</FormLabel>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="typo.black"
                        children={<MdWeb />}
                      />
                      <Input
                        placeholder="Website URL"
                        {...createForm.getFieldProps('site_link')}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="typo.black"
                        children={<FaDiscord />}
                      />
                      <Input
                        placeholder="Discord"
                        {...createForm.getFieldProps('discord_link')}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="typo.black"
                        children={<AiOutlineTwitter />}
                      />
                      <Input
                        placeholder="Twitter"
                        {...createForm.getFieldProps('twitter_link')}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="typo.black"
                        children={<MdInsertLink />}
                      />
                      <Input
                        placeholder="Medium"
                        {...createForm.getFieldProps('medium_link')}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="typo.black"
                        children={<AiFillInstagram />}
                      />
                      <Input
                        placeholder="Instagram"
                        {...createForm.getFieldProps('instagram_link')}
                      />
                    </InputGroup>
                  </FormControl>
                </Stack>
                <FormControl>
                  <FormLabel mb={4}>Email</FormLabel>
                  <Input
                    placeholder="Your Email"
                    {...createForm.getFieldProps('email')}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel mb={2.5}>Royalties</FormLabel>
                  <FormHelperText mb={4}>
                    Collect a fee when a user re-sells an item you originally
                    created. This is deducted from the final sale price and paid
                    monthly to a payout address of your choosing.
                  </FormHelperText>
                  <NumberInput
                    defaultValue={0}
                    precision={1}
                    step={1}
                    max={80}
                    min={0}
                  >
                    <NumberInputField
                      {...createForm.getFieldProps('royalties')}
                    />
                  </NumberInput>
                </FormControl>
                {!!createForm.values.royalties && (
                  <FormControl isRequired>
                    <FormLabel mb={4}>your payout wallet address</FormLabel>
                    <Input
                      placeholder="please enter an address,e.g 0xjju...or destination.eth"
                      {...createForm.getFieldProps('payout_wallet_address')}
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel mb={2.5}>Blockchain</FormLabel>
                  <FormHelperText mb={4}>
                    Select the blockchain where youd like new items from this
                    collection to be added by default.
                  </FormHelperText>
                  <Select {...createForm.getFieldProps('blockchain')}>
                    <option value={1}>Ethereum</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Payment tokens</FormLabel>
                  <FormHelperText mb={4}>
                    These tokens can be used to buy and sell your items.
                  </FormHelperText>
                  <Select {...createForm.getFieldProps('currency_type')}>
                    <option value={1}>ETH</option>
                    {/* <option value={2}>WETH</option> */}
                    <option value={3}>USDT</option>
                  </Select>
                </FormControl>
                {/* 敏感开关 */}
                <FormControl>
                  <FormLabel mb={0}>NSFW</FormLabel>
                  <Flex justify="space-between" align="center">
                    <FormHelperText>
                      Toggle on to show that this collection contains explicit
                      and sensitive content.
                    </FormHelperText>
                    <Switch {...createForm.getFieldProps('sensitive_status')} />
                  </Flex>
                </FormControl>
                {/* 预售开关 */}
                <Box>
                  <FormControl>
                    <FormLabel mb={0}>On sale regularly</FormLabel>
                    <Flex justify="space-between" align="center">
                      <FormHelperText>Set sales start time</FormHelperText>
                      <Switch {...createForm.getFieldProps('presale_status')} />
                    </Flex>
                  </FormControl>
                  {createForm.values.presale_status && (
                    <FormControl mt={4}>
                      <DatePicker
                        value={createForm.values.presale_time}
                        onChange={(v) =>
                          createForm.setFieldValue('presale_time', v)
                        }
                        showTime
                      />
                    </FormControl>
                  )}
                </Box>

                <FormControl>
                  <FormLabel>Reserve for specific buyer</FormLabel>
                  <FormHelperText mb={4}>
                    Whitelist for pre-sale, whitelist can be purchased before
                    the sale.
                  </FormHelperText>
                  <Center
                    w="300px"
                    h="100px"
                    mb={4}
                    rounded="lg"
                    border={
                      createForm.values.white_list ? '' : '2px dashed #D9D9D9'
                    }
                    color="#D9D9D9"
                  >
                    <Upload
                      value={createForm.values.white_list}
                      onChange={(v) =>
                        createForm.setFieldValue('white_list', v)
                      }
                    >
                      {renderUploadFile}
                    </Upload>
                  </Center>
                </FormControl>
              </Stack>
            </Box>
            <Stack spacing="30px" w="500px">
              <FormControl
                isRequired
                isInvalid={!!createForm.errors.logo_image}
              >
                <UploadImage
                  value={createForm.values.logo_image}
                  onChange={(v) => createForm.setFieldValue('logo_image', v)}
                  wrapperProps={{
                    mb: 4,
                  }}
                />
                <FormLabel mb={2.5}>Logo Image</FormLabel>
                <FormHelperText>
                  This image will also be used for navigation. 350 x 350
                  recommended.
                </FormHelperText>
                {createForm.touched.logo_image && (
                  <FormErrorMessage>
                    {createForm.errors.logo_image}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl>
                <UploadImage
                  value={createForm.values.featured_image}
                  onChange={(v) =>
                    createForm.setFieldValue('featured_image', v)
                  }
                  wrapperProps={{
                    w: '360px',
                    h: '240px',
                    mb: 4,
                  }}
                />
                <FormLabel mb={2.5}>Featured Image</FormLabel>
                <FormHelperText>
                  This image will be used to feature this collection on the
                  UneMeta homepage, in the category pages, or in other
                  promotional areas of UneMeta. 600 x 400 recommended.
                </FormHelperText>
              </FormControl>
              <FormControl>
                <UploadImage
                  value={createForm.values.banner_image}
                  onChange={(v) => createForm.setFieldValue('banner_image', v)}
                  wrapperProps={{
                    w: 'full',
                    h: '125px',
                    mb: 4,
                  }}
                />
                <FormLabel mb={2.5}>Banner Image</FormLabel>
                <FormHelperText>
                  This image will appear at the top of the collection’s page.
                  Avoid using too much text in this image, as the dimensions
                  will change depending on the viewing device. 1400 x 400
                  recommended.
                </FormHelperText>
              </FormControl>
            </Stack>
          </Flex>
          <Center py={24}>
            <Button
              type="submit"
              variant="primary"
              width="full"
              maxW="800px"
              h="60px"
              isLoading={addReq.loading || editReq.loading}
              isDisabled={addReq.loading || editReq.loading}
            >
              {isEditing ? 'Update' : 'Create Collection!'}
            </Button>
          </Center>
        </form>
      </Center>
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
      messages: await serverSideTranslations(locale, ['index']),
    },
  };
}
