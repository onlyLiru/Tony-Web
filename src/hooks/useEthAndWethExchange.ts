import { Contract, ContractTransaction, utils } from 'ethers';
import useSignHelper from './helper/useSignHelper';
import { useMemo, useRef, useState } from 'react';
import { ContractStep, ContractStepType } from './helper/types';
import { useContractStepsRun } from './helper/useStepsRun';
import { useSwitchChain } from './useSwitchChain';

type ExchangeParams = {
  amount: string | number;
  type: 'withdraw' | 'deposit';
  complete?: () => void;
  error?: (error: Error) => void;
};

export const useEthAndWethExchange = () => {
  const { addresses, abis, visitChain } = useSwitchChain();
  const { signer } = useSignHelper();
  const [steps, setSteps] = useState<ContractStep[]>([]);
  const paramsRef = useRef<ExchangeParams>();
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

  const exchangeTrigger = async () => {
    const { type, amount } = paramsRef.current!;
    const isDepsit = type === 'deposit';
    const STEP_TYEP = isDepsit
      ? ContractStepType.WETH_DEPOSITT
      : ContractStepType.WETH_WITHDRAW;
    try {
      setSteps((prev) =>
        prev.map((el) =>
          el.type === STEP_TYEP ? { ...el, status: 'pending' } : el,
        ),
      );
      const wethContract = new Contract(
        addresses.LOCAL_WRAPPER_CURRENCY,
        abis.LOCAL_WRAPPER_CURRENCY,
        signer!,
      );
      setIsPrompting(true);
      const value = utils.parseUnits(
        String(amount),
        visitChain.nativeCurrency.decimals,
      );
      const tx: ContractTransaction = isDepsit
        ? await wethContract?.deposit({ value })
        : await wethContract?.withdraw(value);
      setSteps((prev) =>
        prev.map((el) => (el.type === STEP_TYEP ? { ...el, tx } : el)),
      );
      await tx.wait();
      setIsPrompting(false);

      setSteps((prev) =>
        prev.map((el) =>
          el.type === STEP_TYEP ? { ...el, status: 'success' } : el,
        ),
      );
      paramsRef.current?.complete?.();
    } catch (error) {
      setIsPrompting(false);
      setSteps((prev) =>
        prev.map((el) =>
          el.type === STEP_TYEP
            ? { ...el, status: 'faild', trigger: exchangeTrigger }
            : el,
        ),
      );
      paramsRef.current?.error?.(error);
    }
  };

  const exchange = async (params: ExchangeParams) => {
    paramsRef.current = params;
    const STEP_TYEP =
      params.type === 'deposit'
        ? ContractStepType.WETH_DEPOSITT
        : ContractStepType.WETH_WITHDRAW;
    setSteps([{ type: STEP_TYEP, status: '', trigger: exchangeTrigger }]);
  };

  useContractStepsRun(steps);

  return { exchange, isPrompting, isLoading, reset, steps };
};
