import { ApiPoints, getuuInfo } from '@/services/points';
import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useState } from 'react';

const uuInfoAtom = atom<ApiPoints.uuInfo>({} as ApiPoints.uuInfo);
const inviteCode = atom('');
const initIsShowReceiveModal = atom(false);
const initIsShowReceivedModal = atom(false);
const initIsShowCanNotReceiveModal = atom(false);
const showInviteModal = atom(true);

// /api/backend/api/project/v1/joinme/scode 统一获取
const invitationCode = atom('');
const isWhite = atom(false);
const isInvited = atom(false);

export const useInviteCode = () => {
  useHydrateAtoms([[inviteCode, '']] as const);
  return useAtom(inviteCode);
};

export const useShowInviteModal = () => {
  useHydrateAtoms([[showInviteModal, true]] as const);
  return useAtom(showInviteModal);
};

export const useUuInfo = () => {
  useHydrateAtoms([[uuInfoAtom, {}]] as const);
  return useAtom(uuInfoAtom);
};

export const useUuInfoValue = () => {
  const [uuInfo] = useUuInfo();
  return uuInfo;
};

export const useFetchUuInfo = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uuInfo, setUuInfo] = useUuInfo();
  const fetchUuInfo = async () => {
    try {
      setErr(false);
      setLoading(true);
      const { data } = await getuuInfo({ location: 1 });
      setUuInfo(data);
      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ file: user.ts ~ line 33 ~ fetchUuInnfo ~ error', error);
      setErr(true);
    }
  };
  return { err, loading, uuInfo, fetchUuInfo };
};

export const useIsWhite = () => {
  useHydrateAtoms([[isWhite, null]] as const);
  return useAtom(isWhite);
};
export const useIsInvited = () => {
  useHydrateAtoms([[isInvited, null]] as const);
  return useAtom(isInvited);
};
export const useInvitationCode = () => {
  useHydrateAtoms([[invitationCode, '']] as const);
  return useAtom(invitationCode);
};

export const useNftReceiveModal = () => {
  useHydrateAtoms([[initIsShowReceiveModal, false]] as const);

  return useAtom(initIsShowReceiveModal);
};

export const useNftReceivedModal = () => {
  useHydrateAtoms([[initIsShowReceivedModal, false]] as const);

  return useAtom(initIsShowReceivedModal);
};

export const useNftCanNOtReceiveModal = () => {
  useHydrateAtoms([[initIsShowCanNotReceiveModal, false]] as const);

  return useAtom(initIsShowCanNotReceiveModal);
};
