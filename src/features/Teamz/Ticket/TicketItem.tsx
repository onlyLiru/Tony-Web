import type { Item } from './types';
import classNames from 'classnames';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import type { tiktType } from '../hooks/useTicket';
import { useTranslations } from 'next-intl';
import { useBirdTime } from '../hooks/useBirdTime';

export const TicketItem = ({
  item: { title, price, type, priceType, originPrice, color, image, id },
  currentId,
  handleSelect,
}: {
  item: Item;
  currentId: tiktType;
  handleSelect: (id: tiktType) => void;
}) => {
  const { isBirdTime } = useBirdTime();
  const { isMobile } = useDeviceDetect();
  const t = useTranslations('teamz');

  return (
    <li
      className="bg-[rgb(36,36,36)] rounded-2xl text-white list-none flex overflow-hidden md:block"
      style={{
        border:
          id === currentId ? `solid 1px ${color}` : 'solid 1px transparent',
      }}
      onClick={() => {
        handleSelect(id);
      }}
    >
      {isMobile ? (
        <>
          <div className="basis-1/3">
            <img
              src={image}
              alt={image}
              className="object-contain rounded-tl-2xl rounded-bl-2xl"
            />
          </div>
          <div className="basis-2/3 p-3">
            <h4
              className={classNames('text-xs font-bold', { color: color })}
              style={{ color: isMobile ? color : '#fff' }}
            >
              {title}
            </h4>
            <h2 className="font-bold text-sm mb-4">{type}</h2>
            <h4 className="text-slate-500 text-xs">
              {isBirdTime ? priceType : t('price' as any)}
            </h4>

            <h3 className="text-base">
              {isBirdTime ? (
                <>
                  {price}{' '}
                  <span className="text-sm text-slate-500 line-through">
                    {originPrice}
                  </span>
                </>
              ) : (
                <>{originPrice}</>
              )}
            </h3>
          </div>
        </>
      ) : (
        <>
          <h4
            className={classNames(
              'text-xs font-bold h-8 leading-8 text-center',
              { color: color },
            )}
            style={{ color: isMobile ? color : '#fff', backgroundColor: color }}
          >
            {title}
          </h4>
          <img src={image} alt={image} className="object-contain" />
          <div className="p-2">
            <h3 style={{ color }} className="text-xs font-bold">
              MAIN EVENT (SUMMIT)
            </h3>
            <h2 className="font-bold text-lg mb-2">{type}</h2>
            <h4 className="text-slate-500 text-xs">
              {isBirdTime ? priceType : t('price' as any)}
            </h4>
            <h3 className="text-lg font-bold">
              {isBirdTime ? (
                <>
                  {price}{' '}
                  <span className="text-sm text-slate-500 line-through font-normal">
                    {originPrice}
                  </span>
                </>
              ) : (
                <>{originPrice}</>
              )}
            </h3>
          </div>
        </>
      )}
    </li>
  );
};
