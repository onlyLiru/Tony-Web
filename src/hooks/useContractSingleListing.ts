import { BigNumber, Contract, ContractTransaction, utils } from 'ethers';
import * as transactionApis from '@/services/transaction';
import useSignHelper from './helper/useSignHelper';
import { useRef, useState } from 'react';
import { useUserDataValue } from '@/store';
import { MakerOrderWithoutNonce } from '@/contract/types';
import { BulkListItem } from '@/features/ApproveModal';
import { ApiMarket } from '@/services/market';
import { ContractStep, ContractStepType } from './helper/types';
import { useContractStepsRun } from './helper/useStepsRun';
import { useSwitchChain } from './useSwitchChain';
// import approveJson from '@/contract/abi/approve.json';
import { useAccount } from 'wagmi';

export type ContractSingleListingParams = {
  data: ApiMarket.ItemDetail;
  payload: BulkListItem;
  complete?: (res?: transactionApis.ApiTransaction.OrderMakeRes) => void;
  error?: (error: Error) => void;
};

export const useContractSingleListing = () => {
  const { addresses, abis, visitChainId } = useSwitchChain();
  const { signer, signTypedData } = useSignHelper();
  const [steps, setSteps] = useState<ContractStep[]>([]);
  const userData = useUserDataValue();
  const sellParams = useRef<ContractSingleListingParams>();
  // 钱包是否正在请求用户操作状态
  // 此时一般需要禁言部分按钮操作
  const [isPrompting, setIsPrompting] = useState(false);
  const { visitChain } = useSwitchChain();
  const { address } = useAccount();
  const reset = () => {
    setSteps([]);
  };

  const cancelTrigger = async () => {
    try {
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.CANCEL_LISTING
            ? { ...el, status: 'pending' }
            : el,
        ),
      );
      const { data } = await transactionApis.orderGet({
        chain_id: visitChain.id,
        order_id: sellParams.current?.data.item_info.order_id!,
      });

      const transferContract = new Contract(
        addresses.EXCHANGE,
        abis.EXCHANGE,
        signer!,
      );
      // 3333333333 cancelMultipleMakerOrders
      const tx = await transferContract.cancelMultipleMakerOrders?.([
        data.order.nonce,
      ]);
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.CANCEL_LISTING ? { ...el, tx } : el,
        ),
      );
      await tx.wait();
      // const { data: cancelRes } = await transactionApis.orderCancel({
      //   chain_id: visitChain.id,
      //   order_ids: [sellParams.current?.data.item_info.order_id!],
      // });
      // if (!cancelRes.success) {
      //   throw Error(cancelRes.message);
      // }
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.CANCEL_LISTING
            ? { ...el, status: 'success' }
            : el,
        ),
      );
    } catch (error) {
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.CANCEL_LISTING
            ? { ...el, status: 'faild', trigger: cancelTrigger }
            : el,
        ),
      );
      sellParams.current?.error?.(error);
    }
  };

  const collectionApproveTrigger = async () => {
    const data = sellParams.current?.data!;
    const contractAddress = data?.contract_metadata.contract_address!;
    const isERC1155 = +data?.contract_metadata.token_type === 1;
    const operatorAddress = isERC1155
      ? addresses.TRANSFER_MANAGER_ERC1155
      : addresses.TRANSFER_MANAGER_ERC721;
    try {
      // 3333333333 list approve
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.APPROVE_COLLECTION
            ? { ...el, status: 'pending' }
            : el,
        ),
      );
      // 不用接口用合约获取, checkTransferManagerForToken(获取需要用户授权的合约地址）
      const sellContract = new Contract(
        addresses.SELL_APPROVAL,
        abis.SELL_APPROVAL,
        signer!,
      );
      const allowanceAddress = await sellContract.checkTransferManagerForToken(
        contractAddress,
      );
      console.log('step1:allowanceAddress', allowanceAddress);
      if (allowanceAddress) {
        const approvalContract = new Contract(
          contractAddress,
          isERC1155
            ? abis.TRANSFER_MANAGER_ERC1155
            : abis.TRANSFER_MANAGER_ERC721,
          signer!,
        );
        const res = await approvalContract.isApprovedForAll(
          address,
          allowanceAddress,
        );
        console.log('step2:approveStatus', res);
        // 集合合约授权
        if (!res) {
          setIsPrompting(true);
          const approvalTx: ContractTransaction =
            await approvalContract.setApprovalForAll?.(operatorAddress, true);
          setIsPrompting(false);
          setSteps((prev) =>
            prev.map((el) =>
              el.type === ContractStepType.APPROVE_COLLECTION
                ? { ...el, tx: approvalTx }
                : el,
            ),
          );
          await approvalTx.wait();
          // 通知服务端
          // const { data, msg } = await transactionApis.approveSave({
          //   approve: {
          //     contractAddress,
          //     chain: visitChainId,
          //     operator: operatorAddress,
          //   },
          // });
          // if (!data.status) throw Error(msg);
        }
        setSteps((prev) =>
          prev.map((el) =>
            el.type === ContractStepType.APPROVE_COLLECTION
              ? { ...el, status: 'success' }
              : el,
          ),
        );
      }

      // const { data: res } = await transactionApis.approveGet({
      //   approve: {
      //     contractAddress,
      //     chain: visitChainId,
      //     operator: operatorAddress,
      //   },
      // });
    } catch (error) {
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.APPROVE_COLLECTION
            ? { ...el, status: 'faild', trigger: collectionApproveTrigger }
            : el,
        ),
      );
      sellParams.current?.error?.(error);
    }
  };

  const sellTrigger = async () => {
    const payload = sellParams.current?.payload!;

    try {
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.LISTING
            ? { ...el, status: 'pending' }
            : el,
        ),
      );
      // debugger
      // const collectionStrategyResp = await transactionApis.makeActivity({
      //   chain_id: visitChain.id,
      //   contract_address: payload.collection,
      // });
      const strategyAddress = addresses.STRATEGY_STANDARD_SALE;

      const withoutNonceOrder: MakerOrderWithoutNonce = {
        isOrderAsk: true,
        amount: 1, // 数量暂时固定1
        price: utils.parseUnits(
          String(payload.price),
          visitChain.nativeCurrency.decimals,
        ),
        startTime: Math.ceil(new Date().getTime() / 1000),
        endTime: Math.ceil(payload.endTime.getTime() / 1000),
        tokenId: payload.tokenId,
        minPercentageToAsk: 8500,
        collection: payload.collection,
        currency: addresses.LOCAL_WRAPPER_CURRENCY,
        strategy: strategyAddress,
        signer: userData?.wallet_address!,
        params: [],
      };
      setIsPrompting(true);
      const orderWithSignature = await signTypedData(withoutNonceOrder);
      setIsPrompting(false);
      const { data: res } = await transactionApis.orderMake({
        chain_id: visitChain.id,
        itemId: payload.itemId,
        walletAddress: userData?.wallet_address!,
        status: true,
        order: {
          ...orderWithSignature,
          price: BigNumber.from(withoutNonceOrder.price).toString(),
        },
      });
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.LISTING
            ? { ...el, status: 'success' }
            : el,
        ),
      );
      sellParams.current?.complete?.(res);
    } catch (error) {
      setIsPrompting(false);
      setSteps((prev) =>
        prev.map((el) =>
          el.type === ContractStepType.LISTING
            ? { ...el, status: 'faild', trigger: sellTrigger }
            : el,
        ),
      );
      sellParams.current?.error?.(error);
    }
  };

  const singleListing = async (params: ContractSingleListingParams) => {
    sellParams.current = params;
    setSteps([
      {
        type: ContractStepType.APPROVE_COLLECTION,
        status: '',
        trigger: collectionApproveTrigger,
      },
      { type: ContractStepType.LISTING, status: '', trigger: sellTrigger },
    ]);
  };

  const adjustListing = async (params: ContractSingleListingParams) => {
    sellParams.current = params;
    setSteps([
      {
        type: ContractStepType.APPROVE_COLLECTION,
        status: '',
        trigger: collectionApproveTrigger,
      },
      {
        type: ContractStepType.CANCEL_LISTING,
        status: '',
        trigger: cancelTrigger,
      },
      { type: ContractStepType.LISTING, status: '', trigger: sellTrigger },
    ]);
  };

  useContractStepsRun(steps);

  return { singleListing, adjustListing, isPrompting, reset, steps };
};
