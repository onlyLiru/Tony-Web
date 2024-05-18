import { requestV1 } from '@/utils/request';
import { stringify } from 'querystring';
import { ApiMarket } from '@/services/market';

export declare namespace ApiHanazawa {
  interface MintStatus {
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
    left: number;
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
  interface ItemMintInfo {
    /** mint凭证 */
    proof: string;
    /** mint配置	 */
    config: string;
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
}

/** 查询项目mint的状态 */
export function mintStatus(data: { address: string /** 合约地址 */ }) {
  return requestV1<ApiHanazawa.MintStatus>(
    `/api/market/v1/mint/status?${stringify(data)}`,
  );
}

/** 获取用户mint状态 */
export function itemMintStatus(data: { address: string /** 合约地址 */ }) {
  return requestV1<ApiHanazawa.ItemMintStatus>(
    `/api/market/v1/item/mint/status?${stringify(data)}`,
  );
}

/** 获取对应项目对应的mint信息 */
export function itemMintInfo(data: {
  address: string;
  /** 合约地址 */ count: number;
}) {
  return requestV1<ApiHanazawa.ItemMintInfo>(
    `/api/market/v1/item/mint/info?${stringify(data)}`,
  );
}

/** 获取蓝筹信息 */
export function bluechip(data: { address: string /** 合约地址 */ }) {
  return requestV1<ApiHanazawa.BluechipInfo>(
    `/api/market/v1/item/mint/bluechip?${stringify(data)}`,
  );
}

/** 获取项目价值信息 */
export function getMintData(data: { address: string /** 合约地址 */ }) {
  return requestV1<ApiHanazawa.MintData>(
    `/api/market/v1/item/mint/data?${stringify(data)}`,
  );
}

/** 获取nft数据 */
export function getNftData(data: { address: string /** 合约地址 */ }) {
  return requestV1<{ items: ApiMarket.NftListType[] }>(
    `/api/market/v1/item/newest?${stringify(data)}`,
  );
}

/** 更新publicmint状态 */
export function updatePublicStatus(data: { count: number }) {
  return requestV1<{ data: { status: boolean } }>(
    `/api/market/v1/item/mint/public`,
    {
      method: 'PUT',
      body: data,
    },
  );
}
