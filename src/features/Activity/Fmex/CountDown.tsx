import {
  Box,
  HStack,
  VStack,
  Text,
  Image as ChakraImage,
} from '@chakra-ui/react';
import { useCountDown } from 'ahooks';
import { formatTime } from '../help';
import { useContext } from 'react';
import { PageContext } from './context';
import { useTranslations } from 'next-intl';

export const CountDown = () => {
  const { data } = useContext(PageContext);
  const [_, formattedRes] = useCountDown({
    leftTime: Number(data.end_time) * 1000,
  });
  const { days, hours, minutes, seconds } = formattedRes;
  const ct = useTranslations('common');

  return (
    <HStack
      justify="center"
      spacing={{ md: '80px', base: '0' }}
      w="full"
      h={{ md: '180px', base: '108px' }}
      bgColor="#9E0F39"
      color="white"
      fontSize={{ md: '22px', fontsize: '14px' }}
      lineHeight="22px"
    >
      <HStack spacing="26px" display={{ md: 'flex', base: 'none' }}>
        <ChakraImage
          w={{ md: '46px', base: '46px' }}
          h="auto"
          src="/images/activity/fmex/football.svg"
        />
        <HStack spacing={1}>
          <Box
            w="6px"
            h="6px"
            bgColor="#FF004C"
            transform="rotate(45deg)"
          ></Box>
          <Box
            w="6px"
            h="6px"
            bgColor="#FF004C"
            transform="rotate(45deg)"
          ></Box>
          <Box
            w="6px"
            h="6px"
            bgColor="#FF004C"
            transform="rotate(45deg)"
          ></Box>
          <Box
            w="6px"
            h="6px"
            bgColor="#FF004C"
            transform="rotate(45deg)"
          ></Box>
        </HStack>
      </HStack>
      <HStack spacing={{ md: '40px', base: '24px' }}>
        <VStack spacing={{ md: '30px', base: '16px' }}>
          <Text fontSize={{ md: '48px', base: '24px' }}>
            {formatTime(days * 24 + hours)}
          </Text>
          <Text>{ct('hours')}</Text>
        </VStack>
        <VStack spacing={{ md: '30px', base: '16px' }}>
          <Text fontSize={{ md: '48px', base: '24px' }}>
            {formatTime(minutes)}
          </Text>
          <Text>{ct('minutes')}</Text>
        </VStack>
        <VStack spacing={{ md: '30px', base: '16px' }}>
          <Text fontSize={{ md: '48px', base: '24px' }}>
            {formatTime(seconds)}
          </Text>
          <Text>{ct('seconds')}</Text>
        </VStack>
      </HStack>
      <HStack spacing="26px" display={{ md: 'flex', base: 'none' }}>
        <HStack spacing={1}>
          <Box
            w="6px"
            h="6px"
            bgColor="#FF004C"
            transform="rotate(45deg)"
          ></Box>
          <Box
            w="6px"
            h="6px"
            bgColor="#FF004C"
            transform="rotate(45deg)"
          ></Box>
          <Box
            w="6px"
            h="6px"
            bgColor="#FF004C"
            transform="rotate(45deg)"
          ></Box>
          <Box
            w="6px"
            h="6px"
            bgColor="#FF004C"
            transform="rotate(45deg)"
          ></Box>
        </HStack>
        <ChakraImage
          w={{ md: '46px', base: '46px' }}
          h="auto"
          src="/images/activity/fmex/football.svg"
        />
      </HStack>
    </HStack>
  );
};
