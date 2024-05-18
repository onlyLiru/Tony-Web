import { parse } from 'querystring';
import { canUseDom } from './canUseDom';
import { supportChains } from '@/contract';
import { Chain } from 'wagmi';

export const root: any = (canUseDom ? window : global) as unknown as Window;

const searchParam = parse(root?.location?.search?.slice(1));

export function shortAddress(address: string) {
  if (!address) return '';
  return `${address.substring(address.length - 6)}`;
}

export function shortCollectionAddress(address: string) {
  if (!address) return '';
  return `${address.substring(0, 2)}...${address.substring(
    address.length - 4,
  )}`;
}

export const addressReg = /^0x[0-9a-fA-F]{40}$/;
export const emailReg =
  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

export const diffTime = (time: number) => {
  try {
    const h = Math.floor((time / 3600) % 24);
    const m = Math.floor((time / 60) % 60);
    const s = Math.floor(time % 60);
    const hh = h > 9 ? h : `0${h}`;
    const mm = m > 9 ? m : `0${m}`;
    const ss = s > 9 ? s : `0${s}`;
    return `${hh}:${mm}:${ss}`;
  } catch (error) {
    return '00:00:00';
  }
};

export const getResizeImageUrl = (src: string, srcSuffix?: string) => {
  const bool = src?.includes('https://storage.unemeta.cn/img/');
  if (!srcSuffix || !bool) return src;
  return `${src}?${srcSuffix}`;
};

export const sliceIntoChunks = (arr: Array<any>, chunkSize: number) => {
  const res: any = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk: any = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

export const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
export const isPre = process.env.NEXT_PUBLIC_VERCEL_ENV === 'pre';

type activeChainType = 'ethereum' | 'goerli';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const activeChain: activeChainType =
  searchParam?.activeChain ?? 'ethereum';

export function mul(a: any, b: any) {
  let m = 0;
  const s1 = a.toString();
  const s2 = b.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    console.log();
  }
  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    console.log();
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  );
}

export const setupNetwork = async (chainId?: number) => {
  const provider = window.ethereum;
  const arr = supportChains?.filter((chain: Chain) => chain.id === chainId);
  const chain = arr.length ? (arr[0] as Chain) : (supportChains[0] as Chain);
  if (!chainId || !chain?.id) {
    console.error('Invalid chain id');
    return false;
  }
  if (provider && provider.request) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      window?.location?.reload();
      return true;
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: [
                  ...chain.rpcUrls.default.http,
                  ...chain.rpcUrls.public.http,
                ],
              },
            ],
          });
          window?.location?.reload();
          return true;
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error);
          return false;
        }
      }
      return false;
    }
  } else {
    console.error(
      "Can't setup the network on metamask because window.ethereum is undefined",
    );
    return false;
  }
};

export function formatToHex66(val: number) {
  return `0x${Number(val).toString(16).padStart(64, '0')}`;
}
