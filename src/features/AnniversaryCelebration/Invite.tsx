import { Box, Flex, Text, Avatar } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import ShareButton from './components/ShareButton';
import SwipeTip from './components/SwipeTip';
import { useEffect, useState } from 'react';

export const Invite = (props: any) => {
  const t = useTranslations('anniversary');
  const { clientHeight = 0, anniversaryInfo } = props;
  const [inviteList, setInviteList] = useState<[any[], any[], any[]]>([
    [],
    [],
    [],
  ]);
  const boldFont = {
    fontSize: '22px',
    fontWeight: 'bold',
  };

  useEffect(() => {
    if (Array.isArray(anniversaryInfo?.invite_list)) {
      setInviteList([
        anniversaryInfo.invite_list.slice(0, 4),
        anniversaryInfo.invite_list.slice(4, 7),
        anniversaryInfo.invite_list.slice(7, 11),
      ]);
    }
    // else {
    //   setInviteList([mock.slice(0, 4), mock.slice(4, 7), mock.slice(7, 11)]);
    // }
  }, [anniversaryInfo?.invite_list]);

  return (
    <Flex
      direction="column"
      position="relative"
      overflow="auto"
      fontSize="14px"
      height={`${clientHeight}px`}
      paddingTop="12px"
      backgroundImage={`url('/images/anniversary/bg.jpeg')`}
      backgroundSize="100% 100%"
      color="white"
    >
      <ShareButton />
      <Flex mt="32px" pl="35px" pr="32px" direction="column">
        <Text
          fontSize="30px"
          fontWeight="bold"
          background="linear-gradient(180deg, rgba(255,255,255,0.46) 0%, #FFFFFF 100%)"
          backgroundClip="text"
          sx={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('page4Title')}
        </Text>
        <Text mt="44px">{t('page4Content')}</Text>
        <Flex mt="16px" wrap="wrap" {...boldFont} flexWrap="wrap">
          {t.rich('page4Invite', {
            yellow: () => (
              <Text color="#FB9D42" m="0 4px">
                {anniversaryInfo?.invite_count || 0}
              </Text>
            ),
            break: (text) => <Text>{text}</Text>,
          })}
        </Flex>
        {/* <Text {...boldFont}>加入UneMeta</Text> */}
      </Flex>
      {/* 邀请的用户头像 */}
      <Flex p="0 44px" mt="80px" direction="column">
        {/* 为了实现错落的布局，把头像拆成多行，每行里再单独设置具体头像的外边距 */}
        {inviteList.map((inviteItem, inviteIndex) => {
          return (
            <Flex
              justifyContent={
                inviteIndex === 1 ? 'space-evenly' : 'space-between'
              }
              mt="12px"
              key={`invite-${inviteIndex}`}
            >
              {inviteItem.map((childItem, childIndex) => {
                return (
                  <Box
                    key={`child-${childIndex}`}
                    mt={
                      childIndex !== 0 && childIndex !== inviteItem.length - 1
                        ? '8px'
                        : '0'
                    }
                  >
                    <Avatar
                      name={childItem?.nick_name}
                      src={childItem?.image}
                    />
                  </Box>
                );
              })}
            </Flex>
          );
        })}
      </Flex>
      {/* 滑动的提示文案 */}
      <SwipeTip />
    </Flex>
  );
};
