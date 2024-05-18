import React, { useImperativeHandle, forwardRef, useMemo } from 'react';
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
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { ShimmerImage } from '@/components/Image';
import * as rebateApi from '@/services/rebate';
import { useCalender } from '@/hooks/useCalender';

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
      <Box w={{ md: '40px', base: '22px' }} h={{ md: '40px', base: '22px' }} />
    );
  }
  return (
    <Center
      bgColor={
        status === 'before' ? '#EFEBF3' : status === 'today' ? '#776FF3' : ''
      }
      border={status === 'signed' ? '2px solid #000' : ''}
      color={status === 'today' ? '#fff' : '#000'}
      fontSize={{ md: '18px', base: '10px' }}
      w={{ md: '40px', base: '22px' }}
      h={{ md: '40px', base: '22px' }}
      rounded="full"
      cursor={status === 'today' ? 'pointer' : 'unset'}
      onClick={() => (status === 'today' ? handleSignIn() : null)}
    >
      {status === 'signed' ? (
        <ShimmerImage
          w={{ md: '23px', base: '11px' }}
          h={{ md: '26px', base: '12px' }}
          src="/images/activity/rebate/signedDay.png"
        />
      ) : (
        day
      )}
    </Center>
  );
};

export const SignIn = forwardRef(
  (props: { refresh: () => void; timestamp: number }, ref) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const t = useTranslations('rebate');

    useImperativeHandle(ref, () => ({
      open: onOpen,
    }));

    const {
      checkDays,
      currentDay,
      weekday,
      monthTotalDay,
      month,
      year,
      getPrevMonth,
      getNextMonth,
      addCheckDay,
    } = useCalender(1);

    const days = useMemo(
      () => Array.from({ length: monthTotalDay as number }, (_, i) => i + 1),
      [monthTotalDay],
    );
    const empty = useMemo(
      () => Array.from({ length: weekday as number }, () => null),
      [weekday],
    );

    const handleSignIn = async () => {
      try {
        await rebateApi.signIn({ source: 1 });
        addCheckDay(Number(currentDay.split('-')[2]));
        toast({
          status: 'success',
          title: t('checkInSuccessfully'),
          variant: 'subtle',
        });
        props.refresh();
      } catch (error) {
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    };

    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="md"
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent
            rounded={{ md: '16px', base: '10px' }}
            maxWidth={{ base: '362px', md: '800px' }}
            pb={{ md: '73px', base: '22px' }}
            bgColor="#FEFEFF"
            boxShadow="0px 30px 50px rgba(132, 135, 159, 0.3)"
            border="1px solid rgba(0, 0, 0, 0.1);"
          >
            <ModalCloseButton />
            <ModalHeader
              fontSize={{ md: '30px', base: '16px' }}
              lineHeight="50px"
              fontWeight={{ md: 400, base: 500 }}
              pt={{ md: '40px', base: '4px' }}
              pb={{ md: '27px', base: '0' }}
              textAlign={{ md: 'center', base: 'left' }}
            >
              {t('checkIn')}
            </ModalHeader>
            <ModalBody px="0">
              <Box
                w={{ md: '670px', base: '326px' }}
                mx="auto"
                border="1px solid rgba(0, 0, 0, 0.2);"
                rounded={{ md: '10px', base: '5px' }}
                bg="linear-gradient(227.97deg, #F0EDFC 9.73%, rgba(251, 232, 218, 0) 76.39%);"
                pb="16px"
              >
                <HStack
                  w="full"
                  h={{ md: '62px', base: '32px' }}
                  textAlign="center"
                  fontSize={{ md: '22px', base: '12px' }}
                  fontWeight={600}
                  lineHeight={{ md: '30px', base: '16px' }}
                  p={{ md: '17px 64px 15px 64px', base: '8px 20px' }}
                  borderBottom="1px solid rgba(0, 0, 0, 0.1);"
                  justify="space-between"
                >
                  <Center
                    w={{ md: '31px', base: '18px' }}
                    h={{ md: '31px', base: '18px' }}
                    rounded="full"
                    bgColor="rgba(161, 155, 181, 0.2)"
                    cursor="pointer"
                    onClick={() => getPrevMonth()}
                    fontSize={{ md: '22px', base: '18px' }}
                  >
                    <ChevronLeftIcon color="#A19BB5" />
                  </Center>
                  <Text>{months[(month as any) - 1]}</Text>
                  <Center
                    w={{ md: '31px', base: '18px' }}
                    h={{ md: '31px', base: '18px' }}
                    rounded="full"
                    bgColor="rgba(161, 155, 181, 0.2)"
                    cursor="pointer"
                    onClick={() => getNextMonth()}
                    fontSize={{ md: '22px', base: '18px' }}
                  >
                    <ChevronRightIcon color="#A19BB5" />
                  </Center>
                </HStack>
                <HStack
                  w="full"
                  justify="center"
                  fontSize={{ md: '16px', base: '10px' }}
                  fontWeight={400}
                  lineHeight="30px"
                  color="#454545"
                  pt="17px"
                  pb="12px"
                  spacing={{ md: '42px', base: '21px' }}
                >
                  {weeks.map((v, i) => (
                    <Text
                      key={i}
                      w={{ md: '40px', base: '22px' }}
                      textAlign="center"
                      whiteSpace="nowrap"
                    >
                      {v}
                    </Text>
                  ))}
                </HStack>
                <SimpleGrid
                  pl={{ md: '68px', base: '22px' }}
                  pr={{ md: '66px', base: '22px' }}
                  columns={7}
                  spacingX={{ md: '42px', base: '21px' }}
                  spacingY={{ md: '18px', base: '8px' }}
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
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  },
);
