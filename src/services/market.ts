import { CURRENCT_TYPE } from '@/const/currency';
import { NftActivityCurrencyType } from '@/contract/constants/logos';
import { MakerOrderWithSignature } from '@/contract/types';
import { PaginationV1Type, requestV1 } from '@/utils/request';
import { stringify } from 'query-string';
import { ApiCollection } from './collection';

export declare namespace ApiMarket {
  interface ItemBrowse {
    item: NftListType[];
    total: number;
  }

  interface NftListType {
    ass_type: number;
    chain_id: number;
    collection_address: string;
    collection_name: string;
    currency_type: CURRENCT_TYPE;
    is_sell: boolean;
    can_reflush: boolean;
    item_id: number;
    token_id: string;
    /** 资源地址 */
    logo: string;
    name: string;
    owner: string;
    price: string;
    floor_price: string;
    thumbnail: string;
    top_bid: string;
  }

  export interface ItemDetail {
    all_item_info: ApiCollection.CollectionItemInfo[];
    order_info?: MakerOrderWithSignature;
    approval_address: string;
    auth_status: number;
    can_add_num: boolean;
    can_buy: boolean;
    can_sell: boolean;
    change_type: number;
    coming_soon: boolean;
    create_profile_image: string;
    create_username: string;
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
    contract_metadata: CollectionItem;
    order_list: OrderList[];
    can_reflush: boolean;
    royalty: number;
  }
  interface OrderList {
    sell_id: number;
    price: number;
    currency_type: number;
    offerUser: string;
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

  type ItemActivityInfo = Omit<
    ActivityListItem,
    'item_image' | 'item_title' | 'item_name'
  >;

  export interface HaveItemInfo {
    have_num: number;
    have_wallet_address: string;
    is_mint: number;
    item_id: number;
    profile_image: string;
    username: string;
  }

  export interface ItemInfo {
    token_id: string;
    ass_type: number;
    blindbox_id: number;
    blockchain: number;
    categories: number;
    collection_id: number;
    collection_name: string;
    logo: string;
    thumbnail_logo: string;
    order_id: number;
    create_wallet_address: string;
    created_at: number;
    description: string;
    freeze_metadata: number;
    import_status: number;
    is_blindbox: number;
    item_id: number;
    levels: null;
    name: string;
    pay_currency_type: number;
    payout_wallet_address: string;
    royalties: number;
    sensitive_status: number;
    site_link: string;
    stats: null;
    supply_num: number;
    unlockable_content: string;
    unlockable_status: number;
    version: number;
    video_image: string;
    view_num: number;
  }
  export interface OwmerInfo {
    owner_num: number;
    profile_image: string;
    username: string;
    wallet_address: string;
  }
  interface CollectionDetail {
    collection: CollectionItem;
    floor_price: number;
    total: number;
    volume_traded: number;
    vol_in_week: string | number;
    owners: number;
    can_set_royalty: boolean;
    royalty: number;
    chain_id: number;
    /**
     * 调用版税合约方法
     * - 0 调用 updateRoyaltyInfoForCollectionIfSetter
     * - 2 调用 updateRoyaltyInfoForCollectionIfOwner
     * - 3 调用updateRoyaltyInfoForCollectionIfAdmin
     */
    mint_type: number;
    has_rare: boolean;
  }

  interface CollectionItem {
    address: string;
    is_support: string;
    banner_image: string;
    block_chain: number;
    chain_id: number;
    contract_address: string;
    description: string;
    discord_link: string;
    facebook_link: string;
    featured_image: string;
    logo: string;
    name: string;
    symbol: string;
    telegram_link: string;
    token_type: number;
    total_supply: number;
    twitter_link: string;
    website_link: string;
  }
  interface ProjectDetail {
    project: ProjectItem;
    floor_price: number;
    total: number;
    volume_traded: number;
    vol_in_week: string | number;
    owners: number;
    chain_id: number;
  }
  interface ProjectItem {
    name: string;
    total_supply: number;
    facebook_link: string;
    twitter_link: string;
    discord_link: string;
    telegram_link: string;
    website_link: string;
    logo: string;
    description: string;
    banner_image: string;
  }
  interface NftProperties {
    type: string;
    name: string;
    sum: number;
    traits: number;
  }

  interface HomeRecommendItem {
    content: string;
    contract_address: string;
    id: number;
    location: number;
    title: string;
    url: string;
  }

  interface CollectionSearchItem {
    contract_address: string;
    logo: string;
    icon?: string;
    name: string;
    chain_id: number | string;
    title?: string;
    total_supply?: number;
    floor_price?: number;
    is_buddy?: boolean;
  }

  interface CollectionSearchs {
    collections: CollectionSearchItem[];
    chain_id: number | string;
  }
  interface ProjectSearchs {
    chain_id: number | string;
    project_id: number | string;
    logo: string;
    name: string;
  }
  interface NftProperties {
    type: string;
    name: string;
    sum: number;
    traits: number;
  }

  interface HomeRecommendItem {
    content: string;
    contract_address: string;
    id: number;
    location: number;
    title: string;
    url: string;
  }

  interface MintListItem {
    name: string;
    address: string;
    logo: string;
    description: string;
  }
  interface LaunchpadListItem {
    contract_address: string;
    sale_status: number;
    descrintegraliption: number;
  }

  interface ActivityListItem {
    /**
     * 事件类型
     * - 1 创建
     * - 2 上架
     * - 3 转移
     * - 4 出售
     * - 5 下架
     */
    events: string;
    item_id: number;
    item_title: string;
    item_name: string;
    item_image: string;
    /**
     * - 0 图片
     * - 1 视频
     */
    ass_type?: number;
    price: string;
    /**
     * - 1 Eth
     * - 2 wEth
     */
    type: NftActivityCurrencyType;
    from: string;
    to: string;
    tx: number;
  }

  type ActivityListQuery = {
    chain_id?: any;
    collection_address?: string;
    type?: ActivityListItem['events'][];
    attrs?: string;
  };
  type ProjectActivityListQuery = {
    chain_id?: any;
    project_id?: number;
    type?: ActivityListItem['events'][];
    attrs?: string;
  };

  type NftCollectionQueryType = {
    /** 合约地址 */
    address?: string;
    /** 属性相关 */
    // attrs?: Array<{ trait_type: string; value: string[] }>
    attrs?: string;
  };

  type ExploreQueryType = {
    /**
     * 是否挂单
     * - 'true'
     * - 'false'
     */
    is_sell?: string;
    /**
     * - 1.最近挂单
     * - 2.价格降序
     * - 3.价格升序
     * - 4.结束时间倒序
     * - 5.token id倒序
     * - 6.token id正序
     */
    order_type?: string;
    low?: string;
    high?: string;
  } & NftCollectionQueryType;

  type ActivityChartItem = {
    /** 交易平均价格 */
    price: string;
    /** 交易量 */
    total: string;
    time: number;
  };

  type ExploreFilterCollectionItem = {
    address: string;
    name: string;
    image_uri: string;
    floor_price: string;
  };

  type ExploreFilterCollectionItemAttr = {
    trait_type: string;
    value: Array<{ value: string; Count: number; Percent: number }>;
  };

  type CollectionNamelinkQuery = PaginationV1Type & {
    name_like?: string;
    chain_id: any;
    owner_wallet_address?: string;
  };

  type UserListItem = {
    icon: string;
    wallet: string;
    count: string;
    name: string;
  };
  type RareInfoListItem = {
    title: string;
    description: string;
    link: string;
    icon: string;
  };
}

/** explore列表 */
export function itemBrowse(data?: ApiMarket.ExploreQueryType) {
  return requestV1<ApiMarket.ItemBrowse>(`/api/market/v1/item/browse`, {
    method: 'POST',
    body: data,
  });
}

/** 获取nft详情 */
export function itemDetail(
  data: {
    chain_id: any;
    customize_url?: string;
    token_id?: string;
    contract_address?: string;
    collection_address?: string;
  } & PaginationV1Type,
  opts?: any,
) {
  // 3333333 nft Detial
  if (data?.token_id) {
    data['token_id'] = `0x${Number(data.token_id)
      .toString(16)
      .padStart(64, '0')}`;
  }
  return requestV1<ApiMarket.ItemDetail>(
    `/api/market/v1/item/detail?${stringify(data)}`,
    opts,
  );
}
/** 获取nft推荐 */
export function itemsRelate(
  data: {
    address?: string;
    token_id?: string;
  } & PaginationV1Type,
  opts?: any,
) {
  if (data?.token_id) {
    data['token_id'] = `0x${Number(data.token_id)
      .toString(16)
      .padStart(64, '0')}`;
  }
  return requestV1<ApiMarket.ItemDetail>(
    `/api/market/v1/items/relate?${stringify(data)}`,
    {
      method: 'POST',
      body: data,
      ...opts,
    },
  );
}

/** 获取集合详情 */
export function collectionDetail(
  data: {
    chain_id: any;
    contract_address: string;
    wallet_address?: string;
  } & PaginationV1Type,
) {
  return requestV1<ApiMarket.CollectionDetail>(
    `/api/market/v1/collection/detail?${stringify(data)}`,
  );
}
/** 获取project详情 */

export function projectDetail(
  data: {
    project_id: string;
  } & PaginationV1Type,
) {
  return requestV1<ApiMarket.CollectionDetail>(
    `/api/market/v1/project/detail?${stringify(data)}`,
  );
}
/** 获取集合详情 */
export function collectionItemList(
  data: {
    collection_address: string;
    chain_id: any;
  } & ApiMarket.ExploreQueryType,
) {
  return requestV1<{ item: ApiMarket.NftListType[]; total: number }>(
    `/api/market/v1/collection/item/list`,
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 获取项目详情 */
export function projectItemList(
  data: {
    project_id: any;
  } & ApiMarket.ExploreQueryType,
) {
  return requestV1<{ item: ApiMarket.NftListType[]; total: number }>(
    `/api/market/v1/project/item/browse`,
    {
      method: 'POST',
      body: data,
    },
  );
}
/** 获取nft属性信息 */
export function itemProperties(data: {
  token_id: number | string;
  chain_id: any;
  collection_address: string;
}) {
  if (data?.hasOwnProperty('token_id')) {
    data['token_id'] = `0x${Number(data.token_id)
      .toString(16)
      .padStart(64, '0')}`;
  }
  return requestV1<{ propertiesTraits: ApiMarket.NftProperties[] }>(
    `/api/market/v1/item/Properties?${stringify(data)}`,
  );
}

/** 获取首页推荐 */
export function itemRecommend(data: {
  location?: number | string;
  limit?: number;
}) {
  return requestV1<{ list: ApiMarket.HomeRecommendItem[] }>(
    `/api/market/v1/item/Recommend?${stringify(data)}`,
  );
}

/** 首页集合搜索 */
export function collectionSearch(data: { search: string }) {
  return requestV1<{
    contract_list: ApiMarket.CollectionSearchItem[];
    project_list: any;
  }>(`/api/market/v1/collection/contract/search?${stringify(data)}`);
}

/** 热门集合搜索 */
export function hotCollectionSearch() {
  return requestV1<{
    nft_list: ApiMarket.CollectionSearchItem[];
  }>(`/api/market/v1/homepage/quality/default`);
}

/** 查询项目列表信息 */
export function mintList(data?: PaginationV1Type) {
  return requestV1<{ list: ApiMarket.MintListItem[]; total: number }>(
    `/api/market/v1/mint/list?${stringify(data!)}`,
  );
}

/** 更新版税
 * @notice
 * proportion 500=5%
 */
export function collectionRoyaltyUpdate(data: {
  address: string;
  proportion: number;
  chain_id: any;
}) {
  return requestV1<{ proportion: number }>(
    '/api/market/v1/collection/royalty/update',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 刷新 metadata */
export function refreshMetadata(data?: {
  owner?: any;
  item_id?: number;
  chain_id: any;
}) {
  return requestV1('/api/market/v1/item/reflush', {
    method: 'POST',
    body: data,
  });
}

/** activity列表数据 */
export function activityList(
  data?: ApiMarket.ActivityListQuery & PaginationV1Type,
) {
  return requestV1<{ item_activity_info: ApiMarket.ActivityListItem[] }>(
    `/api/market/v1/item/activity/List`,
    {
      method: 'POST',
      body: data,
    },
  );
}
/** activity列表数据 */
export function projectActivityList(
  data?: ApiMarket.ProjectActivityListQuery & PaginationV1Type,
) {
  return requestV1<{ item_activity_info: ApiMarket.ActivityListItem[] }>(
    `/api/market/v1/project/activity/List`,
    {
      method: 'POST',
      body: data,
    },
  );
}

/** activity chart数据 */
export function activityPriceInfo(data: {
  during?: number;
  address: string;
  chain_id: any;
}) {
  return requestV1<{
    chart_info: ApiMarket.ActivityChartItem[];
    count: number;
  }>(`/api/market/v1/item/activity/priceinfo?${stringify(data)}`);
}

/** 查询项目列表信息 */
export function collectionNamelike(data: ApiMarket.CollectionNamelinkQuery) {
  return requestV1<{
    unecollection_list: ApiMarket.ExploreFilterCollectionItem[];
    total: number;
  }>(
    `/api/market/v1/item/collection/namelike?${stringify(data, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
  );
}

/** 查询项目列表信息 */
export function collectionAttributes(data: {
  address: string;
  chain_id: any;
  value_like?: string;
  owner_wallet_address?: string;
  rare_mode?: boolean;
}) {
  return requestV1<
    {
      attrs: ApiMarket.ExploreFilterCollectionItemAttr[];
    } & Omit<ApiMarket.ExploreFilterCollectionItem, 'image_uri'> & {
        image_url: string;
      }
  >(`/api/market/v1/traits/list?${stringify(data)}`);
}

/** 查询project属性信息 */

export function projectAttributes(data: {
  chain_id: any;
  collection_id: any;
  value_like?: string;
}) {
  return requestV1<
    {
      attrs: ApiMarket.ExploreFilterCollectionItemAttr[];
    } & Omit<ApiMarket.ExploreFilterCollectionItem, 'image_uri'> & {
        image_url: string;
      }
  >(`/api/market/v1/project/traits/list?${stringify(data)}`);
}

/** 查询项目列表信息 */
export function iswhitelist(data: {
  /** 合约地址 */
  contract_address: string;
  wallet_address?: string;
}) {
  return requestV1<{ is_whitelist: boolean }>(
    `/api/market/v1/launchpad/whitelist/check?${stringify(data)}`,
  );
}

/** 查询项目列表信息 */
// export function collectionRareInfo(data: { address: string; rare_type: [] }) {
//   return requestV1<{
//     user_list: ApiMarket.UserListItem[];
//     rare_info_list: ApiMarket.RareInfoListItem[];
//   }>(`/api/market/v1/collection/rare/info?${stringify(data)}`);
// }
// /** 查询项目列表信息 */
export function collectionRareInfo(data: {
  address: string;
  rare_type: string[];
  chain_id?: any;
}) {
  return requestV1<{
    user_list: ApiMarket.UserListItem[];
    rare_info_list: ApiMarket.RareInfoListItem[];
  }>(`/api/market/v1/collection/rare/info`, {
    method: 'POST',
    body: data,
  });
}
