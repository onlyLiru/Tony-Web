import { useAccount, useSigner } from 'wagmi';
import {
  BigNumber,
  constants,
  Contract,
  ContractTransaction,
  utils,
} from 'ethers';
import { useMemo, useRef, useState } from 'react';
import * as transactionApis from '@/services/transaction';
import { useUserDataValue } from '@/store';
import {
  MakerOrderWithVRS,
  TakerOrderWithEncodedParams,
} from '@/contract/types';
import { ContractStep, ContractStepType } from './helper/types';
import { useContractStepsRun } from './helper/useStepsRun';
import { useSwitchChain } from './useSwitchChain';
import BN from 'bignumber.js';

type BuyParams = {
  orderId: number;
  /** 需要支付的eth */
  ethPay?: number;
  /** 是否使用weth支付，决定后续weth是否需要授权 */
  useWeth?: boolean;
  complete?: () => void;
  error?: (error: Error) => void;
};

export const useContractBuy = () => {
  const [steps, setSteps] = useState<ContractStep[]>([]);
  const [fetching, setFethting] = useState(false);
  const data = useRef<transactionApis.ApiTransaction.OrderMakeParams>();
  // 钱包是否正在请求用户操作状态
  // 此时一般需要禁言部分按钮操作
  const [isPrompting, setIsPrompting] = useState(false);
  const { addresses, abis } = useSwitchChain();
  const { data: signer } = useSigner();
  const userData = useUserDataValue();
  const buyParams = useRef<BuyParams>();
  const { visitChain } = useSwitchChain();
  const { address: account } = useAccount();

  // 流程是否完成
  const success = useMemo(
    () => steps.length > 0 && steps.every((step) => step.status === 'success'),
    [steps],
  );

  const reset = () => {
    setSteps([]);
  };

  const wethApproveTrigger = async () => {
    try {
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.APPROVE_WETH
            ? { ...el, status: 'pending' }
            : el,
        ),
      );

      const _data = data.current!;
      const { ...orderRest } = _data!.order;
      if (userData?.wallet_address) {
        // weth 授权
        const wethContract = new Contract(
          addresses.LOCAL_WRAPPER_CURRENCY,
          abis.LOCAL_WRAPPER_CURRENCY,
          signer!,
        );
        console.log('wethContract', wethContract);
        const res = await wethContract.allowance(
          userData?.wallet_address,
          addresses.EXCHANGE,
        );
        const allowance = new BN(res?.toString())
          .div(10 ** visitChain.nativeCurrency.decimals)
          .toNumber();
        const price = new BN(orderRest.price?.toString())
          .div(10 ** visitChain.nativeCurrency.decimals)
          .toNumber();
        console.log('ressssssss', allowance, price);
        if (!allowance || allowance < price) {
          // 应该先查有没有授权过，授权的额度是否大于购买额度，是的话就不重复授权，否则需要重新授权
          setIsPrompting(true);
          const tx: ContractTransaction = await wethContract.approve(
            addresses.EXCHANGE,
            constants.MaxUint256,
          );
          setIsPrompting(false);
          setSteps((prev) =>
            prev.map((el) =>
              el.type === ContractStepType.APPROVE_WETH ? { ...el, tx } : el,
            ),
          );
          await tx.wait();
          try {
            await transactionApis.approveSave({
              approve: {
                contractAddress: addresses.LOCAL_WRAPPER_CURRENCY,
                operator: addresses.EXCHANGE,
                chain: visitChain.id,
              },
            });
          } catch (error) {}
          setSteps((prev) =>
            prev.map((el) =>
              el.type === ContractStepType.APPROVE_WETH
                ? { ...el, status: 'success' }
                : el,
            ),
          );
        } else {
          setSteps((prev) =>
            prev.map((el) =>
              el.type === ContractStepType.APPROVE_WETH
                ? { ...el, status: 'success' }
                : el,
            ),
          );
        }
      }
    } catch (error) {
      setIsPrompting(false);
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.APPROVE_WETH
            ? { ...el, status: 'faild', trigger: wethApproveTrigger }
            : el,
        ),
      );
      buyParams.current?.error?.(error);
    }
  };

  const buyTrigger = async () => {
    try {
      const _data = data.current!;
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.BUY ? { ...el, status: 'pending' } : el,
        ),
      );
      const { sign, ...orderRest } = _data!.order;
      const signedOrder = utils.splitSignature(sign);

      const transferContract = new Contract(
        addresses.EXCHANGE,
        abis.EXCHANGE,
        signer!,
      );

      const takerBidOrder: TakerOrderWithEncodedParams = {
        isOrderAsk: false,
        taker: userData?.wallet_address!,
        price: BigNumber.from(orderRest.price),
        tokenId: orderRest.tokenId,
        minPercentageToAsk: _data!.order.minPercentageToAsk,
        params: utils.defaultAbiCoder.encode([], []),
      };

      const makerAskOrder: MakerOrderWithVRS = {
        ...orderRest,
        isOrderAsk: true,
        params: takerBidOrder.params,
        r: signedOrder.r,
        s: signedOrder.s,
        v: signedOrder.v,
      };

      setIsPrompting(true);
      console.log(
        'buyParams',
        buyParams,
        buyParams.current?.ethPay,
        utils.parseUnits(
          String(buyParams.current?.ethPay),
          visitChain.nativeCurrency.decimals,
        ),
        BigNumber.from(takerBidOrder.price),
      );
      const value = buyParams.current?.ethPay;
      const tx: ContractTransaction =
        await transferContract.matchSellerOrdersWETH(
          takerBidOrder,
          makerAskOrder,
          {
            value: value
              ? utils.parseUnits(
                  String(value),
                  visitChain.nativeCurrency.decimals,
                )
              : // : BigNumber.from(takerBidOrder.price),
                0,
          },
        );
      setIsPrompting(false);
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.BUY ? { ...el, tx } : el,
        ),
      );
      await tx.wait();
      // const { data: dealRes } = await transactionApis.deal({
      //   chain_id: visitChain.id,
      //   item_id: _data.itemId!,
      //   collection_address: makerAskOrder.collection,
      //   from: makerAskOrder.signer,
      //   to: userData?.wallet_address!,
      //   token_id: makerAskOrder.tokenId.toString(),
      //   currency: makerAskOrder.currency,
      //   price: makerAskOrder.price.toString(),
      // });
      // if (dealRes.success) {
      buyParams.current?.complete?.();
      // } else {
      //   throw Error(dealRes.message);
      // }
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.BUY ? { ...el, status: 'success' } : el,
        ),
      );
    } catch (error) {
      console.error(error);
      setIsPrompting(false);
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.BUY
            ? { ...el, status: 'faild', trigger: buyTrigger }
            : el,
        ),
      );
      buyParams.current?.error?.(error);
    }
  };

  const buy = async (params: BuyParams) => {
    try {
      buyParams.current = params;
      setFethting(true);
      // 获取购买参数
      const { data: res } = await transactionApis.orderGet({
        chain_id: visitChain.id,
        order_id: params.orderId,
      });
      data.current = res;
      setFethting(false);
      const next: ContractStep[] = [
        { type: ContractStepType.BUY, status: '', trigger: buyTrigger },
      ];
      if (params.useWeth) {
        // const { data: approveRes } = await transactionApis.approveGet({
        //   approve: {
        //     contractAddress: addresses.LOCAL_WRAPPER_CURRENCY,
        //     operator: addresses.EXCHANGE,
        //     chain: visitChain.id,
        //   },
        // });
        next.unshift({
          type: ContractStepType.APPROVE_WETH,
          status: false ? 'success' : '',
          trigger: wethApproveTrigger,
        });
      }
      // 更新步骤信息
      setSteps(next);
    } catch (error) {
      if (fetching) setFethting(false);
      throw error;
    }
  };

  useContractStepsRun(steps);

  return { fetching, isPrompting, success, steps, buy, reset };
};

// 33333333 isApprovedForAll
// const wethContract = new Contract(
//   addresses.LOCAL_WRAPPER_CURRENCY,
//   abis.LOCAL_WRAPPER_CURRENCY,
//   signer!,
// );
// const res = await wethContract?.isApprovedForAll(
//   account,
//   addresses.EXCHANGE,
// );
