import { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import erc20 from '@/contract/abi/erc20.2024.json';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { formatUnits } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { useToast } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

let contract: any = null;
/**
 *
 * @param contractAddress
 * 测试环境默认传0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
 * @returns
 */
export const useBalanceEvent = (contractAddress: string) => {
  const { signer } = useSignHelper();
  const toast = useToast();
  const t = useTranslations('teamz');

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
          // gasLimit: 300000,
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
  const approve = async (
    contractAddress: any,
    price: any,
    ticketTotalPrice: number,
    waltAddr: string,
  ): Promise<any> => {
    try {
      if (contract) {
        let approveTX = null;
        let approveZeroTX = null;
        const allowance = await contract.allowance(waltAddr, contractAddress);
        const allowanceNum = Number(formatUnits(BigNumber.from(allowance), 6));
        console.log(allowanceNum);
        //如果授权额度足够支付，则直接走购买流程
        if (allowanceNum >= ticketTotalPrice) {
          return true;
        }

        //如果有授权额度，并且额度不够支付，则先授权为0，再授权足够额度
        if (allowanceNum > 0 && allowanceNum < ticketTotalPrice) {
          toast({
            title: t('insufficientApprove' as any),
            status: 'error',
            position: 'top',
            duration: 4000,
            containerStyle: { mt: '15%' },
          });

          approveZeroTX = await contract.approve(contractAddress, 0, {
            // gasLimit: 300000,
          });
          const reiceptZeroTX = await approveZeroTX.wait();
          console.log(reiceptZeroTX);
        }

        approveTX = await contract.approve(contractAddress, price, {
          // gasLimit: 300000,
        });
        const reiceptTX = await approveTX.wait();
        console.log(reiceptTX);
        return approve(contractAddress, price, ticketTotalPrice, waltAddr);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (signer) initContract();
  }, [contractAddress, signer]);

  return { loading, getBalance, approve };
};
