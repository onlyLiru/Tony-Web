import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Flex,
  Text,
  Box,
  HStack,
  SimpleGrid,
  useDisclosure,
  Button,
  useToast,
} from '@chakra-ui/react';
import * as pointsApi from '@/services/points';
import { useUserDataValue, useFetchUuInfo } from '@/store';
import { OrderTipModalRef } from './orderTipModal';
import ShimmerImageMemo from '@/components/Image/ShimmerImageMemo';
import { ShimmerImage } from '@/components/Image';
import { useRouter } from 'next/router';

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};

function Redemption({
  initOrderList,
  data,
}: {
  initOrderList: any;
  data: any;
}) {
  const t = useTranslations('points');
  const [activeTab, setActiveTab] = useState(1);
  const [orderList, setOrderList] = useState<any>(initOrderList);
  const [list, setList] = useState<any>(data || []);
  const [curOrderType, updateOrderType] = useState('');
  const userData = useUserDataValue();
  const web2LoginModal = useRef<ResgisterModalAction>(null);
  const OrderTipModalRef = useRef<OrderTipModalRef>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { fetchUuInfo } = useFetchUuInfo();
  const toast = useToast();
  const tabs = [
    {
      name: t('tabs.whiteList'),
      key: 1,
    },
    {
      name: t('tabs.specialRewards'),
      key: 2,
    },
  ];

  // 获取白名单
  const fetchWhiteList = async () => {
    try {
      const { data: whiteListData } = await pointsApi.getExchangeList({
        type: 1,
      });
      setOrderList(whiteListData.can_order_list ?? []);
      setList((pre: any) => {
        return {
          ...pre,
          1: whiteListData.list,
          2: whiteListData.special_list,
        };
      });
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };
  useEffect(() => {
    fetchWhiteList();
  }, []);
  useEffect(() => {
    if (userData?.wallet_address) {
      fetchWhiteList();
    }
  }, [userData?.wallet_address]);
  useEffect(() => {
    if (userData?.wallet_address) {
      fetchWhiteList();
    }
    fetchWhiteList();
  }, [router?.locale]);

  const handleAllExchangeList = (list: any) => {
    const result: any = [];
    tabs.forEach((item) => {
      if (item.key === 3) {
        result.push(...list[item.key]);
      } else {
        const arr = list[item.key] ?? [];
        result.push(
          ...arr.filter((v: any) => {
            return !(
              (v.unlimit > 0 && v.already_exchange >= v.unlimit) ||
              v.toal <= 0 ||
              v.project_status * 1 === 2
            );
          }),
        );
      }
    });
    return result;
  };

  const renderMainContentArea = () => {
    return (
      <Box
        flex="1"
        borderLeft="1px solid rgba(0,0,0,0.12)"
        borderRight="1px solid rgba(0,0,0,0.12)"
        py="40px"
      >
        {/* {handleAllExchangeList(list)?.length ? (
          <Box mb="24px">
            <Text
              fontFamily="MicrosoftYaHei"
              fontWeight="700"
              fontSize="24px"
              color="#fff"
              mb="16px"
            >
              {t('exchangeTitle')}
            </Text>
            <SimpleGrid
              flex="1"
              templateColumns={{
                base: '1fr 1fr',
                md: `repeat(auto-fill, minmax(280px, 1fr))`,
              }}
              spacingX="22px"
              spacingY="16px"
            >
              {handleAllExchangeList(list).map((v: any, index: number) => {
                return (
                  <Box
                    key={v.id || v.tokenId}
                    rounded="8px"
                    border="1px solid rgba(0,0,0,0.12);"
                    overflow="hidden"
                    onClick={() => {
                      if (v?.user_type && userData?.is_new_user) {
                        if (userData?.wallet_address) {
                          OrderTipModalRef?.current?.open(v);
                        } else {
                          web2LoginModal?.current?.open();
                        }
                      } else if (!v?.user_type) {
                        if (userData?.wallet_address) {
                          OrderTipModalRef?.current?.open(v);
                        } else {
                          web2LoginModal?.current?.open();
                        }
                      } else {
                        onOpen();
                      }
                    }}
                    cursor="pointer"
                  >
                    <ShimmerImage
                      w="100%"
                      pb="100%"
                      src={v.img_url}
                      borderTopLeftRadius="8px"
                      borderTopRightRadius="8px"
                    />
                    <Box p="16px">
                      <Text
                        fontFamily="MicrosoftYaHei"
                        fontWeight="500"
                        fontSize="16px"
                        color="#fff"
                        noOfLines={2}
                        mb="10px"
                      >
                        {v.title}
                      </Text>
                      <Flex mb="12px">
                        <ShimmerImage
                          w="18px"
                          h="18px"
                          src="/images/points/uIcon.png"
                          // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                          mr="4px"
                        />
                        <Text
                          fontFamily="MicrosoftYaHei"
                          fontWeight="500"
                          fontSize="16px"
                          color="#E49F5C"
                          mr="12px"
                          lineHeight="20px"
                        >
                          {v.integral}
                        </Text>
                        <Text
                          fontSize="14px"
                          color="rgba(255,255,255,0.4);"
                          lineHeight="20px"
                          whiteSpace="nowrap"
                        >
                          {v.total}/{v.total_real} {t('remainTip')}
                        </Text>
                      </Flex>
                      <Button
                        variant={'primary'}
                        w="100%"
                        _hover={{
                          bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                        }}
                        height="40px"
                        textAlign="center"
                        lineHeight="40px"
                        color="#fff"
                        fontSize="14px"
                        fontFamily="PingFangSC-Medium"
                        fontWeight="bold"
                        background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                        rounded="4px"
                      >
                        {t('exchangeBtn')}
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        ) : null}
        {orderList?.length ? (
          <Box mb="24px">
            <Flex direction="column" mb="16px">
              <Text
                fontFamily="PingFangSC-Medium"
                fontWeight="bold"
                fontSize="24px"
                color="#fff"
                mb="4px"
              >
                {t('reserveTitle')}
              </Text>
              <Text fontSize="16px" color="rgba(0,0,0,0.6)">
                {t('reserveTip')}
              </Text>
            </Flex>
            <SimpleGrid
              flex="1"
              templateColumns={{
                base: '1fr 1fr',
                md: `repeat(auto-fill, minmax(280px, 1fr))`,
              }}
              spacingX="22px"
              spacingY="16px"
            >
              {orderList.map((v: any) => {
                return (
                  <Box
                    key={v.id || v.tokenId}
                    rounded="8px"
                    border="1px solid rgba(0,0,0,0.12);"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => {
                      updateOrderType('reserve');
                      if (v?.user_type && userData?.is_new_user) {
                        if (userData?.wallet_address) {
                          OrderTipModalRef?.current?.open(v);
                        } else {
                          web2LoginModal?.current?.open();
                        }
                      } else if (!v?.user_type) {
                        if (userData?.wallet_address) {
                          OrderTipModalRef?.current?.open(v);
                        } else {
                          web2LoginModal?.current?.open();
                        }
                      } else {
                        onOpen();
                      }
                    }}
                  >
                    <ShimmerImage
                      w="100%"
                      pb="100%"
                      src={v.img_url}
                      borderTopLeftRadius="8px"
                      borderTopRightRadius="8px"
                    />
                    <Box p="16px">
                      <Text
                        fontFamily="MicrosoftYaHei"
                        fontWeight="500"
                        fontSize="16px"
                        color="#fff"
                        noOfLines={2}
                        mb="10px"
                      >
                        {v.title}
                      </Text>
                      <Flex mb="12px">
                        <ShimmerImage
                          w="18px"
                          h="18px"
                          src="/images/points/uIcon.png"
                          // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                          mr="4px"
                        />
                        <Text
                          fontFamily="MicrosoftYaHei"
                          fontWeight="500"
                          fontSize="16px"
                          color="#E49F5C"
                          mr="12px"
                          lineHeight="20px"
                        >
                          {v.integral}
                        </Text>
                        <Text
                          fontSize="14px"
                          color="rgba(255,255,255,0.4);"
                          lineHeight="20px"
                          whiteSpace="nowrap"
                        >
                          {v.total}/{v.total_real} {t('remainTip')}
                        </Text>
                      </Flex>
                      <Box
                        w="100%"
                        h="32px"
                        rounded="4px"
                        bg="linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1))"
                        p="2px"
                      >
                        <Button
                          variant={'primary'}
                          w="100%"
                          _hover={{
                            background: '#fffff',
                          }}
                          height="28px"
                          textAlign="center"
                          lineHeight="28px"
                          color="#E49F5C"
                          fontSize="14px"
                          fontFamily="PingFangSC-Medium"
                          fontWeight="bold"
                          rounded="2px"
                          background="#ffffff"
                        >
                          {t('reserve')}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        ) : null} */}
        <Box>
          <Flex direction="column" mb="2rem">
            <HStack
              spacing="40px"
              px="11px"
              w="100%"
              overflowX="scroll"
              sx={{
                'scrollbar-width': 'none',
                '-ms-overflow-style': 'none',
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {tabs.map((v) => (
                <Text
                  key={v.key}
                  h="auto"
                  py="14px"
                  fontSize={{ md: '24px' }}
                  lineHeight="32px"
                  fontFamily="MicrosoftYaHei"
                  fontWeight="700"
                  color={
                    activeTab === v.key ? '#E49F5C' : 'rgba(255,255,255,0.4)'
                  }
                  pos="relative"
                  _after={{
                    content: '" "',
                    pos: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    w: '100%',
                    h: '4px',
                    bgColor: '#E49F5C',
                    rounded: '2px',
                    display: activeTab === v.key ? 'block' : 'none',
                  }}
                  cursor="pointer"
                  onClick={() => setActiveTab(v.key)}
                >
                  {v.name}
                </Text>
              ))}
            </HStack>
          </Flex>
          <Box
            // h={orderList?.length ? '60vw' : '60vw'}
            overflow={'auto'}
            sx={{
              '::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <SimpleGrid
              flex="1"
              templateColumns={{
                base: '1fr 1fr',
                md: `repeat(auto-fill, minmax(280px, 1fr))`,
              }}
              spacingX="22px"
              spacingY="16px"
            >
              {(list[String(activeTab)] || []).map((v: any, index: number) => {
                return (
                  <Box
                    key={v.id || v.tokenId}
                    rounded="8px"
                    border="1px solid rgba(0,0,0,0.12);"
                    overflow="hidden"
                    onClick={() => {
                      updateOrderType('exChange');
                      if (
                        !(
                          activeTab !== 3 &&
                          ((v.unlimit > 0 && v.already_exchange >= v.unlimit) ||
                            v.toal <= 0 ||
                            v.project_status * 1 === 2)
                        )
                      ) {
                        if (v?.user_type && userData?.is_new_user) {
                          if (userData?.wallet_address) {
                            OrderTipModalRef?.current?.open(v);
                          } else {
                            web2LoginModal?.current?.open();
                          }
                        } else if (!v?.user_type) {
                          if (userData?.wallet_address) {
                            OrderTipModalRef?.current?.open(v);
                          } else {
                            web2LoginModal?.current?.open();
                          }
                        } else {
                          onOpen();
                        }
                        // if (userData?.wallet_address) {
                        //   OrderTipModalRef?.current?.open(v);
                        // } else {
                        //   web2LoginModal?.current?.open();
                        // }
                      }
                    }}
                    cursor="pointer"
                  >
                    <ShimmerImageMemo
                      w="100%"
                      pb="100%"
                      src={v.img_url}
                      rounded="8px 8px 0px 0px"
                    />
                    <Box p="16px">
                      <Text
                        fontFamily="MicrosoftYaHei"
                        fontWeight="500"
                        fontSize="16px"
                        color="#fff"
                        noOfLines={1}
                        mb="10px"
                      >
                        {v.title}
                      </Text>
                      <Flex mb="12px" overflow="hidden">
                        <ShimmerImage
                          w="18px"
                          h="18px"
                          src="/images/points/uIcon.png"
                          // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                          mr="4px"
                        />
                        <Text
                          fontFamily="MicrosoftYaHei"
                          fontWeight="500"
                          fontSize="16px"
                          color="#E49F5C"
                          mr="12px"
                          lineHeight="20px"
                        >
                          {v.integral}
                        </Text>
                        <Text
                          fontSize="14px"
                          color="rgba(255,255,255,0.4);"
                          lineHeight="20px"
                          whiteSpace="nowrap"
                          w={{ md: 'auto', base: '60px' }}
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {v.total}/{v.total_real} {t('remainTip')}
                        </Text>
                      </Flex>
                      <Button
                        variant={'primary'}
                        w="100%"
                        _hover={{
                          bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                        }}
                        _disabled={{
                          bg: 'rgba(255, 255, 255, 0.6)',
                        }}
                        height="40px"
                        textAlign="center"
                        lineHeight="40px"
                        color="#fff"
                        fontSize="14px"
                        fontFamily="PingFangSC-Medium"
                        fontWeight="bold"
                        background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                        rounded="4px"
                        isDisabled={
                          activeTab !== 3 &&
                          ((v.unlimit > 0 && v.already_exchange >= v.unlimit) ||
                            v.toal <= 0 ||
                            v.project_status * 1 === 2)
                        }
                      >
                        {activeTab === 1 && v.status
                          ? t('redeemed')
                          : t('exchangeBtn')}
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
            <Box
              bg={'blackAlpha.500'}
              w={'200px'}
              h={'8px'}
              m={'auto'}
              borderRadius={'15px'}
              mt="10px"
            ></Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box mt={{ md: '1rem' }} as="header">
      <Text
        fontFamily="MicrosoftYaHei"
        fontWeight="700"
        fontSize="24px"
        color="#fff"
        mt="3rem"
        whiteSpace="nowrap"
      >
        {t('aboutIntegral')}
      </Text>
      <Text color="rgba(255,255,255,.4)">{t('integralDesc')}</Text>
      <Flex
        justify="space-between"
        flexDir={{ md: 'row', base: 'column' }}
        flexWrap="wrap"
        gap={{ md: '1rem', base: '1rem' }}
        mt="1rem"
        height={{ md: 'auto', base: '30rem' }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={{ md: '14rem', base: '10rem' }}
          borderRadius="20px"
          bg="#3C3C3C"
          flex="1"
          flexDir="column"
        >
          <Text
            fontWeight="bold"
            color="#E49F5C"
            fontSize={{ md: '1.5rem', base: '1.5rem' }}
          >
            4000+
          </Text>
          <Text>{t('allExchangeWhiteList')}</Text>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={{ md: '14rem', base: '0' }}
          borderRadius="20px"
          bg="#3C3C3C"
          flex="1"
          flexDir="column"
        >
          <Text
            fontWeight="bold"
            color="#E49F5C"
            fontSize={{ md: '1.5rem', base: '1.5rem' }}
          >
            16000+ USDT
          </Text>
          <Text align="center">{t('allExchangeAirdrop')}</Text>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={{ md: '14rem', base: '0' }}
          borderRadius="20px"
          bg="#3C3C3C"
          flex="1"
          flexDir="column"
        >
          <Text
            fontWeight="bold"
            color="#E49F5C"
            fontSize={{ md: '1.5rem', base: '1.5rem' }}
          >
            167%
          </Text>
          <Text align="center">{t('exchangeSupremeRights')}</Text>
        </Box>
      </Flex>

      {renderMainContentArea()}
    </Box>
  );
}

export default Redemption;
