import {
  IconButton,
  IconButtonProps,
  createIcon,
  Flex,
  Text,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { getuuInfo } from '@/services/points';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import IconView from '@/components/iconView';

const RewardIcon = createIcon({
  displayName: 'Nav Reward Icon',
  viewBox: '0 0 26 26',
  path: [
    <g
      key="p1"
      id="页面-1"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="首页"
        transform="translate(-1022.000000, -46.000000)"
        stroke="#14141F"
        strokeWidth="2"
      >
        <g id="编组-14" transform="translate(1022.000000, 46.000000)">
          <circle id="椭圆形备份-3" cx="13" cy="13" r="12"></circle>
          <path
            d="M13.1270847,6.70255441 L15.1418003,10.4129694 L19.3900276,11.0211278 L16.3022623,13.9863651 L17.0081214,18.0408695 L13.1767424,16.2168704 L9.49506705,18.1237665 L10.0730988,13.9713684 L7.0009498,11.0211278 L11.2698296,10.4100129 L13.1270847,6.70255441 Z"
            id="星形"
          ></path>
        </g>
      </g>
    </g>,
  ],
});

export default function RewardButton(
  props: Omit<IconButtonProps, 'aria-label'>,
) {
  const { visitChain } = useSwitchChain();
  const response = useRequest(() => getuuInfo({ location: 0 }), {
    refreshDeps: [visitChain.id],
    pollingInterval: 12000,
    refreshOnWindowFocus: true,
    pollingWhenHidden: false,
    pollingErrorRetryCount: 5,
  });

  const integral: any = response?.data?.data?.integral;
  // 缓存一份供别的页面使用
  window?.localStorage?.setItem('unemata_uuu_balance', integral);

  return (
    <>
      {integral >= 0 ? (
        <NextLink href={`/rewards`} passHref>
          <Link>
            <Flex
              border="1px solid rgba(255,255,255,0.4)"
              borderRadius="12px"
              align={'center'}
              h="40px"
              p="0 16px"
              _hover={{ opacity: 0.6 }}
            >
              {/* <RewardIcon /> */}
              <IconView className="w-[16px] h-[auto]" type="uuuIcon"></IconView>
              <Text
                ml="8px"
                fontFamily={'Inter'}
                fontSize="sm"
                fontWeight="bold"
                color="rgba(255,255,255,1)"
              >
                {integral}uuu
              </Text>
            </Flex>
          </Link>
        </NextLink>
      ) : null}
    </>
  );
}
