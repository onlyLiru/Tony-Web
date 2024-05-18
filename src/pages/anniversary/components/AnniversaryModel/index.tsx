import React, {
  forwardRef,
  useEffect,
  useMemo,
  useImperativeHandle,
  useState,
} from 'react';
// eslint-disable-next-line no-restricted-imports
import Select from '@/features/Select/Select';
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  Button,
  Heading,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
  Link,
  Text,
  Image,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { CheckCircleIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import * as pointsApi from '@/services/points';
export type TipsModalRef = {
  open: () => void;
};

export type InfoModalRef = {
  open: () => void;
};

export type CfxModalRef = {
  open: () => void;
};

type tProps = {
  callback: () => void;
};

export const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

const InfoModal = forwardRef((props: tProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('anniversary');
  const [validate, setValidate] = useState(true);
  const [fromValidate, setFromValidate] = useState(true);
  const [step, setStep] = useState(1);
  const [infoData, setInfoData] = useState({
    amount: 0,
    reward_status: false,
  });
  // Japan
  // Taiwan
  // Hong Kong
  // Macau
  // Mainland China
  // The United States of America
  // Others
  const list = [
    { label: 'Japan', value: 'Japan' },
    // { label: 'Taiwan', value: 'Taiwan' },
    // { label: 'Hong Kong', value: 'Hong Kong' },
    // { label: 'Macau', value: 'Macau' },
    { label: 'Mainland China', value: 'Mainland China' },
    // {
    //   label: 'The United States of America',
    //   value: 'The United States of America',
    // },
    { label: 'Others', value: 'Others' },
  ];
  const list1 = [
    { label: 'Japan', value: 'Japan' },
    { label: 'Mainland China', value: 'Mainland China' },
  ];
  const [state, setState] = useState({
    inAddress: '',
    address: '',
    prizeType: '',
    wallet: '',
    country: '',
    firstName: '',
    lastName: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });
  const prizeList = useMemo(() => {
    console.log(state.inAddress);
    if (state.inAddress === 'Others') {
      return [
        {
          label: 'USDT',
          value: '3',
        },
      ];
    } else {
      return [
        {
          label: t('infoModal.giftBox'),
          value: '2',
        },
        {
          label: 'USDT',
          value: '3',
        },
      ];
    }
  }, [state.inAddress]);
  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
      setValidate(true);
      setStep(1);
    },
  }));

  const toast = useToast();
  const {
    inAddress,
    prizeType,
    wallet,
    address,
    firstName,
    country,
    lastName,
    city,
    province,
    postalCode,
    phone,
  } = state;

  const updateValue = (key: string, value: string) => {
    setState({
      ...state,
      [key]: value,
    });
    reg.test(value) && setValidate(true);
  };
  const updateValueFrom = (key: string, value: string) => {
    setState({
      ...state,
      [key]: value,
    });
  };
  useEffect(() => {
    console.log(state.country);
    if (
      !(
        state.country &&
        state.firstName &&
        state.lastName &&
        state.address &&
        state.city &&
        state.province &&
        state.postalCode &&
        state.phone
      )
    ) {
      setFromValidate(false);
    } else {
      setFromValidate(true);
    }
  }, [state]);

  const handleSelectChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      inAddress: value,
      country: value,
    }));
    value && setValidate(true);
  };
  const handleCountryChange = (value: string) => {
    setState((prevState) => ({ ...prevState, country: value }));
    value && setValidate(true);
  };

  const handleSelectTypeChange = (value: string) => {
    setState((prevState) => ({ ...prevState, prizeType: value }));
  };

  const handleEdit = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (prizeType === '3') {
      // 校验钱包是否填写
      if (!wallet) {
        setValidate(false);
        return;
      }
    }
    if (!inAddress) {
      setValidate(false);
      return;
    }
    submitInfo();
  };

  // 提交信息
  const rewardInfo = async () => {
    try {
      const { data } = await pointsApi.rewardInfo();
      console.log(data, 'asdasd');
      setInfoData(data);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useEffect(() => {
    rewardInfo();
  }, []);

  const exchangeSpecial = async () => {
    let dataJson = '';
    if (step === 1) {
      dataJson = JSON?.stringify({
        inAddress: state.inAddress,
        prizeType: state.prizeType,
        wallet: state.wallet,
      });
    } else {
      if (
        !(
          state.country &&
          state.firstName &&
          state.lastName &&
          state.address &&
          state.city &&
          state.province &&
          state.postalCode &&
          state.phone
        )
      ) {
        setFromValidate(false);
        return;
      }
      dataJson = JSON?.stringify({
        country: state.country,
        firstName: state.firstName,
        lastName: state.lastName,
        address: state.address,
        city: state.city,
        province: state.province,
        postalCode: state.postalCode,
        phone: state.phone,
      });
    }
    try {
      const { data } = await pointsApi.exchangeSpecialInfo(9999, dataJson);
      if (data.status) {
        setStep(3);
        // 兑换成功以后，页面刷新一下Special Rewards列表，以便展示新的库存
        props.callback && props.callback?.();
      }
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  // 提交信息
  const submitInfo = async () => {
    if (prizeType !== '3') {
      setStep(2);
    } else {
      exchangeSpecial();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent
          maxW={{ md: '550px' }}
          w={{ md: '550px', base: 'full' }}
          fontFamily={'Inter'}
          mx={{ md: 'auto', base: '4vw' }}
        >
          <ModalBody p={0}>
            <div className="p-4 md:p-8">
              {step === 1 ? (
                <>
                  <div className="text-xl md:text-2xl font-medium w-[423px]">
                    {t('infoModal.title')}
                  </div>
                  {prizeType === '3' ? (
                    <>
                      {!wallet && (
                        <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                          {t('infoModal.desc8')}
                        </div>
                      )}
                    </>
                  ) : null}
                  <div className="mb-2 mt-4 text-sm md:text-base">
                    {t('infoModal.formTitle2')}
                  </div>
                  <Select
                    placeholder={t('infoModal.desc2')}
                    className={`${!inAddress ? 'border-[#FE4064]' : ''}`}
                    data={list}
                    defaultValue={inAddress}
                    handleSelectChange={handleSelectChange}
                  />
                  <div className="mb-2 mt-4 text-sm md:text-base">
                    {t('infoModal.formTitle3')}
                  </div>
                  <Select
                    placeholder={t('infoModal.desc7')}
                    className={`${!prizeType ? 'border-[#FE4064]' : ''}`}
                    data={prizeList}
                    defaultValue={prizeType}
                    handleSelectChange={handleSelectTypeChange}
                  />
                  {prizeType && (
                    <Text fontSize="12px">({infoData?.amount}/200)</Text>
                  )}

                  {state.prizeType === '3' ? (
                    <>
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {t('infoModal.walletAddress')}
                      </div>
                      <input
                        placeholder={t('infoModal.desc8')}
                        className={`form-input ${
                          wallet ? '' : 'border-[#FE4064]'
                        }`}
                        value={wallet}
                        onChange={(e) => updateValue('wallet', e.target.value)}
                      />
                    </>
                  ) : null}
                  <Button
                    isDisabled={infoData?.amount <= 0 ? true : false}
                    bg="#FB9D42"
                    w={'100%'}
                    py="12px"
                    mt="40px"
                    borderColor={'#FB9D42'}
                    _hover={{
                      bg: '#FB9D42',
                    }}
                    color={'#000'}
                    onClick={handleSubmit}
                  >
                    {state.prizeType === '3' ? t('infoModal.submit') : 'Next'}
                  </Button>
                </>
              ) : step === 2 ? (
                <>
                  <div className="text-xl md:text-2xl font-medium">
                    {t('infoModal.content1')}
                  </div>
                  <>
                    {!fromValidate && (
                      <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                        {t('infoModal.desc8')}
                      </div>
                    )}
                  </>
                  <div className="mb-2 mt-4 text-sm md:text-base">
                    {t('infoModal.content2')}
                  </div>
                  <Select
                    placeholder={'Please Select'}
                    className={`${!country ? 'border-[#FE4064]' : ''}`}
                    data={list1}
                    defaultValue={country}
                    handleSelectChange={handleCountryChange}
                  />
                  <Box display="flex">
                    <Box w="50%" mr="20px">
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {t('infoModal.firstName')}
                      </div>
                      <input
                        placeholder={t('infoModal.desc9')}
                        value={firstName}
                        // className={`form-input`}
                        className={`form-input ${
                          firstName ? '' : 'border-[#FE4064]'
                        }`}
                        onChange={(e) =>
                          updateValueFrom('firstName', e.target.value)
                        }
                      />
                    </Box>
                    <Box w="50%">
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {t('infoModal.lasttName')}
                      </div>
                      <input
                        placeholder={t('infoModal.desc9')}
                        value={lastName}
                        className={`form-input ${
                          lastName ? '' : 'border-[#FE4064]'
                        }`}
                        onChange={(e) =>
                          updateValueFrom('lastName', e.target.value)
                        }
                      />
                    </Box>
                  </Box>
                  <div className="mb-2 text-sm md:text-base mt-4">
                    {t('infoModal.content3')}
                  </div>
                  <input
                    placeholder={t('infoModal.desc9')}
                    value={address}
                    className={`form-input ${
                      address ? '' : 'border-[#FE4064]'
                    }`}
                    onChange={(e) => updateValueFrom('address', e.target.value)}
                  />

                  <Box display="flex">
                    <Box w="33%" mr="20px">
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {t('infoModal.content4')}
                      </div>
                      <input
                        placeholder={t('infoModal.desc9')}
                        value={city}
                        className={`form-input ${
                          city ? '' : 'border-[#FE4064]'
                        }`}
                        onChange={(e) =>
                          updateValueFrom('city', e.target.value)
                        }
                      />
                    </Box>
                    <Box w="33%" mr="20px">
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {t('infoModal.content5')}
                      </div>
                      <input
                        placeholder={t('infoModal.desc9')}
                        value={province}
                        className={`form-input ${
                          province ? '' : 'border-[#FE4064]'
                        }`}
                        onChange={(e) =>
                          updateValueFrom('province', e.target.value)
                        }
                      />
                    </Box>
                    <Box w="33%">
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {t('infoModal.content6')}
                      </div>
                      <input
                        placeholder={t('infoModal.desc9')}
                        value={postalCode}
                        className={`form-input ${
                          postalCode ? '' : 'border-[#FE4064]'
                        }`}
                        onChange={(e) =>
                          updateValueFrom('postalCode', e.target.value)
                        }
                      />
                    </Box>
                  </Box>
                  <div className="mb-2 text-sm md:text-base mt-4">
                    {t('infoModal.content7')}
                  </div>
                  <input
                    placeholder={t('infoModal.desc9')}
                    value={phone}
                    className={`form-input ${phone ? '' : 'border-[#FE4064]'}`}
                    onChange={(e) => updateValueFrom('phone', e.target.value)}
                  />

                  <Button
                    bg="#FB9D42"
                    w={'100%'}
                    py="12px"
                    mt="40px"
                    borderColor={'#FB9D42'}
                    _hover={{
                      bg: '#FB9D42',
                    }}
                    color={'#000'}
                    onClick={() => exchangeSpecial()}
                  >
                    {t('infoModal.submit')}
                  </Button>
                </>
              ) : (
                <div className="py-8">
                  <div className="text-center my-4">
                    <Image
                      className="m-auto"
                      src={'/images/login/DIanmond.png'}
                    ></Image>
                  </div>
                  <div className="text-xl md:text-2xl font-medium m-auto text-center w-[400px]">
                    {t('infoModal.success')}
                  </div>
                  <div className="text-sm md:text-base  px-3 py-1.5   m-auto   w-[422px] text-center">
                    {t('infoModal.successw')}
                  </div>
                  <Box display="flex" justifyContent="center">
                    <Button
                      bg="#FB9D42"
                      w={'422px'}
                      py="12px"
                      mt="20px"
                      borderColor={'#FB9D42'}
                      _hover={{
                        bg: '#FB9D42',
                      }}
                      color={'#000'}
                      onClick={onClose}
                    >
                      ok
                    </Button>
                  </Box>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalCloseButton
            color={'#B5B5B5'}
            top={{ md: '10px', base: '-2px' }}
            right={{ md: '10px', base: '0' }}
          />
        </ModalContent>
      </Modal>
    </>
  );
});
export default InfoModal;
