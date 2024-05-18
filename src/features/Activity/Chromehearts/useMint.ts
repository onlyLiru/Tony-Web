import abi from './abi.json';
import { Contract, ContractTransaction } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { useMounted } from '@/hooks/useMounted';
import { isProd } from '@/utils';
import * as chain from 'wagmi/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useToast } from '@chakra-ui/react';
import { getErrorMessage } from '@/utils/error';
import { useUserDataValue } from '@/store';
import BN from 'bignumber.js';
import { useTranslations } from 'next-intl';
import { etherTestNet } from '@/contract';

const chainInfo = isProd ? chain.mainnet : etherTestNet;

const testAddresses = {
  mint: '0xAd3C9cdB7fA023E12228d0E3Ad9d53663530b64E', // goerli
  // mint: '0xb8c67b1ed316cd281879b0dcc1cdbf8fefd99d20', // polygon
};

// TODO: 上线更改主网合约
const mainnetAddresses = {
  mint: '0xAd3C9cdB7fA023E12228d0E3Ad9d53663530b64E', //mint 操作合约地址
};

const addresses = isProd ? mainnetAddresses : testAddresses;

/**
 * 写只需关注1个：claim
 * 读：
 * 每阶段的总量 （常量）：totalPhase1X，totalPhase1Y，totalPhase2X，totalPhase2Y，totalPhase3X， totalPhase3Y
 * 整个活动总量（常量）：totalMicDoll
 * 每阶段的剩余量（变量)：claimedCountPhase1X，claimedCountPhase1Y ，claimedCountPhase2X，claimedCountPhase2Y  ，claimedCountPhase3X，claimedCountPhase3Y
 * 单价（常量）：priceMicDollX  priceMicDollY
 * paused(变量）：暂停状态为unpause时，开启当前阶段的领取
 * phaseStopStatus（变量）：当为0时，活动还没开始，当为1时代表第1阶段活动已结束，当为2时代表第2阶段活动已结束，当为3时代表第3阶段活动已结束。
 */
export const useChromeHeartseMint = () => {
  const mounted = useMounted();
  const [isMinting, setIsMinting] = useState(false);
  const [isMinting2, setIsMinting2] = useState(false);
  const { signer } = useSignHelper();
  const { chain } = useNetwork();
  const t = useTranslations('chromeheart');
  const { address } = useAccount();
  // const { now: systemNow } = useWatchNow();
  const { openConnectModal } = useConnectModal();
  const toast = useToast();
  const userData = useUserDataValue();

  const [paused, setPaused] = useState('');
  const [priceMicDollX, setPriceMicDollX] = useState(0);
  const [priceMicDollY, setPriceMicDollY] = useState(0);
  const [countX, setCountX] = useState(0);
  const [countY, setCountY] = useState(0);
  const [phaseStopStatus, setPhaseStopStatus] = useState(0);
  const [isInWhiteList, setIsInWhiteList] = useState(0);

  /** 是否需要切换链 */
  const needSwitchNetwork = useMemo(
    () => chain?.id !== chainInfo.id && signer,
    [chain, signer],
  );

  const { switchNetworkAsync } = useSwitchNetwork({ chainId: chainInfo.id });

  /** 切换到chainInfo */
  const switchNetwork = async () => {
    try {
      setIsMinting(true);
      await switchNetworkAsync?.();
      setIsMinting(false);
      // window.location.reload();
    } catch (error) {
      setIsMinting(false);
      throw error;
    }
  };
  const contract = useMemo(
    () => (signer ? new Contract(addresses.mint, abi, signer!) : null),
    [signer],
  );
  const getStaticData = useCallback(async () => {
    try {
      const res = await contract?.paused();
      setPaused(res);
      const price1 = await contract?.priceMicDollX();
      setPriceMicDollX(
        new BN(price1?.toString() || 500000000000000000)
          .div(10 ** 18)
          ?.toNumber(),
      );
      const price2 = await contract?.priceMicDollY();
      setPriceMicDollY(
        new BN(price2?.toString() || 300000000000000000)
          .div(10 ** 18)
          ?.toNumber(),
      );
      // const total = await contract?.totalMicDoll();

      // phaseStopStatus为0时，活动还没开始，当为1时代表第1阶段活动已结束，当为2时代表第2阶段活动已结束，当为3时代表第3阶段活动已结束。
      const status = await contract?.phaseStopStatus();
      setPhaseStopStatus(status?.toNumber());
      switch (status?.toNumber()) {
        case 0:
          const p1x = await contract?.totalPhase1X();
          const p1y = await contract?.totalPhase1Y();
          const c1x = await contract?.claimedCountPhase1X();
          const c1y = await contract?.claimedCountPhase1Y();
          setCountX(p1x?.toNumber() - c1x?.toNumber());
          setCountY(p1y?.toNumber() - c1y?.toNumber());
          break;
        case 1:
          const p2x = await contract?.totalPhase2Y();
          const p2y = await contract?.totalPhase2Y();
          const c2x = await contract?.claimedCountPhase2X();
          const c2y = await contract?.claimedCountPhase2Y();
          setCountX(p2x?.toNumber() - c2x?.toNumber());
          setCountY(p2y?.toNumber() - c2y?.toNumber());
          break;
        case 2:
          const p3x = await contract?.totalPhase3Y();
          const p3y = await contract?.totalPhase3Y();
          const c3x = await contract?.claimedCountPhase3X();
          const c3y = await contract?.claimedCountPhase3Y();
          setCountX(p3x?.toNumber() - c3x?.toNumber());
          setCountY(p3y?.toNumber() - c3y?.toNumber());
          break;
      }
    } catch (error) {
      throw error;
    }
  }, [contract]);

  const getDataWithAccount = useCallback(async () => {
    try {
      const account = address;
      if (!account) return;
      switch (phaseStopStatus) {
        case 0:
          const isInWhiteList1 = await contract?.recipientsPhase1(account);
          console.log('====recipientsPhase1', isInWhiteList1?.toNumber());
          setIsInWhiteList(isInWhiteList1?.toNumber());
          break;
        case 1:
          const isInWhiteList2 = await contract?.recipientsPhase2(account);
          console.log('====recipientsPhase2', isInWhiteList2?.toNumber());
          setIsInWhiteList(isInWhiteList2?.toNumber());
          break;
        case 2:
          const isInWhiteList3 = await contract?.recipientsPhase3(account);
          console.log('====recipientsPhase3', isInWhiteList3?.toNumber());
          setIsInWhiteList(isInWhiteList3?.toNumber());
          break;
      }
    } catch (error) {
      throw error;
    }
  }, [contract, address, phaseStopStatus]);

  useEffect(() => {
    getStaticData();
    getDataWithAccount();
  }, [getStaticData, getDataWithAccount]);
  /** mint方法 */
  // micDollType是1时代表premium，是2时代表standard
  const mint = async (type: number) => {
    try {
      type === 1 ? setIsMinting(true) : setIsMinting2(true);
      // sender tokenId amount source
      // const estimateGas = await contract?.estimateGas?.claim(type, 2)
      // console.log(estimateGas)
      const v = type === 1 ? priceMicDollX : priceMicDollY;
      const tx: ContractTransaction = await contract?.claim(type, 2, {
        gasLimit: 310000,
        value: new BN(v?.toString()).times(10 ** 18).toString(),
      });
      const reicept = await tx?.wait();
      type === 1 ? setIsMinting(false) : setIsMinting2(false);
      return reicept;
    } catch (error) {
      type === 1 ? setIsMinting(false) : setIsMinting2(false);
      throw error;
    }
  };

  const handleMint = useCallback(
    async (type: number) => {
      try {
        // mint 之前没登录就登录，需要切网就切网
        if (!address) {
          return openConnectModal?.();
        }
        if (needSwitchNetwork) {
          await switchNetwork();
          return toast({
            status: 'success',
            title: 'Switch successed!',
          });
        }
        // 状态是没开始的话 提示mint没开始
        if (paused) {
          toast({
            status: 'error',
            title: t('mint.time'),
          });
          return;
        }
        // 查询当前账户是否已经mint过了一个premium和standard，如果mint过则提示只能mint一个限制
        // tokenid 段
        // premium box
        // phase I 1000001-1000015
        // phase II 1000051-1000080
        // phase III 1000141-1000320
        // standard box
        // phase I 1000016-1000050
        // phase II 1000081-10000140
        // phase III 1000321-1000800
        const inRange = (num: number, min: number, max: number) =>
          num >= min && num <= max;
        const num = await contract?.balanceOf(address);
        let flag = true;
        console.log(
          '====type',
          `${type === 1 ? 'premium box' : 'standard box'}`,
          num?.toNumber(),
          address,
        );
        if (num?.toNumber() > 0) {
          for (let i = 0; i < num?.toNumber(); i++) {
            const index = await contract?.tokenOfOwnerByIndex(address, i);
            const tokenid = new BN(index?.toString()).toNumber();
            console.log('====tokenid', tokenid, 'address', address);

            if (type === 1) {
              // premium box
              if (
                inRange(tokenid, 1000001, 1000015) ||
                inRange(tokenid, 1000051, 1000080) ||
                inRange(tokenid, 1000141, 1000320)
              ) {
                flag = false;
              }
            } else {
              // standard box
              if (
                inRange(tokenid, 1000016, 1000050) ||
                inRange(tokenid, 1000081, 10000140) ||
                inRange(tokenid, 1000321, 1000800)
              ) {
                flag = false;
              }
            }
          }
        }
        // 只允许mint各一个
        if (!flag) {
          toast({
            status: 'error',
            title: t('mint.limit'),
          });
          return;
        }
        // 不是白名单内
        if (!isInWhiteList && !num?.toNumber()) {
          toast({
            status: 'error',
            title: t('mint.white'),
          });
          return;
        }
        const res = await mint(type);
        if (res?.status) {
          toast({ status: 'success', title: 'Mint successed!' });
          getStaticData();
        }
      } catch (error) {
        if (!error.message) return;
        toast({ status: 'error', title: getErrorMessage(error) });
      }
    },
    [address, contract, isInWhiteList],
  );

  return {
    mounted,
    handleMint,
    switchNetwork,
    isMinting,
    isMinting2,
    needSwitchNetwork,
    priceMicDollX,
    priceMicDollY,
    countX,
    countY,
    paused,
  };
};
