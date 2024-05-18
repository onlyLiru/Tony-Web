import { SupportedChainId } from '@/contract/types';
import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useSwitchChain } from './useSwitchChain';

type UseUserWalletBalanceOptions = {
  /** 固定链值 */
  fixedChainId?: SupportedChainId;
};

export const useUserWalletBalance = (options?: UseUserWalletBalanceOptions) => {
  const { address: userAddress } = useAccount();
  const { addresses, visitChain, VisitChainLogo } = useSwitchChain({
    fixedChainId: options?.fixedChainId,
  });

  const localCurrency = useBalance({
    chainId: visitChain.id,
    address: userAddress!,
    formatUnits: visitChain.nativeCurrency.decimals,
  });
  const wrapperCurrency = useBalance({
    chainId: visitChain.id,
    address: userAddress,
    token: addresses?.LOCAL_WRAPPER_CURRENCY!,
    formatUnits: visitChain.nativeCurrency.decimals,
  });
  const stableCurrency = useBalance({
    chainId: visitChain.id,
    address: userAddress,
    token: addresses?.STABLE_CURRENCY!,
    formatUnits: visitChain.nativeCurrency.decimals,
  });

  const localCurrencyAmount = useMemo(
    () => +(localCurrency.data?.formatted || 0),
    [localCurrency?.data],
  );
  const wrapperCurrencyAmount = useMemo(
    () => +(wrapperCurrency.data?.formatted || 0),
    [wrapperCurrency?.data],
  );
  const statbleCurrencyAmount = useMemo(
    () => +(stableCurrency.data?.formatted || 0),
    [stableCurrency?.data],
  );

  return {
    VisitChainLogo,
    localCurrency,
    wrapperCurrency,
    stableCurrency,
    localCurrencyAmount,
    wrapperCurrencyAmount,
    statbleCurrencyAmount,
  };
};
