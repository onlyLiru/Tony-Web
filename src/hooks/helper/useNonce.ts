import * as globalApis from '@/services/global';
import * as transactionApis from '@/services/transaction';
import { useUserDataValue } from '@/store';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

export const useNonce = () => {
  const { address } = useAccount();
  const userData = useUserDataValue();
  const getNonce = useCallback(async () => {
    const {
      data: { nonce },
    } = await transactionApis.transactionGetNonce({
      wallet_address: address! || userData?.wallet_address!,
    });
    return nonce;
  }, [userData?.wallet_address, address]);

  const getMessageNonce = useCallback(
    async (type?: number | undefined) => {
      const {
        data: { noce },
      } = await globalApis.nonce({
        walletAddress: address! || userData?.wallet_address!,
        type: type || 0,
      });
      return noce;
    },
    [userData?.wallet_address, address],
  );
  return { getNonce, getMessageNonce };
};
