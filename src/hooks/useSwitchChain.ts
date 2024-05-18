import { addressesByNetwork } from '@/contract/constants/addresses';
import { abis } from '@/contract/constants/abis';
import { logosByNetwork, symbolsByNetwork } from '@/contract/constants/logos';
import { Chain, goerli, mainnet, useNetwork, useSwitchNetwork } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { SupportedChainId } from '@/contract/types';
import { defaultChainId, useUserDataValue, useVisitChain } from '@/store';
import { isProd } from '@/utils';
import { supportChains } from '@/contract';
import { useRootModalConsumer } from '@/features/AssetPage';
import useLocalStorage from './storage';
import { LOCAL_KEY } from '@/const/localKey';

type UseSwitchChainOptions = {
  /** 固定链值 */
  fixedChainId?: SupportedChainId;
};

/**
 * 获取chain相关合约地址和abi
 * @returns
 */
export const useSwitchChain = (options?: UseSwitchChainOptions) => {
  const [, setVisitChainId] = useVisitChain();
  const _visitChainId = defaultChainId;
  const user = useUserDataValue();
  const { chain, chains: _chains } = useNetwork();

  const [localChainId, setLocalChainId] = useState(() => {
    try {
      const item = window.localStorage.getItem('unemata_visionChainId');
      return item ? item : defaultChainId;
    } catch (error) {
      return defaultChainId;
    }
  });

  const chainId = useMemo(() => {
    if (Array.isArray(supportChains) && supportChains.length)
      return supportChains
        .map((i) => i?.id)
        .includes(Number(localChainId) as SupportedChainId)
        ? (Number(localChainId) as SupportedChainId)
        : defaultChainId;
  }, [localChainId, supportChains, defaultChainId]);

  // const visitChainId = useMemo(
  //   () => options?.fixedChainId || chainId || _visitChainId,
  //   [options?.fixedChainId, _visitChainId, chainId],
  // );

  const [curretnChainId] = useLocalStorage(
    LOCAL_KEY.currentChainIdKey,
    defaultChainId,
  );
  const [visitChainId, setvisitChainId] = useState<number>(defaultChainId);
  useEffect(() => {
    if (curretnChainId && Number(curretnChainId) > 0) {
      setvisitChainId(curretnChainId);
    }
  }, []);

  const { openSwitchChainModal } = useRootModalConsumer();

  const chains = useMemo<Chain[]>(
    () => (Array.isArray(_chains) && _chains.length ? _chains : supportChains),
    [_chains],
  );

  const network = useSwitchNetwork({
    chainId: Number(visitChainId),
  });

  const visitChain = useMemo(() => {
    if (visitChainId && Array.isArray(chains) && chains.length)
      return (
        chains.find((el) => el.id === visitChainId)! ||
        (isProd ? mainnet : goerli)
      );
    return isProd ? mainnet : goerli;
  }, [visitChainId, chains]);

  /** 是否需要切换钱包链
   * 1.场景链和钱包链不一致
   * 2.浏览链和钱包链不一致
   * 3.场景链和浏览链不一致
   */
  const needSwitchWalletChain = useMemo(
    () =>
      (user?.wallet_address &&
        options?.fixedChainId &&
        options?.fixedChainId !== chain?.id) ||
      (chain && chain?.id !== visitChainId),
    [user?.wallet_address, visitChainId, chain?.id, options?.fixedChainId],
  );
  const needSwitchVisitChain = useMemo(
    () =>
      user?.wallet_address &&
      options?.fixedChainId &&
      options?.fixedChainId !== visitChainId,
    [user?.wallet_address, options?.fixedChainId, visitChainId],
  );
  const needSwitchChain = useMemo(
    () => needSwitchWalletChain || needSwitchVisitChain,
    [needSwitchWalletChain, needSwitchVisitChain],
  );

  /** 切换当前浏览链方法 */
  const onVisitChainChange = (chainId: SupportedChainId) => {
    if (chainId === _visitChainId) return;
    setVisitChainId(chainId);
  };

  /** 切换钱包链方法 */
  const switchChain = async () => {
    try {
      if (needSwitchVisitChain && !needSwitchWalletChain) {
        openSwitchChainModal({
          nextChainId: visitChainId,
          prevChainId: _visitChainId,
          complete: () => {
            onVisitChainChange(visitChainId);
            // window.location.reload();
          },
        });
        return;
      }
      await network?.switchNetworkAsync?.();
      onVisitChainChange(visitChainId);
      // window.location.reload();
    } catch (error) {}
  };

  const addresses = useMemo(
    () => addressesByNetwork[visitChainId],
    [visitChainId],
  );

  const logos = useMemo(() => logosByNetwork[visitChainId], [visitChainId]);

  const symbols = useMemo(() => symbolsByNetwork[visitChainId], [visitChainId]);

  return {
    addresses,
    localChainId,
    setLocalChainId,
    VisitChainLogo: logos,
    visitChainSymbols: symbols,
    abis,
    visitChainId,
    visitChain,
    needSwitchChain,
    switchChain,
    onVisitChainChange,
  };
};
