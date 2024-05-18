import { useTranslations } from 'next-intl';
import {
  AspectRatio,
  Box,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Stack,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputRightElement,
  Input,
  Flex,
  CloseButton,
  ModalFooter,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Image,
  InputLeftElement,
  useMediaQuery,
  FormLabel,
  ModalCloseButton,
} from '@chakra-ui/react';
import { CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import React, { useState, useRef } from 'react';
import { AssetImage } from '@/features/AssetItem';
import { Field, Form, Formik, FormikProps, FormikState } from 'formik';
import { DatePicker } from '@/features/DatePicker';
import { NftItemDataType } from '@/features/AssetItem';
import { useSwitchChain } from '@/hooks/useSwitchChain';

type SelectedNft = NftItemDataType & { form_sell_price?: string };
type PendingOrder = {
  bulkList: string[];
  time: any;
};

const PendingOrderModal = ({
  modalControl,
  openApproveModal,
  data,
  changeData,
  formData,
  changeFormData,
  refresh,
}: any) => {
  const { visitChain } = useSwitchChain();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { visitChainId, VisitChainLogo } = useSwitchChain();
  const formRef = useRef<FormikProps<PendingOrder>>(null);
  const ct = useTranslations('common');
  // 暂存点价格，当点击对勾后同步到所有的NFT上
  const [stashPrice, setStashPrice] = useState<'' | number>(0);
  const [stashDate, setStashDate] = useState<Date>();
  // 选中的条目，用于批量操作时使用
  const [selectedItemList, setSelectedItemList] = useState<Array<boolean>>([]);

  const changeAllPrice = (price?: number) => {
    formRef.current?.setFieldValue(
      'bulkList',
      formRef.current?.values?.bulkList?.map(() => price || stashPrice),
    );
  };

  // 把价格同步到选中的条目中
  const syncPrice = () => {
    formRef.current?.setFieldValue(
      'bulkList',
      formRef.current?.values?.bulkList?.map((_, index) => {
        return selectedItemList[index]
          ? stashPrice
          : formRef.current?.values.bulkList[index];
      }),
    );
  };

  // 把日期同步到选中的条目中
  const syncDate = () => {
    console.log(data);
  };

  const handleDelete = (index: number) => {
    // 改变选中数据 selectedNfts
    changeData(data.filter((v: SelectedNft, i: number) => i !== index));
    // 删除表单数据
    formRef.current?.setFieldValue(
      'bulkList',
      formRef.current?.values?.bulkList?.filter(
        (v: string, i: number) => i !== index,
      ),
    );
    // 更新选中的数据
    const tempSelectedItemList: Array<boolean> = JSON.parse(
      JSON.stringify(selectedItemList),
    );
    tempSelectedItemList.splice(index, 1);
    setSelectedItemList(tempSelectedItemList);
  };

  const onClose = () => {
    // 保存价格数据
    // changeData(
    //   data.map((v: SelectedNft, i: number) => ({
    //     ...v,
    //     form_sell_price: formRef.current?.values?.bulkList[i],
    //   })),
    // );
    // 保存时间  update:不保存时间，影响数据回显
    // changeFormData(formRef.current?.values.time);
    modalControl.onClose();
  };

  const onApproveComplete = () => {
    refresh();
  };

  return (
    <Modal
      isOpen={modalControl?.isOpen}
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        minW={{ base: 'full', md: '875px', sm: '360px' }}
        minH={{ base: 'full', md: '600px' }}
        m="auto"
      >
        {/* 标题 */}
        {isLargerThan768 && (
          <Flex p="8" w="full" justify={'space-between'}>
            <Heading fontSize={{ base: 'lg', md: '2xl' }}>
              Listing for Sale
            </Heading>
            <CloseButton size={{ base: 'sm', md: 'md' }} onClick={onClose} />
          </Flex>
        )}
        {!isLargerThan768 && <ModalCloseButton />}
        {/* 表格内容 */}
        <Formik
          initialValues={{
            bulkList: data?.map((v: SelectedNft) => v.form_sell_price || ''),
            time: formData,
          }}
          validate={(values) => {
            const errors: any = {};
            if (!values.bulkList.every((v: string) => v)) {
              errors.bulkList = 'required';
            }
            return errors;
          }}
          onSubmit={(values) => {
            // 打开授权弹窗
            openApproveModal({
              data: data.map((v: SelectedNft, i: number) => ({
                price: values.bulkList[i],
                endTime: values.time,
                collection: v.collection_address,
                tokenId: v.token_id,
                itemId: v.item_id,
                title: v.name,
              })),
              // cancel: () => modalControl.onOpen(),
              complete: () => onApproveComplete(),
            });
            onClose();
          }}
          innerRef={formRef}
        >
          {({ errors, touched, values }: FormikState<PendingOrder>) => (
            <Form>
              <Flex
                pt={{ base: 10, md: '0' }}
                h={{ base: '100vh', md: '600px' }}
                direction="column"
                justify="space-between"
              >
                {!isLargerThan768 && (
                  <>
                    <ModalHeader p={0}>
                      <Stack
                        justify="space-between"
                        w="full"
                        pl={{ base: '30px', md: '50px' }}
                        pr={{ base: '30px', md: '80px' }}
                        mb={{ base: '20px', md: '30px' }}
                        direction={{ base: 'column', md: 'row' }}
                      >
                        <FormLabel whiteSpace="nowrap">
                          {`${ct('list')} ${values.bulkList.length} ${ct(
                            'items',
                          )}`}
                        </FormLabel>
                        <InputGroup w={{ base: '95%', md: '227px' }}>
                          <InputLeftElement
                            pointerEvents="none"
                            color="typo.black"
                            children={
                              <Image
                                src="/images/common/eth.svg"
                                width="12px"
                                height="auto"
                              />
                            }
                          />
                          <Input
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setStashPrice(value);
                              changeAllPrice(value);
                            }}
                          />
                        </InputGroup>
                      </Stack>
                    </ModalHeader>
                    <ModalBody p={0}>
                      <VStack
                        spacing={{ base: '20px', md: 0 }}
                        mb="10px"
                        pl={{ base: '30px', md: '50px' }}
                        pr={{ base: '30px', md: '80px' }}
                      >
                        {values.bulkList.map((v: string, i: number) => (
                          <Stack
                            justify="space-between"
                            w="full"
                            key={i}
                            pos="relative"
                            h={{ base: 'auto', md: '80px' }}
                            direction={{ base: 'column', md: 'row' }}
                            align={{ base: 'flex-start', md: 'center' }}
                            spacing={{ base: 3.5, md: 0 }}
                          >
                            <Flex align="center" flex={1}>
                              <AspectRatio
                                ratio={1}
                                w={{ base: '20%', md: '60px' }}
                                minW="60px"
                                mr={4}
                              >
                                <AssetImage
                                  src={data[i].logo}
                                  srcSuffix="s=100"
                                />
                              </AspectRatio>
                              <Box mr={5}>
                                <Text
                                  w={{ base: 'full', md: '200px' }}
                                  fontSize="14px"
                                  color="primary.lightGray"
                                  noOfLines={1}
                                >
                                  {data[i].collection_name}
                                </Text>
                                <Box fontSize="sm" fontWeight="bold">
                                  {data[i].name}
                                </Box>
                              </Box>
                              <Box mr={5} w={{ base: '100px', md: '200px' }}>
                                <Box fontSize="14px" color="primary.lightGray">
                                  {ct('floorPrice')}
                                </Box>
                                <Flex>
                                  <Image
                                    src="/images/common/eth.svg"
                                    width="12px"
                                    height="auto"
                                    mr={2}
                                  />
                                  <Text>{data[i].floor_price}</Text>
                                </Flex>
                              </Box>
                            </Flex>
                            <FormControl
                              w={{ base: '95%', md: '227px' }}
                              isInvalid={
                                !formRef.current?.values.bulkList[i] &&
                                !!touched.bulkList &&
                                !![
                                  ...(touched.bulkList as unknown as boolean[]),
                                ][i]
                              }
                            >
                              <InputGroup pos="relative">
                                <InputLeftElement
                                  pointerEvents="none"
                                  color="typo.black"
                                  children={
                                    <Image
                                      src="/images/common/eth.svg"
                                      width="12px"
                                      height="auto"
                                    />
                                  }
                                />
                                <Field
                                  as={Input}
                                  pl={10}
                                  name={`bulkList[${i}]`}
                                />
                                <CloseButton
                                  h="40px"
                                  pos="absolute"
                                  right="-32px"
                                  top="center"
                                  color="typo.sec"
                                  onClick={() => handleDelete(i)}
                                />
                              </InputGroup>
                              {!!touched.bulkList &&
                                !![
                                  ...(touched.bulkList as unknown as boolean[]),
                                ][i] && (
                                  <FormErrorMessage>
                                    {errors.bulkList?.toString()}
                                  </FormErrorMessage>
                                )}
                            </FormControl>
                          </Stack>
                        ))}
                      </VStack>
                    </ModalBody>
                    <ModalFooter p={0}>
                      <FormControl>
                        <VStack
                          px={{ base: '30px', md: '50px' }}
                          py={{ base: '20px', md: '0' }}
                          h={{ base: 'auto', md: '110px' }}
                          justify="center"
                          align="flex-start"
                          boxShadow="0px 2px 8px rgba(20, 20, 31, 0.1)"
                        >
                          <FormHelperText fontSize="sm" mt={0}>
                            {ct('durationDesc')}
                          </FormHelperText>
                          <Stack
                            w="full"
                            spacing="20px"
                            direction={{ base: 'column', md: 'row' }}
                            justify="space-between"
                          >
                            <DatePicker
                              value={formRef.current?.values.time}
                              defaultValue={values.time}
                              onChange={(v) =>
                                formRef.current?.setFieldValue('time', v)
                              }
                            />
                            <Button
                              className="Mi010"
                              type="submit"
                              bg="primary.main"
                              color="white"
                              w={{ base: 'full', md: '200px' }}
                              rounded="lg"
                            >
                              {ct('list').toLocaleUpperCase()}
                            </Button>
                          </Stack>
                        </VStack>
                      </FormControl>
                    </ModalFooter>
                  </>
                )}
                {isLargerThan768 && (
                  <>
                    <ModalHeader p="0" pl="8" pr="8">
                      <Flex direction={{ base: 'column', md: 'row' }}>
                        <Stack align="center" w="full" mb="4" direction="row">
                          {/* 挂单N个商品提示 */}
                          <Text fontSize="md" whiteSpace="nowrap">
                            {`${ct('applyTo')} ${
                              selectedItemList.filter((item) => item).length
                            } ${ct('items')}`}
                          </Text>
                          <Flex w={{ base: '100%', md: 'auto' }}>
                            {/* 价格 */}
                            <InputGroup
                              w={{ base: '100%', md: '227px' }}
                              ml={{ base: '', md: '8 !important' }}
                            >
                              <InputRightElement
                                pointerEvents="none"
                                color="typo.black"
                                children={
                                  <Text pr="4">
                                    {visitChain?.nativeCurrency?.symbol?.toUpperCase()}
                                  </Text>
                                }
                              />
                              <Input
                                type="number"
                                value={stashPrice}
                                maxLength={15}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStashPrice(val !== '' ? Number(val) : '');
                                }}
                              />
                              <InputRightElement>
                                {/* {visitChainId} */}
                                {visitChainId === 97 || visitChainId === 56 ? (
                                  <Text>BNB</Text>
                                ) : (
                                  <Text>ETH</Text>
                                )}
                                {/* <VisitChainLogo.Local fontSize={'24px'} /> */}
                              </InputRightElement>
                            </InputGroup>
                            <IconButton
                              ml="2"
                              variant="outline"
                              aria-label="Done"
                              fontSize="20px"
                              isDisabled={Boolean(Number(stashPrice) <= 0)}
                              icon={<CheckIcon />}
                              onClick={syncPrice}
                            />
                          </Flex>
                        </Stack>
                        {/* 时间 */}
                        <Stack
                          ml={{ base: '', md: '16' }}
                          w="full"
                          direction={{ base: 'row', md: 'row' }}
                        >
                          <Box w={{ base: '95%', md: '227px' }}>
                            <DatePicker
                              value={formRef.current?.values.time}
                              defaultValue={values.time}
                              onChange={(v) => {
                                setStashDate(v);
                                formRef.current?.setFieldValue('time', v);
                              }}
                              showPickDate={false}
                            />
                          </Box>
                          {/* <IconButton
                            variant="outline"
                            aria-label="Done"
                            fontSize="20px"
                            icon={<CheckIcon />}
                            onClick={syncDate}
                          /> */}
                        </Stack>
                      </Flex>
                    </ModalHeader>
                    <ModalBody pt={8} pl={8} pr={8}>
                      <TableContainer>
                        <Table variant="simple" size="md">
                          <Thead>
                            <Tr>
                              <Th pl="2" pr="2">
                                <Checkbox
                                  size="lg"
                                  isChecked={
                                    selectedItemList.length ===
                                      values.bulkList.length &&
                                    selectedItemList.every((item) =>
                                      Boolean(item),
                                    )
                                  }
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    setSelectedItemList(
                                      val
                                        ? values.bulkList.map(() => true)
                                        : new Array(
                                            values.bulkList.length,
                                          ).fill(false),
                                    );
                                  }}
                                />
                              </Th>
                              <Th pl="2" pr="2">
                                Item
                              </Th>
                              <Th pl="2" pr="2" minW="200px">
                                Price
                              </Th>
                              {/* <Th pl="2" pr="2">
                                Duration
                              </Th> */}
                              <Th pl="2" pr="2"></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {values.bulkList.map((v: string, i: number) => (
                              <Tr key={i}>
                                <Td pl="2" pr="2">
                                  <Checkbox
                                    size="lg"
                                    isChecked={selectedItemList[i]}
                                    onChange={(e) => {
                                      let res = [...selectedItemList];
                                      // 先初始化列表
                                      if (res.length === 0) {
                                        res = new Array(
                                          values.bulkList.length,
                                        ).fill(false);
                                      }
                                      res[i] = Boolean(e.target.checked);
                                      setSelectedItemList(res);
                                    }}
                                  />
                                </Td>
                                <Td pl="2" pr="2">
                                  <Flex>
                                    <AspectRatio
                                      ratio={1}
                                      w={{ base: '20%', md: '60px' }}
                                      minW="60px"
                                      mr={4}
                                    >
                                      <AssetImage
                                        src={data[i].logo}
                                        srcSuffix="s=100"
                                        borderRadius="10px"
                                      />
                                    </AspectRatio>
                                    <Flex
                                      direction="column"
                                      justifyContent="center"
                                    >
                                      <Text fontWeight="bold">
                                        {data[i].name}
                                      </Text>
                                      <Text mt="6px">
                                        {data[i].collection_name}
                                      </Text>
                                    </Flex>
                                  </Flex>
                                </Td>
                                <Td pl="2" pr="2" minW="200px">
                                  <FormControl
                                    w={{ base: '95%', md: '227px' }}
                                    isInvalid={
                                      !formRef.current?.values.bulkList[i] &&
                                      !!touched.bulkList &&
                                      !![
                                        ...(touched.bulkList as unknown as boolean[]),
                                      ][i]
                                    }
                                  >
                                    <InputGroup pos="relative">
                                      <Field
                                        as={Input}
                                        name={`bulkList[${i}]`}
                                      />
                                      {/* <InputRightElement
                                        pointerEvents="none"
                                        color="typo.black"
                                        children={
                                          <VisitChainLogo.Local fontSize={24} />
                                        }
                                      /> */}
                                      <InputRightElement>
                                        {/* {visitChainId} */}
                                        <Text pr="4">
                                            {visitChain?.nativeCurrency?.symbol?.toUpperCase()}
                                          </Text>
                                        {/* <VisitChainLogo.Local
                                          fontSize={'24px'}
                                        /> */}
                                      </InputRightElement>
                                    </InputGroup>
                                    {!!touched.bulkList &&
                                      !![
                                        ...(touched.bulkList as unknown as boolean[]),
                                      ][i] && (
                                        <FormErrorMessage>
                                          {errors.bulkList?.toString()}
                                        </FormErrorMessage>
                                      )}
                                  </FormControl>
                                </Td>
                                {/* <Td pl="2" pr="2">
                                  <DatePicker
                                    value={formRef.current?.values.time}
                                    defaultValue={values.time}
                                    onChange={(v) =>
                                      formRef.current?.setFieldValue('time', v)
                                    }
                                    showPickDate={false}
                                  />
                                </Td> */}
                                <Td pl="2" pr="2">
                                  <IconButton
                                    variant="ghost"
                                    aria-label="Done"
                                    fontSize="20px"
                                    icon={<DeleteIcon />}
                                    onClick={() => handleDelete(i)}
                                  />
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </ModalBody>
                    <ModalFooter pr={8} pb={8}>
                      <Button
                        w="100px"
                        h="48px"
                        variant="outline"
                        size="lg"
                        borderRadius="8px"
                        border="1px solid rgba(0,0,0,0.2)"
                        onClick={onClose}
                      >
                        {ct('cancel')}
                      </Button>
                      <Button
                        w="100px"
                        h="48px"
                        colorScheme="teal"
                        variant="outline"
                        ml="4"
                        type="submit"
                        size="lg"
                        borderRadius="8px"
                        background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                        border="none"
                        color="white"
                        // 仅仅为了覆盖hover和active的样式，没有额外作用
                        _hover={{ backgroundColor: 'none' }}
                        _active={{ backgroundColor: 'none' }}
                      >
                        {ct('list').toLocaleUpperCase()}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </Flex>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default PendingOrderModal;
