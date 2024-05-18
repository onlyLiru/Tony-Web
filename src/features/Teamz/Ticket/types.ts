import type { tiktType } from '../hooks/useTicket';

export type Item = {
  id: tiktType;
  title: string;
  type: string;
  priceType: string;
  price: string;
  originPrice: string;
  color?: string;
  image?: string;
};
