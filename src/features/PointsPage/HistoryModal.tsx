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
  Tag,
  TagLeftIcon,
  TagLabel,
  Text,
  useToast,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { fetchRecord } from '@/services/points';
import { useRequest } from 'ahooks';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';

export type HistoryModalRef = {
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
          {item.type * 1 === 9 || item.type * 1 === 21 || item.type * 1 === 23
            ? item.project_name
            : ''}
          {t(`source.${item?.type}` as any)}
        </Text>
        <Text
          mt={'10px'}
          lineHeight={{ md: '17px', base: '15px' }}
          color={'primary.lightGray'}
          fontSize={{ md: '14px', base: '12px' }}
        >
          {format(item?.update_time * 1000, 'MMM dd, yyyy p')}
        </Text>
      </Box>
      <Tag
        bg={
          item?.symbol ? 'rgba(112, 101, 240, 0.1)' : 'rgba(20, 20, 31, 0.05);'
        }
        h={'28px'}
        borderRadius={{ md: '4px' }}
        color={item?.symbol ? '#7065F0' : 'primary.main'}
        justifyContent={'center'}
      >
        <TagLeftIcon
          mr={'2px'}
          boxSize="8px"
          as={item?.symbol ? AddIcon : MinusIcon}
        />
        <TagLabel fontWeight={'500'} fontSize={'14px'}>
          {item?.score}
        </TagLabel>
      </Tag>
    </Flex>
  );
};

export const HistoryModal = memo(
  forwardRef((props: { openTurntable?: () => void }, ref) => {
    const t = useTranslations('points');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const { data, loading, error, runAsync } = useRequest(fetchRecord, {
      manual: true,
    });
    const [tag, setTag] = useState<number>(0);
    const list = data?.data?.list;
    const fetchHistory = useCallback(async () => {
      try {
        // const { data } = await fetchRecord();
        runAsync({ page: 1, pageSize: 50, tag });
      } catch (error) {
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    }, [tag]);

    useImperativeHandle(ref, () => ({
      open: () => {
        onOpen();
        fetchHistory();
      },
    }));

    useEffect(() => {
      if (isOpen) {
        fetchHistory();
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
          props.openTurntable && props.openTurntable();
        }}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.400" />
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
                  w={{ base: '80px', md: '100px' }}
                  mr={{ base: '10px', md: '20px' }}
                  _selected={{
                    color: 'primary.main',
                    borderBottom: '4px solid #14141F',
                  }}
                  fontSize={{ md: '16px', base: '13px' }}
                  className="md: font-semibold "
                  _focusVisible={{ boxShadow: 'none' }}
                >
                  {t('all')}
                </Tab>
                <Tab
                  w={{ base: '80px', md: '100px' }}
                  mr={{ base: '10px', md: '20px' }}
                  _selected={{
                    color: 'primary.main',
                    borderBottom: '4px solid #14141F',
                  }}
                  fontSize={{ md: '16px', base: '13px' }}
                  className="md: font-semibold"
                >
                  {t('acquired')}
                </Tab>
                <Tab
                  w={{ base: '80px', md: '100px' }}
                  _selected={{
                    color: 'primary.main',
                    borderBottom: '4px solid #14141F',
                  }}
                  className="md: font-semibold"
                  fontSize={{ md: '16px', base: '13px' }}
                >
                  {t('consumed')}
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
                    {list && list.length > 0 ? (
                      list?.map((item, idx) => <Items key={idx} item={item} />)
                    ) : (
                      <Flex h={'full'} align={'center'} justify={'center'}>
                        {t('noData')}
                      </Flex>
                    )}
                  </TabPanel>
                  <TabPanel p={0} h={'full'}>
                    {list && list.length > 0 ? (
                      list?.map((item, idx) => <Items key={idx} item={item} />)
                    ) : (
                      <Flex h={'full'} align={'center'} justify={'center'}>
                        {t('noData')}
                      </Flex>
                    )}
                  </TabPanel>
                  <TabPanel p={0} h={'full'}>
                    {list && list.length > 0 ? (
                      list?.map((item, idx) => <Items key={idx} item={item} />)
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
          {/* <ModalFooter pt={{ md: '17px', base: 0 }} pb={0}>
          <Text
            lineHeight={{ md: '19px', base: '17px' }}
            fontSize={{ md: '16px', base: '14px' }}
            fontWeight={'700'}
            color={'primary.main'}
          >
            {t('score')}: 100
          </Text>
        </ModalFooter> */}
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
