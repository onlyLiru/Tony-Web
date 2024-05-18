import { TicketSelector } from './TicketSelector';
import { TicketItem } from './TicketItem';
import type { Item } from './types';
import { useUserDataValue } from '@/store';
import { UseTicket } from '../hooks/useTicket';
import { useTranslations } from 'next-intl';

const Mint = () => {
  const { wallet_address: walletAddr } = useUserDataValue() as any;
  const { curTikt, setTikt } = UseTicket(walletAddr);
  const t = useTranslations('teamz');

  const items: Item[] = [
    {
      id: 'express',
      title: '1 DAY TICKET',
      type: 'EXPRESS TICKET',
      priceType: t('early_bird' as any),
      price: '40 USDC',
      originPrice: '70 USDC',
      color: '#B46E18',
      image: '/images/teamz/2024/20231205-144816.jpeg',
    },
    {
      id: 'general',
      title: '2 DAY TICKET',
      type: 'GENERAL PASS',
      priceType: t('early_bird' as any),
      price: '60 USDC',
      originPrice: '90 USDC',
      color: '#B15BC6',
      image: '/images/teamz/2024/20231205-144821.jpeg',
    },
    {
      id: 'business',
      title: '2 DAY TICKET / 2名',
      type: 'BUSINESS PASS',
      priceType: t('early_bird' as any),
      price: '110 USDC',
      originPrice: '170 USDC',
      color: '#336FFD',
      image: '/images/teamz/2024/20231205-144825.jpeg',
    },
    {
      id: 'red',
      title: '2 DAY TICKET',
      type: 'RED CARPET PASS',
      priceType: t('early_bird' as any),
      price: '150 USDC',
      originPrice: '190 USDC',
      color: '#FF4547',
      image: '/images/teamz/2024/20231205-144829.jpeg',
    },
    {
      id: 'vip',
      title: '2 DAY TICKET',
      type: 'VIP PASS',
      priceType: t('early_bird' as any),
      price: '320 USDC',
      originPrice: '520 USDC',
      color: '#FFC00F',
      image: '/images/teamz/2024/20231205-144834.jpeg',
    },
  ];

  return (
    <>
      <ul className="grid grid-cols-5 max-sm:grid-cols-1 gap-4 mb-5">
        {items.map((item) => {
          return (
            <TicketItem
              key={item.id}
              item={item}
              currentId={curTikt}
              handleSelect={(id) => {
                setTikt(id);
              }}
            />
          );
        })}
      </ul>
      <TicketSelector currentId={curTikt} />
    </>
  );
};

export default Mint;
