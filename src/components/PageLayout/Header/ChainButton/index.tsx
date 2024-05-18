/* eslint-disable react/jsx-key */
import { supportChains } from '@/contract';
import { logosByNetwork, namesByNetwork } from '@/contract/constants/logos';
import { SupportedChainId } from '@/contract/types';
import { useMounted } from '@/hooks/useMounted';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Link,
  IconButtonProps,
  useDisclosure,
  Box,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useNetwork, useSwitchNetwork } from 'wagmi';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { defaultChainId } from '@/store';
import useLocalStorage from '@/hooks/storage';
import { LOCAL_KEY } from '@/const/localKey';
import { useStore } from '@/store/useStore';
// import { setupNetwork } from '@/utils';
// import { ethers } from 'ethers';
import { observer } from 'mobx-react';

const ChainButton = observer((props: Omit<IconButtonProps, 'aria-label'>) => {
  const { nftStore } = useStore();
  const [curretnChainId, setCurrentChainId] = useLocalStorage(
    LOCAL_KEY.currentChainIdKey,
  );

  const { isOpen, onToggle, onClose } = useDisclosure();
  const { onVisitChainChange, localChainId, setLocalChainId } =
    useSwitchChain();

  const isMounted = useMounted();

  useEffect(() => {
    setTimeout(() => {
      const newWindowChainId =
        typeof window !== 'undefined' && localChainId
          ? Number(localChainId)
          : defaultChainId;
      setLocalChainId(newWindowChainId.toString());
    }, 500);
  }, []);

  const isActive = useCallback(
    (id: number) => {
      return id === Number(localChainId);
    },
    [localChainId],
  );

  const Logo = useMemo(
    () => logosByNetwork[Number(localChainId) as SupportedChainId],
    [logosByNetwork, localChainId],
  );

  if (!isMounted) return null;
  return (
    <>
      <Flex
        border="1px solid rgba(255,255,255,0.1)"
        borderRadius="12px"
        h="40px"
        ml="16px"
      >
        {supportChains.map((item, index) => {
          const Logos = logosByNetwork[item.id as SupportedChainId];
          return (
            <Link
              key={item?.id}
              onClick={() => {
                // 切换链都是假切，登录或者交易的时候才真切
                // if (switchNetwork) {
                //   switchNetwork(item?.id);
                // } else {
                //   setupNetwork(item?.id);
                // }
                window?.localStorage?.setItem(
                  'unemata_visionChainId',
                  item?.id?.toString(),
                );
                setCurrentChainId(item?.id);
                nftStore.setToRefreshAll(true);
                setLocalChainId(item?.id?.toString());
                onVisitChainChange(item?.id);
                onClose();
                if (window.location?.pathname != '/explore') {
                  window.location.href = '/explore';
                }
                // window.location.reload();
              }}
              color={isActive(item?.id) ? 'primary.main' : 'typo.sec'}
              role={'group'}
              display={'flex'}
              alignItems="center"
              h="40px"
              px="16px"
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
              <Logos.Chain fontSize={20} />
              {isActive(item?.id) && (
                <Text ml="6px" color={'rgba(255,255,255,0.8)'}>
                  {namesByNetwork[item?.id as SupportedChainId]}
                </Text>
              )}
              {/* {isActive(item?.id) && (
                <Box
                  ml={2}
                  w={{ base: '4px', md: '6px' }}
                  h={{ base: '4px', md: '6px' }}
                  rounded="full"
                  bg="green.300"
                />
              )} */}
            </Link>
          );
        })}
      </Flex>
      {/* <Web2LoginModal ref={web2LoginModal}></Web2LoginModal> */}
    </>
  );
});

export default ChainButton;
