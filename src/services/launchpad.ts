import { requestV1 } from '@/utils/request';
import { stringify } from 'querystring';

export declare namespace ApiLaunchpad {
  interface ListItem {
    /** 合约地址 */
    contract_address: string;
    /**
     * 销售状态
     * - 0 未开始
     * - 1 进行中
     * - 2 已结束
     */
    sale_status: number;
    /** 项目标识符 */
    name: string;
    desc: string;
    img_url: string;
    /** 倒计时 */
    end_time: number;
    /** 项目名称 */
    title: string;
    /** 主链类型 */
    type: 1 | 2;
    /** ? */
    integral: number;
    labels: { name: string; color: string }[];
  }

  interface Itemtatus {
    /**
     * 销售阶段
     * - 1 公开发售
     * - 2 白名单阶段
     * - 4 freemint阶段
     */
    sales_stage: number;
    /**
     * 销售状态
     * - 0:未开始
     * - 1:进行中
     * - 2:已结束
     */
    sale_status: number;
    /** 剩余时间 */
    end_time: number;
    /** 总供应量 */
    total_supply: number;
    /** 总销售量 */
    total_mint: number;
    /** 阶段供应量 */
    phase_supply: number;
    /** 剩余量 */
    left: number;
    /** 价格 */
    price: number;
  }
  interface ItemMintStatus {
    /** 是否可以mint */
    mint_status: boolean;
    /** 已经mint的数量 */
    mint_count: number;
    /** 最大mint数量 */
    max_mint_count: number;
  }
  interface ItemMintProof {
    /** mint凭证 */
    proof: string;
    /** mint配置	 */
    config: string;
    /** mint价值 */
    value: number;
  }
  interface BluechipInfo {
    holders: number;
    holder_rate: number;
    holder_up_rate: number;
    total_holders: number;
    whales: number;
    total_whales: number;
    whales_up_rate: number;
    whales_rate: number;
  }
  interface MintData {
    items: number;
    unique_owners: number;
    listed: number;
    vol: number;
    floor: number;
    floor_rate: number;
  }
  interface UserStatus {
    limit: number;
    minted: number;
  }
}

/** 查询launchpad列表 */
export function list(data?: {
  /**
   * 筛选
   * - 0 all
   * - 1 eth
   * - 2 bsc
   */
  type: string;
}) {
  return requestV1<{ launchpad_list: ApiLaunchpad.ListItem[] }>(
    `/api/market/v1/launchpad/list?${stringify(data)}`,
  );
}

/** 获取launchpad的项目具体状态 */
export function status(data: {
  /** 项目地址 */
  address: string;
}) {
  return requestV1<ApiLaunchpad.Itemtatus>(
    `/api/market/v1/launchpad/status?${stringify(data)}`,
  );
}

export enum ProjectStatusV2 {
  Wait,
  InProgress,
  End,
}

export enum ProjectStageV2 {
  PublicSale = 1,
  WhitelistSale = 2,
}

/** 获取launchpad的项目具体状态 */
export function statusV2(data: {
  /** 项目地址 */
  address: string;
}) {
  return requestV1<{
    sale_stage: ProjectStageV2;
    sale_status: ProjectStatusV2;
    /** 开始时间 */
    start_time: number;
    /** 结束时间 */
    end_time: number;
    /** 公开销售阶段的供应量 */
    public_sale_supply: number;
    /** 公开销售阶段剩余量 */
    public_sale_left: number;
    /** private sale 白单用户供应量 */
    private_sale_supply: number;
    /** private sale 白单用户剩余量 */
    private_white_sale_left: number;
    /** private sale 非白单用户供应量 */
    private_public_sale_supply: number;
    /** private sale 非白单用户剩余量 */
    private_public_sale_left: number;
    /** 价格 */
    private_price: number;
    /** 普通价格 */
    public_price: number;
    /** 项目合约地址 */
    contract_address: string;
    perfume_exchanged: number;
  }>(`/api/market/v1/launchpad/status?${stringify(data)}`);
}

/** 获取用户项目状态 */
export function userStatus(data: {
  /** 项目地址 */
  address: string;
}) {
  return requestV1<ApiLaunchpad.UserStatus>(
    `/api/market/v1/launchpad/mint/users/status?${stringify(data)}`,
  );
}

export function userStatusV2(data: {
  /** 项目地址 */
  address: string;
}) {
  return requestV1<{
    /** 是否是白单用户 */
    is_whitelist: boolean;
    /** 白单阶段购买限制的个数 */
    allow_limit: number;
    /** 公开阶段购买限制的个数 */
    public_limit: number;
    /** 用户白单阶段的已mint 数量 */
    allow_minted: number;
    /** 用户公开阶段已 mint 数量 */
    public_minted: number;
  }>(`/api/market/v1/launchpad/mint/users/status?${stringify(data)}`);
}

/** 获取用户mint签名信息 */
export function proof(data: {
  /** 合约地址 */
  contract_address: string;
  /** mint数量 */
  count: number;
}) {
  return requestV1<ApiLaunchpad.ItemMintProof>(
    `/api/market/v1/launchpad/mint/users/proof?${stringify(data)}`,
  );
}

export type BellaFormPayload = {
  name: string;
  email: string;
  city: string;
  zip: string;
  address: string;
  token_id_list?: string[];
};

/** bella香薰对换表单 */
export function bellaForm(data: BellaFormPayload) {
  return requestV1<{ success: boolean }>(
    `/api/market/v1/launchpad/bella/form`,
    {
      method: 'POST',
      body: data,
    },
  );
}

type BellaTokenListRes = {
  list: { id: string; name: string }[];
  already_written: boolean;
};
/** 获取香薰可交换tokenid */
export function bellaTokenList() {
  return requestV1<BellaTokenListRes>(
    `/api/market/v1/launchpad/bella/token/list`,
  );
}

export type hqpListPayload = {
  platform: number;
};

/** 优质项目列表 */
export function hqpList(data: hqpListPayload) {
  return requestV1<any>(`/api/project/v1/hqp/get`, {
    method: 'POST',
    body: data,
  });
}
/** 获取launchpad sign */
export function addressSign(data: {
  /** 项目地址 */
  contract_address: string;
  wallet_address: any;
}) {
  return requestV1<{
    sign: string;
  }>(`/api/market/v1/launchpad/sign?${stringify(data)}`);
}

/** 检查用户是否是在项目白名单中 */
export function whitelistCheck(data: {
  /** 项目地址 */
  contract_address: string;
  wallet_address: any;
}) {
  return requestV1<{
    is_whitelist: boolean;
  }>(`/api/market/v1/launchpad/whitelist/check?${stringify(data)}`);
}
