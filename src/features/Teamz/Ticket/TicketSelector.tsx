import {
  Box,
  Image,
  Text,
  HStack,
  Button,
  Input,
  Center,
  useNumberInput,
  useToast,
} from '@chakra-ui/react';
import _ from 'lodash';
import { MintModal } from '../comps/mintModal';
import { useEffect, useRef } from 'react';
import { UseTicket, mintAction } from '../hooks/useTicket';
import { useUserDataValue } from '@/store';
import { useTranslations } from 'next-intl';
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit';
import {
  validMintNum,
  validMintTotal,
  validDollarNum,
  confTimeInfo,
  genToastOpt,
} from '../helpers/ticketInfo';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { ticketPrice, totalTikcetNum, confEndTime } from '../const/ticket';

export const TicketSelector = (props: any) => {
  const t = useTranslations('teamz');
  const toast = useToast();
  const { visitChain } = useSwitchChain();
  const { openChainModal } = useChainModal();
  const { wallet_address: walletAddr } = useUserDataValue() as any;
  const { openConnectModal } = useConnectModal();

  const { currentId } = props;

  const {
    balc,
    tiktPrice,
    curTikt,
    setTikt,
    tiktMint,
    setTiktMint,
    setMint,
    mintByUsdt,
    getTiktInfo,
    initBalc,
    wrongNet,
    tiktSupply,
    tiktSuppiled,
  } = UseTicket(walletAddr);

  useEffect(() => {
    setTikt(currentId);
  }, [currentId]);

  useEffect(() => {
    console.info(
      'visitChain:',
      visitChain,
      'wrongNet:',
      wrongNet,
      'NEXT_PUBLIC_VERCEL_ENV:',
      process.env.NEXT_PUBLIC_VERCEL_ENV,
    );
    if (wrongNet) {
      toast(genToastOpt(t('switchNetworkTip')));
      setTimeout(() => openChainModal?.(), 1000 * 2);
    }
  }, [wrongNet]);
  const useNum = useNumberInput({
    step: 1,
    defaultValue: 0,
    min: 0,
    max: 1000,
  });
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNum;
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();
  const mintModalRef = useRef<any>();

  // const ticketStock = {
  //   red: tiktSupply.red - tiktSuppiled.red,
  //   vip: tiktSupply.vip - tiktSuppiled.vip,
  //   express: tiktSupply.express - tiktSuppiled.express,
  //   general: tiktSupply.express - tiktSuppiled.general,
  //   business: tiktSupply.express - tiktSuppiled.business,
  // };
  const isAddDisabled = tiktSuppiled.red + tiktMint[curTikt] >= tiktSupply.red;
  const maxSuppily = tiktSupply.red - tiktSuppiled.red;

  // tiktSupply[curTikt] === 0
  //   ? tiktMint[curTikt] >= totalTikcetNum[curTikt]
  //   : tiktMint[curTikt] >= ticketStock[curTikt];

  const isDecDisabled = tiktMint[curTikt] <= 0;
  const usdtMintClk = async () => {
    if (confTimeInfo(confEndTime).isEnd) {
      toast(genToastOpt(t('confEndTip')));
      return;
    }
    if (!walletAddr) {
      openConnectModal?.();
      return;
    }

    // if (!balc) initBalc();
    await initBalc();

    const vMintTotal = validMintTotal(tiktMint, tiktPrice, balc);
    const vMintNum = validMintNum(tiktMint);
    // 如果库存为0代表没有拉到库存则在支付阶段校验库存
    const vStock =
      tiktMint[curTikt] <= tiktSupply[curTikt] - tiktSuppiled[curTikt] ||
      tiktSupply[curTikt] === 0;

    if (vMintNum && vMintTotal && vStock) {
      mintModalRef.current?.open();
    } else {
      const stock = tiktSupply[curTikt] - tiktSuppiled[curTikt];
      const numWording = t('mintNumErr');
      const totalWording = t('InsufficientBalcErr');
      const stockWording = `${t('lowStockErr')} ${stock} Tickets.`;
      toast(
        genToastOpt(
          vMintNum ? (vStock ? totalWording : stockWording) : numWording,
        ),
      );
    }
  };
  const dollarMintClk = () => {
    if (confTimeInfo(confEndTime).isEnd) {
      t('confEndTip');
      return;
    }

    // if (!walletAddr) {
    //   openConnectModal?.();
    //   return;
    // }

    const vMintNum = validMintNum(tiktMint);
    const vDollarNum = validDollarNum(tiktMint);
    // 如果库存为0代表没有拉到库存则在支付阶段校验库存
    const vStock =
      tiktMint[curTikt] <= tiktSupply[curTikt] - tiktSuppiled[curTikt] ||
      tiktSupply[curTikt] === 0;
    if (vMintNum && vDollarNum) {
      mintModalRef.current?.setDollarMint();
      mintModalRef.current?.open();
    } else {
      const stock = tiktSupply[curTikt] - tiktSuppiled[curTikt];
      const numWording = t('mintNumErr');
      const dollarWording = t('dollarMintNumErr');
      const stockWording = `${t('lowStockErr')} ${stock} Tickets.`;
      toast(
        genToastOpt(
          vMintNum ? (vStock ? dollarWording : stockWording) : numWording,
        ),
      );
    }
  };
  const decreaseTiktClk = () => {
    if (tiktMint[curTikt] <= 0) {
      toast(genToastOpt(t('mintNumErr')));
    } else {
      setMint(mintAction.decrease);
    }
  };
  const addTiktClk = () => {
    if (tiktMint[curTikt] >= totalTikcetNum[curTikt]) {
      toast(genToastOpt(t('mintNumErr')));
    } else {
      setMint(mintAction.add);
    }
  };
  return (
    <>
      <Box
        h="100%"
        w="100%"
        display="flex"
        flexDir="column"
        alignItems="center"
        {...props}
      >
        <HStack
          w={{ sm: '95vw', md: '80%' }}
          minW={{ base: 'auto', lg: '628px' }}
          align="center"
          fontSize={{ base: '2vw', md: '32px' }}
          h={{ base: '10vw', md: '64px' }}
          bg="black"
          borderRadius="32px"
          overflow="hidden"
          border="2px solid #AAFF01"
        >
          <Button
            bg="black"
            h={{ base: '10vw', md: '64px' }}
            fontSize={{ base: '5vw', md: '28px' }}
            color="white"
            pl="25px"
            _hover={{ bg: '#262424' }}
            {...dec}
            isDisabled={isDecDisabled}
            onClick={decreaseTiktClk}
          >
            -
          </Button>
          <Input
            bg="black"
            textAlign="center"
            color="white"
            ml="0px"
            border="none"
            h={{ base: '10vw', md: '64px' }}
            fontSize={{ base: '5vw', md: '28px' }}
            {...input}
            onChange={(e) =>
              setTiktMint({
                ...tiktMint,
                [currentId]:
                  Number(e.target.value) > maxSuppily
                    ? maxSuppily
                    : Number(e.target.value),
              })
            }
            value={tiktMint[curTikt]}
          />
          <Button
            {...inc}
            bg="black"
            color="white"
            h={{ base: '10vw', md: '64px' }}
            fontSize={{ base: '5vw', md: '28px' }}
            pr="25px"
            _hover={{ bg: '#262424' }}
            onClick={addTiktClk}
            isDisabled={isAddDisabled}
          >
            +
          </Button>
        </HStack>
        <HStack spacing={4} align="center" mt={{ base: '5vw', md: '28px' }}>
          <Button
            colorScheme="teal"
            variant="solid"
            w={{ base: '44vw', md: '302px' }}
            bg="#AAFF01FF"
            borderRadius="32px"
            color="black"
            onClick={usdtMintClk}
            isDisabled={tiktMint[curTikt] === 0}
          >
            Mint with USDC
          </Button>
          {/* <Button
            colorScheme="teal"
            variant="solid"
            w={{ base: '44vw', md: '302px' }}
            bg="#AAFF01FF"
            borderRadius="32px"
            color="black"
            onClick={dollarMintClk}
            isDisabled={tiktMint[curTikt] === 0}
          >
            Mint with Credit Cards
          </Button> */}
        </HStack>
        {/* Counter Start End*/}
        <MintModal
          ref={mintModalRef}
          tiktMint={tiktMint}
          mintByUsdt={mintByUsdt}
          getTicketInfo={getTiktInfo}
          curTikt={curTikt}
        />
      </Box>
    </>
  );
};
