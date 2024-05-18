import { useState, useEffect } from 'react';
import { BigNumber, Contract } from 'ethers';
import erc20 from '@/contract/abi/erc20.json';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { formatUnits } from 'ethers/lib/utils.js';
import { useUserDataValue } from '@/store';

let contract: any = null;
/**
 *
 * @param contractAddress
 * 测试环境默认传0x1e8a172ada8fa9635473edde983e8822f3601fec
 * @returns
 */
export const useBalanceEvent = (contractAddress: string) => {
  const { signer } = useSignHelper();

  const [loading, setLoading] = useState(true);

  const initContract = async () => {
    contract = new Contract(contractAddress, erc20.abi, signer!);
    setLoading(false);
  };

  /**
   * 查询对应的钱包已有的余额
   */
  const getBalance = async (walletAddress: string) => {
    try {
      if (contract) {
        const tx = await contract.balanceOf(walletAddress, {
          gasLimit: 300000,
        });

        return tx;

        // 转成成wei单位：formatUnits(BigNumber.from(tx), 'wei')
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * 对合约进行授权
   * contractAddress 合约地址
   * price getBalance方法返回的余额直接传过来就好
   */
  const approve = async (contractAddress: any, price: any) => {
    try {
      if (contract) {
        const tx = await contract.approve(contractAddress, price, {
          gasLimit: 300000,
        });

        return tx;
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * 查询对应的钱包已授权的余额
   */
  const getAllowBalance = async (
    walletAddress: string,
    contractAddress: string,
  ) => {
    try {
      if (contract) {
        const tx = await contract.allowance(walletAddress, contractAddress, {
          gasLimit: 300000,
        });

        return tx;

        // 转成成wei单位：formatUnits(BigNumber.from(tx), 'wei')
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (signer) initContract();
  }, [contractAddress, signer]);

  return { loading, getBalance, approve, getAllowBalance };
};
