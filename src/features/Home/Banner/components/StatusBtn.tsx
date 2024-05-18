import {
  Box,
  HStack,
  Text,
  Icon,
  ChakraProps,
  useMediaQuery,
  Divider,
} from '@chakra-ui/react';
import { FiArrowUpRight } from 'react-icons/fi';

const StatusBtn = (
  props: ChakraProps & {
    status: 'SOLD OUT' | 'MINT SOON' | 'MINT NOW' | 'ENDED' | 'COMING SOON';
  },
) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const isSoldOut = props.status === 'SOLD OUT' || props.status === 'ENDED';

  return (
    <HStack
      hidden={!props.status}
      py={{ md: '10px', base: '4px' }}
      pl={isSoldOut || props.status === 'MINT NOW' ? '12px' : '10px'}
      pr={{ md: '16px', base: '10px' }}
      rounded={{ md: '6px', base: '3px' }}
      spacing={{ md: isSoldOut ? '14px' : '10px', base: '0' }}
      bgColor={isSoldOut ? '#fff' : '#000'}
      fontSize={{ md: '20px', base: '12px' }}
      lineHeight={{ md: '28px' }}
      fontWeight={600}
      color={isSoldOut ? '#000' : '#fff'}
      {...props}
    >
      <Text whiteSpace="nowrap">{props.status}</Text>
      <HStack spacing={{ md: '10px' }} hidden={props.status === 'COMING SOON'}>
        <Box
          pos="relative"
          h="22px"
          w="1px"
          bgColor={isSoldOut ? '#2B2626' : '#F0E7F5'}
          opacity={0.5}
          hidden={!isLargerThan768}
        >
          <Box
            pos="absolute"
            w="2px"
            h="2px"
            top="0"
            left="-0.5px"
            rounded="full"
            bgColor={isSoldOut ? '#2B2626' : '#F0E7F5'}
          ></Box>
          <Box
            pos="absolute"
            w="2px"
            h="2px"
            bottom="0"
            left="-0.5px"
            rounded="full"
            bgColor={isSoldOut ? '#2B2626' : '#F0E7F5'}
          ></Box>
        </Box>
        <Divider
          hidden={isLargerThan768}
          ml="14px"
          mr="4px !important"
          borderColor="#E2E8F0"
          borderWidth="1px"
          h="12px"
          orientation="vertical"
          opacity="1"
        />
        <Icon as={FiArrowUpRight} />
      </HStack>
    </HStack>
  );
};

export default StatusBtn;
