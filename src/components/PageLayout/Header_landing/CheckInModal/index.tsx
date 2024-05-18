import React, {
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  useToast,
  Box,
  Text,
  HStack,
  Center,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { ShimmerImage } from '@/components/Image';
import * as rebateApi from '@/services/rebate';
import { useCalender } from '@/hooks/useCalender';
import { useRouter } from 'next/router';
import { useUserDataValue } from '@/store';
// import Image from '@/components/Image';

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CanlenderDayItem = ({
  day,
  currentDay,
  month,
  checkDays = [],
  handleSignIn,
}: any) => {
  const t = useTranslations('common');
  const status = useMemo(
    () =>
      checkDays.includes(day)
        ? 'signed'
        : currentDay === month + '-' + day
        ? 'today'
        : new Date(currentDay).getTime() < new Date(month + '-' + day).getTime()
        ? 'after'
        : 'before',
    [checkDays],
  );

  if (!day) {
    return (
      <Box w={{ md: '36px', base: '30px' }} h={{ md: '36px', base: '30px' }} />
    );
  }
  return (
    <VStack
      justifyContent="center"
      spacing={0}
      bg={
        status === 'signed'
          ? 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%)'
          : status === 'before'
          ? '#EDEAF0'
          : ''
        // status === 'signed' ? 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%)': status === 'before' ? '#EFEBF3' : status === 'today' ? '#776FF3' : ''
      }
      // border={status === 'signed' ? '2px solid #000' : ''}
      // color={status === 'today' ? '#fff' : '#000'}
      color={status === 'signed' ? '#fff' : '#000'}
      fontSize="10px"
      w={{ md: '48px', base: '30px' }}
      h={{ md: '48px', base: '30px' }}
      rounded="8px"
      cursor={status === 'today' || status === 'before' ? 'pointer' : 'unset'}
      onClick={() =>
        status === 'today' || status === 'before'
          ? handleSignIn(status, day)
          : null
      }
      _hover={{
        bg:
          status === 'today'
            ? 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%)'
            : '',
        color: status === 'today' ? '#fff' : '',
      }}
    >
      <Text>{day}</Text>
      {status === 'before' ? (
        <Text
          fontSize="10px"
          color="#6157FF"
          lineHeight="12px"
          transform="scale(0.8)"
          textAlign="center"
        >
          {/* {t('check.missCheck')} */}
          {t('check.getMissCheck')}
        </Text>
      ) : null}
      {/* {status === 'signed' ? (
        <ShimmerImage
          w="11px"
          h="12px"
          src="/images/activity/rebate/signedDay.png"
        />
      ) : (
        day
      )} */}
    </VStack>
  );
};

export const CheckInModal = forwardRef((props: any, ref) => {
  const { onSignSuccess, getFun } = props;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('common');

  const userData = useUserDataValue();
  const [remedy, setRemedy] = useState(false);
  const router = useRouter();
  const {
    checkDays,
    currentDay,
    weekday,
    monthTotalDay,
    month,
    year,
    // getPrevMonth,
    // getNextMonth,
    addCheckDay,
    dateInfo,
    getDateInfo,
  } = useCalender(2);

  useImperativeHandle(ref, () => ({
    open: async (bitget: any) => {
      console.log(dateInfo);
      console.log(bitget);
      if (bitget) {
        const { data } = await rebateApi.getSignedInDate({
          year,
          month,
          source: 2,
        });
        onOpen();
        console.log(data);
        if (data && !data?.today_sign_in_status && userData?.wallet_address) {
          handleSignIn('today', new Date().getDate());
        }
      } else {
        onOpen();
        if (
          dateInfo &&
          !dateInfo?.today_sign_in_status &&
          userData?.wallet_address
        ) {
          handleSignIn('today', new Date().getDate());
        }
      }
    },
  }));

  const [signedSatatus, setSignedStatus] = useState<any>(false);

  const days = useMemo(
    () => Array.from({ length: monthTotalDay as number }, (_, i) => i + 1),
    [monthTotalDay],
  );
  const empty = useMemo(
    () => Array.from({ length: weekday as number }, () => null),
    [weekday],
  );

  const [signDataInfo, setSignDataInfo] =
    useState<rebateApi.ApiRebate.SignedInfo>();

  const handleSignIn = async (status?: string, day?: number) => {
    try {
      if (day && status === 'before') {
        const { data } = await rebateApi.reSignIn({
          date: new Date(`${year}-${month}-${day}`).getTime() / 1000,
        });
        if (data.status) {
          addCheckDay(day);
          toast({
            status: 'success',
            title: `${t('reCheckInSuccessfully')}`,
            variant: 'subtle',
          });
        }
      }
      if (status === 'today') {
        const { data } = await rebateApi.signIn({ source: 2 });
        addCheckDay(Number(currentDay.split('-')[2]));
        setSignDataInfo(data);
        setSignedStatus(true);
        toast({
          status: 'success',
          title: `${t('checkInSuccessfully')}, +${data.uuu_reward}uuu`,
          variant: 'subtle',
        });
      }

      onSignSuccess();
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
    getDateInfo();
  };

  useEffect(() => {
    !isOpen && setRemedy(false);
  }, [isOpen]);

  useEffect(() => {
    setSignedStatus(dateInfo?.today_sign_in_status);
  }, [dateInfo?.today_sign_in_status]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (getFun) {
            getFun();
          }
          onClose();
        }}
        size="md"
        isCentered
        scrollBehavior="inside"
        variant={{ md: 'right', base: '' }}
      >
        <ModalOverlay />
        <ModalContent
          rounded="10px"
          maxWidth={{ md: '460px', base: '340px' }}
          pb="22px"
          bgColor="#FEFEFF"
          boxShadow="0px 30px 50px rgba(132, 135, 159, 0.3)"
          // border="1px solid rgba(0, 0, 0, 0.1);"
        >
          <ModalCloseButton zIndex={1} color="rgba(0,0,0,.2)" />
          {remedy ? (
            <ModalHeader
              fontSize="16px"
              lineHeight="50px"
              fontWeight={500}
              py="0"
              textAlign="left"
            >
              {t('check.getMissCheck')}
            </ModalHeader>
          ) : null}
          {remedy ? (
            <ModalBody px="0" py="0">
              <div className="px-6">
                <div className="text-xs md:text-sm text-[rgba(0,0,0,.4)] -pt-2 pb-6">
                  {t('check.reSign1')}
                </div>
                <div>
                  <div
                    className="bg-gradient-to-r from-[#FF4AF6] to-[#0099FF] mb-4 p-0.5 rounded cursor-pointer"
                    onClick={() => {
                      onClose();
                      router.push('/explore');
                    }}
                  >
                    <div className="flex-between p-4 bg-[#F7F7F7] rounded">
                      <div>
                        <div className="font-bold text-sm">
                          {t('check.reSign2')}
                        </div>
                        <div className="text-xs text-[rgba(0,0,0,0.4)] mt-1">
                          {t('check.reSign3')}
                        </div>
                      </div>
                      <Box
                        background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                        rounded="4px"
                        px="10px"
                        py="4px"
                        fontSize="12px"
                        fontFamily="PingFangSC-Medium"
                        fontWeight="bold"
                        color="#fff"
                      >
                        {t('check.buy')}
                      </Box>
                    </div>
                  </div>
                  <div
                    className="bg-gradient-to-r from-[#FF4AF6] to-[#0099FF] mb-4 p-0.5 rounded cursor-pointer"
                    onClick={() => {
                      onClose();
                      router.push('/');
                    }}
                  >
                    <div className="flex-between p-4 bg-[#F7F7F7] rounded">
                      <div>
                        <div className="font-bold text-sm">
                          {t('check.reSign4')}
                        </div>
                        <div className="text-xs text-[rgba(0,0,0,0.4)] mt-1">
                          {t('check.reSign3')}
                        </div>
                      </div>
                      <Box
                        background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                        rounded="4px"
                        px="10px"
                        py="4px"
                        fontSize="12px"
                        fontFamily="PingFangSC-Medium"
                        fontWeight="bold"
                        color="#fff"
                      >
                        {t('check.buy')}
                      </Box>
                    </div>
                  </div>
                  <div
                    className="bg-gradient-to-r from-[#FF4AF6] to-[#0099FF] p-0.5 rounded cursor-pointer"
                    onClick={() => {
                      onClose();
                      router.push(`/user/${userData?.wallet_address}`);
                    }}
                  >
                    <div className="flex-between p-4 bg-[#F7F7F7] rounded">
                      <div>
                        <div className="font-bold text-sm">
                          {t('check.reSign5')}
                        </div>
                        <div className="text-xs text-[rgba(0,0,0,0.4)] mt-1">
                          {t('check.reSign3')}
                        </div>
                      </div>
                      <Box
                        background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                        rounded="4px"
                        px="10px"
                        py="4px"
                        fontSize="12px"
                        fontFamily="PingFangSC-Medium"
                        fontWeight="bold"
                        color="#fff"
                      >
                        {t('check.buy')}
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          ) : (
            <ModalBody px="0" pt="40px" position="relative">
              {signedSatatus && (
                <div className="text-center mb-4">
                  <ShimmerImage
                    src="/images/home/research_icon.png"
                    w={{ md: '100px', base: '80px' }}
                    h={{ md: '100px', base: '80px' }}
                    transform="rotate(15deg)"
                    m="auto"
                  />
                  <div className="text-base md:text-xl">
                    {t('checkInSuccessfully')}
                  </div>
                  <div className="text-xs md:text-sm text-[rgba(0,0,0,.4)] py-1">
                    {t('check.reSign6')} {dateInfo?.continuous_sign_days}{' '}
                    {t('check.day')}
                  </div>
                  {signDataInfo ? (
                    <div className="flex-center">
                      <ShimmerImage
                        src="/images/points/u.png"
                        w="20px"
                        h="20px"
                      />
                      <div className="text-[#544AEC] ml-1">
                        +{signDataInfo?.uuu_reward}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <Box
                w={{ md: '420px', base: '300px' }}
                mx="auto"
                border="1px solid rgba(0, 0, 0, 0.12);"
                rounded="5px"
                // bg="linear-gradient(227.97deg, #F0EDFC 9.73%, rgba(251, 232, 218, 0) 76.39%);"
                pb="12px"
              >
                {/* <HStack
                w="full"
                h="32px"
                textAlign="center"
                fontSize="12px"
                fontWeight={600}
                lineHeight="16px"
                p="8px 20px"
                borderBottom="1px solid rgba(0, 0, 0, 0.1);"
                justify="space-between"
              >
                <Center
                  w="18px"
                  h="18px"
                  rounded="full"
                  bgColor="rgba(161, 155, 181, 0.2)"
                  cursor="pointer"
                  onClick={() => getPrevMonth()}
                  fontSize="18px"
                >
                  <ChevronLeftIcon color="#A19BB5" />
                </Center>
                <Text>{months[(month as any) - 1]}</Text>
                <Center
                  w="18px"
                  h="18px"
                  rounded="full"
                  bgColor="rgba(161, 155, 181, 0.2)"
                  cursor="pointer"
                  onClick={() => getNextMonth()}
                  fontSize="18px"
                >
                  <ChevronRightIcon color="#A19BB5" />
                </Center>
              </HStack> */}
                <HStack
                  w="full"
                  justify="center"
                  fontSize="10px"
                  fontWeight={400}
                  lineHeight="30px"
                  color="#454545"
                  pt={{ md: '6px', base: '12px' }}
                  pb={{ md: '6px', base: '12px' }}
                  spacing={{ md: '20px', base: '19px' }}
                >
                  {weeks.map((v, i) => (
                    <Text
                      key={i}
                      w={{ md: '36px', base: '20px' }}
                      textAlign="center"
                      whiteSpace="nowrap"
                      fontWeight="700"
                    >
                      {v}
                    </Text>
                  ))}
                </HStack>
                <SimpleGrid
                  pl={{ md: '20px', base: '22px' }}
                  pr={{ md: '20px', base: '22px' }}
                  columns={7}
                  spacingX="5px"
                  spacingY="5px"
                >
                  {[...empty, ...days].map((v, i) => (
                    <CanlenderDayItem
                      key={i}
                      day={v}
                      month={`${year}-${month}`}
                      currentDay={currentDay}
                      checkDays={checkDays}
                      handleSignIn={handleSignIn}
                    />
                  ))}
                </SimpleGrid>
                <div className="bg-[#F2F3F5] rounded text-[#86909C] mx-5 mt-3 text-xs md:text-sm px-2 py-1 flex-between">
                  <div>
                    {t('check.reSign7')} {dateInfo?.sign_days}{' '}
                    {dateInfo?.sign_days > 1 ? t('check.days') : t('check.day')}
                    ，{t('check.reSign8')} {dateInfo?.not_sign_days}{' '}
                    {dateInfo?.not_sign_days > 1
                      ? t('check.days')
                      : t('check.day')}
                  </div>
                  <div
                    className="flex-center cursor-pointer"
                    onClick={() => setRemedy(true)}
                  >
                    <div className="text-[#6157FF]">{t('check.reSign9')}</div>
                    <ChevronRightIcon color="#6157FF" />
                  </div>
                </div>
                {signedSatatus ? (
                  <Box
                    position="absolute"
                    top="80px"
                    right="0"
                    rounded="16px 0 0 16px"
                    className="bg-[#F2F3F5] text-[#86909C] text-xs md:text-sm px-2 py-1 flex-between"
                  >
                    {t('check.reSign10')}
                    <Text color="#165DFF" mx="4px">
                      {dateInfo?.repair_cards}
                    </Text>
                  </Box>
                ) : null}
              </Box>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});
