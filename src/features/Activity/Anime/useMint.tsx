/* eslint-disable @typescript-eslint/no-unused-vars */
import abi from './abi.json';
import { Contract, ContractTransaction } from 'ethers';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { isProd, isPre } from '@/utils';
import * as chain from 'wagmi/chains';
import BN from 'bignumber.js';
import { addressSign, whitelistCheck } from '@/services/launchpad';
import { useBalanceEvent } from './useBalanceEvent';
import { useToast } from '@chakra-ui/react';
import { etherTestNet } from '@/contract';
const chainInfo = isProd ? chain.mainnet : etherTestNet;
const testAddresses = {
  mint: '0xfeC67be082FaeD3AA7C11f7689A54111A2a91DF2', // goerli
  wallet: '0x1e8a172ada8fa9635473edde983e8822f3601fec',
};
// TODO: 上线更改主网合约
const mainnetAddresses = {
  mint: '0x637AAa9c7059B2Df195339B7c55bb2f3cb2eD946', //mint 操作合约地址
  wallet: '0xdac17f958d2ee523a2206206994597c13d831ec7',
};
const addresses = isProd || isPre ? mainnetAddresses : testAddresses;

export const useMint = () => {
  const { signer } = useSignHelper();
  const { address } = useAccount();
  const contract = useMemo(
    () => (signer ? new Contract(addresses.mint, abi, signer!) : null),
    [signer],
  );

  const { getBalance, approve, getAllowBalance } = useBalanceEvent(
    addresses.wallet,
  );
  const [balc, setBalc] = useState('');
  const [approved, setApproved] = useState(false);
  const [wrongNet, setWrongNet] = useState(false);
  const toast = useToast();

  //  查看余额,默认使用余额做批准额度
  const initBalc = async () => {
    try {
      console.info('[UseMint][initBalc]waltAddr:', address);
      const balcRsp = await getBalance(address as string);
      console.info(
        '[UseMint][initBalc]balcRsp:',
        balcRsp,
        new BN(balcRsp?.toString()).div(10 ** 6).toNumber(),
      );
      balcRsp ? setBalc(balcRsp) : setBalc('');
    } catch (err) {
      try {
        const str = err.message || '';
        const matches = str.match(/(.*?)\((.*?)\)/g);
        console.info('matches:', matches);
        const obj: any = {};
        matches[0].split(', ').forEach((keyValue: any) => {
          const [key, value] = keyValue.split('=');
          if (key === 'network' || key === 'detectedNetwork') {
            obj[key] = JSON.parse(value);
          } else {
            obj[key] = value;
          }
        });
        const { detectedNetwork, network } = obj;
        const wrongNetwork = detectedNetwork.chainId !== network.chainId;
        wrongNetwork && setWrongNet(true);
        console.info('[useMint][initBalc][wrongNetwork]:', obj, wrongNetwork);
      } catch (err) {
        console.error('[useMint][initBalc]err:', err.message);
      }
    }
  };
  const initApprove = async (contAddr: string, oriBalc: any) => {
    try {
      if (approved) return;
      console.log(oriBalc, 'oriBalc');
      // const apprRsp = await approve(contAddr, oriBalc); // 通过钱包向商户授权
      const apprRsp = await approve(contAddr, oriBalc); // 通过钱包向商户授权
      console.info('[useMint][initApprove]apprRsp:', apprRsp);
      apprRsp ? setApproved(true) : setApproved(false);
    } catch (err) {
      console.error('[useMint][initApprove]err:', err);
    }
  };
  /** mint  */
  const mint = async (sign: string) => {
    const tx: ContractTransaction = await contract?.publicMint(sign);
    const reicept = await tx?.wait();
    return reicept;
  };

  const mintByUsdt = async (type: string, sign?: string, number?: number) => {
    try {
      if (type === 'AllowMint') {
        const tx: ContractTransaction = await contract?.AllowMint(sign);
        const reicept = await tx?.wait();
        console.info('[useMint][mintByUsdt]mintRsp:', reicept);
        return reicept;
      } else {
        const allowBalanceRes = await getAllowBalance(
          address as string,
          addresses.mint,
        );
        // 3,800,000,000,000
        const singlePriceRes = await contract?.TICKET_PRICE();
        const allowBalance = new BN(allowBalanceRes?.toString()).toNumber();
        const singlePrice = new BN(singlePriceRes?.toString()).toNumber();
        const balcPrice = new BN(balc?.toString()).toNumber();
        // debugger
        console.log(allowBalance, singlePrice, 'singlePrice allowBalance');
        let approved = false; // setState
        // await initApprove(addresses.mint, 0);
        // 授权额度大于购买总额
        if (number) {
          if (balcPrice < singlePrice * number) {
            // debugger
            toast({
              title: 'The current balance is less than the price of the mint',
              status: 'error',
              isClosable: true,
            });
            return false;
          }
          if (allowBalance >= singlePrice * number) {
            approved = true;
            await setApproved(true);
          } else if (allowBalance > 0 && allowBalance < singlePrice * number) {
            // 额度不够，重新授权0
            // debugger
            const approveRes = await initApprove(addresses.mint, 0);
            console.log(
              approveRes,
              'The quota is insufficient and you need to cancel and re-authorize it.',
            );
            return false;
          }
        }
        // 未经过授权
        if (!approved) {
          // 默认授权当前的余额
          const approveRes = await initApprove(addresses.mint, balc);
          console.log(approveRes, 'approveRes');
        } else {
          const tx: ContractTransaction = await contract?.publicMint(number);
          const reicept = await tx?.wait();
          console.log(reicept, 'publicMint reicept');
          return reicept;
        }
      }
    } catch (err) {
      console.error('[useMint][mintByUsdt]err', err);
      return false;
    }
  };
  /** whitelist */
  const allowMint = async (sign: string) => {
    const tx: ContractTransaction = await contract?.AllowMint(sign);
    const reicept = await tx?.wait();
    return reicept;
  };
  /** 是否还可mint，未mint的可以参与 */
  const canMinted = async () => {
    const res: boolean = await contract?.canMinted(address);
    console.log(res);
    return res;
  };
  /** 通过后端接口获取签名 */
  const getSign = async () => {
    const signRes = await addressSign({
      contract_address: addresses.mint,
      wallet_address: address,
    });
    return signRes.data.sign;
  };
  /** 是否在白名单之中 */
  const hasWhiteList = async () => {
    const res = await whitelistCheck({
      contract_address: addresses.mint,
      wallet_address: address,
    });
    return res.data.is_whitelist;
  };

  /** 剩余 */
  const maxSupply = async () => {
    const res = await contract?.TICKET_SUPPLY();
    const res2 = await contract?.SUPPLYED();
    const result =
      new BN(res?.toString()).toNumber() - new BN(res2?.toString()).toNumber();
    console.log(
      result,
      'maxSupply',
      new BN(res?.toString()).toNumber(),
      new BN(res2?.toString()).toNumber(),
    );
    return result;
  };
  /** 获取票价 */
  const getPrice = async () => {
    const res = await contract?.TICKET_PRICE();
    const result = new BN(res?.toString()).div(10 ** 6).toNumber();
    console.log(result, 'price');
    return result;
  };
  /** akiHolder */
  const isAkiHolder = async () => {
    const res = await contract?.balanceOf(address);
    const result = new BN(res?.toString()).toNumber();
    return result;
  };

  return {
    mint,
    allowMint,
    canMinted,
    hasWhiteList,
    maxSupply,
    getSign,
    isAkiHolder,
    getPrice,
    contract,
    initBalc,
    balc,
    mintByUsdt,
    wrongNet,
  };
};
