import { useState } from 'react';
import { Contract, ContractTransaction } from 'ethers';
import reabateJson from '@/contract/abi/rebate.json';
import useSignHelper from '@/hooks/helper/useSignHelper';
import * as rebateApis from '@/services/rebate';
import { isProd } from '@/utils';

const address = isProd
  ? '0xA93B19f0E81988D4b46596A03d85B296269709a2'
  : '0xBc84FC74436A52F6c06d5c17c3Fb27F528C92Fd0';

export const useClaimEvent = () => {
  const { signer } = useSignHelper();
  const [loading, setLoading] = useState(false);

  const claim = async () => {
    try {
      setLoading(true);
      const contract = new Contract(address, reabateJson, signer!);
      const paused: ContractTransaction = await contract.paused();
      if (paused) {
        setLoading(false);
        return {
          status: false,
        };
      }
      const { data } = await rebateApis.getReward();
      const tx: ContractTransaction = await contract.claim(
        data.id,
        data.tree_id,
        data.number1,
        data.number2,
        data.amount,
        data.proof,
      );
      const reicept = await tx.wait();
      setLoading(false);
      return {
        status: true,
        data: reicept,
      };
    } catch (error) {
      console.log(error);
      setLoading(false);
      return {
        status: false,
        msg: error.msg,
      };
    }
  };

  return { loading, claim };
};
