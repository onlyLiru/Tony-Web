import { requestV1, PaginationV1Type } from '@/utils/request';
import { stringify } from 'querystring';

export declare namespace ApiAgent {
  type HomePage = {
    join_me_info: {
      code: string;
      description: string;
    };
    agent_info: {
      nick_name: string;
      /** 可提现金额，单位eth */
      amount: string;
      /**
       * 推广类型
       * - 1 个人
       * - 2 团队
       */
      type: string;
      /** 推广者等级 */
      level: string;
      /** 反佣比例，百分数，使用时候需要后面加百分号 */
      ratio: string;
      status: number;
    };
    board_info: {
      /** 当日新增会员 */
      today_new_members: number;
      /** 总会员数量 */
      total_members: number;
      /** 当日反佣金 eth */
      today_recommision: string;
      /** 总反佣金 eth */
      total_recommision: string;
    };
    /** 能够推广 */
    can_extension: boolean;
  };

  type AgentItem = {
    name: string;
    wallet_address: string;
    level: number;
    ratio: number;
    friends_num: number;
    deal_amount: string;
  };

  type InviteItem = {
    id: number;
    description: string;
    invited_num: number;
    amount: string;
    status: number;
    created: number;
    code: string;
  };

  type InviteList = {
    total: number;
    list: ApiAgent.InviteItem[];
    list_count: number;
    list_useful: number;
  };

  type UserItem = {
    name: string;
    promoter_type: number;
    description: string;
    friend_num: number;
    deal_amount: string;
    day_deal_amount: string;
    contributed: string;
  };

  type UserList = {
    total: number;
    list: ApiAgent.UserItem[];
    new_deal_friend_num: number;
    total_friends_num: number;
  };

  type OrderItem = {
    name: string;
    parent_id: number;
    parent_name: string;
    deal_amount: string;
    currency_type: number;
    ratio: number;
    recommendation_amount: string;
    created: number;
  };

  type OrderList = {
    total: number;
    list: ApiAgent.OrderItem[];
    total_recommendation_amount: string;
  };

  type WithdrawItem = {
    order_id: string;
    before_amount: string;
    submit_amount: string;
    after_amount: string;
    status: number;
    currency_type: number;
    created_at: number;
  };

  type WithdrawList = {
    total: number;
    list: ApiAgent.WithdrawItem[];
    total_submit_amount: string;
  };

  type WithdrawData = {
    id: number;
    amount: string;
    proof: string[];
  };

  type JoinmeRes = { code: string };

  type LevelItem = {
    level: number;
    name: string;
  };
}

/** 生成邀请链接 */
export function joinme(data: {
  is_default: number;
  description: string;
  url: string;
}) {
  return requestV1<ApiAgent.JoinmeRes>('/api/project/v1/joinme', {
    method: 'POST',
    body: data,
  });
}

/** 用户点击邀请链接，前端发送请求，后端解析短链返回长链，前端重定向到长链地址 */
export function slink(data: { short_link: string }) {
  return requestV1<{ long_link: string }>('/api/project/v1/parse/slink', {
    method: 'POST',
    body: data,
  });
}

/** 校验邀请码 */
export function checkCode(data: { code: string }) {
  return requestV1<{ status: number }>(
    `/api/project/v1/check/code?${stringify(data)}`,
  );
}

/** 失效邀请码 */
export function invalidateCode(data: { code: string }) {
  return requestV1<{ status: number }>(
    `/api/project/v1/disable/code?${stringify(data)}`,
  );
}

/** 主页信息返回 */
export function promoterHomepage() {
  return requestV1<ApiAgent.HomePage>(`/api/project/v1/promoter/homepage`);
}

/** 邀请回调函数 */
export function joinmeSucceed(data: { code: string }) {
  return requestV1<{ status: number }>(
    `/api/project/v1/joinme/succeed?${stringify(data)}`,
  );
}

/** 推广列表 */
export function agentList(data: { wallet_address: string } & PaginationV1Type) {
  return requestV1<{
    total: number;
    list: ApiAgent.AgentItem[];
    can_operate: boolean;
  }>('/api/project/v1/promoter/agent/list', {
    method: 'POST',
    body: data,
  });
}

/** 用户列表 */
export function userList(
  data: { description: string; name: string } & PaginationV1Type,
) {
  return requestV1<ApiAgent.UserList>('/api/project/v1/promoter/friend/list', {
    method: 'POST',
    body: data,
  });
}

/** 邀请列表 */
export function inviteList(
  data: {
    description: string;
    start_time: number;
    end_time: number;
  } & PaginationV1Type,
) {
  return requestV1<ApiAgent.InviteList>(
    '/api/project/v1/promoter/invite/list',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** order列表 */
export function orderList(
  data: { name: string; parent_id: number } & PaginationV1Type,
) {
  return requestV1<ApiAgent.OrderList>(
    '/api/project/v1/promoter/recommission/list',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 提现列表 */
export function withdrawList(
  data: { name: string; parent_id: number } & PaginationV1Type,
) {
  return requestV1<ApiAgent.WithdrawList>(
    '/api/project/v1/promoter/submit/list',
    {
      method: 'POST',
      body: data,
    },
  );
}

/** 获取提现数据 */
export function getWithdrawData() {
  return requestV1<ApiAgent.WithdrawData>(`/api/project/v1/promoter/data`);
}

/** 获取可设置等级 */
export function getLevelList() {
  return requestV1<{
    wallet_address: string;
    level_list: ApiAgent.LevelItem[];
  }>(`/api/project/v1/promoter/level/list`);
}

/** 设置代理等级 */
export function settingLevel(data: { friend_wallet: string; level: number }) {
  return requestV1<{ status: number }>(
    `/api/project/v1/promoter/setlevel?${stringify(data)}`,
  );
}
