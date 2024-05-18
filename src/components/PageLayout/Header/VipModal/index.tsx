import React, { useImperativeHandle, forwardRef } from 'react';
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
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

const bgImage = '/images/common/vip3_modal.png';

export const VipModal = forwardRef<any, any>((props, ref) => {
  const { children = <Box /> } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('common');
  const { connector } = useAccount();
  const router = useRouter();
  useImperativeHandle(ref, () => ({
    open: onOpen,
  }));
  // const newconnector: <any, any, any> = connector
  const wallets = (connector as any)?._wallets || null;
  console.log(router);
  return (
    <>
      <Popover
        placement={'bottom-end'}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
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
          {wallets && wallets[0]?.id !== 'bitget' ? (
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
                src="/images/common/vip3_icon.png"
                w="175px"
                h="56px"
                mt="65px"
              />
              <Text mt="24px">{t('header.profile.menus.welcome')}</Text>
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
                  w={'172px'}
                  textAlign={'center'}
                  dangerouslySetInnerHTML={{
                    __html: t.raw('header.profile.menus.desc'),
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
                onClick={onClose}
              >
                {t('header.profile.menus.iknown')}
              </Button>
            </Box>
          ) : (
            <>
              {router?.pathname !== '/chat' && (
                <Box
                  w="382px"
                  color="#ffffff"
                  h="400px"
                  bgImage={bgImage}
                  bgRepeat="no-repeat"
                  alignItems={'center'}
                  flexDir={'column'}
                  display={'flex'}
                  bgSize={'100% 100%'}
                  fontFamily="PingFang SC"
                >
                  <Image
                    src="/images/login/bgW.png"
                    // w="175px"
                    mt="68px"
                    h="38px"
                  />
                  <Text w="260px" minH="48px" mt="24px">
                    {t('header.profile.menus.bgWelcome')}
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
                      w={'172px'}
                      textAlign={'center'}
                      dangerouslySetInnerHTML={{
                        __html: t.raw('header.profile.menus.bgDesc'),
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
                    onClick={() => {
                      router.push(`/rewards`);
                      onClose();
                    }}
                  >
                    {t('header.profile.menus.bgiknown')}
                  </Button>
                </Box>
              )}
            </>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
});
