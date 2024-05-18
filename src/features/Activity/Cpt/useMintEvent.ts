import { useState } from 'react';
import { BigNumber, utils, Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import { formatEther } from 'ethers/lib/utils.js';
import contractJson from './contract.json';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { CONTRACT_ADDRESS } from './constants';

export const useMintEvent = () => {
  const { signer } = useSignHelper();
  const [loading, setLoading] = useState(false);

  const mint = async ({
    count,
    proof,
    maxClaimable,
    claimConditionForWallet,
    walletAddress,
  }: {
    count: number;
    proof: any;
    maxClaimable: number;
    claimConditionForWallet: any;
    walletAddress: any;
  }) => {
    const proofResult = Array.isArray(proof) ? proof : [];
    let quantityLimitPerWallet: any =
      +claimConditionForWallet?.maxClaimablePerWallet?.slice(-1);
    quantityLimitPerWallet = Number.isInteger(quantityLimitPerWallet)
      ? quantityLimitPerWallet
      : '115792089237316195423570985008687907853269984665640564039457584007913129639935';

    try {
      setLoading(true);
      const totalPrice = +formatUnits(claimConditionForWallet?.price) * count;
      const contract = new Contract(
        CONTRACT_ADDRESS,
        contractJson.abi,
        signer!,
      );

      const tx = await contract.claim(
        walletAddress,
        count,
        claimConditionForWallet?.currencyAddress,
        claimConditionForWallet?.price,
        {
          proof: proofResult,
          quantityLimitPerWallet,
          pricePerToken:
            proofResult.length > 0
              ? '115792089237316195423570985008687907853269984665640564039457584007913129639935'
              : claimConditionForWallet?.price,
          currency: '0x0000000000000000000000000000000000000000',
        },
        '0x',
        {
          value: utils.parseUnits(totalPrice + ''),
          gasLimit: 300000,
        },
      );

      const reicept = await tx.wait();

      setLoading(false);
      return reicept;
    } catch (error) {
      console.log(error);
      setLoading(false);
      throw error;
    }
  };

  return { loading, mint };
};
