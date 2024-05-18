import { LOCAL_KEY } from '@/const/localKey';
import { supportChains } from '@/contract';
import { logosByNetwork, namesByNetwork } from '@/contract/constants/logos';
import { SupportedChainId } from '@/contract/types';
import useLocalStorage from '@/hooks/storage';
import { useMounted } from '@/hooks/useMounted';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { useStore } from '@/store/useStore';
import { Link, useDisclosure } from '@chakra-ui/react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChainInfo } from '@/utils/chain';
import IconView from '@/components/iconView';
const SwitchChainView = observer(() => {
  const overlayRef = useRef(null);
  const [showDrowdown, setshowDrowdown] = useState(false);
  const [curretnChainId, setCurrentChainId] = useLocalStorage(
    LOCAL_KEY.currentChainIdKey,
  );
  const { curChainInfo } = useChainInfo();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { nftStore } = useStore();
  const { onVisitChainChange, localChainId, setLocalChainId } =
    useSwitchChain();

  const isMounted = useMounted();

  useEffect(() => {
    const handleMousedown = (e: any) => {
      const safeNodeList: any[] = [];
      if (overlayRef.current) {
        safeNodeList.push(overlayRef.current);
      }
      // 点击层
      const clickNode = e.target;
      for (let index = 0; index < safeNodeList.length; index++) {
        const node = safeNodeList[index];
        if (node && node.contains(clickNode)) {
          return;
        }
      }
      setshowDrowdown?.(false);
    };
    if (showDrowdown) {
      window.addEventListener('mousedown', handleMousedown);
    }
    return () => {
      window.removeEventListener('mousedown', handleMousedown);
    };
  }, [showDrowdown]);

  const isActive = useCallback(
    (id: number) => {
      return id === Number(localChainId);
    },
    [localChainId],
  );

  if (!isMounted) return null;

  return (
    <div
      className="flex relative text-[14px] font-[400] text-[#fff]/80"
      ref={overlayRef}
    >
      <div
        className="py-[8px] px-[16px] border-[1px] border-[#fff]/10 ounded-[10px] rounded-[10px] flex justify-start items-center cursor-pointer select-none"
        onClick={() => setshowDrowdown(!showDrowdown)}
      >
        {supportChains
          ?.filter((item) => item.id === Number(localChainId))
          ?.map((item: any, index: number) => {
            const Logos = logosByNetwork[item.id as SupportedChainId];
            return (
              <div className="" key={index}>
                <Logos.Chain fontSize={22} />
              </div>
            );
          })}
        <span className="ml-[8px] mr-[15px]">
          {localChainId &&
            supportChains
              ?.find((item) => item.id === Number(localChainId))
              ?.nativeCurrency?.symbol?.toUpperCase()}
        </span>
        <IconView type="arrowDown" className="w-[14px] h-auto"></IconView>
      </div>
      {showDrowdown && (
        <div className="absolute top-[50px] left-0 p-[8px] bg-[#0A0A0A] border-[1px] border-[#fff]/10 rounded-[10px] w-[135px]">
          {supportChains.map((item, index) => {
            const Logos = logosByNetwork[item.id as SupportedChainId];
            return (
              <Link
                className={classNames(
                  'rounded-[10px] flex justify-start items-center px-[8px] mb-[4px]',
                  {
                    'bg-[#fff]/10':
                      curretnChainId &&
                      Number(curretnChainId) > 0 &&
                      item?.id === Number(curretnChainId),
                  },
                )}
                key={item?.id}
                onClick={() => {
                  window?.localStorage?.setItem(
                    'unemata_visionChainId',
                    item?.id?.toString(),
                  );
                  setCurrentChainId(item?.id);
                  nftStore.setToRefreshAll(true);
                  setLocalChainId(item?.id?.toString());
                  onVisitChainChange(item?.id);
                  onClose();

                  if (
                    window.location?.pathname != '/explore' ||
                    location.search.indexOf('address') > -1
                  ) {
                    window.location.href = '/explore';
                  }
                  // window.location.reload();
                }}
                color={isActive(item?.id) ? 'primary.main' : 'typo.sec'}
                role={'group'}
                h="40px"
                fontSize="14px"
                transition={'all .3s ease'}
                fontWeight={600}
                _hover={{
                  bg: 'rgba(217, 217, 217, 0.5)',
                }}
                borderLeft={
                  index !== 0 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }
              >
                <Logos.Chain fontSize={22} />
                <span
                  className={classNames(
                    'ml-[8px] text-[14px] font-[500] text-[#fff] hover:text-[#fff]/80',
                  )}
                >
                  {item?.nativeCurrency?.symbol?.toUpperCase()}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});
export default SwitchChainView;
