import { NEXT_CHAIN_KEY } from '@/const/cookie';
import { SupportedChainId } from '@/contract/types';
import { isProd } from '@/utils';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const defaultChainId = isProd
  ? SupportedChainId.MAINNET
  : SupportedChainId.EtherTest;

export const staticChainId = SupportedChainId.MAINNET;

const visitChainAtom = atomWithStorage<SupportedChainId>(
  NEXT_CHAIN_KEY,
  defaultChainId,
);

export const useVisitChain = () => {
  return useAtom(visitChainAtom);
};
