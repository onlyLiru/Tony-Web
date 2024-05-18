import { supportChains } from '@/contract';
import { useEffect, useState } from 'react';
import { useChainId } from 'wagmi';

export const useChainInfo = () => {
  const chainId = useChainId();
  const [curChainInfo, setcurChainInfo] = useState<any>(null);
  useEffect(() => {
    if (chainId) {
      const chainItemInfo = supportChains.find(
        (item: any) => item.id === chainId,
      );
      setcurChainInfo(chainItemInfo);
    }
  }, [chainId]);

  return { curChainInfo };
};
