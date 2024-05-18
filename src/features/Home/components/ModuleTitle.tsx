import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import * as React from 'react';

export const ModuleTitle = ({
  title,
  iconRender,
  desc,
  extra,
  remark,
  tip,
}: {
  title: string;
  iconRender?: React.ReactNode;
  desc?: string;
  extra?: string | React.ReactNode;
  remark?: any;
  tip?: React.ReactNode;
}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const pcAreaContent = () => (
    <VStack
      position="relative"
      spacing={{ md: '14px', base: '6px' }}
      pl="40px"
      pr="40px"
    >
      {/* {remark ? remark : null} */}
      <Flex w="100%">
        <Text
          fontSize={{ md: '32px', base: '21px' }}
          lineHeight="32px"
          fontWeight="bold"
        >
          {title}
        </Text>
        <Flex
          ml="8px"
          hidden={!desc}
          w="auto"
          // maxW={{ md: '500px', base: '275px' }}
          px="8px"
          py="6px"
          align="center"
          borderRadius="8px"
          bgColor="rgba(251,157,66,0.12)"
        >
          <Text
            color="#FB9D42"
            fontSize="14px"
            lineHeight="14px"
            noOfLines={2}
            align="center"
          >
            {desc}
          </Text>
          {tip}
        </Flex>
      </Flex>
      {extra ? (
        React.isValidElement(extra) ? (
          extra
        ) : (
          <Text
            w="100%"
            mt={{ md: '16px !important', base: '10px !important' }}
            fontSize="14px"
            color="#86909C"
          >
            {extra ?? ''}
          </Text>
        )
      ) : null}
    </VStack>
  );

  const mobileAreaContent = () => (
    <HStack align="center" ml="20px">
      <Text
        hidden={!title}
        fontSize="18px"
        lineHeight="18px"
        fontWeight={700}
        fontFamily="PingFangSC-Medium"
      >
        {title}
      </Text>
      <Text
        hidden={!desc}
        maxW="275px"
        color="#544AEC"
        fontSize="12px"
        lineHeight="12px"
        noOfLines={1}
        borderRadius="2px"
        bgColor="rgba(84,74,236,0.12)"
        px="8px"
        py="4px"
        fontFamily="PingFangSC-Medium"
      >
        {desc}
      </Text>
    </HStack>
  );

  return isLargerThan768 ? pcAreaContent() : mobileAreaContent();
};
