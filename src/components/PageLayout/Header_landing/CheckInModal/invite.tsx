import React, {
  useImperativeHandle,
  forwardRef,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  useToast,
  Button,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import * as rebateApi from '@/services/rebate';
import { useCalender } from '@/hooks/useCalender';
import { useRouter } from 'next/router';
import { useUserDataValue } from '@/store';
import { ShimmerImage } from '@/components/Image';

export const CheckInInviteModal = forwardRef((_, ref) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('common');

  useImperativeHandle(ref, () => ({
    open: onOpen,
  }));
  const userData = useUserDataValue();
  const [remedy, setRemedy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    !isOpen && setRemedy(false);
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        scrollBehavior="inside"
        variant={{ md: 'right', base: '' }}
      >
        <ModalOverlay />
        <ModalContent
          rounded="10px"
          maxWidth={{ md: '460px', base: '340px' }}
          pb="22px"
          bgColor="#FEFEFF"
          boxShadow="0px 30px 50px rgba(132, 135, 159, 0.3)"
          // border="1px solid rgba(0, 0, 0, 0.1);"
        >
          <ModalCloseButton color="rgba(0,0,0,.2)" />
          <ModalHeader
            fontSize="16px"
            lineHeight="50px"
            fontWeight={500}
            py="0"
            textAlign="left"
          >
            邀请好友注册得积分
          </ModalHeader>
          <ModalBody px="0" py="0">
            <div className="px-6">
              <div className="text-xs md:text-sm text-center pb-6">
                我的邀请码
              </div>
              <div className="text-5xl font-bold text-center">223322</div>
              <Button
                leftIcon={<CopyIcon />}
                colorScheme="teal"
                variant="solid"
                className="w-full my-4 !bg-gradient-to-r !from-[#C53FF7] !to-[#0984FE]"
              >
                复制邀请码与邀请链接
              </Button>
              <div className="flex-between space-x-4">
                <div className="border-[rgba(0,0,0,0.12)] border rounded p-2 w-1/2 text-center">
                  <div>40</div>
                  <div>累计邀请人数</div>
                </div>
                <div className="border-[rgba(0,0,0,0.12)] border rounded p-2 w-1/2 text-center">
                  <div>200</div>
                  <div>累计获得积分</div>
                </div>
              </div>
              <div className="flex-between my-4">
                <div className="border-[rgba(0,0,0,0.12)] border-y border-l rounded py-2 w-[30%] text-center relative bg-[#CECBFF] border-[#CECBFF]">
                  <div className="flex-center">
                    <ShimmerImage
                      src="/images/points/u.png"
                      w="20px"
                      h="20px"
                      className="mr-1"
                    />
                    +20
                  </div>
                  <div>邀请5人</div>
                  <div className="triangle-t active active1" />
                  <div className="triangle-border-t active active1" />
                  <div className="triangle-b active active1" />
                  <div className="triangle-border-b active active1" />
                </div>

                <div className="border-[rgba(0,0,0,0.12)] border-y rounded py-2 w-[30%] text-center relative bg-[#CECBFF] border-[#CECBFF]">
                  <div className="flex-center">
                    <ShimmerImage
                      src="/images/points/u.png"
                      w="20px"
                      h="20px"
                      className="mr-1"
                    />
                    +50
                  </div>
                  <div>邀请10人</div>
                  <div className="triangle-t active" />
                  <div className="triangle-border-t active" />
                  <div className="triangle-b active" />
                  <div className="triangle-border-b active" />
                </div>
                <div className="border-[rgba(0,0,0,0.12)] border-y border-r rounded py-2 w-[30%] text-center">
                  <div className="flex-center">
                    <ShimmerImage
                      src="/images/points/u_n.png"
                      w="20px"
                      h="20px"
                      className="mr-1"
                    />
                    +100
                  </div>
                  <div>邀请20人</div>
                </div>
              </div>
              <div className="flex-between p-4">
                <div>
                  <ShimmerImage
                    src="/images/points/share.png"
                    w="64px"
                    h="64px"
                  />
                </div>
                <div>
                  <ShimmerImage
                    src="/images/points/next.png"
                    w="20px"
                    h="20px"
                  />
                </div>
                <div>
                  <ShimmerImage
                    src="/images/points/wallet.png"
                    w="64px"
                    h="64px"
                  />
                </div>
                <div>
                  <ShimmerImage
                    src="/images/points/next.png"
                    w="20px"
                    h="20px"
                  />
                </div>
                <div>
                  <ShimmerImage
                    src="/images/points/code.png"
                    w="64px"
                    h="64px"
                  />
                </div>
              </div>
              <div className="flex-between text-center text-sm">
                <div>分享邀请链接或邀请码</div>
                <div className="pl-14 pr-16">好友关联钱包登录Unemeta</div>
                <div className="pr-4">好友填写邀请码</div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
