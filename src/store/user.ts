import * as globalApi from '@/services/global';
import { atom, useAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useState } from 'react';

const userDataAtom = atom<globalApi.ApiGlobal.getUserInfo | undefined>(
  undefined,
);

const userAuthAtom = atom<globalApi.ApiGlobal.UserAuthRes | undefined>(
  undefined,
);

export const useUserAuth = () => {
  useHydrateAtoms([[userAuthAtom, {}]] as const);
  return useAtom(userAuthAtom);
};

export const useUserData = () => {
  useHydrateAtoms([[userDataAtom, {}]] as const);
  return useAtom(userDataAtom);
};

export const useUserAuthValue = () => {
  const [useAuth] = useUserAuth();
  return useAuth;
};

export const useUserDataValue = () => {
  const [userData] = useUserData();
  return userData;
};

export const useFetchUser = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useUserData();
  const fetchUser = async () => {
    try {
      setErr(false);
      setLoading(true);
      const { data } = await globalApi.getUserInfo();
      // 20230806update: 兼容web2登陆，有邮箱也认为是登陆成功
      if (!data.wallet_address && !data.login_email)
        throw Error('user data fetching error');
      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ file: user.ts ~ line 33 ~ fetchUser ~ error', error);
      setErr(true);
      setLoading(false);
    }
  };
  return { err, loading, userData, fetchUser };
};

export const useFetchAuth = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAuth, setUserAuth] = useUserAuth();
  const fetchAuth = async () => {
    try {
      setErr(false);
      setLoading(true);
      const { data: authData } = await globalApi.getUserAuth({
        list: [{ types: globalApi.AUTH_TYPE.VIP3 }],
      });
      if (!authData.auth_list) throw Error('user data fetching error');
      setUserAuth(authData);
      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ file: user.ts ~ line 33 ~ fetchUser ~ error', error);
      setErr(true);
    }
  };
  return { err, loading, fetchAuth, userAuth };
};

const isShowLogin = atom(false);

export const useIsShowLogin = () => {
  useHydrateAtoms([[isShowLogin, null]] as const);
  return useAtom(isShowLogin);
};
