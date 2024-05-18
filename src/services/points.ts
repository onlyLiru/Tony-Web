import { requestV1 } from '@/utils/request';
import { stringify } from 'querystring';

export declare namespace ApiPoints {
  export interface exchangePrize {
    /** 兑换奖品 */
    to_token_id: number;
    amount: number;
  }

  export type PageType = {
    page?: number;
    pageSize?: number;
    tag?: number;
  };

  export interface PrizeList {
    tokenId: number;
    max_amount_per_transaction: number;
    min_amount_per_transaction: number;
    name: string;
    status: string;
    symbol: string;
    type: string;
    regions: string;
    exchangeRate: number;
    Bitcoin: string;
  }
  export interface Info {
    /** 兑换奖品 */
    brandList: PrizeList[];
    imgUrlList: any[];
  }

  export interface Record {
    id: number;
    score: number;
    type: string;
    source: string;
    status: number;
    symbol: boolean;
  }
  export interface uuInfo {
    schedule: number;
    strat_time: number;
    end_time: number;
    count_down: number;
    integral: number;
    qibee: boolean;
    isOrderUstd?: boolean;
    email: string;
    score_avatar?: boolean;
    can_receive_avatar?: boolean;
    avatar_time?: number;
  }

  export interface AccountInfo {
    /** 兑换奖品 */
    account_type: number;
    email: string;
  }

  export interface PrizeRecord {
    /** 兑换奖品 */
    list: [{ prize_id: number; create_time: number }];
  }

  export interface ExchangeItem {
    id: number;
    title: string;
    chain_type: number;
    integral: number;
    img_url: string;
    total: number;
    status?: boolean;
    link?: string;
    type?: number;
    end_time?: string;
    project_status?: number;
  }

  export interface SwiperItem {
    image_url: string;
    name: string;
    item: string;
    time: number;
  }
  export interface InviteCodeInfo {
    code: string;
    is_score_code: number;
  }
}

/** 获取奖品信息 */
export function fetchPrizeInfo() {
  return requestV1<ApiPoints.Info>(`/api/integral/v1/prize/info`);
}

/** 兑换奖品 */
export function exchangePrize(data: ApiPoints.exchangePrize) {
  return requestV1<{ status: number }>(
    '/api/integral/v1/prize/exchange/crypto',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 获取积分流水信息 */
export function fetchRecord(data: ApiPoints.PageType) {
  return requestV1<{ list: [] }>(
    `/api/integral/v1/integral/record?${stringify(data)}`,
  );
}

/** 创建第三方积分账号 */
export function createAccount(data: ApiPoints.AccountInfo) {
  return requestV1('/api/integral/v1/integral/third/account', {
    method: 'POST',
    body: data,
  });
}

/**  获取抽奖结果 */
export function getResults(data: {
  raffle_type: number;
  whitelist_id?: number;
}) {
  return requestV1<{ results: number }>(
    `/api/integral/v1/raffle/results?${stringify(data)}`,
  );
}

/**  邀请用户 */
export function invite() {
  return requestV1<{ trace_id: string }>(`/api/user/v1/groups/get`);
}

/** 获取uu活动状态 */
export function getuuInfo(data: { location: number }) {
  return requestV1<ApiPoints.uuInfo>(
    `/api/integral/v1/uu/info?${stringify(data)}`,
  );
}

/** ustd提现 */
export function getUstd() {
  return requestV1<{ status: string }>('/api/integral/v1/activity/getUstd', {
    method: 'POST',
  });
}

/** 获取好友 助力信息  */
export function getTraceInfo(data: { trace_id: string }) {
  return requestV1<ApiPoints.uuInfo>(
    `/api/integral/v1/uu/info/trace?${stringify(data)}`,
  );
}

/** 获取奖品信息  */
export function getPrizeRecord(data?: { page: number; page_size: number }) {
  return requestV1<ApiPoints.PrizeRecord>(
    `/api/integral/v1/prize/record?${stringify(data)}`,
  );
}

/** 兑换列表 */
export function getExchangeList(data: { type: number }) {
  return requestV1<{
    cfx_list: ApiPoints.ExchangeItem[];
    list: ApiPoints.ExchangeItem[];
    special_list?: ApiPoints.ExchangeItem[];
    can_order_list: ApiPoints.ExchangeItem[];
  }>(`/api/integral/v1/whitelist/list?${stringify(data)}`);
}

/** 预约列表 */
export function submitRecord(data: { type: number }) {
  return requestV1<{
    cfx_list: ApiPoints.ExchangeItem[];
    list: ApiPoints.ExchangeItem[];
    special_list?: ApiPoints.ExchangeItem[];
    can_order_list: ApiPoints.ExchangeItem[];
  }>(`/api/integral/v1/whitelist/list?${stringify(data)}`);
}

/** 白单兑换 */
export function exchangeWhiteList(data: { id: number }) {
  return requestV1<{ status: number }>(`/api/integral/v1/whitelist`, {
    method: 'PUT',
    body: data,
  });
}

/** 获取小喇叭轮播列表 */
export function getRewardsSwiperList() {
  return requestV1<{ record_list: ApiPoints.SwiperItem[] }>(
    `/api/integral/v1/whitelist/special/record`,
  );
}

/** 获取用户city和email */
export function getUserInfo() {
  return requestV1<{
    address: string;
    email: string;
    wallet: string;
    type: string | number;
  }>(
    `/api/integral/v1/whitelist/user/address`,
    {
      method: 'GET',
    },
    {
      unlogin: true,
    },
  );
}

/** 兑换特殊奖品 */
export function exchangeSpecial(
  id: number | string,
  type: number | undefined,
  specialType: number,
  remark?: string,
) {
  return requestV1<{ status: string }>(
    '/api/integral/v1/whitelist/exchange/special',
    {
      method: 'POST',
      body: {
        id,
        type,
        exchange_type: specialType,
        remark,
      },
    },
  );
}
/** 兑换特殊奖品 */
export function exchangeSpecialInfo(id: number | string, remark?: string) {
  return requestV1<{ status: string }>(
    '/api/integral/v1/whitelist/exchange/special/cele',
    {
      method: 'POST',
      body: {
        id,
        remark,
      },
    },
  );
}
export function rewardInfo() {
  return requestV1(
    // `/api/project/v1/check/code`,
    `/api/project/v1/cele/reward/info`,
    {
      method: 'GET',
    },
  );
}

/** 设置用户邮箱地址信息 */
export function submitUserInfo(
  address: string,
  email: string,
  wallet: string,
  type: string | number,
) {
  return requestV1<{ status: string }>(
    '/api/integral/v1/whitelist/user/address',
    {
      method: 'POST',
      body: {
        email,
        city: address,
        wallet,
        type,
      },
    },
  );
}

/** 获取邀请码 */
export function getInviteCode() {
  return requestV1(
    '/api/project/v1/joinme/scode',
    {
      method: 'POST',
    },
    {
      unlogin: true,
    },
  );
}

/** 校验邀请码 */
export function checkInviteCode(code: string) {
  return requestV1<{ status: number }>(
    // `/api/project/v1/check/code`,
    `/api/project/v1/check/code?${stringify({ code, is_score_code: 1 })}`,
    {
      method: 'GET',
      // body: {
      //   code,
      //   is_score_code: 1,
      // },
    },
  );
}
/** 邀请回调函数 */
export function codeCallBack(code: string) {
  return requestV1<{ status: number }>(
    // `/api/project/v1/joinme/scode/succeed`,
    `/api/project/v1/joinme/scode/succeed?${stringify({ code })}`,
    {
      method: 'GET',
      // body: {
      //   code,
      // },
    },
  );
}

/**
 * 立即预约
 */
export function submitReserve(param: any) {
  return requestV1<{ status: number }>('/api/integral/v1/whitelist/order', {
    method: 'POST',
    body: param,
  });
}

/**
 * 立即预约
 */
export function receiveAvatar() {
  return requestV1('/api/integral/v1/score/avatar/receive', {
    method: 'GET',
  });
}
