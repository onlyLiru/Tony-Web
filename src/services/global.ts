import { JWT_HEADER_KEY, jwtHelper } from '@/utils/jwt';
import request, { requestV1 } from '@/utils/request';
import { TypedDataDomain } from 'ethers';
import { stringify } from 'querystring';

export enum AUTH_TYPE {
  VIP3 = 3,
}

export declare namespace ApiGlobal {
  interface getUserInfo {
    auth_status: number;
    bio: string;
    contract_address: string;
    created_at: string;
    email: string;
    instagram_link: string;
    integral: number;
    integral_num: number;
    profile_banner: string;
    profile_image: string;
    site_link: string;
    twitter_link: string;
    username: string;
    wallet_address: string;
    is_nft_avatar: boolean;
    twitter_name: string;
    discord_name: string;
    login_email?: string;
    is_new_user?: boolean;
    source?: number;
  }

  interface userAuthReq {
    list: AuthItem[];
  }
  interface AuthItem {
    types: AUTH_TYPE;
  }

  interface UserAuthRes {
    auth_list: { types: AUTH_TYPE; is_auth: boolean }[];
  }

  interface login {
    accessToken: string;
    accessExpire: string;
    refreshAfter: string;
    isInit?: boolean;
  }
  interface loginOut {
    status: number;
  }

  interface getVersionInfo {
    domain: TypedDataDomain;
    // 代币合约列表
    currList: ContractItem[];
    // 执行策略列表
    exlist: ContractItem[];
    // 主合约
    marketList: ContractItem;
    roylist: ContractItem;
    transFerList: ContractItem[];
  }

  interface ContractItem {
    address: string;
    contract_type: number;
    info: string;
    name: string;
  }
  interface CurrencyInfo {
    currency_contract: string;
    currency_name: string;
    currency_type: number;
  }
}

/** 获取用户权限信息 */
export function getUserAuth(data: ApiGlobal.userAuthReq) {
  return requestV1<ApiGlobal.UserAuthRes>('/api/user/v1/user/thirdparty/auth', {
    method: 'POST',
    body: data,
  });
}

/** 获取用户权限 */
export function getUserInfo() {
  return requestV1<ApiGlobal.getUserInfo>('/api/user/v1/users/id');
}

/** 获取链接钱包的随机数 */
export function nonce(data: { walletAddress: string; type?: number }) {
  return requestV1<{ noce: string }>('/api/user/v1/users/nonce', {
    method: 'POST',
    body: data,
  });
}

/** 登录 */
export function login(data: { wallet_address: string; signData: string }) {
  return requestV1<ApiGlobal.login>('/api/user/v1/users/login', {
    method: 'POST',
    body: data,
  });
}

/** 注册 */
export function resgister(data: {
  wallet_address: string;
  signData: string;
  // is_luck?: number;
  okx?: boolean;
  wallet_connect?: boolean;
  bitget?: boolean;
  metamask?: boolean;
  coinbase?: boolean;
}) {
  return requestV1<{ status: string }>('/api/user/v1/users/resgister', {
    method: 'POST',
    body: data,
  });
}

/** 登出 */
export function loginOut() {
  return request<ApiGlobal.loginOut>('/api/loginOut', {
    method: 'POST',
  });
}

/** 获取版本信息 */
export function getVersionInfo() {
  return requestV1<ApiGlobal.getVersionInfo>(`/api/system/v1/contract/info`);
}

/** 获取eth gas */
export function getGas(data: { chain_id: any }) {
  return requestV1<{
    FastGasPrice: string;
    LastBlock: string;
    ProposeGasPrice: string;
    SafeGasPrice: string;
    gasUsedRatio: string;
    suggestBaseFee: string;
  }>(`/api/system/v1/eth/Gas?${stringify(data)}`);
}

/** 上传图片 */
export function upLoadImage(formData: FormData): Promise<{ data: string }> {
  return fetch('/api/backend/api/upLoadImage', {
    method: 'POST',
    headers: {
      [JWT_HEADER_KEY]: jwtHelper.getToken() as string,
    },
    body: formData,
  }).then((r) => r.json());
}

/** 获取上传图片url */
export function getUploadUrl() {
  return request<{ data: { url: string }; code: number; msg: string }>(
    '/api/user/v1/users/upload',
  );
}

/** 上传图片 */
export function uploadFile(formData: FormData): Promise<{ data: string }> {
  return fetch('/api/backend/api/user/v1/image/upload', {
    method: 'POST',
    headers: {
      [JWT_HEADER_KEY]: jwtHelper.getToken() as string,
    },
    body: formData,
  }).then((r) => r.json());
}

/** 获取版本信息 */
export function getCurrencyInfo(data: { url: any }) {
  return request<{ data: ApiGlobal.CurrencyInfo[] }>('/api/getCurrencyInfo', {
    method: 'POST',
    body: data,
  });
}

/**
 * web2 login相关接口
 */

/** 发送邮箱验证码 */
export function sendEmailValidCode(data: { email: string }) {
  return requestV1<ApiGlobal.login>('/api/user/v1/central/email/code', {
    method: 'POST',
    body: data,
  });
}

/** 校验邮箱 */
export function loginWithEmail(data: { email: string; code: number }) {
  return requestV1<ApiGlobal.login>('/api/user/v1/central/email/login', {
    method: 'PUT',
    body: data,
  });
}

/** 将web2登陆的邮箱绑定web3的钱包地址 */
export function loginBindEmail(data: { wallet_address: string }) {
  return requestV1<ApiGlobal.login>('/api/user/v1/central/email/bind', {
    method: 'PUT',
    body: data,
  });
}

/** 绑定邮箱获取50UUU积分 */
export function loginBindEmailWithPointReward(data: {
  email: string;
  code: number;
}) {
  return requestV1<{ status: number }>('/api/user/v1/users/email/bind', {
    method: 'POST',
    body: data,
  });
}

/**
 * web2 login相关接口end
 */
