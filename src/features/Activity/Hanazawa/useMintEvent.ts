import { useContext, useState } from 'react';
import { BigNumber, Contract, ContractTransaction } from 'ethers';
import hanazawaJson from '@/contract/abi/hanazawa.json';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { itemMintInfo, updatePublicStatus } from './services';
import { PageInfoContext } from './context';

export const useMintEvent = () => {
  const { signer } = useSignHelper();
  const [loading, setLoading] = useState(false);
  const { data } = useContext(PageInfoContext);

  const freeMint = async ({ count }: { count: number }) => {
    try {
      setLoading(true);
      const resp = await itemMintInfo({ address: data.address!, count });
      const contract = new Contract(data.address!, hanazawaJson.abi, signer!);
      const tx: ContractTransaction = await contract.freeMint(
        JSON.parse(resp.data.proof),
        resp.data.config,
      );
      const reicept = await tx.wait();
      setLoading(false);
      return reicept;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const whitelistMint = async ({ count }: { count: number }) => {
    try {
      setLoading(true);
      const resp = await itemMintInfo({ address: data.address!, count });
      const contract = new Contract(data.address!, hanazawaJson.abi, signer!);
      const tx: ContractTransaction = await contract.whitelistMint(
        JSON.parse(resp.data.proof),
        resp.data.config,
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

  const publicMint = async ({ count }: { count: number }) => {
    try {
      setLoading(true);
      const resp = await itemMintInfo({ address: data.address!, count });
      const contract = new Contract(data.address!, hanazawaJson.abi, signer!);
      const tx: ContractTransaction = await contract.publicMint(count, {
        value: BigNumber.from(resp.data.value),
      });
      const reicept = await tx.wait();
      await updatePublicStatus({ count });
      setLoading(false);
      return reicept;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { loading, freeMint, whitelistMint, publicMint };
};
