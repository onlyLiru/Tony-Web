import {
  Box,
  UseCheckboxProps,
  useCheckbox,
  chakra,
  useCheckboxGroup,
  Flex,
  Text,
  VStack,
  Stack,
} from '@chakra-ui/react';
import { floor } from 'lodash';
import BN from 'bignumber.js';
import React, { useEffect, useMemo } from 'react';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { useUserWalletBalance } from '@/hooks/useUserWalletBalance';
import { defaultChainId } from '@/store';
import { useRouter } from 'next/router';
import { SupportedChainId } from '@/contract/types';
import { useNetwork } from 'wagmi';

const TokenCheckbox = (
  props: UseCheckboxProps & { children: React.ReactNode },
) => {
  const { state, getCheckboxProps, getInputProps, htmlProps } =
    useCheckbox(props);
  return (
    <chakra.label
      userSelect={'none'}
      fontFamily={'Inter'}
      flex="1"
      cursor={state.isDisabled ? 'not-allowed' : 'pointer'}
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Box
        borderRadius={'lg'}
        border="2px solid"
        opacity={state.isDisabled ? 0.5 : 1}
        borderColor={
          state.isChecked && !state.isDisabled ? 'primary.main' : 'primary.gray'
        }
        py={2}
        px={5}
        {...getCheckboxProps()}
      >
        {props.children}
      </Box>
    </chakra.label>
  );
};

export type BalanceCheckoutState = {
  eth: number;
  weth: number;
  canBuy: boolean;
};

type TokenBalanceCheckoutProps = {
  total: number;
  onChange?: (state: BalanceCheckoutState) => void;
};

export const TokenBalanceCheckout = ({
  total = 0,
  ...props
}: TokenBalanceCheckoutProps) => {
  const { value, getCheckboxProps, setValue } = useCheckboxGroup({
    defaultValue: [],
  });
  const router = useRouter();
  const { chain, chains: _chains } = useNetwork();
  const { VisitChainLogo, visitChainSymbols } = useSwitchChain({
    fixedChainId: (+router.query?.chain! as SupportedChainId) || chain?.id,
  });
  const {
    localCurrency,
    wrapperCurrency,
    localCurrencyAmount,
    wrapperCurrencyAmount,
  } = useUserWalletBalance();

  const isSuccess = useMemo(
    () => localCurrency.isSuccess && wrapperCurrency.isSuccess,
    [localCurrency.isSuccess, wrapperCurrency.isSuccess],
  );
  const computedState = useMemo<BalanceCheckoutState>(() => {
    const eth = value.includes('eth') ? localCurrencyAmount : 0;
    const weth = value.includes('weth') ? wrapperCurrencyAmount : 0;
    // 如果 eth + weth 小于总价 则无法购买
    if (new BN(eth).plus(weth).toNumber() < total)
      return { eth, weth, canBuy: false };
    // 需要支付的 eth
    const payEth = new BN(total).minus(weth).toNumber();
    return {
      canBuy: true,
      eth: payEth <= 0 ? 0 : payEth,
      weth: payEth <= 0 ? total : weth,
    };
  }, [localCurrencyAmount, wrapperCurrencyAmount, value, total]);

  useEffect(() => {
    if (!isSuccess) return;
    // if (new BN(ethAmount).toNumber() >= total) return;
    if (
      new BN(localCurrencyAmount).plus(wrapperCurrencyAmount).toNumber() >=
      total
    ) {
      setValue(['eth', 'weth']);
    }
  }, [isSuccess]);

  useEffect(() => {
    props.onChange?.(computedState);
  }, [computedState]);

  return (
    <>
      <VStack w="full" spacing={2} align="flex-start">
        <Stack direction={{ base: 'column', md: 'row' }} w="full">
          <TokenCheckbox
            isDisabled={!localCurrencyAmount}
            {...getCheckboxProps({ value: 'eth' })}
          >
            <Flex>
              <VisitChainLogo.Local mr={2} fontSize={24} />
              <VStack spacing={0} align={'flex-start'} flex={1}>
                <Text fontWeight={'bold'}>{visitChainSymbols.Local}</Text>
                <Text color="primary.sec" fontSize={'sm'}>
                  Balance:{' '}
                  {floor(localCurrencyAmount + wrapperCurrencyAmount, 4)}
                </Text>
              </VStack>
            </Flex>
          </TokenCheckbox>
          {/* <TokenCheckbox
            isDisabled={!wrapperCurrencyAmount}
            {...getCheckboxProps({ value: 'weth' })}
          >
            <Flex>
              <VisitChainLogo.Wrapper mr={2} fontSize={24} />
              <VStack spacing={0} align={'flex-start'} flex={1}>
                <Text fontWeight={'bold'}>{visitChainSymbols.Wrapper}</Text>
                <Text color="primary.sec" fontSize={'sm'}>
                  Balance: {floor(wrapperCurrencyAmount, 4)}
                </Text>
              </VStack>
            </Flex>
          </TokenCheckbox> */}
        </Stack>
      </VStack>

      <Flex mt={1} justify={'space-between'} align="flex-start">
        <VStack w="full" align={'flex-end'} spacing={1}>
          {/* {computedState.weth > 0 && (
            <HStack spacing={2}>
              <WethLogo fontSize={20} />
              <Text fontWeight="bold">{floor(computedState.weth, 6)} WETH</Text>
            </HStack>
          )}
          {computedState.eth > 0 && (
            <HStack spacing={2}>
              <EthLogo fontSize={20} />
              <Text fontWeight="bold">{floor(computedState.eth, 6)} ETH</Text>
            </HStack>
          )}
          {computedState.canBuy && (
            <HStack spacing={2} fontSize="sm">
              <Text color="typo.sec">Total</Text>
              <Text color="primary.main" fontWeight="bold">
                Ξ{total}
              </Text>
            </HStack>
          )} */}
        </VStack>
      </Flex>
    </>
  );
};

export const TokenBalanceResult = ({
  data,
}: {
  data: BalanceCheckoutState;
}) => {
  const router = useRouter();
  const { VisitChainLogo, visitChainSymbols } = useSwitchChain({
    fixedChainId: (+router.query?.chain! as SupportedChainId) || defaultChainId,
  });
  if (!data) return null;
  return (
    <Flex w="full" align={'flex-start'} justify="space-between">
      <Text color="primary.sec">You pay</Text>
      <VStack spacing={0} align={'flex-end'}>
        {data.weth > 0 && (
          <Flex align={'center'}>
            <VisitChainLogo.Wrapper fontSize={20} />
            <Text color="primary.main" fontSize={'sm'} fontWeight="bold">
              {floor(data.weth, 4)} {visitChainSymbols.Wrapper}
            </Text>
          </Flex>
        )}
        {data.eth > 0 && (
          <Flex align={'center'}>
            <VisitChainLogo.Local fontSize={20} />
            <Text color="primary.main" fontSize={'sm'} fontWeight="bold">
              {floor(data.eth, 4)} {visitChainSymbols.Local}
            </Text>
          </Flex>
        )}
      </VStack>
    </Flex>
  );
};
