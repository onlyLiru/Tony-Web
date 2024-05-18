import React, { forwardRef, useEffect, useState } from 'react';
import {
  useDisclosure,
  Box,
  Text,
  Popover,
  PopoverContent,
  Image,
  Button,
  PopoverAnchor,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { setCookie, getCookie, removeCookies } from 'cookies-next';
import * as SIDJS from '@siddomains/sidjs';
import { useProvider, useNetwork, useAccount } from 'wagmi';
import { bsc as bscMain, bscTestnet } from 'wagmi/chains';
import { isProd } from '@/utils';

const { default: SID, getSidAddress } = SIDJS;
const bsc = isProd ? bscMain : bscTestnet;
const bgImage = '/images/common/vip3_modal.png';

export const SpaceIdModal = forwardRef<any, any>((props, ref) => {
  const { children = <Box /> } = props;
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('common');
  const { chain: currentChain } = useNetwork();
  const provider = useProvider();
  const { address } = useAccount();

  useEffect(() => {
    // 当登出的时候清除本地缓存，清除的逻辑维护在具体的组件里好阅读一点
    if (!address) {
      removeCookies('spaceIdModalShow');
    } else {
      // 当在BSC链上时判断用户是否是.bnb域名用户，一次登陆只出一次弹窗
      if (!getCookie('spaceIdModalShow') && currentChain?.id === bsc.id) {
        const sid = new SID({
          provider,
          sidAddress: getSidAddress(currentChain.id),
        });
        sid.getName(address).then((res: any) => {
          if (res.name) {
            setIsOpen(true);
            setCookie('spaceIdModalShow', '1');
          }
        });
      }
    }
  }, [currentChain, address]);

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Popover
        placement={'bottom-end'}
        isOpen={isOpen}
        onClose={handleModalClose}
        // onOpen={onOpen}
        closeOnBlur={false}
        autoFocus={false}
      >
        <PopoverAnchor>{children}</PopoverAnchor>
        <PopoverContent
          border={0}
          p={0}
          rounded={'lg'}
          w="auto"
          bg="transparent"
          overflow={'hidden'}
          top={{ md: '-20px', base: '0' }}
          right={{ md: '-30px', base: '0' }}
          mt={{ md: '0', base: '25%' }}
          _focus={{
            border: '0px',
          }}
        >
          <Box
            w="382px"
            color="#ffffff"
            h="382px"
            bgImage={bgImage}
            bgRepeat="no-repeat"
            alignItems={'center'}
            flexDir={'column'}
            display={'flex'}
            fontFamily="PingFang SC"
          >
            <Image
              src="/images/common/space_id_icon.png"
              w="260px"
              h="40px"
              mt="65px"
            />
            <Text mt="24px" textAlign={'center'} maxWidth="260px">
              {t('header.profile.menus.spaceIdWelcome')}
            </Text>
            <Box
              w={'240px'}
              py="8px"
              mt={'12px'}
              fontSize={'14px'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              opacity={'0.6'}
              lineHeight={'20px'}
              boxShadow={'0px 2px 30px 0px rgba(52,151,233,0.12)'}
              borderRadius={'8px'}
              border={'1px solid rgba(255,255,255,0.09)'}
            >
              <Text
                textAlign={'center'}
                dangerouslySetInnerHTML={{
                  __html: t.raw('header.profile.menus.spaceIdDesc'),
                }}
              />
            </Box>
            <Button
              bg="#756DF6"
              w={'240px'}
              h={'48px'}
              borderColor={'#756DF6'}
              color={'white'}
              _hover={{
                bgColor: 'rgb(117, 139, 255)',
              }}
              fontSize="14px"
              rounded="8px"
              m="24px"
              variant={'outline2border'}
              fontFamily="PingFang SC"
              onClick={handleModalClose}
            >
              {t('header.profile.menus.spaceIdIknown')}
            </Button>
          </Box>
        </PopoverContent>
      </Popover>
    </>
  );
});
