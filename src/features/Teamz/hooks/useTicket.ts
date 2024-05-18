import { useEffect, useState } from 'react';
import { useBalanceEvent } from './useBalanceEvent';
import { formatUnits } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { useMintEvent } from './useMintEvent';
import retry from 'retry-as-promised';
import { calculatePrice } from '../helpers/ticketInfo';

const testCont = {
  ticket: '0xc5aED23b0205f0e282005c615295cF15Cf4A906C',
  wallet: '0xC0F89060E1F09D987594AA0BaFCaFa213C522804',
};

const prodCont = {
  ticket: '0x57e4eA0e07dc70BD90D17DB160f6F483bFf29B99',
  wallet: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
};
export const contAddr =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? prodCont : testCont;
const maxRetryT = 2;
export type tiktType = 'express' | 'general' | 'business' | 'red' | 'vip';
export type fetchType = 'init' | 'fresh';
export enum mintAction {
  'add' = 1,
  'decrease' = -1,
}
export enum sevrTiktType {
  'express' = '1',
  'general' = '2',
  'business' = '3',
  'red' = '4',
  'vip' = '5',
}

export type tiktMintType = {
  vip: number;
  red: number;
  express: number;
  general: number;
  business: number;
};
export type tiktPriceType = {
  vip: number;
  red: number;
  express: number;
  general: number;
  business: number;
};
export const UseTicket = (waltAddr: string) => {
  const { getBalance, approve } = useBalanceEvent(contAddr.wallet);
  const { getSupply, getPrice, getSupplyed, mint } = useMintEvent(
    contAddr.ticket,
  );
  // Wallet/User Info
  const [balc, setBalc] = useState('');
  const [outOfBalc] = useState(true);
  const [wrongNet, setWrongNet] = useState(false);
  // Ticket Info
  const [tiktSupply, setTiktSupply] = useState({
    vip: 0,
    red: 0,
    express: 0,
    general: 0,
    business: 0,
  });
  const [tiktSuppiled, setTiktSuppiled] = useState({
    vip: 0,
    red: 0,
    express: 0,
    general: 0,
    business: 0,
  });
  const [tiktPrice, setTiktPrice] = useState({
    vip: 0,
    red: 0,
    express: 0,
    general: 0,
    business: 0,
  });
  const [needRetry, setNeedRetry] = useState({
    price: true,
    supply: true,
    suppiled: true,
  });
  // Mint Info
  const [tiktMint, setTiktMint] = useState({
    vip: 0,
    red: 0,
    express: 1,
    general: 0,
    business: 0,
  });
  const [curTikt, setCurTikt] = useState('express' as tiktType);

  const initBalc = async () => {
    try {
      console.info('[UseTicket][initBalc]waltAddr:', waltAddr);
      const balcRsp = await getBalance(waltAddr);
      console.info('[UseTicket][initBalc]balcRsp:', balcRsp);
      balcRsp ? setBalc(balcRsp) : setBalc('');
      return balcRsp;
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
        console.info('[UseTicket][initBalc][wrongNetwork]:', obj, wrongNetwork);
      } catch (err) {
        console.error('[UseTicket][initBalc]err:', err.message);
      }
    }
  };
  const initApprove = async (contAddr: string, oriBalc: any) => {
    try {
      const ticketTotalPrice = calculatePrice(tiktMint, tiktPrice);

      const apprRsp = await approve(
        contAddr,
        oriBalc,
        ticketTotalPrice,
        waltAddr,
      ); // 通过钱包向商户授权
      console.info('[UseTicket][initApprove]apprRsp:', apprRsp);
      if (!apprRsp) throw new Error('approve fail');
      return apprRsp;
    } catch (err) {
      console.error('[UseTicket][initApprove]err:', err);
    }
  };
  const initSupply = async () => {
    try {
      const supplyRsp: any = await getSupply();
      console.info('[UseTicket]supplyRsp:', supplyRsp);
      setTiktSupply({ ...tiktSupply, ...supplyRsp });
      if (Object.keys(supplyRsp).length) {
        setNeedRetry({ ...needRetry, supply: false });
      }
    } catch (err) {
      console.error('[UseTicket][initSupply]:', err);
    }
  };
  const initPrice = async () => {
    try {
      const priceRsp = await getPrice();
      if (Object.keys(priceRsp).length) {
        const usdtPrice = {
          vip: Number(formatUnits(BigNumber.from(priceRsp.vip), 6)),
          red: Number(formatUnits(BigNumber.from(priceRsp.red), 6)),
          express: Number(formatUnits(BigNumber.from(priceRsp.express), 6)),
          general: Number(formatUnits(BigNumber.from(priceRsp.general), 6)),
          business: Number(formatUnits(BigNumber.from(priceRsp.business), 6)),
        };
        console.log('[UseTicket]usdtPrice:', usdtPrice);
        setTiktPrice({ ...tiktPrice, ...usdtPrice });
        setNeedRetry({ ...needRetry, price: false });
      }
    } catch (err) {
      console.error('[UseTicket][initPrice]:', err);
    }
  };
  const initSupplied = async () => {
    try {
      const suppliedRsp: any = await getSupplyed();
      console.info('[UseTicket]suppliedRsp:', suppliedRsp);
      if (Object.keys(suppliedRsp)) {
        setNeedRetry({ ...needRetry, suppiled: false });
        setTiktSuppiled({ ...tiktSuppiled, ...suppliedRsp });
      }
    } catch (err) {
      console.error('[UseTicket][initSupplied]:', err);
    }
  };
  const setTikt = (type: tiktType) => {
    setCurTikt(type);
    const tiktMint = { express: 0, red: 0, vip: 0, general: 0, business: 0 };
    tiktMint[type] = 1;
    setTiktMint(tiktMint);
  };
  const setMint = (action: mintAction) => {
    const tarTikt = {};
    (tarTikt as any)[curTikt] = tiktMint[curTikt] + action;
    const tiktMintInfo = { ...tiktMint, ...tarTikt };
    console.info('[useTicket]tiktMint:', tiktMintInfo);
    setTiktMint(tiktMintInfo);
  };

  const mintByUsdt = async () => {
    try {
      const approveRes = await initApprove(contAddr.ticket, balc);
      console.log(approveRes);
      if (!approveRes) {
        return;
      }

      const mintRsp = await Promise.all(
        Object.keys(tiktMint).map((item: string) =>
          mint(tiktMint[item as tiktType], item),
        ),
      );
      console.info('[useTicket][mintByUsdt]mintRsp:', mintRsp);
      return mintRsp;
    } catch (err) {
      console.error('[useTicket][mintByUsdt]err', err);
      return '';
    }
  };
  // Helper
  const getTiktInfo = async (type: fetchType, times = 1) => {
    if (type === 'init' && times !== 1) {
      const retry = needRetry.price || needRetry.supply || needRetry.suppiled;
      if (retry) {
        console.error(
          '[useTicket][getTiktInfo]:',
          `${times} Times Retry For Fetch TicketInfo`,
        );
        needRetry.price && (await initPrice());
        needRetry.supply && (await initSupply());
        needRetry.suppiled && (await initSupplied());
      }
    } else {
      await Promise.all([initPrice(), initSupply(), initSupplied()]);
    }
    return times === maxRetryT ? Promise.resolve() : Promise.reject();
  };
  // UseEffect
  useEffect(() => {
    if (waltAddr) {
      retry(() => initBalc(), {
        max: maxRetryT,
        timeout: 10000,
      });
      retry((opt) => getTiktInfo('init', opt.current), {
        max: maxRetryT,
        timeout: 10000,
      });
    }
  }, [waltAddr]);

  return {
    balc,
    outOfBalc,
    tiktSupply,
    tiktSuppiled,
    tiktPrice,
    curTikt,
    setTikt,
    tiktMint,
    setTiktMint,
    setMint,
    mintByUsdt,
    getTiktInfo,
    initBalc,
    wrongNet,
  };
};
