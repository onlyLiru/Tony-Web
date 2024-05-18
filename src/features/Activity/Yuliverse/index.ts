import abi from './abi.json';
import { BigNumber, constants, Contract, ContractTransaction } from 'ethers';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useAccount,
  useContractReads,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';
import busdJson from '@/contract/abi/busd.json';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { formatEther } from 'ethers/lib/utils';
import { useMounted } from '@/hooks/useMounted';
import { approveGet, approveSave } from '@/services/transaction';
import { isProd } from '@/utils';
import { bsc as bscMain, bscTestnet } from 'wagmi/chains';

const bsc = isProd ? bscMain : bscTestnet;

const testAddresses = {
  yuliverse: '0x8b3934a8E1F4c972E1E1884081Cf57c7A129c035',
  busd: '0xb80fbf87969028d055a28530b57f3feaab44d172',
};

const mainnetAddresses = {
  yuliverse: '0xe3CFa5B7eC6f3b72d648Ce6b4b7cD6bb3aaE8cd8',
  busd: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
};

const addresses = isProd ? mainnetAddresses : testAddresses;

const useWatchNow = () => {
  const timer = useRef<any>();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    timer.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);
  return { now };
};

export enum BoxType {
  WHITE = 3,
  GREEN = 4,
}

export enum SaleStatus {
  /** 信息请求中 */
  Pending = 'MINTING SOON ',
  /** 活动未开始 */
  Wait = 'MINTING SOON ',
  /** 白单Mint进行中 */
  WhiteMint = 'White Mint',
  /** Mint进行中 */
  Mint = 'Mint',
  /** 已卖完 */
  Soldout = 'Sold out',
  /** 已过期 */
  Expired = 'Expired',
}

const bscContract = {
  addressOrName: addresses.yuliverse,
  contractInterface: abi,
  chainId: bsc.id,
};

export const useYuliverseMint = () => {
  const mounted = useMounted();
  const [currentBox, setCurrentBox] = useState<BoxType>(BoxType.GREEN);
  const [isMinting, setIsMinting] = useState(false);
  const { signer } = useSignHelper();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { now: systemNow } = useWatchNow();

  const contractData: any = useContractReads({
    watch: true,
    allowFailure: true,
    contracts: [
      {
        ...bscContract,
        functionName: 'getBoxStock',
        args: [currentBox],
      },
      {
        ...bscContract,
        functionName: 'getBoxPrice',
        args: [currentBox],
      },
      {
        ...bscContract,
        functionName: 'getSaleTime',
      },
      {
        ...bscContract,
        functionName: 'isInWhitelist',
        args: [address],
      },
      {
        ...bscContract,
        functionName: 'getBuyCountMap',
        args: [address],
      },
    ],
  });

  const cantGetData = useMemo(
    () =>
      !contractData.isSuccess ||
      !contractData.data ||
      !Array.isArray(contractData.data) ||
      !mounted,
    [mounted, contractData.isSuccess, contractData.data],
  );

  /** 盒子总供应量和已mint的数量 */
  const totalSupplyWithMinted = useMemo(() => {
    if (cantGetData || !contractData?.data?.[0])
      return { totalSupplyNum: 0, mintedNum: 0 };
    const [remaining, totalSupply] = contractData?.data?.[0]! as [
      BigNumber,
      BigNumber,
    ];
    const totalSupplyNum = totalSupply.toNumber();
    const mintedNum = totalSupply.sub(remaining).toNumber();
    return { totalSupplyNum, mintedNum };
  }, [cantGetData, contractData.data]);

  /** 盒子价格 */
  const price = useMemo(() => {
    if (cantGetData || !contractData?.data?.[1]) return 0;
    return formatEther(contractData.data?.[1]!);
  }, [cantGetData, contractData.data]);

  /** mint时间区间 */
  const saleTime = useMemo<[number, number]>(() => {
    if (cantGetData || !contractData?.data?.[2]) return [0, 0];
    const [start, end] = contractData.data?.[2]!;
    return [start.toNumber(), end.toNumber()];
  }, [cantGetData, contractData.data]);

  /** 是否在白单中 */
  const isInWhitelist = useMemo(() => {
    if (cantGetData || !contractData?.data?.[3]) return false;
    return contractData.data?.[3]!;
  }, [cantGetData, contractData.data]);

  /** 用户已mint数量 */
  const userBuyCount = useMemo(() => {
    if (cantGetData || !contractData?.data?.[4]) return Number.MAX_VALUE;
    return contractData.data?.[4]
      ? contractData.data?.[4]!.toNumber()
      : Number.MAX_VALUE;
  }, [cantGetData, contractData.data]);

  /** 销售状态 */
  const saleStatus = useMemo<SaleStatus>(() => {
    if (!saleTime.filter(Boolean).length) return SaleStatus.Pending;
    if (
      totalSupplyWithMinted.totalSupplyNum === totalSupplyWithMinted.mintedNum
    )
      return SaleStatus.Soldout;
    const now = Math.ceil(Date.now() / 1000);
    const [start, end] = saleTime;
    const whiteMintStart = start - 5 * 60;
    if (now < whiteMintStart) return SaleStatus.Wait;
    if (now >= whiteMintStart && now < start) return SaleStatus.WhiteMint;
    if (now >= start && end > now) return SaleStatus.Mint;
    return SaleStatus.Expired;
  }, [systemNow, saleTime, totalSupplyWithMinted]);

  /** 是否需要切换链 */
  const needSwitchNetwork = useMemo(
    () => chain?.id !== bsc.id && signer,
    [chain, signer],
  );

  const { switchNetworkAsync } = useSwitchNetwork({ chainId: bsc.id });

  /** 切换到bsc */
  const switchNetwork = async () => {
    try {
      setIsMinting(true);
      await switchNetworkAsync?.();
      setIsMinting(false);
      window.location.reload();
    } catch (error) {
      setIsMinting(false);
      throw error;
    }
  };

  /** mint方法 */
  const mint = async (type: BoxType, amount?: number) => {
    try {
      setIsMinting(true);
      const { data: approveRes } = await approveGet({
        approve: {
          contractAddress: addresses.busd,
          operator: addresses.yuliverse,
          chain: bsc.id,
        },
      });
      if (!approveRes.status) {
        const busdContract = new Contract(
          addresses.busd,
          busdJson.abi,
          signer!,
        );
        const busdApproveTx: ContractTransaction = await busdContract.approve(
          addresses.yuliverse,
          constants.MaxUint256,
        );
        await busdApproveTx.wait();
        try {
          await approveSave({
            approve: {
              contractAddress: addresses.busd,
              operator: addresses.yuliverse,
              chain: bsc.id,
            },
          });
        } catch (error) {}
      }

      const contract = new Contract(addresses.yuliverse, abi, signer!);
      const tx: ContractTransaction = await contract.buyBox(type, amount || 1);
      const reicept = await tx.wait();
      setIsMinting(false);
      return reicept;
    } catch (error) {
      setIsMinting(false);
      throw error;
    }
  };
  return {
    saleStatus,
    mounted,
    isInWhitelist,
    userBuyCount,
    contractDataLoading: contractData.isLoading,
    contractDataError: contractData.isError,
    ...totalSupplyWithMinted,
    price,
    saleTime,
    currentBox,
    setCurrentBox,
    mint,
    switchNetwork,
    isMinting,
    needSwitchNetwork,
  };
};
