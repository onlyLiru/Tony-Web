import request from '@/utils/request';
import { stringify } from 'querystring';

export declare namespace ApiHome {
  export interface getViewInfo {
    /** 文章列表 */
    album_info: AlbumInfo[];
    art_info: ArtInfo[];
    game_info: Info[];
    select_info: Info[];
    top_info: Info;
  }

  export interface AlbumInfo {
    album_id: number;
    banner_image: string;
    content: string;
    create_time: number;
    introduction: string;
    recommend_image: string;
    release_time: number;
    title: string;
  }

  export interface ArtInfo {
    collection_id: number;
    collection_name: string;
    customize_url: string;
    item_info: ItemInfo[];
    profile_image: string;
    username: string;
    view_num: number;
    wallet_address: string;
  }

  export interface ItemInfo {
    content: string;
    description: string;
    item_id: number;
    item_name: string;
  }

  export interface Info {
    collection_id: number;
    customize_url: string;
    description: string;
    item_content: string;
    item_id: number;
    item_name: string;
  }
}

/** 获取首页展示数据 */
export function getViewInfo() {
  return request<{ data: ApiHome.getViewInfo }>('/api/getViewInfo', {
    method: 'POST',
  });
}

/** 获取首页banner */
export function geBannerList(data = {}) {
  return request<{ data: any }>(
    `/api/market/v1/homepage/banner?${stringify(data)}`,
    {
      method: 'GET',
    },
  );
}

/** 获取首页精选项目 */
export function getQualityList() {
  return request<{ data: any }>('/api/market/v1/homepage/quality', {
    method: 'GET',
  });
}
export function getAllInfo() {
  return request<{ data: any }>('/api/integral/v1/score/all/info', {
    method: 'GET',
  });
}

/** 获取首页NFT合辑 */
export function getCollectionsList(data: any) {
  return request<{ data: any }>('/api/market/v1/homepage/collections/list', {
    method: 'POST',
    body: data,
  }).then((res) => {
    return res?.data?.collections_list || [];
  });
}

/** 获取首页研究院各tab信息 */
export function getResearchList(data: any) {
  return request<{ data: any }>(
    `/api/market/v1/homepage/news?${stringify(data)}`,
    {
      method: 'GET',
    },
  );
}

/** 获取首页底部seo文章 */
export function getSeoArticleList() {
  return request('/api/project/v1/wp/list', {
    method: 'GET',
  });
}

// /** 获取首页分类展示数据 */
// export function getCategoryInfo(data: { category: string }) {
//   return request<{ data: ApiHome.getVersionInfo }>('/api/getCategoryInfo', {
//     method: 'POST',
//     body: data,
//   });
// }

// /** 获取首页底部评论展示数据 */
// export function getTransactionInfo() {
//   return request<{ data: ApiHome.getVersionInfo }>('/api/getTransactionInfo', {
//     method: 'POST',
//   });
// }
