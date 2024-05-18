import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Flex, Text, Tooltip, Box, Avatar } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { getScoreRank } from '@/services/rebate';
import { useUserDataValue } from '@/store';
import { HistoryModalRef, HistoryModal } from '@/features/PointsPage';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';

const colorStyle = {
  active: '#E49F5C',
  regular: 'rgba(255,255,255,0.4)',
};
const tabStyle = {
  active: '1px solid #E49F5C',
  regular: '1px solid rgba(255,255,255,0.4)',
};
type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};

function Rankings() {
  const t = useTranslations('points');
  const [curRankTab, changeRankTab] = useState('month');
  const onChangeRankTab = (active: string): void => {
    changeRankTab(active);
  };

  const [rankList, updateRankList] = useState<
    {
      icon: string;
      level: number;
      nick_name: string;
      score: number;
      wallet: string;
    }[]
  >([]);
  const [rankMine, updateRankMine] = useState<any>({});
  const userData = useUserDataValue();
  const web2LoginModal = useRef<ResgisterModalAction>(null);
  const isConnected = useMemo(
    () => !!userData?.wallet_address,
    [userData?.wallet_address],
  );
  const historyModalRef = useRef<HistoryModalRef>(null);

  useEffect(() => {
    // 获取积分排行榜
    const fetchScoreRank = async () => {
      const rankMap: any = {
        month: 1,
        all: 2,
      };

      const result = await getScoreRank({
        page: 1,
        page_size: 10,
        type: rankMap[curRankTab],
      });
      updateRankList(result?.data?.board_list ?? []);
      updateRankMine(result?.data?.my_info);
    };

    fetchScoreRank();
  }, [curRankTab]);

  console.log('rankList:', rankMine);

  const record = (
    <Text
      color="#fff"
      cursor="pointer"
      onClick={() => {
        !isConnected
          ? web2LoginModal?.current?.open()
          : historyModalRef?.current?.open();
      }}
      bg="#CD8F53"
      borderRadius="4px"
      padding={isConnected ? '0 .5rem' : '0'}
    >
      {userData?.wallet_address ? t('uuuRecord') : ''}
    </Text>
  );

  return (
    <>
      <Flex
        justify="space-between"
        flexWrap="wrap"
        mb={{ md: '16px', base: '1rem' }}
      >
        <Flex alignItems={'center'} mb={{ md: '16px', base: '1rem' }}>
          <Text
            fontFamily="MicrosoftYaHei"
            fontWeight="700"
            fontSize="24px"
            color="#fff"
            mr="8px"
            whiteSpace="nowrap"
          >
            {t('rank.rankTitle')}
          </Text>
          <Tooltip label={t('rank.rankDesc')} hasArrow placement="top">
            <QuestionOutlineIcon />
          </Tooltip>
        </Flex>
        <Flex cursor="pointer" mb="8px">
          <Box
            height="32px"
            px="12px"
            lineHeight="30px"
            fontSize="14px"
            textAlign="center"
            color={
              curRankTab === 'month' ? colorStyle.active : colorStyle.regular
            }
            border={curRankTab === 'month' ? tabStyle.active : tabStyle.regular}
            borderRight={curRankTab === 'all' ? 'none' : tabStyle.active}
            borderTopLeftRadius="4px"
            borderBottomLeftRadius="4px"
            onClick={onChangeRankTab.bind(null, 'month')}
            w={{ md: '8rem' }}
          >
            {t('rank.month')}
          </Box>
          <Box
            height="32px"
            px="12px"
            lineHeight="30px"
            fontSize="14px"
            textAlign="center"
            color={
              curRankTab === 'all' ? colorStyle.active : colorStyle.regular
            }
            border={curRankTab === 'all' ? tabStyle.active : tabStyle.regular}
            borderLeft={curRankTab === 'month' ? 'none' : tabStyle.active}
            borderTopRightRadius="4px"
            borderBottomRightRadius="4px"
            onClick={onChangeRankTab.bind(null, 'all')}
            w={{ md: '8rem' }}
          >
            {t('rank.all')}
          </Box>
        </Flex>
      </Flex>
      <Flex flexDir="column" gap="1rem">
        <Flex
          justify="space-between"
          alignItems="end"
          gap={{ md: '20px', base: '.5rem' }}
        >
          <Box
            height={{ md: '222px', base: '212px' }}
            bg="#2879FF"
            width="33%"
            borderRadius={{ md: '20px', base: '1rem' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            gap="6px"
          >
            <Avatar
              size={{ md: 'lg', base: 'md' }}
              name="Dan Abrahmov"
              src={rankList[0]?.icon}
            />
            <Text color="#000">{rankList[0]?.nick_name}</Text>
            <Text fontWeight="bold">{rankList[0]?.score}</Text>
          </Box>
          <Box
            height={{ md: '255px', base: '244px' }}
            bg="#FFCF24"
            width="33%"
            borderRadius={{ md: '20px', base: '1rem' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            gap="6px"
          >
            <Avatar
              size={{ md: 'lg', base: 'md' }}
              name="Dan Abrahmov"
              src={rankList[1]?.icon}
            />
            <Text color="#000">{rankList[1]?.nick_name}</Text>
            <Text fontWeight="bold">{rankList[1]?.score}</Text>
          </Box>
          <Box
            height={{ md: '188px', base: '140px' }}
            bg="#FF6901"
            width="33%"
            borderRadius={{ md: '20px', base: '1rem' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            gap="6px"
          >
            <Avatar
              size={{ md: 'lg', base: 'md' }}
              name="Dan Abrahmov"
              src={rankList[2]?.icon}
            />
            <Text color="#000">{rankList[2]?.nick_name}</Text>
            <Text fontWeight="bold">{rankList[2]?.score}</Text>
          </Box>
        </Flex>
        <Flex flexDir="column" gap="1rem">
          {rankList.slice(3).map((item, i) => (
            <Flex
              justify="space-between"
              alignItems="center"
              bg="#404040"
              padding=".4rem 1rem"
              borderRadius="4px"
              border="1px solid #404040"
              _hover={{
                border: 'solid 1px #E49F5C',
              }}
              key={item.wallet}
            >
              <Flex gap="1rem" alignItems="center">
                <Box
                  w={'1.5rem'}
                  textAlign="center"
                  bg="#4D4D4D"
                  borderRadius="6px"
                >
                  <Text>{i + 4}</Text>
                </Box>
                <Flex gap=".3rem">
                  <Avatar size="xs" name="Dan Abrahmov" src={item.icon} />
                  <Text>{item.nick_name}</Text>
                </Flex>
              </Flex>
              <Text color="#E49F5C">{item.score}</Text>
            </Flex>
          ))}
          <Box
            bg="#E49F5C"
            padding=".4rem 1rem"
            borderRadius="4px"
            border="1px solid #E49F5C"
            _hover={{
              border: 'solid 1px #E49F5C',
            }}
          >
            <Flex justify="space-between">
              <Flex gap="1rem">
                <Box
                  padding={rankMine?.level <= 10 ? '0 .5rem' : '0'}
                  minW={'1.5rem'}
                  textAlign="center"
                  bg="#E8B37C"
                  borderRadius="6px"
                >
                  <Text>
                    {userData?.wallet_address ? (
                      <>
                        {rankMine?.level > 10
                          ? rankMine?.level
                          : t('rank.unrank')}{' '}
                      </>
                    ) : (
                      <>?</>
                    )}
                  </Text>
                </Box>
                <Flex gap=".3rem">
                  <Avatar
                    size="xs"
                    name="Dan Abrahmov"
                    src={
                      userData?.profile_image ??
                      'https://www.unemeta.com/_next/image?url=https%3A%2F%2Fimages.unemeta.com%2Fconsole%2Fdefault_avatar.jpg&w=3840&q=75'
                    }
                  />
                  <Text
                    color="#000"
                    cursor="pointer"
                    onClick={() => {
                      !isConnected ? web2LoginModal?.current?.open() : null;
                    }}
                  >
                    {userData?.username ?? t('loginToView')}
                  </Text>
                </Flex>
              </Flex>
              <Flex gap="1.5rem">
                <div className="hidden md:block">{record}</div>
                <Text color="#000">
                  {userData?.wallet_address ? rankMine?.score : '???'}
                </Text>
              </Flex>
            </Flex>
            <div className="hidden sm:block mt-2 text-center">{record}</div>
          </Box>
        </Flex>
      </Flex>
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
      <HistoryModal ref={historyModalRef} />
    </>
  );
}

export default Rankings;
