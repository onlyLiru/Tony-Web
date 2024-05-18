import { useContext, useState } from 'react';
import { BigNumber, Contract, ContractTransaction } from 'ethers';
import contractJson from './contract.json';
import useSignHelper from '@/hooks/helper/useSignHelper';
import * as launchpadApis from '@/services/launchpad';
import { PageContext } from './context';

export const useMintEvent = () => {
  const { signer } = useSignHelper();
  const [loading, setLoading] = useState(false);
  const { data } = useContext(PageContext);

  const mint = async ({ count }: { count: number }) => {
    try {
      setLoading(true);
      const resp = await launchpadApis.proof({
        contract_address: data.contract_address!,
        count,
      });
      const contract = new Contract(
        data.contract_address!,
        contractJson.abi,
        signer!,
      );
      const tx: ContractTransaction = await contract.mintByWhitelist(
        // channel 固定是2
        2,
        resp.data.proof,
        {
          value: BigNumber.from(resp.data.value),
        },
      );
      const reicept = await tx.wait();
      setLoading(false);
      return reicept;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { loading, mint };
};
