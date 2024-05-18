import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

export const formatPrice = (price: BigNumberish, decimals: number) => {
  if (!price) return '0.0';
  return formatUnits(BigNumber.from(price), decimals);
};
