import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useUserWalletBalance } from '@/hooks/useUserWalletBalance';
import { floor } from 'lodash';

export default function BalanceButton() {
  const {
    VisitChainLogo,
    localCurrency,
    localCurrencyAmount,
    wrapperCurrencyAmount,
  } = useUserWalletBalance();

  return (
    <>
      <Flex
        border="1px solid #404040"
        borderRadius="12px"
        align={'center'}
        h="48px"
        padding="0 16px"
        _hover={{ opacity: 0.6 }}
      >
        {/* <HStack align={'center'}>
          <VisitChainLogo.Local fontSize={16} />{' '}
          <Text>{localCurrency.data?.symbol}</Text>
        </HStack> */}
        <VisitChainLogo.Local />
        <Text
          ml="8px"
          fontFamily={'Inter'}
          fontSize="sm"
          fontWeight="bold"
          color="#808080"
        >
          {floor(localCurrencyAmount + wrapperCurrencyAmount, 4)}
          {localCurrency.data?.symbol}
        </Text>
      </Flex>
    </>
  );
}
