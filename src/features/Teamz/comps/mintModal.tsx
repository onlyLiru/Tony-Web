import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { sevrTiktType, tiktType } from '../hooks/useTicket';
import { mToast } from '../helpers/ticketInfo';
import * as Cookies from 'tiny-cookie';
import { sendMail, setMail as saveMail } from '../helpers/ticketInfo';
import {
  Text,
  Center,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useToast,
  Flex,
  Box,
} from '@chakra-ui/react';

const mailReg = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
const mailKey = 'teamz-mint-mail';
// const nftPayUrl: any = {
//   ticket:
//     'https://sandbox.nftpay.xyz/iframe/iframe_pay/4a524977-febb-4472-8953-7eed93601c53?&_mintType=',
//   red: 'https://sandbox.nftpay.xyz/iframe/iframe_pay/ab306d86-f7cb-41cc-a6b5-63fbbdc39b50?&_mintType=',
//   vip: 'https://sandbox.nftpay.xyz/iframe/iframe_pay/e6d9c779-5a00-475f-b897-61d521f848b6?&_mintType=',
// };
const nftPayUrl: any = {
  express:
    'https://payments.nftpay.xyz/iframe/iframe_pay/f02785ba-d00f-415b-83ba-411a0a341191?&_mintType=',
  red: 'https://payments.nftpay.xyz/iframe/iframe_pay/d821d8a1-c6bd-4e52-893d-f0e9fec54a01?&_mintType=',
  vip: 'https://payments.nftpay.xyz/iframe/iframe_pay/fe6057b6-1ea4-43fe-9fd4-ef32a3a5b3ea?&_mintType=',
};
export const MintModal = forwardRef(
  ({ tiktMint, mintByUsdt, getTicketInfo, curTikt }: any, ref) => {
    const toast = useToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [mail, setMail] = useState('');
    const [inValid, setInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mintSucc, setMintSucc] = useState(false);
    const [isDollarMint, setIsDollarMint] = useState(false);
    const t = useTranslations('teamz');
    const handleMailChange = (event: any) => setMail(event.target.value);
    const handleClose = () => {
      onClose();
      setMail('');
      setInvalid(false);
      setIsLoading(false);
      setMintSucc(false);
      setIsDollarMint(false);
    };
    const handleFrameClose = () => {
      setMintSucc(false);
      setIsDollarMint(false);
      handleClose();
      // saveMail(mail);
      // setTimeout(() => sendMail(tiktMint), 1000 * 5);
    };
    const handleClk = async () => {
      const validMail = new RegExp(mailReg, 'gm').test(mail);
      if (!mail || !validMail) {
        setInvalid(true);
        mToast(toast, t('emptyOrErrMail'));
        return;
      }
      Cookies.setCookie(mailKey, mail, { expires: '1h' });
      // saveMail(mail);
      // setTimeout(() => sendMail(tiktMint), 1000);
      if (isDollarMint) {
        setMintSucc(true);
      } else {
        setIsLoading(true);
        const tipTimer5 = setTimeout(
          () => mToast(toast, t('slowTip5s')),
          1000 * 15,
        );
        const tipTimer30 = setTimeout(
          () => mToast(toast, t('slowTip10s')),
          1000 * 50,
        );
        const mintByUsdtRsp = await mintByUsdt();
        clearTimeout(tipTimer5);
        clearTimeout(tipTimer30);
        if (mintByUsdtRsp) {
          getTicketInfo();
          setIsLoading(false);
          setMintSucc(true);
          await saveMail(mail);
          setTimeout(() => sendMail(tiktMint), 1000 * 3);
        } else {
          toast({
            description: t('mintErrTip'),
            status: 'error',
            position: 'top',
            duration: 2000,
            containerStyle: { mt: '15%' },
          });
        }
        setIsLoading(false);
      }
    };
    useImperativeHandle(ref, () => ({
      open: () => onOpen(),
      setDollarMint: () => {
        setIsDollarMint(true);
        setMintSucc(true);
      },
    }));
    const genPayUrl = () => {
      const sevrType = sevrTiktType[curTikt as tiktType];
      const payUrl = `${nftPayUrl[curTikt]}${sevrType}`;
      // console.info('payUrl:', payUrl);
      return payUrl;
    };

    const dollarMintModal = (
      <>
        <Modal
          isOpen={isDollarMint && mintSucc}
          onClose={handleFrameClose}
          isCentered
          size="xs"
          key="dollarModal"
        >
          <ModalOverlay />
          <ModalContent padding="0px" w={{ base: '88vw', md: 'auto' }}>
            <ModalBody padding="0px">
              <ModalCloseButton />
              <iframe
                src={genPayUrl()}
                height="550px"
                style={{ margin: 'auto', marginTop: '20px' }}
              ></iframe>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
    return (
      <>
        {isDollarMint && mintSucc ? (
          dollarMintModal
        ) : (
          <Modal
            isOpen={isOpen}
            onClose={handleClose}
            isCentered
            key="mintModal"
          >
            <ModalOverlay />
            <ModalContent w={{ base: '88vw', md: 'auto' }}>
              {!mintSucc && (
                <ModalHeader>
                  <Text padding="17px">{t('mailTipTitle')}</Text>
                </ModalHeader>
              )}
              {!mintSucc && <ModalCloseButton />}
              <ModalBody overflow="scroll">
                {mintSucc ? (
                  <Center
                    mt="60px"
                    mb={isDollarMint ? '20px' : '60px'}
                    display="flex"
                    flexDir="column"
                    w={{ md: '300px' }}
                  >
                    <Text
                      color="black"
                      fontWeight={500}
                      mt="10px"
                      fontSize="24px"
                    >
                      {t('usdtSuccTip')}
                    </Text>
                    {isDollarMint && (
                      <Text
                        color="rgba(0,0,0,0.5)"
                        fontWeight={500}
                        mt="10px"
                        fontSize="16px"
                        w="80%"
                        textAlign="center"
                      >
                        {t('dollorSuccTip')}
                      </Text>
                    )}
                  </Center>
                ) : (
                  <>
                    <Box h={{ base: '30vh', md: 'auto' }} overflow="scroll">
                      {['1', '2', '3', '4'].map((key) => {
                        return (
                          <Box key={key}>
                            <Flex color="white" alignItems="baseline">
                              <Box
                                width="8px"
                                height="8px"
                                borderRadius="8px"
                                backgroundColor="#7F7F80"
                              />
                              <Text ml={3} flex="1" color="rgba(0,0,0,0.5)">
                                {t(`mailTipContent${key}` as any)}
                              </Text>
                            </Flex>
                          </Box>
                        );
                      })}
                    </Box>

                    <Text ml="4px" mb="3px" mt={8}>
                      {t('mailText')}{' '}
                    </Text>
                    <Center mt={2}>
                      <Input
                        placeholder={t('mailFillTip')}
                        w="100%"
                        value={mail}
                        errorBorderColor="crimson"
                        focusBorderColor="blue"
                        onChange={handleMailChange}
                        isInvalid={inValid}
                      />
                    </Center>
                    <Text color="rgba(0,0,0,0.5)" mt="10px">
                      {t('mailTipContent5')}
                    </Text>
                  </>
                )}
              </ModalBody>

              <ModalFooter display="flex" mb="15px">
                {mintSucc ? (
                  <Button
                    mr={3}
                    onClick={handleClose}
                    _hover={{ bgColor: '#2a2727' }}
                    _active={{ bgColor: '#2a2727' }}
                    bg="black"
                    variant="outline"
                    color="white"
                    flex="1"
                  >
                    {t('mintConfirmText')}
                  </Button>
                ) : (
                  <>
                    <Button
                      mr={3}
                      onClick={handleClose}
                      flex="1"
                      colorScheme="whiteAlpha"
                      variant="outline"
                    >
                      {t('mintCancelText')}
                    </Button>
                    <Button
                      _hover={{ bgColor: '#2a2727' }}
                      _active={{ bgColor: '#2a2727' }}
                      bg="black"
                      variant="outline"
                      color="white"
                      flex="1"
                      onClick={handleClk}
                      isLoading={isLoading}
                      loadingText={t('mintConfirmText')}
                    >
                      {t('mintConfirmText')}
                    </Button>
                  </>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </>
    );
  },
);
