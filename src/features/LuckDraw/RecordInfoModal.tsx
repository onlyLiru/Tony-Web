import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  memo,
  useState,
  useEffect,
} from 'react';
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Box,
  Text,
  useToast,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { getPrizeRecord } from '@/services/points';
import { useRequest } from 'ahooks';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';

export type RecordModalRef = {
  open: () => void;
};

const Items = ({ item }: { item: any }) => {
  const t = useTranslations('points');
  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      mb={{ md: '20px', base: '16px' }}
    >
      <Box>
        <Text
          lineHeight={{ md: '19px', base: '16px' }}
          color={'#1D1B23'}
          fontWeight={'600'}
          fontSize={{ md: '16px', base: '13px' }}
        >
          {item?.prize_id === 0
            ? '100 USDT'
            : t(`gifts.${item?.prize_id}` as any)}
        </Text>
      </Box>
      <Text
        mt={'10px'}
        lineHeight={{ md: '17px', base: '15px' }}
        color={'primary.lightGray'}
        fontSize={{ md: '14px', base: '12px' }}
      >
        {format(item?.create_time * 1000, 'MMM dd, yyyy p')}
      </Text>
    </Flex>
  );
};

export const RecordModal = memo(
  forwardRef((props, ref) => {
    const t = useTranslations('points');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { data, loading, error, runAsync } = useRequest(getPrizeRecord, {
      manual: true,
    });
    const [tag, setTag] = useState<number>(0);

    const fetchRecord = useCallback(async () => {
      try {
        // const { data } = await fetchRecord();
        runAsync();
      } catch (error) {
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    }, [tag]);

    useImperativeHandle(ref, () => ({
      open: () => {
        onOpen();
        fetchRecord();
      },
    }));

    useEffect(() => {
      if (isOpen) {
        fetchRecord();
      }
    }, [tag, isOpen]);

    const changeTabs = useCallback((val: number) => {
      setTag(val);
    }, []);

    if (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          mx={{ md: 0, base: '4vw' }}
          w={{ md: '600px', base: 'full' }}
          maxW={{ md: '600px' }}
          fontFamily={'Inter'}
          pb={{ md: '30px', base: '15px' }}
        >
          <ModalBody p={{ md: '18px 0 0', base: '9px 0 0' }}>
            <Tabs onChange={changeTabs}>
              <TabList color={'#777E90'} px={'14px'}>
                <Tab
                  px={{ md: '30px', base: '15px' }}
                  mr={{ base: '10px', md: '20px' }}
                  _selected={{
                    color: 'primary.main',
                    borderBottom: '4px solid #14141F',
                  }}
                  fontSize={{ md: '16px', base: '13px' }}
                  className="md: font-semibold "
                  boxShadow={'none'}
                  _focusVisible={{ boxShadow: 'none' }}
                >
                  {t('raffleHistory')}
                </Tab>
              </TabList>

              {!loading ? (
                <TabPanels
                  p={{ md: '30px 30px 0', base: '16px 20px 0' }}
                  maxH={'440px'}
                  overflow={'hidden'}
                  overflowY={'scroll'}
                  h={'440px'}
                >
                  <TabPanel p={0} h={'full'}>
                    {data?.data?.list && data?.data?.list?.length > 0 ? (
                      data?.data?.list?.map((item, idx) => (
                        <Items key={idx} item={item} />
                      ))
                    ) : (
                      <Flex h={'full'} align={'center'} justify={'center'}>
                        {t('noData')}
                      </Flex>
                    )}
                  </TabPanel>
                </TabPanels>
              ) : (
                <Center h="440px" mx="auto">
                  <Spinner size="lg" />
                </Center>
              )}
            </Tabs>
          </ModalBody>
          <ModalCloseButton
            color={'#B5B5B5'}
            top={{ md: '0', base: '-2px' }}
            right={{ md: '0', base: '0' }}
          />
        </ModalContent>
      </Modal>
    );
  }),
);
