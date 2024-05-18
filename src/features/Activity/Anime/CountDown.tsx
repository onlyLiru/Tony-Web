import React, { useEffect } from 'react';
import { HStack, Center, Text } from '@chakra-ui/react';
import { useCountDown } from 'ahooks';

const CountDown = ({
  timestamp,
  onFinish,
}: {
  timestamp: number;
  onFinish: any;
}) => {
  const [_, formattedRes] = useCountDown({
    leftTime: timestamp,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  useEffect(() => {
    if ([days, hours, minutes, seconds].every((v) => v === 0)) {
      onFinish();
    }
  }, [days, hours, minutes, seconds]);

  return (
    <HStack
      w={{ md: '794px', base: '343px' }}
      h={{ md: '134px', base: '58px' }}
      pl={{ md: '18px', base: '8px' }}
      spacing="0"
      fontFamily={'Silkscreen'}
    >
      <HStack
        spacing={{ md: '20px', base: '9px' }}
        w={{ md: '200px', base: '85px' }}
        align="flex-end"
        fontFamily={'font-family: PingFangSC-Semibold, PingFang SC;'}
      >
        <Center
          w={{ md: '100px', base: '43px' }}
          h={{ md: '96px', base: '42px' }}
          fontSize={{ md: '40px', base: '17px' }}
          color="#fff"
          opacity={0.8}
          borderRadius="8px"
          bgColor="rgba(255,255,255,0.2)"
        >
          {days}
        </Center>
        <Text
          fontSize={{ md: '24px', base: '10px' }}
          lineHeight={{ md: '28px', base: '10px' }}
          color="#fff"
        >
          D
        </Text>
      </HStack>
      <HStack
        spacing={{ md: '20px', base: '9px' }}
        w={{ md: '200px', base: '85px' }}
        align="flex-end"
      >
        <Center
          w={{ md: '100px', base: '43px' }}
          h={{ md: '96px', base: '42px' }}
          fontSize={{ md: '40px', base: '17px' }}
          color="#fff"
          opacity={0.8}
          borderRadius="8px"
          bgColor="rgba(255,255,255,0.2)"
        >
          {hours}
        </Center>
        <Text
          fontSize={{ md: '24px', base: '10px' }}
          lineHeight={{ md: '28px', base: '10px' }}
          color="#fff"
        >
          H
        </Text>
      </HStack>
      <HStack
        spacing={{ md: '20px', base: '9px' }}
        w={{ md: '200px', base: '85px' }}
        align="flex-end"
      >
        <Center
          w={{ md: '100px', base: '43px' }}
          h={{ md: '96px', base: '42px' }}
          fontSize={{ md: '40px', base: '17px' }}
          color="#fff"
          opacity={0.8}
          borderRadius="8px"
          bgColor="rgba(255,255,255,0.2)"
        >
          {minutes}
        </Center>
        <Text
          fontSize={{ md: '24px', base: '10px' }}
          lineHeight={{ md: '28px', base: '10px' }}
          color="#fff"
        >
          M
        </Text>
      </HStack>
      <HStack
        spacing={{ md: '20px', base: '9px' }}
        w={{ md: '200px', base: '85px' }}
        align="flex-end"
      >
        <Center
          w={{ md: '100px', base: '43px' }}
          h={{ md: '96px', base: '42px' }}
          fontSize={{ md: '40px', base: '17px' }}
          color="#fff"
          opacity={0.8}
          borderRadius="8px"
          bgColor="rgba(255,255,255,0.2)"
        >
          {seconds}
        </Center>
        <Text
          fontSize={{ md: '24px', base: '10px' }}
          lineHeight={{ md: '28px', base: '10px' }}
          color="#fff"
        >
          S
        </Text>
      </HStack>
    </HStack>
  );
};

export default CountDown;
