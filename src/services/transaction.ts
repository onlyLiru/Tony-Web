import { MakerOrderWithSignature } from '@/contract/types';
import { requestV1 } from '@/utils/request';
import { stringify } from 'querystring';

export declare namespace ApiTransaction {
  interface ApproveListResItem {
    collection_name: string;
    chain_id: number;
    collection: string;
    token_standard: string;
    status: boolean;
  }

  interface OrderMakeParams {
    itemId: number;
    walletAddress: string;
    order: MakerOrderWithSignature;
    status: boolean;
    weth_approve?: boolean;
  }
  interface OrderMakeRes {
    orderId: string;
    status: boolean;
  }

  interface ApprovePayload {
    /** 合约地址 */
    contractAddress: string;
    /** 链id */
    chain: number;
    /** 操作合约 */
    operator?: string;
  }
}

/** 获取挂单详情 */
export function orderGet(data: { order_id: number; chain_id: any }) {
  return requestV1<ApiTransaction.OrderMakeParams>(
    `/api/transaction/v1/transaction/order/get?${stringify(data)}`,
  );
}

/** 获取挂单详情 */
export function transactionGetNonce(data: { wallet_address: string }) {
  return requestV1<{ nonce: number }>(
    `/api/transaction/v1/transaction/getNonce?${stringify(data)}`,
  );
}

/** 获取挂单详情 */
export function orderMake(
  data: ApiTransaction.OrderMakeParams & { chain_id: any },
) {
  return requestV1<ApiTransaction.OrderMakeRes>(
    '/api/transaction/v1/transaction/order/make',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 取消挂单 */
export function orderCancel(data: { order_ids: number[]; chain_id: any }) {
  return requestV1<{ success: boolean; message: string }>(
    '/api/transaction/v1/transaction/order/cancel',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 取消所有挂单和已发送的offer */
export function cancelAll(data: { chain_id: any }) {
  return requestV1<{ success: boolean; message: string }>(
    '/api/transaction/v1/transaction/order/cancel/all',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 获取需要授权的集合列表 */
export function approveGet(data: { approve: ApiTransaction.ApprovePayload }) {
  return requestV1<{ status: boolean }>(
    `/api/transaction/v1/transaction/approve/get`,
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 保存集合授权信息 */
export function approveSave(data: { approve: ApiTransaction.ApprovePayload }) {
  return requestV1<{ status: boolean }>(
    `/api/transaction/v1/transaction/approve/save`,
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 保存集合授权信息 */
export function approveList(data: {
  list: { collection: string; chain_id: number }[];
}) {
  return requestV1<{ list: ApiTransaction.ApproveListResItem[] }>(
    `/api/transaction/v1/transaction/order/approve/list`,
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 成交  废除 */
export function deal(data: {
  item_id: number;
  collection_address: string;
  from: string;
  to: string;
  token_id: string;
  chain_id: any;
  price: string;
  currency: string;
}) {
  return requestV1<{ success: boolean; message: string }>(
    `/api/transaction/v1/transaction/deal`,
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 获取挂单详情 */
export function makeActivity(data: {
  /** 合约地址 */
  contract_address: string;
  chain_id: any;
}) {
  return requestV1<{
    /** 新的 strategy 地址 */
    Address: string;
  }>(`/api/transaction/v1/make/activity?${stringify(data)}`);
}
