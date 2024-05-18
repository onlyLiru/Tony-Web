import { setCookie, getCookie, removeCookies } from 'cookies-next';
import type { OptionsType } from 'cookies-next/lib/types';
import { GetServerSidePropsContext } from 'next';

export const JWT_HEADER_KEY = 'Authorization';
export const WALLET_ADDRESS_KEY = 'UserWalletAddress';
export const EMAIL_KEY = 'UserEmail';

export const jwtHelper = {
  getToken: () => {
    return getCookie(JWT_HEADER_KEY);
  },
  setToken: (tk: string, opts?: OptionsType) => {
    setCookie(JWT_HEADER_KEY, tk, opts);
  },
  setWalletAddress: (address: string, opts?: OptionsType) => {
    setCookie(WALLET_ADDRESS_KEY, address, opts);
  },
  setEmail: (email: string, opts?: OptionsType) => {
    setCookie(EMAIL_KEY, email, opts);
  },
  getWalletAddress: () => {
    return getCookie(WALLET_ADDRESS_KEY);
  },
  getEmail: () => {
    return getCookie(EMAIL_KEY);
  },
  clearToken: () => {
    removeCookies(JWT_HEADER_KEY);
    removeCookies(WALLET_ADDRESS_KEY);
    removeCookies(EMAIL_KEY);
  },
  getServerToken: (req: GetServerSidePropsContext['req']) => {
    return {
      headers: {
        [JWT_HEADER_KEY]: `Bearer ${req.cookies[JWT_HEADER_KEY]}`,
      },
    };
  },
};
