import request, { requestV1 } from '@/utils/request';
import { stringify } from 'querystring';
import { NEXT_LOCALE_KEY } from '@/const/cookie';

export declare namespace ApiRebate {
  export interface SignedInDate {
    year?: number;
    month?: number;
    source?: number;
  }

  export interface SignedInDateInfo {
    sign_date?: number[];
    sign_days?: number; // 签到日期
    not_sign_days?: number; // 未签到日期
    repair_cards?: number; // 补签卡数量
    today_sign_in_status?: boolean; // 今日是否签到过
    today_sign_in_count?: number; // 今日总签到人数
    continuous_sign_days?: number; //连续签到天数
  }
  export interface SignedInfo {
    sign_days?: number; // 签到日期
    not_sign_days?: number; // 未签到日期
    uuu_reward?: number; // 获得积分
    repair_cards?: number; // 补签卡数量
    continuous_sign_days?: number; // 补签卡数量
  }

  export interface TaskListItem {
    task: string;
    description: string;
    status: number;
  }
  export interface HoldListItem {
    item_id: number;
    create_time: number;
    image_thumbnail_url: string;
    image_url: string;
    format: number;
    cash_status: number;
    diamonds_status: number;
  }
  export interface RebateInfo {
    task1: number; // 积分兑换白蛋活动
    task2: number; // 设置nft为头像
    task3: number; // 连续签到7天
    task4: number; // 拥有5个花泽nft
    task5: number; // 拥有5个花泽nft持有时间大于7天
    task6: number; // twitter 转发
    task7: number; // 拥有5个花泽nft持有时间大于30天
    task8: number; // 转发twitter削减数量
    can_receive: boolean; // 是否能领取奖励
    reward: {
      cash_count: number; // 领取现金奖励份数
      cash_reward: string; //  可领取现金奖励金额eth
      diamonds_count: number; // 领取钻石手奖励份数
      diamonds_reward: string; //  可领取钻石手奖励金额eth
      total_reward: string; // 领取奖励金额（eth）
      remain_reward: string;
      received_reward: string;
    };
    local_time: number; // 时间戳
    task_done_num: number; // 任务完成数
    received_score: number; // 任务获取的总积分数
    continuous_check_in_time: number; // 连续签到时间
  }
  export interface GetReward {
    id: number;
    tree_id: number;
    amount: string;
    proof: string;
    number1: number;
    number2: number;
  }
}

export function getSignedInDate(data: ApiRebate.SignedInDate) {
  return requestV1(
    '/api/project/v1/signin/info',
    {
      method: 'POST',
      body: data,
    },
    {
      unlogin: true,
    },
  );
}

export function signIn(data: { source: number }) {
  return requestV1<ApiRebate.SignedInfo>(
    `/api/project/v1/signin?${stringify(data)}`,
  );
}

export function reSignIn(data: { date: number }) {
  return requestV1<{ status: number }>(
    `/api/project/v1/signin/repair?${stringify(data)}`,
  );
}

export function retweet(data: { locale: string; task_id: number }) {
  return requestV1<{ status: number; msg: string }>(
    `/api/user/v1/quote/activity`,
    {
      headers: {
        [NEXT_LOCALE_KEY]: data.locale,
      },
      method: 'POST',
      body: data,
    },
  );
}

export function getTwittwerBindStatus() {
  return requestV1<{ is_auth: boolean }>(`/api/user/v1/auth`);
}

export function getTaskStatus() {
  return requestV1<ApiRebate.RebateInfo>(`/api/project/v1/bella/task/status`);
}

export function getHoldList(data: { page?: number; page_size?: number }) {
  return requestV1<{
    item_list: ApiRebate.HoldListItem[];
    num: number;
    local_time: number;
  }>(`/api/project/v1/bella/second/item/list?${stringify(data)}`);
}

export function getReward() {
  return requestV1<ApiRebate.GetReward>(`/api/project/v1/bella/receive`);
}

/**
 * 积分排行榜
 */
export function getScoreRank(data: any) {
  return requestV1('/api/integral/v1/score/board', {
    method: 'POST',
    body: data,
  });
}
/**
 * 砖石排行榜
 */
export function getMasonryRank() {
  return request('/api/project/v1/diamond/board', {
    method: 'GET',
  });
}
