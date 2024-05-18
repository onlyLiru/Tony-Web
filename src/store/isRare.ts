import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

const isRare = atom<boolean>(false);
const isRareMode = atom<boolean>(false);

export const useIsRare = () => {
  useHydrateAtoms([[isRare, false]] as const);
  return useAtom(isRare);
};

export const useRareMode = () => {
  useHydrateAtoms([[isRareMode, false]] as const);
  return useAtom(isRareMode);
};
