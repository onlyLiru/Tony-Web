import { NEXT_LOCALE_KEY } from '@/const/cookie';
import { NftItemDataType } from '@/features/AssetItem';
import request, { PaginationType, requestV1 } from '@/utils/request';
import { method } from 'lodash';
import { stringify } from 'querystring';
import { ApiCollection } from './collection';
import { ApiMarket } from './market';

export declare namespace ApiUser {
  interface UserDetailInfo {
    auth_status: number;
    bio: string;
    email: string;
    favorites: number;
    followers: number;
    following: number;
    instagram_link: string;
    is_follow: boolean;
    profile_banner: string;
    profile_image: string;
    site_link: string;
    twitter_link: string;
    username: string;
    wallet_address: string;
  }
  interface getUserItemInfo {
    total: number;
    item: NftItemDataType[];
  }

  interface UserItemInfo {
    Accuracy: number;
    blockchain: number;
    categories: number;
    collection_id: number;
    collection_name: string;
    content: string;
    create_wallet_address: string;
    currency_type: number;
    customize_url: string;
    description: string;
    favorites_num: number;
    have_num: number;
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

  interface getFavoritesInfo {
    itemInfo: ApiCollection.CollectionItemInfo[];
  }
  interface getUserBlindboxInfo {
    user_blindbox_info: ApiCollection.CollectionItemInfo[];
  }

  interface saveUserInfoPayload {
    username?: string;
    bio?: string;
    email?: string;
    twitter_link?: string;
    instagram_link?: string;
    site_link?: string;
    profile_image: string;
    profile_banner?: string;
    wallet_address?: string;
  }
  interface BlogItem {
    id: number;
    title: string;
    desc: string;
    content: string;
    img_url: string;
    date: string;
    created_at: number;
    subtitle: { title: string; desc: string }[];
  }
  interface EventItem {
    id: number;
    title: string;
    content: string;
    date: string;
    created_at: number;
  }

  interface LuckydogPayload {
    name: string;
    phone: string;
    email: string;
    discord: string;
  }

  interface ActivityReviewPayload {
    review_id?: number;
    activity_id: number;
    twitter: string;
    discord: string;
    img_url: string[];
  }

  interface ActivityListItem {
    id: number;
    name: string;
    start_time: number;
    end_time: number;
    status: ActivityStatus;
  }

  interface NotifyListItem {
    id: number;
    title: string;
    content: string;
    link?: string;
    read: boolean;
  }

  interface ProjectItemDataType {
    collection_address: string;
    logo: string;
    name: string;
    chain_id: number;
  }

  interface getUserProjectItems {
    total: number;
    list: ProjectItemDataType[];
  }

  interface getUserProjectItemsDetail {
    collection_address: string;
    chain_id: number;
    sign_data?: string;
    logo: string;
    banner: string;
    royalty?: string;
    receiver?: string;
  }
}

/** 获取用户页nfts */
export function getUserItems(
  data: {
    owner_wallet_address: string;
    chain_id: any;
  } & ApiMarket.ExploreQueryType,
) {
  return requestV1<ApiUser.getUserItemInfo>(`/api/market/v1/item/list`, {
    method: 'POST',
    body: data,
  });
}

/** buddy project - 获取用户页项目 */
export function getUserProjectItems(data: { chain_id: number | string }) {
  return requestV1<ApiUser.getUserProjectItems>(
    `/api/user/v1/collection?${stringify(data)}`,
  );
}

/** buddy project - 项目详细信息 */
export function getUserProjectItemsDetail(data: {
  chain_id: number | string;
  collection_address: string;
}) {
  return requestV1<ApiUser.getUserProjectItemsDetail>(
    `/api/user/v1/collection/info?${stringify(data)}`,
  );
}

/** buddy project - 修改项目详细信息 */
export function postUserProjectItemsDetail(
  data: ApiUser.getUserProjectItemsDetail,
) {
  return requestV1<{ status: number }>(`/api/user/v1/collection`, {
    method: 'POST',
    body: data,
  });
}

/** 获取用户信息 */
export function getUserInfo(data: { wallet_address: string }) {
  return requestV1<ApiUser.UserDetailInfo>(
    `/api/user/v1/users/info?${stringify(data)}`,
  );
}

/** 更新用户信息 */
export function updateUserInfo(data: ApiUser.saveUserInfoPayload) {
  return requestV1<{ data: string }>(`/api/user/v1/users/info`, {
    method: 'PUT',
    body: data,
  });
}

/** 设置nft为头像 */
export function setNFTAvatar(data: {
  chain_id: number;
  token_id: string;
  collection_address: string;
}) {
  return requestV1<{ status: number }>(`/api/user/v1/user/avatar/nft`, {
    method: 'PUT',
    body: data,
  });
}

/** 获取用户页nft列表信息 */
export function getMyNftList(
  data: { wallet_address: string } & PaginationType,
) {
  return request<{ data: ApiUser.getUserItemInfo }>('/api/getMyNftList', {
    method: 'POST',
    body: data,
  });
}

/**
 * 获取用户页收藏列表信息
 * */
export function getFavoritesInfo(data: PaginationType) {
  return request<{ data: ApiUser.getFavoritesInfo }>('/api/getFavoritesInfo', {
    method: 'POST',
    body: data,
  });
}

/** 获取用户页盲盒表信息 */
export function getUserBlindboxInfo(
  data: { wallet_address: string } & PaginationType,
) {
  return request<{ data: ApiUser.getUserBlindboxInfo }>(
    '/api/getUserBlindboxInfo',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 保存用户信息 */
export function saveUserInfo(data: ApiUser.saveUserInfoPayload) {
  return request<{ data: string }>('/api/saveUserInfo', {
    method: 'POST',
    body: data,
  });
}

/** 绑定关系 */
export function bindRelationship(data: { trace_id: string }) {
  return request<{ up_user_id: string }>('/api/user/v1/groups/set', {
    method: 'POST',
    body: data,
  });
}

/** 首页blog */
export function blogList(data: { locale: string; section: number }) {
  return requestV1<{ publication_list: ApiUser.BlogItem[] }>(
    `/api/user/v1/publication/list?${stringify(data)}`,
    {
      headers: {
        [NEXT_LOCALE_KEY]: data.locale,
      },
    },
  );
}

/** 全部blog */
export function allBlogList(data: { locale: string; section: number }) {
  return requestV1<{ publication_list: ApiUser.BlogItem[] }>(
    `/api/user/v1/blog/list?${stringify(data)}`,
    {
      headers: {
        [NEXT_LOCALE_KEY]: data.locale,
      },
    },
  );
}

/** event list */
export function eventList(data: { locale: string }) {
  return requestV1<{ list: ApiUser.EventItem[] }>(`/api/user/v1/event/list`, {
    headers: {
      [NEXT_LOCALE_KEY]: data.locale,
    },
  });
}

/** 该用户对应的tokenid是否中奖 */
export function getLuckydog() {
  return requestV1<{
    /** 是否有资格 */
    is_lucky_dog: boolean;
    /** 是否已填写 */
    already_written: boolean;
  }>(`/api/user/v1/luckydog`);
}

/** 中奖统计信息表单 */
export function luckydog(data: ApiUser.LuckydogPayload) {
  return requestV1<{ status: number }>(`/api/user/v1/luckydog`, {
    method: 'POST',
    body: data,
  });
}

/** 历史填写表单信息 */
export function activityReviewHistory(data: { activity_id: number }) {
  return requestV1<ApiUser.ActivityReviewPayload>(
    `/api/user/v1/activity/review?${stringify(data)}`,
  );
}

/** 填写活动表单 */
export function activityReview(data: ApiUser.ActivityReviewPayload) {
  return requestV1<{ status: number }>(`/api/user/v1/activity/review`, {
    method: 'POST',
    body: data,
  });
}

export enum ActivityStatus {
  NotStarted,
  InProgress,
  Finished,
}

export enum ActivityReviewStatus {
  NotSubmitted,
  Submitted,
  FailedToPass,
  Pass,
}

export function activityReviewStatus(data: { id: number }) {
  return requestV1<{ status: ActivityReviewStatus }>(
    `/api/user/v1/activity/review/status?${stringify(data)}`,
  );
}
// export function chatInfo(data:  {
//   wallet: string | undefined,
//   room: string,
//   cursor: number,
//   page_size: number
// }) {
//   return requestV1Chat<{ status: number }>(`/proxy`, {
//     method: 'POST',
//     body: data,
//   });
// }

export function activityList() {
  return requestV1<{
    list: Array<ApiUser.ActivityListItem>;
    server_time: number;
  }>(`/api/user/v1/activity/list`);
}
/** 获取当前登录用户站内信列表 */
export function getNotifyList() {
  return requestV1<{ list: ApiUser.NotifyListItem[] }>(
    `/api/user/v1/notify/list`,
  );
}

/** 批量设置站内信已读 */
export function readNotify(data: { id_list: number[] }) {
  return requestV1<{ status: number }>(`/api/user/v1/notify/list/read`, {
    method: 'PUT',
    body: data,
  });
}

/** 获取twitter登录链接 */
// export function getTwitterUrl() {
//   return requestV1<{ url: string }>(`/api/user/v1/user/twitter/url`);
// }

export function getTwitterUrl(data: { redirect_url: string }) {
  return requestV1(`/api/user/v1/user/twitter/url?${stringify(data)}`);
}

// export function newGetTwitterUrl() {
//   return requestV1<{ url: string }>(`/api/user/v1/user/twitter/url`);
// }

export function newGetTwUrl(data: { redirect_url: string; state: any }) {
  return requestV1<any>(`/api/user/v1/task/twitter/url`, {
    method: 'POST',
    body: data,
  });
}

/**关注twitter */
export function newFollowTw(data: {
  code: string;
  redirect_url: string;
  task_id: number;
}) {
  return requestV1<any>(`/api/user/v1/task/twitter/follow`, {
    method: 'PUT',
    body: data,
  });
}

/** 绑定twitter */
export function bindTwitter(data: { code: string; redirect_url: string }) {
  return requestV1<{ twitter_name: string; is_first: boolean }>(
    `/api/user/v1/user/twitter`,
    {
      method: 'POST',
      body: data,
    },
  );
}

/** discord回调接口 返回dcname  */
export function dcCallback(data: { code: string; redirect_uri: string }) {
  return requestV1<{ discord_name: string; is_first: boolean }>(
    `/api/user/v1/discord/callback`,
    {
      method: 'POST',
      body: data,
    },
  );
}

/** discord清空内容 */
export function unbindDc() {
  return requestV1<{ discord_name: string }>(`/api/user/v1/discord/unbind`, {
    method: 'DELETE',
  });
}

/** twitter清空内容 */
export function unbindTw() {
  return requestV1<{ discord_name: string }>(`/api/user/v1/twitter/unbind`, {
    method: 'DELETE',
  });
}

/** 获取twitter oauth2.0 url */
export function getTwUrl(data: { redirect_url: string; type: number }) {
  return requestV1<any>(`/api/user/v1/task/twitter/url`, {
    method: 'POST',
    body: data,
  });
}
/**关注twitter */
export function followTw(data: {
  code: string;
  redirect_url: string;
  follow_id: number;
}) {
  return requestV1<any>(`/api/user/v1/task/twitter/follow`, {
    method: 'PUT',
    body: data,
  });
}

/**转发twitter */
export function retweetTw(data: {
  code: string;
  redirect_url: string;
  retweet_id: number;
}) {
  return requestV1<any>(`/api/user/v1/task/twitter/retweet`, {
    method: 'PUT',
    body: data,
  });
}

/** 获取周年庆任务完成情况 */
export function getTaskInfo() {
  return requestV1<any>(`/api/user/v1/task/info`, {
    method: 'GET',
  });
}

/**周年庆打卡 */
export function dayCheckIn() {
  return requestV1<any>(`/api/user/v1/task/checkin`, {
    method: 'PUT',
  });
}

/**为用户加入群组 */
export function dcGuild(data: { code: string; redirect_uri: string }) {
  return requestV1<any>(`/api/user/v1/task/discord/guild`, {
    method: 'POST',
    body: data,
  });
}

/**周年庆新闻阅读完成 */
export function newsRead(data: { news_id: number }) {
  return requestV1<any>(`/api/user/v1/task/news/read`, {
    method: 'PUT',
    body: data,
  });
}

/**参加周年庆任务评级 */
export function rating() {
  return requestV1<any>(`/api/user/v1/task/rating`, {
    method: 'PUT',
  });
}
