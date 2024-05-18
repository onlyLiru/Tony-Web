import { useEffect, useState } from 'react';
import { Text, VStack, useToast } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useToggle, useRequest, useCountDown } from 'ahooks';
import { CloseIcon } from '@chakra-ui/icons';
import { getuuInfo } from '@/services/points';
import { useTranslations } from 'next-intl';

type Props = {
  type?: 'user' | 'friend' | string;
};

export const ActivityTipModal = ({ type }: Props) => {
  const [show, { toggle }] = useToggle(true);
  const toast = useToast();
  const infoReq = useRequest(getuuInfo, { manual: true });
  const [leftTime, setLeftTime] = useState<number>();
  const [_, formattedRes] = useCountDown({
    leftTime,
  });
  const { hours, minutes, seconds } = formattedRes;
  const t = useTranslations('userDetail');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await infoReq.runAsync({ location: 1 });
        setLeftTime(data.count_down * 1000);
      } catch (error) {
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    };
    if (type === 'user') {
      fetch();
    }
  }, [type]);

  if (!type || (type !== 'user' && type !== 'friend')) return null;

  return (
    <VStack
      pos="fixed"
      w="auto"
      right="4px"
      top="50%"
      hidden={!show}
      bg="white"
      borderRadius="8px 0px 0px 8px"
      justify="space-between"
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        opacity: 0.9,
        backdropFilter: 'blur(50px)',
      }}
      p="10px"
      spacing={2}
      zIndex={10}
    >
      <CloseIcon
        pos="absolute"
        w="12px"
        cursor={'pointer'}
        right="2px"
        top="4px"
        color="#E5E8EB"
        onClick={toggle}
      />
      <Image src="/images/luckDraw/gift.png" w="85px" />
      {type === 'user' ? (
        <Text fontSize="14px">{`${hours < 10 ? `0${hours}` : hours}:${
          minutes < 10 ? `0${minutes}` : minutes
        }:${seconds < 10 ? `0${seconds}` : seconds}`}</Text>
      ) : (
        <Text maxW="100px" color="#5B46DF" align="center" fontSize="14px">
          {t('activityTip')}
        </Text>
      )}
    </VStack>
  );
};
