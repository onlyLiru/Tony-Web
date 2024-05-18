/**
 * 出售事件hook
 **/
import { useSigner } from 'wagmi';
import { utils, Contract, BigNumber } from 'ethers';
import * as transactionApis from '@/services/transaction';
import useSignHelper from './helper/useSignHelper';
import { useState } from 'react';
import { useUserDataValue } from '@/store';
import { MakerOrderWithoutNonce } from '@/contract/types';
import { BulkListItem } from '@/features/ApproveModal';
import { useSwitchChain } from './useSwitchChain';

/**
 * 事件步骤
 *
 * - `sign` 签名阶段
 * - `approval` token转换授权阶段
 * - `receipt` 等待交易confirm阶段
 * - `done` 流程完成
 */
type StatusValue = '' | 'pending' | 'success';

export const useContractSell = () => {
  const [status, setStatus] = useState<StatusValue>('');
  const { addresses, abis } = useSwitchChain();
  const { signTypedData } = useSignHelper();
  const { data: singer } = useSigner();
  const userData = useUserDataValue();
  const { visitChain } = useSwitchChain();

  const sell = async (params: BulkListItem) => {
    try {
      setStatus('pending');
      const withoutNonceOrder: MakerOrderWithoutNonce = {
        isOrderAsk: true,
        amount: 1, // 数量暂时固定1
        price: utils.parseUnits(
          String(params.price),
          visitChain.nativeCurrency.decimals,
        ),
        startTime: Math.ceil(new Date().getTime() / 1000),
        endTime: Math.ceil(params.endTime.getTime() / 1000),
        tokenId: params.tokenId,
        minPercentageToAsk: 8500,
        collection: params.collection,
        currency: addresses?.LOCAL_WRAPPER_CURRENCY,
        strategy: addresses?.STRATEGY_STANDARD_SALE,
        signer: userData?.wallet_address!,
        params: [],
      };
      const orderWithSignature = await signTypedData(withoutNonceOrder);
      const { data: res } = await transactionApis.orderMake({
        chain_id: visitChain.id,
        itemId: params.itemId,
        walletAddress: userData?.wallet_address!,
        status: true,
        order: {
          ...orderWithSignature,
          price: BigNumber.from(withoutNonceOrder.price).toString(),
        },
      });
      console.log(
        '🚀 ~ file: useContractSell.ts ~ line 69 ~ useContractSell ~ res',
        res,
      );
      // 获取nft合约相关信息
      setStatus('success');
    } catch (error) {
      setStatus('');
      throw error;
    }
  };

  const cancelSell = async ({ orderId }: { orderId: number }) => {
    try {
      setStatus('pending');
      // 获取nft合约相关信息
      const { data } = await transactionApis.orderGet({
        chain_id: visitChain.id,
        order_id: orderId,
      });

      // 交易合约
      const transferContract = new Contract(
        addresses.EXCHANGE,
        abis.EXCHANGE,
        singer!,
      );

      const tx = await transferContract.cancelMultipleMakerOrders?.([
        data.order.nonce,
      ]);
      const receipt = await tx.wait();
      // const { data: cancelRes } = await transactionApis.orderCancel({
      //   chain_id: visitChain.id,
      //   order_ids: [orderId],
      // });
      // if (!cancelRes.success) {
      //   throw Error(cancelRes.message);
      // }
      setStatus('success');
      return receipt;
    } catch (error) {
      setStatus('');
      throw error;
    }
  };

  return { status, sell, cancelSell };
};
