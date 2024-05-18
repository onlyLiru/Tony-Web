import { useSigner, useSignMessage } from 'wagmi';
import { signMakerOrder } from '@/contract/sign';
import {
  MakerOrder,
  MakerOrderWithoutNonce,
  MakerOrderWithSignature,
} from '@/contract/types';
import { useNonce } from './useNonce';
import { useState } from 'react';
import { TypedDataDomain } from 'ethers';
import { useSwitchChain } from '../useSwitchChain';

const useSignHelper = () => {
  const { data: signer } = useSigner();
  const { getNonce, getMessageNonce } = useNonce();
  const { visitChainId, addresses } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);

  const sign = async (type?: number | undefined) => {
    try {
      setIsSigning(true);
      const nonce = await getMessageNonce(type);
      const signature = await signMessageAsync({
        message: nonce,
      });
      setIsSigning(false);
      return signature;
    } catch (error) {
      setIsSigning(false);
      throw error;
    }
  };

  const signTypedData = async (withoutNonceOorder: MakerOrderWithoutNonce) => {
    try {
      setIsSigning(true);
      const nonce = await getNonce();
      const domain: TypedDataDomain = {
        chainId: visitChainId,
        name: 'UnemetaMarket',
        verifyingContract: addresses.EXCHANGE,
        version: '1',
      };

      const order = {
        ...withoutNonceOorder,
        nonce,
      } as MakerOrder;
      const signature = await signMakerOrder(signer as any, order, domain);
      const orderWithSignature: MakerOrderWithSignature = {
        ...order,
        sign: signature,
      };
      setIsSigning(false);

      return orderWithSignature;
    } catch (error) {
      setIsSigning(true);
      throw error;
    }
  };

  return { isSigning, signer, sign, signTypedData };
};

export default useSignHelper;
