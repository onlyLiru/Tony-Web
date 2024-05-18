import { useEffect } from 'react';
import { ContractStep } from './types';

export const useContractStepsRun = (steps: ContractStep[]) => {
  useEffect(() => {
    if (steps.length === 0) return;
    // 所有步骤完成 退出
    if (steps.every((el) => el.status === 'success')) return;
    // 出现任何失败或者进行中的步骤 退出流程
    if (steps.some((el) => el.status === 'faild' || el.status === 'pending'))
      return;
    const lastestSuccessStepIndex = steps.reduce((a, v, i) => {
      if (v.status === 'success') return i + 1;
      return a;
    }, 0);
    steps[lastestSuccessStepIndex]?.trigger?.();
  }, [steps]);
};
