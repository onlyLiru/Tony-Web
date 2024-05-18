import abi from './abi.json';
import { Contract, ContractTransaction } from 'ethers';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { isProd, isPre } from '@/utils';
import * as chain from 'wagmi/chains';
import BN from 'bignumber.js';
import { addressSign, whitelistCheck } from '@/services/launchpad';
import { formatBytes32String, toUtf8Bytes, hexValue } from 'ethers/lib/utils';
import { etherTestNet } from '@/contract';

const chainInfo = isProd ? chain.mainnet : etherTestNet;
const testAddresses = {
  mint: '0x7E6edBABC96e40154e38bc55D89D9dd261346803', // goerli
  // mint: '0xb8c67b1ed316cd281879b0dcc1cdbf8fefd99d20', // polygon
};

// TODO: 上线更改主网合约
const mainnetAddresses = {
  mint: '0x430fe243e843e2af17cdc646bcff68425ea13ff0', //mint 操作合约地址
};

const addresses = isProd || isPre ? mainnetAddresses : testAddresses;

export const useMint = () => {
  const { signer } = useSignHelper();
  const { address } = useAccount();
  const contract = useMemo(
    () => (signer ? new Contract(addresses.mint, abi, signer!) : null),
    [signer],
  );
  //   const contract = new Contract(addresses.mint, abi, signer!)
  /** mint  */
  const mint = async (sign: string) => {
    const tx: ContractTransaction = await contract?.freeMint(sign);
    const reicept = await tx?.wait();
    return reicept;
  };
  /** mint时间是否开始 */
  const mintStart = async () => {
    const res = await contract?.ALLOW_START_TIME();
    const startTime = new BN(res?.toString()).toNumber();
    // console.log(res, startTime) //unit256
    return startTime;
  };
  /** public mint时间是否开始 */
  const publicMintStart = async () => {
    const res = await contract?.PUBLIC_START_TIME();
    const startTime = new BN(res?.toString()).toNumber();
    // console.log(res, startTime) //unit256
    return startTime;
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
    // 结果是转不转都一样
    const res = await contract?.MAX_SUPPLY();
    const res2 = await contract?.SUPPLY();
    const result =
      new BN(res?.toString()).toNumber() - new BN(res2?.toString()).toNumber();
    console.log(result);
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
    mintStart,
    publicMintStart,
    canMinted,
    hasWhiteList,
    maxSupply,
    getSign,
    isAkiHolder,
    contract,
  };
};
