/**
 * 出售事件hook
 **/
import { useAccount, useSigner } from 'wagmi';
import * as ethers from 'ethers';
import * as transactionApis from '@/services/transaction';
import { useState } from 'react';
import { useSwitchChain } from './useSwitchChain';
import { Contract } from 'ethers';

type StatusValue = '' | 'pending' | 'success';

export const useContractApprove = () => {
  const [status, setStatus] = useState<StatusValue>('');
  const { addresses, abis, visitChainId } = useSwitchChain();
  // 钱包是否正在请求用户操作状态
  // 此时一般需要禁言部分按钮操作
  const [isPrompting, setIsPrompting] = useState(false);
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const approve = async (
    col: transactionApis.ApiTransaction.ApproveListResItem,
  ) => {
    try {
      // 3333333333 list approve
      setStatus('pending');
      const isERC1155 = +col.token_standard === 1;
      const operatorAddress = isERC1155
        ? addresses.TRANSFER_MANAGER_ERC1155
        : addresses.TRANSFER_MANAGER_ERC721;

      setIsPrompting(true);
      // 不用接口用合约获取, checkTransferManagerForToken(获取需要用户授权的合约地址）
      const sellContract = new Contract(
        addresses.SELL_APPROVAL,
        abis.SELL_APPROVAL,
        signer!,
      );
      const allowanceAddress = await sellContract?.checkTransferManagerForToken(
        col.collection,
      );
      console.log('step1:allowanceAddress', allowanceAddress, sellContract);
      if (allowanceAddress) {
        const approvalContract = new Contract(
          col.collection,
          isERC1155
            ? abis.TRANSFER_MANAGER_ERC1155
            : abis.TRANSFER_MANAGER_ERC721,
          signer!,
        );
        const res = await approvalContract?.isApprovedForAll(
          address,
          allowanceAddress,
        );
        if (!res) {
          console.log('step2:approvalContract', approvalContract);
          const approvalTx: ethers.ContractTransaction =
            await approvalContract.setApprovalForAll?.(operatorAddress, true);
          setIsPrompting(false);
          await approvalTx.wait();
          console.log('step4:approveStatus', approvalTx);
        }
      }
      try {
        // 通知服务端
        // const { data, msg } = await transactionApis.approveSave({
        //   approve: {
        //     contractAddress: col.collection,
        //     chain: visitChainId,
        //     operator: isERC1155
        //       ? addresses.TRANSFER_MANAGER_ERC1155
        //       : addresses.TRANSFER_MANAGER_ERC721,
        //   },
        // });
        // if (!data.status) throw Error(msg);
      } catch (error) {
        throw error;
      }
      setStatus('success');
    } catch (error) {
      setStatus('');
      setIsPrompting(false);
      throw error;
    }
  };

  return { status, isPrompting, approve };
};
