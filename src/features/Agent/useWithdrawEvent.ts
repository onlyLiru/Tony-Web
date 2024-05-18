import { useState } from 'react';
import { Contract, ContractTransaction } from 'ethers';
import withdrawJson from '@/contract/abi/promoterWithdraw.json';
import useSignHelper from '@/hooks/helper/useSignHelper';
import * as agentApis from '@/services/agent';
import { isProd } from '@/utils';
import { useToast } from '@chakra-ui/react';

const address = isProd
  ? '0xe9081cD4e0b3E40389d0446A953cDeDE18D2B615'
  : '0xe9081cD4e0b3E40389d0446A953cDeDE18D2B615';

export const useWithdrawEvent = () => {
  const { signer } = useSignHelper();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const withdraw = async () => {
    try {
      setLoading(true);
      const contract = new Contract(address, withdrawJson, signer!);
      const { data } = await agentApis.getWithdrawData();
      const tx: ContractTransaction = await contract.claim(
        data.id,
        2,
        data.amount,
        data.proof,
      );
      await tx.wait();
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      toast({
        status: 'error',
        title: 'withdraw failed',
        variant: 'subtle',
      });
    }
  };

  return { loading, withdraw };
};
