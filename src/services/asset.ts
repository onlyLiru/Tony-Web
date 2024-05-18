import { CURRENCT_TYPE } from '@/const/currency';
import request from '@/utils/request';
import { ApiCollection } from './collection';

export declare namespace ApiAsset {
  interface getItemInfoPayload {
    item_id: number;
    customize_url?: string;
    token_id?: string;
    contract_address?: string;
  }
  interface getItemInfo {
    all_item_info: ApiCollection.CollectionItemInfo[];
    approval_address: string;
    auth_status: number;
    can_add_num: boolean;
    can_buy: boolean;
    can_sell: number;
    change_type: number;
    coming_soon: boolean;
    create_profile_image: string;
    create_username: string;
    current_price_info: CurrentPriceInfo;
    customize_url: string;
    discord: string;
    favorites_num: number;
    have_item_info: HaveItemInfo[];
    historical_price_info: HistoricalPriceInfo[];
    is_favorites: number;
    is_free_mint: boolean;
    item_activity_info: ItemActivityInfo[];
    item_info: ItemInfo;
    mint_price: number;
    mint_stock: number;
    need_approval: number;
    owmer_info: OwmerInfo;
    sale_stock: number;
    total_num: number;
  }

  interface CurrentPriceInfo {
    accuracy: number;
    created_at: string;
    currency_type: number;
    duration: string;
    item_id: number;
    max_accuracy: number;
    max_num: number;
    min_accuracy: number;
    min_num: number;
    num: number;
    order_info: string;
    presale_status: number;
    presale_time: number;
    price: number;
    sell_id: number;
    sell_type: number;
    specific: number;
    specific_num: number;
    status: number;
    type: number;
    updated_at: string;
    usdt_price: number;
    wallet_address: string;
  }

  interface HaveItemInfo {
    have_num: number;
    have_wallet_address: string;
    is_mint: number;
    item_id: number;
    profile_image: string;
    username: string;
  }

  interface HistoricalPriceInfo {
    accuracy: number;
    buy_info_id: number;
    change_type: number;
    collection_id: number;
    created_at: string;
    currency_type: number;
    from_wallet_address: string;
    item_activity_id: number;
    item_id: number;
    price: number;
    to_wallet_address: string;
    usdt_price: number;
  }

  interface ItemActivityInfo {
    Accuracy: number;
    change_type: number;
    created_at: string;
    currency_type: number;
    from_name: string;
    from_wallet_address: string;
    item_id: number;
    price: number;
    to_name: string;
    to_wallet_address: string;
  }

  interface ItemInfo {
    blindbox_id: number;
    blockchain: number;
    categories: number;
    collection_id: number;
    collection_name: string;
    content: string;
    create_wallet_address: string;
    created_at: string;
    description: string;
    freeze_metadata: number;
    import_status: number;
    is_blindbox: number;
    item_id: number;
    levels: any[];
    name: string;
    pay_currency_type: number;
    payout_wallet_address: string;
    properties: any[];
    propertiesTraits: { Type: string; Name: string; Traits: number }[];
    royalties: number;
    sensitive_status: number;
    site_link: string;
    stats: any[];
    supply_num: number;
    unlockable_content: string;
    unlockable_status: number;
    version: number;
    video_image: string;
    view_num: number;
  }

  interface OwmerInfo {
    owner_num: number;
    profile_image: string;
    username: string;
    wallet_address: string;
  }

  interface getItemDetails {
    blockchain: number;
    contract_address: string;
    is_import: number;
    item_id: number;
    metadata: string;
    token_id: string;
    token_standard: number;
  }
  interface getBuyInfo {
    sign_ary: string[];
    sign_data1: string;
    sign_data2: string;
    send_type: number;
  }
  interface cancelSell {
    sign_ary: string[];
    sign_data: string;
    send_type: number;
  }
  interface newReleaseBlindbox {
    contract_address: string;
    collection_token_id: string;
    class_probabilities: string[];
    hash_ary: string[];
    have_numary: string;
    total_num: string;
    salt: string;
    sign_data1: string;
    sign_data2: string;
    blindbox_hashstr: string;
  }
  interface openBlindbox {
    address_data: string[];
    tokenAry: string[];
    uint_data: string[];
    sign_data1: string;
    sign_data2: string;
  }
  interface getSellInfo {
    need_cancel: boolean;
    sign_id: string;
    sign_str: string;
  }

  interface getSellInfoPayload {
    item_id: number;
    price: string;
    currency_type: CURRENCT_TYPE;
    duration: string;
    presale_status: number; //预售开关 1:关 2:开 必传
    presale_time?: string; //预售时间时间戳
    white_list?: string[];
    num: number; //上架数量
    sell_type: number; //上架类型 1:首次上架 2:二次交易上架
  }

  interface getOfferInfo {
    accuracy: number;
    currency_type: number;
    is_have: number;
    item_id: number;
    offer_id: number;
    offer_username: string;
    offer_wallet_address: string;
    offers_expiration: string;
    price: number;
    usdt_price: number;
  }

  interface getListingsInfo {
    accuracy: number;
    currency_type: number;
    duration: string;
    is_seller: number;
    item_id: number;
    price: number;
    sell_id: number;
    stock: number;
    type: number;
    usdt_price: number;
    username: string;
    wallet_address: string;
  }
}

/** 获取Nft详情 */
export function getItemInfo(data: ApiAsset.getItemInfoPayload) {
  return request<{ data: ApiAsset.getItemInfo }>('/api/getItemInfo', {
    method: 'POST',
    body: data,
  });
}

/** 获取Nft合约相关信息 */
export function getItemDetails(data: {
  item_id: number;
  customize_url: string;
}) {
  return request<{ data: ApiAsset.getItemDetails }>('/api/getItemDetails', {
    method: 'POST',
    body: data,
  });
}

/** 获取购买相关信息 */
export function getBuyInfo(data: {
  num: number;
  sell_id: number;
  sign_data: string;
}) {
  return request<ApiAsset.getBuyInfo>('/api/getBuyInfo', {
    method: 'POST',
    body: data,
  });
}

/** 获取盲盒发布信息 */
export function releaseBlindbox(data: {
  wallet_address: string;
  collection_id: string;
  sign_data: string;
}) {
  return request<{ data: ApiAsset.openBlindbox }>('/api/releaseBlindbox', {
    method: 'POST',
    body: data,
  });
}

/** 获取可交易盲盒发布信息 */
export function newReleaseBlindbox(data: {
  wallet_address: string;
  collection_id: string;
  sign_data: string;
}) {
  return request<{ data: ApiAsset.newReleaseBlindbox }>(
    '/api/newReleaseBlindbox',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 获取拆盲盒信息 */
export function openBlindbox(data: {
  open_num: number;
  item_id: number;
  sign_data: string;
}) {
  return request<{ data: ApiAsset.openBlindbox }>('/api/openBlindbox', {
    method: 'POST',
    body: data,
  });
}

/** 获取出售相关信息 */
export function getSellInfo(data: ApiAsset.getSellInfoPayload) {
  return request<ApiAsset.getSellInfo>('/api/getSellInfo', {
    method: 'POST',
    body: data,
  });
}

/** 保存出售信息 */
export function saveSellInfo(data: { sign_id: string; sign_data: string }) {
  return request<ApiAsset.getBuyInfo>('/api/saveSellInfo', {
    method: 'POST',
    body: data,
  });
}

/** 取消出售 */
export function cancelSell(data: { sell_id: number; sign_data: string }) {
  return request<ApiAsset.cancelSell>('/api/cancelSell', {
    method: 'POST',
    body: data,
  });
}

/** 获取报价相关信息 */
export function getMakeOfferInfo(data: {
  item_id: number;
  price: number | string;
  currency_type: CURRENCT_TYPE;
  duration: string;
}) {
  return request<ApiAsset.getSellInfo>('/api/getMakeOfferInfo', {
    method: 'POST',
    body: data,
  });
}

/** 保存报价信息 */
export function saveMakeOfferInfo(data: {
  sign_id: string;
  sign_data: string;
}) {
  return request<{ data: string }>('/api/saveMakeOfferInfo', {
    method: 'POST',
    body: data,
  });
}

/** 获取报价相关信息 */
export function getOfferInfo(data: {
  item_id: number;
  price: number | string;
  currency_type: CURRENCT_TYPE;
  duration: string;
}) {
  return request<{ data: ApiAsset.getOfferInfo[] }>('/api/getOfferInfo', {
    method: 'POST',
    body: data,
  });
}

/** 获取报价相关信息 */
export function getAcceptOfferInfo(data: {
  offer_id: number;
  sign_data: string;
}) {
  return request<ApiAsset.getBuyInfo>('/api/getAcceptOfferInfo', {
    method: 'POST',
    body: data,
  });
}

/** 获取nft挂单信息 */
export function getListingsInfo(data: {
  item_id: number;
  customize_url: string;
}) {
  return request<{ data: ApiAsset.getListingsInfo[] }>('/api/getListingsInfo', {
    method: 'POST',
    body: data,
  });
}

/** nft收藏 */
export function favoritesItem(data: {
  item_id: number;
  customize_url: string;
}) {
  return request<{ data: number }>('/api/favoritesItem', {
    method: 'POST',
    body: data,
  });
}

/** 增加nft数量 */
export function addSupplyNum(data: {
  item_id: number;
  add_num: number;
  sign_data: string;
}) {
  return request<{ data: string }>('/api/addSupplyNum', {
    method: 'POST',
    body: data,
  });
}
