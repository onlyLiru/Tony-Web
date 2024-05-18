import {
  Box,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  Text,
  Button,
  Flex,
  HStack,
  Image,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
// import Image from '@/components/Image';
import { useTranslations } from 'next-intl';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  memo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Rule, rubberBand, Progress } from './LuckDrawUi1';
import { useLocalStorageState } from 'ahooks';
import { useUserDataValue, useInviteCode, useShowInviteModal } from '@/store';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import { getTraceInfo, ApiPoints } from '@/services/points';
import { diffTime } from '@/utils/index';

export const HelpModal = memo(
  forwardRef((props: { openTurntable: () => void }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const t = useTranslations('points');
    const [showRule, setShowRule] = useState(false);
    const userData = useUserDataValue();
    const { openConnectModal } = useConnectModal();
    const router = useRouter();
    const toast = useToast();
    const [traceInfo, setTraceInfo] = useState<ApiPoints.uuInfo>(
      {} as ApiPoints.uuInfo,
    );
    const [countdown, setCountdown] = useState(0);
    const timer = useRef<any>();
    const [code, setCode] = useInviteCode();
    const [inviteCode, setInviteCode] = useLocalStorageState<string>(
      'inviteCode',
      {
        defaultValue: '',
      },
    );
    const [_, showInviteModal] = useShowInviteModal();
    useImperativeHandle(ref, () => ({
      open: () => {
        onOpen();
      },
    }));

    useEffect(() => {
      if (inviteCode) {
        onOpen();
        fetchTraceInfo();
      }
    }, [inviteCode]);

    useEffect(() => {
      if (!inviteCode && !isOpen) {
        showInviteModal(false);
      } else {
        showInviteModal(true);
      }
    }, [isOpen, inviteCode]);

    useEffect(() => {
      if (router.query.inviteCode) {
        setInviteCode(router.query.inviteCode as string);
        setCode(router.query.inviteCode as string);
      }
    }, [router.query.inviteCode]);

    const fetchTraceInfo = async () => {
      try {
        const { data } = await getTraceInfo({
          trace_id: inviteCode,
        });
        setTraceInfo(data);
      } catch (error) {
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    };

    // 主力好友
    const bindRela = async () => {
      if (!userData?.wallet_address) {
        openConnectModal?.();
        return;
      }
    };

    // 打开抽奖
    const participate = useCallback(() => {
      if (!userData?.wallet_address) {
        openConnectModal?.();
        return;
      }
      onClose();
      props?.openTurntable();
    }, [userData?.wallet_address]);

    useEffect(() => {
      if (traceInfo?.count_down <= 0) {
        setCountdown(0);
      } else {
        setCountdown(traceInfo?.count_down);
        timer.current = setInterval(() => {
          setCountdown((countdown) => {
            if (countdown <= 0) {
              clearTimeout(timer.current);
              return 0;
            } else {
              return countdown - 1;
            }
          });
        }, 1000);
      }
      return () => {
        clearTimeout(timer.current);
      };
    }, [traceInfo?.count_down]);

    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            // onClose();
            setShowRule(false);
          }}
          isCentered
        >
          <ModalOverlay bg="blackAlpha.700" />
          <ModalContent
            bg={'transparent'}
            transition={'all .5s'}
            transform={isOpen ? 'scale(1)' : 'scale(0)'}
            maxW={'828px'}
          >
            <Flex
              flexDirection={'column'}
              justify={'center'}
              align={'center'}
              position={'relative'}
              onClick={() => {
                setShowRule(false);
              }}
              className="zoom87 md:zoom"
            >
              <Box
                w={'380px'}
                bg={'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);'}
                rounded={'20px'}
                p={'20px 20px 130px'}
                pos={'relative'}
              >
                <Box
                  w={'full'}
                  bg={'#DDF3FF'}
                  rounded={'10px'}
                  p={'15px 10px'}
                  mb={'5px'}
                  boxShadow={'0px 0px 2px rgba(228, 126, 0, 0.2);'}
                >
                  <Box
                    p={'15px 10px'}
                    bg={'#A38EFF'}
                    rounded={'8px'}
                    position={'relative'}
                  >
                    <Flex
                      bg={'#FCF6E8'}
                      borderRadius={'6px'}
                      p={'14px 10px 18px'}
                      align={'center'}
                      flexDirection={'column'}
                    >
                      <Text
                        fontWeight={'600'}
                        mb={'22px'}
                        fontSize={'12px'}
                        color={'#000000'}
                        lineHeight={'15px'}
                        dangerouslySetInnerHTML={{ __html: t.raw('vTitle') }}
                      />
                      <HStack
                        mb={'22px'}
                        fontWeight={'900'}
                        fontSize={'40px'}
                        color={'#FF7A00'}
                        align={'flex-end'}
                      >
                        <Text
                          animation={`${rubberBand} .8s linear infinite`}
                          lineHeight={'25px'}
                        >
                          {traceInfo?.schedule / 100}
                          {traceInfo?.schedule == 9900 ? '.0' : ''}
                        </Text>
                        <Text pos={'relative'} top={'5px'} fontSize={'20px'}>
                          U
                        </Text>
                        <Image
                          cursor={'pointer'}
                          src={'/images/points/q1.png'}
                          w={'15px'}
                          h={'15px'}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowRule(!showRule);
                          }}
                        />
                      </HStack>
                      <Progress schedule={traceInfo?.schedule} />
                      <Button
                        w={'280px'}
                        h={'40px'}
                        bg={'#F7931A'}
                        mt={'9px'}
                        rounded={'100px'}
                        color={'#FFFFFF'}
                        fontSize={'14px'}
                        fontWeight={'600'}
                        fontFamily={'Inter'}
                        onClick={bindRela}
                        disabled={!code}
                        position={'relative'}
                        _hover={{
                          bg: '#F7931A',
                          opacity: 0.8,
                        }}
                        zIndex={5}
                      >
                        {t('help.btn1')}
                      </Button>
                      <HStack
                        justifyContent={'center'}
                        alignItems={'center'}
                        bg={'#A98FFF'}
                        rounded={'8px'}
                        position={'absolute'}
                        w={'140px'}
                        h={'30px'}
                        left={'50%'}
                        transform={'translateX(-50%)'}
                        top={'-20px'}
                      >
                        <Image
                          src={'/images/points/t.png'}
                          w={'15px'}
                          h={'15px'}
                        />
                        <Text
                          fontSize={'12px'}
                          fontWeight={'700'}
                          color={'#FFFFFF'}
                        >
                          {countdown > 0 ? diffTime(countdown) : '00:00:00'}{' '}
                          {t('expire')}
                        </Text>
                      </HStack>
                    </Flex>
                  </Box>
                </Box>
                <ModalCloseButton
                  zIndex={15}
                  color={'#FFFFFF'}
                  top={'-40px'}
                  right={'-15px'}
                  onClick={onClose}
                />
                {/* 规则 */}
                <Rule visible={showRule} isHlep={true} />
                <Box
                  display={{
                    md: 'none',
                    base: showRule ? 'block' : 'none',
                  }}
                  pos={'fixed'}
                  right={0}
                  bottom={0}
                  top={0}
                  left={0}
                  bg={'blackAlpha.700'}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowRule(false);
                  }}
                  zIndex={11}
                />
                <Button
                  rounded={'100px'}
                  bg={'#FAC736'}
                  boxShadow={'2px 4px 0px #D09A00;'}
                  w={'300px'}
                  h={'40px'}
                  color={'#000000'}
                  fontSize={'14px'}
                  pos={'absolute'}
                  bottom={'-64px'}
                  left={'50%'}
                  transform={'translateX(-50%)'}
                  onClick={participate}
                  _hover={{ bg: '#FAC736', opacity: 0.8 }}
                >
                  {t('help.btn2')}
                </Button>
              </Box>
              <Image
                src={'/images/points/hd.png'}
                w={'424px'}
                h={'228'}
                pos={'absolute'}
                bottom={'-10px'}
              />
              <Image
                src={'/images/points/help_t.png'}
                w={'828px'}
                h={'400px'}
                pos={'absolute'}
                top={'-103px'}
                zIndex={-1}
              />
            </Flex>
          </ModalContent>
        </Modal>
      </>
    );
  }),
);
