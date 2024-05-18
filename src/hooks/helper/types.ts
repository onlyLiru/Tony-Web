import { ContractTransaction } from 'ethers';

/** 可展示的合约步骤 */
export enum ContractStepType {
  /** 合约授权 */
  APPROVE_COLLECTION,
  /** Weth 授权 */
  APPROVE_WETH,
  /** 挂单 */
  LISTING,
  /** 取消挂单 */
  CANCEL_LISTING,
  /** 购买 */
  BUY,
  /** 发起报价 */
  MAKE_OFFER,
  /** 接受报价 */
  ACCEPT_OFFER,
  /** weth 存款，对应 eth转weth */
  WETH_DEPOSITT,
  /** weth 提现，对应，weth转eth */
  WETH_WITHDRAW,
  /** 合约拥有者fee设置 */
  COLLECTION_OWNER_FEE_SETTING,
}
export type ContractStep = {
  type: ContractStepType;
  tx?: ContractTransaction;
  trigger?: () => void;
  status: 'pending' | 'success' | 'faild' | '';
};
