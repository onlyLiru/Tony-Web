/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { useTranslations } from 'next-intl';
import { redirectLoginPage, serverSideTranslations } from '@/i18n';
import { UploadImage } from '@/features/Create';
import { useUserDataValue } from '@/store';
import {
  useToast,
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
  Switch,
  Button,
  IconButton,
  HStack,
  VStack,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import * as createApis from '@/services/create';
import { useRequest } from 'ahooks';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { JWT_HEADER_KEY } from '@/utils/jwt';

interface PropertyType {
  type: string;
  name: string;
}

interface MainFormValues {
  content: string; //image
  name: string; // name
  site_link?: string; //外部链接
  description?: string; //项目描述
  collection_id: number; //集合id
  collection_name?: string; //集合名称
  blockchain: number; //区块链 1:以太坊 2：ploygon
  supply_num: number; //供应数量
  properties: PropertyType[]; //特性
  unlockable_status: boolean; //解锁内容开关  1:无需解锁内容 2：有需解锁内容
  unlockable_content?: string; //需解锁内容
  sensitive_status: boolean; //敏感内容开关  1:没有敏感内容 2：有敏感内容
  sign_data?: string; //签名
  item_id?: string; // nft id
}

export default function CreateNft() {
  const router = useRouter();
  const query = router.query as Record<string, string>;
  const isEditing = query.type === 'edit';
  const t = useTranslations('index');
  const { sign } = useSignHelper();
  const userData = useUserDataValue();
  const toast = useToast();
  const [collectionList, setCollectionList] = useState<any[]>([]);

  const addReq = useRequest(createApis.createNft, { manual: true });
  const editReq = useRequest(createApis.updateNft, { manual: true });

  const createForm = useFormik<MainFormValues>({
    initialValues: {
      content: '', //image
      name: '', // name
      site_link: '', //外部链接
      description: '', //项目描述
      collection_id: 0, //集合id
      collection_name: '', //集合名称
      blockchain: 1, //区块链 1:以太坊 2：ploygon
      supply_num: 1, //供应数量
      properties: [], //特性
      unlockable_status: false, //解锁内容开关  1:无需解锁内容 2：有需解锁内容
      unlockable_content: '', //需解锁内容
      sensitive_status: false, //敏感内容开关  1:没有敏感内容 2：有敏感内容
    },
    validate: async (values) => {
      const errors: any = {};
      if (!values.name) {
        errors.name = 'Name cannot be empty';
      }
      if (!values.content) {
        errors.content = 'NFT content cannot be empty';
      }
      if (!values.supply_num) {
        errors.supply_num = 'supply num cannot be empty';
      }
      if (values.unlockable_status && !values.unlockable_content) {
        errors.unlockable_content = 'unlockable content is not available';
      }
      return errors;
    },
    onSubmit: async ({
      sensitive_status,
      unlockable_status,
      properties,
      collection_id,
      supply_num,
      ...values
    }) => {
      const sign_data = await sign();
      const submitData = {
        sign_data, // signToken
        sensitive_status: sensitive_status ? 2 : 1,
        unlockable_status: unlockable_status ? 2 : 1,
        properties: properties.filter((v) => v.name && v.type),
        ...values,
        collection_id: +collection_id,
        supply_num: +supply_num,
      };
      try {
        const { data } = isEditing
          ? await editReq.runAsync(submitData)
          : await addReq.runAsync(submitData);
        if (data === 'success') {
          toast({
            status: 'success',
            title: `${isEditing ? 'update' : 'create'} success`,
            variant: 'subtle',
          });
          if (isEditing) {
            router.back();
          } else {
            router.push(`/user/${userData?.wallet_address}`);
          }
        } else {
          toast({ status: 'error', title: data, variant: 'subtle' });
        }
      } catch (e) {
        toast({ status: 'error', title: 'create faild!', variant: 'subtle' });
        throw e;
      }
    },
  });

  useRequest(createApis.getCollectionList, {
    defaultParams: [{ customize_url: '' }],
    onSuccess: ({ data }) => {
      setCollectionList(data);
      if (!isEditing) {
        createForm.setValues({
          ...createForm.initialValues,
          collection_id: data[0].collection_id * 1,
          collection_name: data[0].collection_name,
        });
      }
    },
  });

  useEffect(() => {
    const fetchInfo = async (p: { item_id: number; customize_url: string }) => {
      try {
        const { data } = await createApis.getNftInfo(p);
        createForm.setValues({
          ...createForm.initialValues,
          ...data.item_info,
        } as MainFormValues);
      } catch (e) {
        throw e;
      }
    };
    if (
      isEditing &&
      typeof query.id === 'string' &&
      typeof query.collection === 'string'
    ) {
      fetchInfo({ item_id: Number(query.id), customize_url: query.collection });
    }
  }, []);

  const onPropertyAdd = () => {
    createForm.setFieldValue('properties', [
      ...createForm.values.properties,
      { type: '', name: '' },
    ]);
  };

  const onPropertyDelete = (index: number) => {
    const arr = createForm.values.properties.filter((v, i) => i !== index);
    createForm.setFieldValue('properties', arr);
  };

  return (
    <>
      <Center flexDirection="column">
        <Heading pt={6} pb={12} fontSize="30px">
          Create New Item
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
              <Stack spacing="30px">
                <FormControl
                  isRequired
                  isInvalid={
                    !!createForm.errors.name && createForm.touched.name
                  }
                >
                  <FormLabel htmlFor="name" mb={4}>
                    Item Name
                  </FormLabel>
                  <Input {...createForm.getFieldProps('name')} />
                  {createForm.touched.name && (
                    <FormErrorMessage>
                      {createForm.errors.name}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel mb={2.5}>External link</FormLabel>
                  <FormHelperText mb={4}>
                    Provide a link for more information about the item. This
                    external link will be included on the item detail page, so
                    everyone can click to learn more.
                  </FormHelperText>
                  <Input
                    placeholder="Website URL"
                    {...createForm.getFieldProps('site_link')}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel mb={2.5}>Description</FormLabel>
                  <FormHelperText mb={4}>
                    Write a description for your NFT! It will be included on the
                    item detail page. Markdown syntax is supported.
                  </FormHelperText>
                  <Textarea {...createForm.getFieldProps('description')} />
                </FormControl>
                <FormControl>
                  <FormLabel mb={2.5}>Collection</FormLabel>
                  <FormHelperText mb={4}>
                    Select the collection for which this item will appear in.
                  </FormHelperText>
                  <Select {...createForm.getFieldProps('collection_id')}>
                    {collectionList.map((v) => (
                      <option
                        key={v.collection_id}
                        value={Number(v.collection_id)}
                      >
                        {v.collection_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel mb={2.5}>Properties</FormLabel>
                  <FormHelperText mb={4}>
                    Add textual properties to the item. These properties will be
                    displayed as rectangular tags.
                  </FormHelperText>
                  <VStack align="flex-start">
                    {createForm.values.properties.map((v, i) => (
                      <HStack key={i} spacing={2.5} w="full">
                        <FormControl>
                          <HStack>
                            <FormLabel m={0}>Type</FormLabel>
                            <Input
                              {...createForm.getFieldProps(
                                `properties.${i}.type`,
                              )}
                            />
                          </HStack>
                        </FormControl>
                        <FormControl>
                          <HStack>
                            <FormLabel m={0}>Name</FormLabel>
                            <Input
                              {...createForm.getFieldProps(
                                `properties.${i}.name`,
                              )}
                            />
                          </HStack>
                        </FormControl>
                        <DeleteIcon onClick={() => onPropertyDelete(i)} />
                      </HStack>
                    ))}
                  </VStack>
                  <IconButton
                    aria-label="add Properties"
                    color="gray.400"
                    icon={<AddIcon />}
                    onClick={onPropertyAdd}
                  />
                </FormControl>
                <Box>
                  <FormControl>
                    <Flex justify="space-between" align="center">
                      <Box>
                        <FormLabel mb={2.5}>Unlockable Content</FormLabel>
                        <FormHelperText>
                          Toggle to add unlockable content that can only be
                          viewed by owner of the item.
                        </FormHelperText>
                      </Box>
                      <Switch
                        {...createForm.getFieldProps('unlockable_status')}
                      />
                    </Flex>
                  </FormControl>
                  {createForm.values.unlockable_status && (
                    <FormControl mt={4}>
                      <Textarea
                        placeholder="enter content"
                        {...createForm.getFieldProps('unlockable_content')}
                      />
                    </FormControl>
                  )}
                </Box>
                {/* 敏感开关 */}
                <FormControl>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <FormLabel mb={2.5}>NSFW</FormLabel>
                      <FormHelperText>
                        Toggle on to show that this collection contains explicit
                        and sensitive content.
                      </FormHelperText>
                    </Box>
                    <Switch {...createForm.getFieldProps('sensitive_status')} />
                  </Flex>
                </FormControl>
                <FormControl isInvalid={!!createForm.errors.supply_num}>
                  <FormLabel mb={2.5}>Total Supply</FormLabel>
                  <FormHelperText mb={4}>
                    Mint numerous copies of this item at no gas cost! So far,
                    only single mints are supported, but the feature is coming
                    soon! :)
                  </FormHelperText>
                  <NumberInput
                    {...createForm.getFieldProps('supply_num')}
                    precision={1}
                    min={1}
                  >
                    <NumberInputField
                      {...createForm.getFieldProps('supply_num')}
                    />
                  </NumberInput>
                  <FormErrorMessage>
                    {createForm.errors.supply_num}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel mb={4}>Blockchain</FormLabel>
                  <Select {...createForm.getFieldProps('blockchain')}>
                    <option value={1}>Etherem</option>
                  </Select>
                </FormControl>
              </Stack>
            </Box>
            <FormControl
              w="500px"
              isInvalid={!!createForm.errors.content}
              isRequired
            >
              <UploadImage
                value={createForm.values.content}
                onChange={(v) => createForm.setFieldValue('content', v)}
                wrapperProps={{
                  w: '500px',
                  h: '500px',
                  mb: 4,
                }}
              />
              <FormLabel mb={2.5}>
                Upload an Image, Video, Audio or 3D Model File
              </FormLabel>
              <FormHelperText>
                File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
                OGG, GLB, GLTF. Max file size: 100MB.
              </FormHelperText>
              {createForm.touched.content && (
                <FormErrorMessage>{createForm.errors.content}</FormErrorMessage>
              )}
            </FormControl>
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
              {isEditing ? 'Update' : 'Create your NFT!'}
            </Button>
          </Center>
        </form>
      </Center>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
  resolvedUrl,
}) => {
  if (!req.cookies?.[JWT_HEADER_KEY]) {
    // return redirectLoginPage({ locale, resolvedUrl });
    console.log('未登录不做重定向处理');
  }
  return {
    props: {
      messages: await serverSideTranslations(locale, ['index']),
    },
  };
};
