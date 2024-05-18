import request, { PaginationType } from '@/utils/request';

export declare namespace ApiCollection {
  interface ListItem {
    banner_image: string;
    blindbox_tradable: number;
    category: number;
    collection_id: number;
    customize_url: string;
    description: string;
    featured_image: string;
    is_blindbox: number;
    is_release: number;
    is_selected: number;
    item_num: number;
    logo_image: string;
    name: string;
    one_price: number;
    pay_currency_type: number;
    presale_status: number;
    profile_image: string[] | null;
    wallet_address: string;
  }

  interface Info {
    banner_image: string;
    blindbox_description: string;
    blindbox_name: string;
    blindbox_show_cover: string;
    blindbox_tradable: number;
    blindbox_type: number;
    blindbox_user: string;
    blockchain: number;
    category: number;
    collection_id: number;
    created_at: string;
    currency_type: number;
    customize_url: string;
    description: string;
    discord_link: string;
    display_theme: number;
    email: string;
    featured_image: string;
    floor_price: number;
    have_contract: boolean;
    import_status: number;
    instagram_link: string;
    is_blindbox: number;
    is_release: number;
    item_num: number;
    logo_image: string;
    medium_link: string;
    metabox_six_day_image: any[];
    name: string;
    one_price: number;
    open_time: number;
    open_time_status: number;
    owners: number;
    pay_currency_type: number;
    payout_wallet_address: string;
    presale_status: number;
    presale_time: number;
    profit_sharing: number;
    profit_sharing_proportion: number;
    royalties: number;
    sensitive_status: number;
    separate_contract: number;
    site_link: string;
    six_day_image_status: number;
    twitter_link: string;
    usdt_price: number;
    volume_traded: number;
    wallet_address: string;
    whit_list_info: any[];
  }

  interface getCollectionItemInfo {
    blindbox_price: number;
    currency_type: number;
    itemInfo: CollectionItemInfo[];
    now_page_num: number;
    page_limit_num: number;
  }

  interface CollectionItemInfo {
    Accuracy: number;
    auth_status?: number;
    blockchain: number;
    content: string;
    create_wallet_address: string;
    created_at?: string;
    currency_type: number;
    customize_url: string;
    favorites_num: number;
    freeze_metadata?: number;
    is_blindbox: number;
    is_favorites: number;
    is_selected: number;
    item_id: number;
    name: string;
    presale_status: number;
    price: number;
    profile_image: string;
    site_link: string;
    usdt_price: number;
    username: string;
    video_image: string;
  }
}

/** 获取集合信息 */
export function getCollectionInfo(data: { customize_url: string }) {
  return request<{ data: ApiCollection.Info }>('/api/getCollectionInfo', {
    method: 'POST',
    body: data,
  });
}

/** 获取集合列表数据 */
export function getCollectionItemInfo(
  data: { customize_url: string } & PaginationType,
) {
  return request<{ data: ApiCollection.getCollectionItemInfo }>(
    '/api/getCollectionItemInfo',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 获取我的集合列表 */
export function getCollectionList(data: { wallet_address: string }) {
  return request<{ data: ApiCollection.ListItem[] }>('/api/getCollectionList', {
    method: 'POST',
    body: data,
  });
}

/** 刷新 metadata */
export function refreshCollectionMetadata(data?: { contract_address?: string; chain_id: string }) {
  return request('/api/market/v1/collection/flush', {
    method: 'PUT',
    body: data,
  });
}