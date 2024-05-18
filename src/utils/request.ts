import { NEXT_LOCALE_KEY } from '@/const/cookie';
import { getCookie } from 'cookies-next';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import router from 'next/router';
import { getServerUrl } from './getBaseUrl';
import { jwtHelper, JWT_HEADER_KEY } from './jwt';

/** 分页参数 */
export type PaginationType = {
  now_page_num?: number;
  page_limit_num?: number;
};

export type PaginationV1Type = {
  page?: number;
  page_size?: number;
};

export class FetchError extends Error {
  response: Response;
  data: {
    message: string;
  };
  constructor({
    message,
    response,
    data,
  }: {
    message: string;
    response: Response;
    data: {
      message: string;
    };
  }) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.name = 'FetchError';
    this.response = response;
    this.data = data ?? { message: message };
  }
}

type RequestOptionsType = Omit<RequestInit, 'body'> & { body?: any };

export async function createRequest(
  url: string,
  options: RequestInit,
  extra?: any,
) {
  const opts: any = {
    ...options,
    headers: { ...options.headers },
  };

  if (typeof opts.body !== 'string') opts.body = JSON.stringify(opts.body);

  (opts.headers as any)['Content-Type'] = 'application/json; charset=utf-8';

  const localParam = process.browser
    ? router.locale
    : getCookie(NEXT_LOCALE_KEY);

  const locale = (opts.headers as any)[NEXT_LOCALE_KEY];
  if (!locale) (opts.headers as any)[NEXT_LOCALE_KEY] = localParam || 'en';
  try {
    const token = jwtHelper.getToken();
    if (!!token) {
      (opts.headers as any)[JWT_HEADER_KEY] = `Bearer ${token}`;
    }
  } catch (error) {
    console.log(
      '🚀 ~ file: request.ts ~ line 64 ~ createRequest ~ error',
      error,
    );
  }
  try {
    const fetchUrl = `${getServerUrl()}${url}`;
    const response = await fetch(fetchUrl, {
      ...opts,
      credentials: 'include',
    });

    let data: any;
    try {
      data = await response.json();
    } catch (error) {
      console.error(error);
      throw new FetchError({
        message: response.statusText,
        response,
        data,
      });
    }

    if (response.ok && data?.code === 200) {
      return data;
    }
    console.log(response);
    throw new FetchError({
      message: response.statusText,
      response,
      data,
    });
  } catch (e: any) {
    const status = e.response?.status;
    // environment should not be used
    if (status === 401) {
      if (!extra?.unlogin) {
        jwtHelper.clearToken();
        // if (url === '/api/backend/api/user/v1/users/id') {
        //   window.location.reload();
        // }
        // window.sessionStorage.setItem('oldRoute', router.route);
        // router.push('/login');
      }
    }
    throw { ...e.data, message: e?.data?.msg };
  }
}

// eslint-disable-next-line no-unused-vars
const generatorRequest = <T>(
  prefix = '/api/backend',
): ((url: string, options?: RequestInit, extra?: any) => Promise<T>) => {
  return (url: string, options?: RequestInit, extra?: any) =>
    createRequest(`${prefix}${url}`, options || {}, extra);
};
// const chatRequest = <T>(
//   prefix = '/api',
// ): ((url: string, options?: RequestInit, extra?: any) => Promise<T>) => {
//   return (url: string, options?: RequestInit, extra?: any) =>
//     createRequest(`${prefix}${url}`, options || {}, extra);
// };

// client side main request
const request: <T = any>(
  url: string,
  options?: RequestOptionsType,
) => Promise<T> = generatorRequest();

// client side main request
export const requestV1: <T = any>(
  url: string,
  options?: RequestOptionsType,
  extra?: any,
) => Promise<{ code: number; msg: string; data: T }> = generatorRequest();

// export const requestV1Chat: <T = any>(
//   url: string,
//   options?: RequestOptionsType,
//   extra?: any,
// ) => Promise<{ code: number; msg: string; data: T }> = chatRequest();

export default request;
