export interface ChainInfo {
  label: string;
  appUrl: string;
  rpcUrl: string;
  explorer: string;
  apiUrl: string;
  osApiUrl: string;
  cdnUrl: string;
  rewardsSubgraphUrl: string;
  cloudinaryUrl: string;
}

export interface Addresses {
  /** 版税设置地址 */
  ROYALTY_FEE: `0x${string}`;
  /** market合约地址 */
  EXCHANGE: `0x${string}`;
  /** erc721地址 */
  TRANSFER_MANAGER_ERC721: `0x${string}`;
  /** erc1155地址 */
  TRANSFER_MANAGER_ERC1155: `0x${string}`;
  /** 标准挂单合约地址 */
  STRATEGY_STANDARD_SALE: `0x${string}`;
  /** 稳定币地址 */
  STABLE_CURRENCY: `0x${string}`;
  /** 本地包装货币地址 */
  LOCAL_WRAPPER_CURRENCY: `0x${string}`;
  /** 挂单前授权合约地址查询 */
  SELL_APPROVAL: `0x${string}`;
  /** 版税合约地址查询 */
  COLLECTION_ROYALTI: `0x${string}`;
}
