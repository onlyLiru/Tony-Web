import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import { useSwitchChain } from './useSwitchChain';

export const useAddWethToWallet = () => {
  const { data: signer } = useSigner();
  const { addresses, visitChainSymbols, visitChain } = useSwitchChain();

  const addWethToWallet = async () => {
    try {
      const result = await (
        signer!.provider as ethers.providers.JsonRpcProvider
      )?.send('wallet_watchAsset', {
        type: 'ERC20',
        options: {
          address: addresses.LOCAL_WRAPPER_CURRENCY,
          symbol: visitChainSymbols.Wrapper,
          decimals: visitChain.nativeCurrency.decimals,
        },
      } as any);
      return result;
    } catch (error) {
      console.warn('wallet_watchAsset faild!');
    }
  };
  return { addWethToWallet };
};
