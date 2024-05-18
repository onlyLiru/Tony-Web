import { Contract, ContractTransaction } from 'ethers';
import useSignHelper from './helper/useSignHelper';
import { useMemo, useRef, useState } from 'react';
import { ContractStep, ContractStepType } from './helper/types';
import { useContractStepsRun } from './helper/useStepsRun';
import { useUserDataValue } from '@/store';
import * as marketApis from '@/services/market';
import { useSwitchChain } from './useSwitchChain';

type CollectionFeeParams = {
  methodName: string;
  contractAddress: string;
  fee: string;
  receiver: string;
  complete?: () => void;
  error?: (error: Error) => void;
};

export const useCollectionFee = () => {
  const { addresses, abis, visitChain } = useSwitchChain();
  const { signer } = useSignHelper();
  const [steps, setSteps] = useState<ContractStep[]>([]);
  const paramsRef = useRef<CollectionFeeParams>();
  const userData = useUserDataValue();
  // 钱包是否正在请求用户操作状态
  // 此时一般需要禁言部分按钮操作
  const [isPrompting, setIsPrompting] = useState(false);

  const isLoading = useMemo(
    () => steps.some((el) => el.status === 'pending'),
    [steps],
  );

  const reset = () => {
    setSteps([]);
  };

  const settingFeeTrigger = async () => {
    const { contractAddress, fee, receiver } = paramsRef.current!;
    try {
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.COLLECTION_OWNER_FEE_SETTING
            ? { ...el, status: 'pending' }
            : el,
        ),
      );
      const royContract = new Contract(
        addresses.ROYALTY_FEE,
        abis.ROYALTY_FEE,
        signer!,
      );
      setIsPrompting(true);
      const parseFee = String(+fee * 100);
      const tx: ContractTransaction = await royContract[
        paramsRef.current?.methodName!
      ](contractAddress, userData?.wallet_address!, receiver, parseFee);
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.COLLECTION_OWNER_FEE_SETTING
            ? { ...el, tx }
            : el,
        ),
      );
      await tx.wait();
      setIsPrompting(false);

      const { code, msg } = await marketApis.collectionRoyaltyUpdate({
        chain_id: visitChain.id,
        address: contractAddress,
        proportion: +parseFee,
      });
      if (code !== 200) throw Error(msg);

      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.COLLECTION_OWNER_FEE_SETTING
            ? { ...el, status: 'success' }
            : el,
        ),
      );
      paramsRef.current?.complete?.();
    } catch (error) {
      setIsPrompting(false);
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.COLLECTION_OWNER_FEE_SETTING
            ? { ...el, status: 'faild', trigger: settingFeeTrigger }
            : el,
        ),
      );
      paramsRef.current?.error?.(error);
    }
  };

  const settingFee = async (params: CollectionFeeParams) => {
    paramsRef.current = params;
    setSteps([
      {
        type: ContractStepType.COLLECTION_OWNER_FEE_SETTING,
        status: '',
        trigger: settingFeeTrigger,
      },
    ]);
  };

  useContractStepsRun(steps);

  return { settingFee, isPrompting, isLoading, reset, steps };
};
