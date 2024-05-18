export enum CURRENCT_TYPE {
  ETH = 1,
  WETH = 2,
  USDT = 3,
  UNE = 4,
}

export function getCurrenySymbol(type: CURRENCT_TYPE) {
  if (!type) return '';
  return CURRENCT_TYPE[type];
}
