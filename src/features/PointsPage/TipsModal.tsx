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
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { CheckCircleIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import * as pointsApi from '@/services/points';
import { type } from 'os';

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
  type: number;
  id?: number;
  specialType?: number;
  info: any;
};

export const TipsModal = forwardRef((props: tProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('points');
  const ct = useTranslations('common');

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent
          maxW={{ md: '500px' }}
          w={{ md: '500px', base: 'full' }}
          fontFamily={'Inter'}
          mx={{ md: 'auto', base: '4vw' }}
        >
          <ModalBody p={0}>
            <Box p={{ md: '33px 25px 20px', base: '36px 15px 20px' }}>
              <Heading
                fontSize={'16px'}
                fontWeight={'600'}
                mb={'10px'}
                lineHeight={'19px'}
                color={'#14141F'}
              >
                {t('tipsModal.title')}
              </Heading>
              <Box
                color={'#8C8C8C'}
                lineHeight={{ md: '19px', base: '16px' }}
                fontSize={{ md: '16px', base: '13px' }}
                dangerouslySetInnerHTML={{
                  __html: props.type === 3 ? t.raw('tipsModal.content') : '',
                }}
              ></Box>
              <Box
                color={'#DF4949'}
                mt={'24px'}
                fontSize={{ md: '16px', base: '13px' }}
                lineHeight={{ md: '19px', base: '16px' }}
              >
                {t('tipsModal.dec')}
              </Box>
              <Flex
                mt={{ md: '70px', base: '30px' }}
                justify={{ md: 'flex-end', base: 'center' }}
              >
                <Button
                  fontSize={{ md: '16px', base: '15px' }}
                  w={{ md: '180px', base: '240px' }}
                  h={{ md: '48px', base: '40px' }}
                  color={'#FFFFFF'}
                  bg={'#14141F'}
                  fontWeight={'700'}
                  rounded={{ md: '8px', base: '4px' }}
                  onClick={() => {
                    onClose();
                    props.callback?.();
                  }}
                  _hover={{ bg: '#14141F', opacity: 0.8 }}
                >
                  {ct('confirm')}
                </Button>
              </Flex>
            </Box>
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

export const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

export const InfoModal = forwardRef((props: tProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('points');
  const [validate, setValidate] = useState(true);
  const [step, setStep] = useState(1);
  // Japan
  // Taiwan
  // Hong Kong
  // Macau
  // Mainland China
  // The United States of America
  // Others
  const list = [
    { label: 'Japan', value: 'Japan' },
    { label: 'Taiwan', value: 'Taiwan' },
    { label: 'Hong Kong', value: 'Hong Kong' },
    { label: 'Macau', value: 'Macau' },
    { label: 'Mainland China', value: 'Mainland China' },
    {
      label: 'The United States of America',
      value: 'The United States of America',
    },
    { label: 'Others', value: 'Others' },
  ];
  const [state, setState] = useState({
    email: '',
    address: '',
    prizeType: '',
    wallet: '',
    uid: '',
  });
  const prizeList = useMemo(() => {
    if (state.address === 'Japan') {
      return [
        {
          label: 'Email Address',
          value: '2',
        },
        {
          label: 'Yuliverse',
          value: '5',
        },
        {
          label: 'Gift Card',
          value: '6',
        },
        {
          label: 'UID',
          value: '7',
        },
      ];
    }
    return [
      {
        label: 'Email Address',
        value: '2',
      },
      {
        label: 'USDT',
        value: '3',
      },
      {
        label: 'Yuliverse',
        value: '5',
      },
      {
        label: 'Gift Card',
        value: '6',
      },
      {
        label: 'UID',
        value: '7',
      },
    ];
  }, [state.address]);
  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
      setValidate(true);
      if (reg.test(email) && address) {
        setStep(2);
      } else {
        setStep(1);
      }
    },
  }));

  const toast = useToast();
  const { email, address, prizeType, wallet, uid } = state;

  const updateValue = (key: string, value: string) => {
    setState({
      ...state,
      [key]: value,
    });
    reg.test(value) && address && setValidate(true);
  };

  const handleSelectChange = (value: string) => {
    setState((prevState) => ({ ...prevState, address: value }));
    // //日本只能选择亚马逊card
    // if (value === 'Japan') {
    //   handleSelectTypeChange('2')
    //   setState((prevState) => ({ ...prevState, prizeType: '2' }));
    // }
    reg.test(email) && value && setValidate(true);
  };

  const handleSelectTypeChange = (value: string) => {
    setState((prevState) => ({ ...prevState, prizeType: value }));
    // reg.test(email) && value && setValidate(true);
  };

  const handleEdit = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (prizeType === '2') {
      // 校验email
      if (!reg.test(email)) {
        setValidate(false);
        return;
      }
    }
    if (prizeType === '3') {
      // 校验钱包是否填写
      if (!wallet) {
        setValidate(false);
        return;
      }
    }
    if (!address) {
      setValidate(false);
      return;
    }
    if (prizeType === '7') {
      // 校验uid是否填写
      if (!uid) {
        setValidate(false);
        return;
      }
    }
    submitInfo();
  };

  // 获取邮箱地址信息
  const getInfo = async () => {
    const { data } = await pointsApi.getUserInfo();
    setState((prevState) => ({
      ...prevState,
      ...{
        email: data.email,
        address: data.address,
        wallet: data.wallet,
        prizeType: '2',
      },
    }));
    if (data.email && data.address) {
      setStep(2);
    }
  };

  const exchangeSpecial = async () => {
    try {
      const { data } = await pointsApi.exchangeSpecial(
        props.id ?? 0,
        Number(prizeType),
        props.specialType as number,
      );
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
    try {
      const { data } = await pointsApi.submitUserInfo(
        address,
        email,
        wallet,
        Number(prizeType),
      );
      if (data.status) {
        setStep(2);
      }
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        {step}
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
                  <div className="text-xl md:text-2xl font-medium">
                    {t('infoModal.title')}
                  </div>
                  <div className="mt-4 text-slate-500">
                    {t('infoModal.inputBrc20')}
                  </div>
                  {prizeType === '2' ? (
                    <>
                      {!validate && (
                        <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                          {!reg.test(email)
                            ? t('infoModal.desc')
                            : t('infoModal.desc2')}
                        </div>
                      )}
                    </>
                  ) : prizeType === '6' ? (
                    <>
                      {!wallet && (
                        <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                          {t('infoModal.descBnb')}
                        </div>
                      )}
                    </>
                  ) : prizeType === '7' ? (
                    <>
                      {!uid && (
                        <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                          {t('infoModal.descUid')}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {!wallet && (
                        <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                          {t('infoModal.desc8')}
                        </div>
                      )}
                    </>
                  )}
                  <div className="mb-2 mt-4 text-sm md:text-base">
                    {t('infoModal.formTitle2')}
                  </div>
                  <Select
                    placeholder={t('infoModal.desc2')}
                    className={`${!address ? 'border-[#FE4064]' : ''}`}
                    data={list}
                    defaultValue={address}
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
                  {state.prizeType === '2' ? (
                    <>
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {t('infoModal.formTitle1')}
                      </div>
                      <input
                        placeholder={t('infoModal.desc1')}
                        className={`form-input ${
                          !reg.test(email) ? 'border-[#FE4064]' : ''
                        }`}
                        value={email}
                        onChange={(e) => updateValue('email', e.target.value)}
                      />
                    </>
                  ) : state.prizeType === '6' ? (
                    <>
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {t('infoModal.walletAddress')}
                      </div>
                      <input
                        placeholder={t('infoModal.descBnb')}
                        className={`form-input ${
                          wallet ? '' : 'border-[#FE4064]'
                        }`}
                        value={wallet}
                        onChange={(e) => updateValue('wallet', e.target.value)}
                      />
                    </>
                  ) : state.prizeType === '7' ? (
                    <>
                      <div className="mb-2 text-sm md:text-base mt-4">
                        {'UID'}
                      </div>
                      <input
                        placeholder={t('infoModal.descUid')}
                        className={`form-input ${
                          uid ? '' : 'border-[#FE4064]'
                        }`}
                        value={uid}
                        onChange={(e) => updateValue('uid', e.target.value)}
                      />
                    </>
                  ) : (
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
                  )}
                  <button className="form-btn mt-4" onClick={handleSubmit}>
                    {t('infoModal.submit')}
                  </button>
                </>
              ) : step === 2 ? (
                <>
                  <div className="text-xl md:text-2xl font-medium">
                    {t('infoModal.content1')}
                  </div>
                  <Box className="mt-4 text-slate-500">
                    {t('infoModal.inputBrc20')}
                  </Box>
                  <div className="my-6">
                    {prizeType === '2' ? (
                      <>
                        <div className="flex mb-1">
                          <div>{t('infoModal.desc3')}：</div>
                          <div className="text-[#544AEC]">
                            Playbux Email Address
                          </div>
                        </div>
                        <div className="flex mb-1">
                          <div>{t('infoModal.desc4')}：</div>
                          <div className="text-[#544AEC]">{email}</div>
                        </div>
                      </>
                    ) : prizeType === '3' ? (
                      <>
                        <div className="flex mb-1">
                          <div>{t('infoModal.desc3')}：</div>
                          <div className="text-[#544AEC]">USDT</div>
                        </div>
                        <div className="flex mb-1">
                          <div>{t('infoModal.walletAddress')}：</div>
                          <div className="text-[#544AEC]">{wallet}</div>
                        </div>
                      </>
                    ) : prizeType === '6' ? (
                      <>
                        <div className="flex mb-1">
                          <div>{t('infoModal.desc3')}：</div>
                          <div className="text-[#544AEC]">Gift Card</div>
                        </div>
                        <div className="flex mb-1">
                          <div>{t('infoModal.walletAddress')}：</div>
                          <div className="text-[#544AEC]">{wallet}</div>
                        </div>
                      </>
                    ) : prizeType === '7' ? (
                      <>
                        <div className="flex mb-1">
                          <div>{t('infoModal.desc3')}：</div>
                          <div className="text-[#544AEC]">UID</div>
                        </div>
                        <div className="flex mb-1">
                          <div>UID：</div>
                          <div className="text-[#544AEC]">{uid}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex mb-1">
                          <div>{t('infoModal.desc3')}：</div>
                          <div className="text-[#544AEC]">Yuliverse</div>
                        </div>
                        <div className="flex mb-1">
                          <div>{t('infoModal.walletAddress')}：</div>
                          <div className="text-[#544AEC]">{wallet}</div>
                        </div>
                      </>
                    )}
                    <div className="flex">
                      <div>{t('infoModal.desc5')}：</div>
                      {address === 'Japan' ? (
                        <Popover trigger={'click'} placement={'bottom'}>
                          <PopoverTrigger>
                            <div className="text-[#544AEC]">
                              <span className="mr-1">{address}</span>
                              <QuestionOutlineIcon />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            border={0}
                            boxShadow={'xl'}
                            p={4}
                            rounded={'xl'}
                            w="auto"
                          >
                            <div className="w-60">
                              {t('infoModal.tips', { address })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div className="text-[#544AEC]">{address}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      className="form-btn border border-[rgba(0,0,0,.2)] bg-white text-black"
                      onClick={handleEdit}
                    >
                      {t('infoModal.edit')}
                    </button>
                    <button
                      className="form-btn"
                      onClick={() => exchangeSpecial()}
                    >
                      {t('infoModal.submit2')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="text-center my-4">
                    <CheckCircleIcon className="!w-12 !h-12 !text-[#2BE174] m-auto" />
                  </div>
                  <div className="text-xl md:text-2xl font-medium text-center">
                    {prizeType === '2'
                      ? t('infoModal.success')
                      : t('infoModal.successw')}
                  </div>
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

export const CfxModal = forwardRef((props: tProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('points');
  const [validate, setValidate] = useState(true);
  const [step, setStep] = useState(1);
  // Japan
  // Taiwan
  // Hong Kong
  // Macau
  // Mainland China
  // The United States of America
  // Others
  const list = [
    { label: 'Japan', value: 'Japan' },
    { label: 'Taiwan', value: 'Taiwan' },
    { label: 'Hong Kong', value: 'Hong Kong' },
    { label: 'Macau', value: 'Macau' },
    { label: 'Mainland China', value: 'Mainland China' },
    {
      label: 'The United States of America',
      value: 'The United States of America',
    },
    { label: 'Others', value: 'Others' },
  ];
  const [state, setState] = useState({
    email: '',
    address: '',
    wallet: '',
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
      setValidate(true);
      if (reg.test(email) && address) {
        setStep(2);
      } else {
        setStep(1);
      }
    },
  }));

  const toast = useToast();
  const { email, address, wallet } = state;

  const updateValue = (key: string, value: string) => {
    setState({
      ...state,
      [key]: value,
    });
    reg.test(value) && address && setValidate(true);
  };

  const handleSelectChange = (value: string) => {
    setState((prevState) => ({ ...prevState, address: value }));
    reg.test(email) && value && setValidate(true);
  };

  const handleEdit = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    // 校验email
    if (!reg.test(email)) {
      setValidate(false);
      return;
    }

    // 校验钱包是否填写
    if (!wallet) {
      setValidate(false);
      return;
    }

    if (!address) {
      setValidate(false);
      return;
    }
    submitInfo();
  };

  // 获取邮箱地址信息
  const getInfo = async () => {
    const { data } = await pointsApi.getUserInfo();
    setState((prevState) => ({
      ...prevState,
      ...{
        email: data.email,
        address: data.address,
        wallet: data.wallet,
      },
    }));
    if (data.email && data.address) {
      setStep(2);
    }
  };

  const exchangeSpecial = async () => {
    try {
      const { data } = await pointsApi.exchangeSpecial(
        props.id ?? 0,
        4, //type为4时 兑换cfx
        props.specialType as number,
      );
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
    try {
      const { data } = await pointsApi.submitUserInfo(
        address,
        email,
        wallet,
        4,
      );
      if (data.status) {
        setStep(2);
      }
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

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
                  <div className="text-xl md:text-2xl font-medium">
                    {t('cfxModal.title')}
                  </div>
                  <div className="opacity-50 mt-4 mb-4 text-sm md:text-base">
                    {t('cfxModal.tips')}
                  </div>
                  <>
                    {!validate && !reg.test(email) ? (
                      <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                        {t('cfxModal.wrongEmail')}
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                  <>
                    {!validate && !address ? (
                      <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                        {t('cfxModal.regionInput')}
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                  <>
                    {!validate && !wallet ? (
                      <div className="text-sm md:text-base text-[#FF0030] bg-[rgba(255,0,48,0.17)] rounded-lg px-3 py-1.5 mb-6 text-center">
                        {t('cfxModal.walletInput')}
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                  <div className="mb-2 mt-4 text-sm md:text-base">
                    {t('cfxModal.yourRegion')}
                  </div>
                  <Select
                    placeholder={t('cfxModal.regionInput')}
                    className={`${
                      !address && !validate ? 'border-[#FE4064]' : ''
                    }`}
                    data={list}
                    defaultValue={address}
                    handleSelectChange={handleSelectChange}
                  />
                  <>
                    <div className="mb-2 text-sm md:text-base mt-4">
                      {t('cfxModal.yourEmail')}
                    </div>
                    <input
                      placeholder={t('cfxModal.emailInput')}
                      className={`form-input ${
                        !reg.test(email) && !validate ? 'border-[#FE4064]' : ''
                      }`}
                      value={email}
                      onChange={(e) => updateValue('email', e.target.value)}
                    />
                  </>
                  <>
                    <div className="mb-2 text-sm md:text-base mt-4">
                      {t('cfxModal.walletAddress')}
                      <Text>
                        ({t('cfxModal.walletTips')}
                        <Link
                          isExternal
                          color="teal.500"
                          href="https://doc.confluxnetwork.org/docs/espace/learn/tutorials/user_metamask_interact_evmspace"
                        >
                          {' '}
                          Using MetaMask on Conflux eSpace{' '}
                        </Link>
                        )
                      </Text>
                      {/* <Popover trigger={'click'} placement={'bottom'}>
                        <PopoverTrigger>
                          <QuestionOutlineIcon />
                        </PopoverTrigger>
                        <PopoverContent
                          border={0}
                          boxShadow={'xl'}
                          p={4}
                          rounded={'xl'}
                          w="auto"
                        >
                          <div className="w-60">{t('cfxModal.walletTips')}
                          </div>
                          <Link isExternal color='teal.500' href='https://doc.confluxnetwork.org/docs/espace/learn/tutorials/user_metamask_interact_evmspace'> https://doc.confluxnetwork.org/docs/espace/learn/tutorials/user_metamask_interact_evmspace</Link>
                        </PopoverContent>
                      </Popover> */}
                    </div>

                    <input
                      placeholder={t('cfxModal.walletInput')}
                      className={`form-input ${
                        !wallet && !validate ? 'border-[#FE4064]' : ''
                      }`}
                      value={wallet}
                      onChange={(e) => updateValue('wallet', e.target.value)}
                    />
                  </>
                  <button className="form-btn mt-4" onClick={handleSubmit}>
                    {t('cfxModal.submit')}
                  </button>
                </>
              ) : step === 2 ? (
                <>
                  <div className="text-xl md:text-2xl font-medium">
                    {t('cfxModal.content1')}
                  </div>
                  <div className="my-6">
                    <>
                      <div className="flex mb-1">
                        <div>{t('cfxModal.gift')}：</div>
                        <div className="text-[#544AEC]">CFX</div>
                      </div>
                      <div className="flex mb-1">
                        <div>{t('cfxModal.yourEmail')}：</div>
                        <div className="text-[#544AEC]">{email}</div>
                      </div>
                      <div className="flex mb-1">
                        <div>{t('cfxModal.walletAddress')}：</div>
                        <div className="text-[#544AEC]">{wallet}</div>
                      </div>
                    </>
                    <div className="flex">
                      <div>{t('cfxModal.region')}：</div>
                      <div className="text-[#544AEC]">{address}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      className="form-btn border border-[rgba(0,0,0,.2)] bg-white text-black"
                      onClick={handleEdit}
                    >
                      {t('cfxModal.edit')}
                    </button>
                    <button
                      className="form-btn"
                      onClick={() => exchangeSpecial()}
                    >
                      {t('cfxModal.comfirm')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="text-center my-4">
                    <CheckCircleIcon className="!w-12 !h-12 !text-[#2BE174] m-auto" />
                  </div>
                  <div className="text-xl md:text-2xl font-medium text-center">
                    {t('cfxModal.success')}
                  </div>
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
