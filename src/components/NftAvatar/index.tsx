import {
  useUuInfo,
  useNftReceiveModal,
  useNftReceivedModal,
  useNftCanNOtReceiveModal,
  useUserDataValue,
} from '@/store';
import { receiveAvatar } from '@/services/points';
import { event } from '@/features/Analytics';
import { btnShow, modalShow, nftReceive } from '@/const/nftLog';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';
import { useTranslations } from 'next-intl';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import ContentList from '@/components/GetUUUList';

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};
const whiteList = ['/rewards', '/user/[address]'];
const defaultAvatar =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA29JREFUeF7tnctpXUEUBOfhCLR1CsI4AoFWTsKJKAQn4r3BeyNQBMJhaGEnIKQgalG0Xml/Zlp96vZ8uNx3+XX77e2Av/vHB1B9zuP9D1S/Xmz7dwkAF6EAKAEQgTRBSwBkPy8uAUoARFEJgOzzi0uAEgBRWAIg+/ziEqAEQBSWAMg+v7gEKAEQhSUAss8vLgFKAERhCYDs84tLgBIAUVgCIPv8Yj0Bfn9+Qe8D3D3/VV2kTwAVTxtI53/6+gUNcQkA5N8JgBKAEQSrSwB5E1kClADwGWblJUAJgAhqE4jsO20COway1+Ihf6cloCUAMdQSgOxrCTgtAS0B8Bli5V0FdxXMCILVXQR1EQQRYuWdAjoFIII6BSD7PsAp4P/LH/Q+gL0J+/TvJ2whK3+9+c4GgNV0D3IJANaBAJDX4BKA3UOUACwATglQAkCEWHl7gDaBiKCWAGTfaQnoGNgxED5DrLxTQKcARhCs7hTQKQAixMo7BXQKQAR1CkD2dQrQP/bcJrBNIHyGWXmbwDaBjCBYjTeB9HPxUP+hEW4/gev68dfCA4C9kGIDHACQ4BLgyg0MgABADrQEwJs828ASAPF/OgXIbxW3CbxygAMgANgPR0L/WgJaArYvUtoEwghYN3Bdf3uAKwc4AAKgTSBhoCWAuHe6CLJvMuc/EAH5my+/+k/EzHcQ/gMBAA1cLw+A9Q5C/QEADVwvD4D1DkL9AQANXC8PgPUOQv0BAA1cLw+A9Q5C/QEADVwvD4D1DkL9AQANXC8PgPUOQv0BAA1cLw+A9Q5C/RiA9c/FQ//my/EHIgJgm4EA2O4fVh8A2MLtAQJgu39YfQBgC7cHCIDt/mH1AYAt3B4gALb7h9UHALZwe4AA2O4fVh8A2MLtAQJgu39YfQBgC7cHCIDt/mH1AYAt3B4AA0B/L4AK2LbfV09/uBN/IygAXAgCwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAIoAO9pKJKOnE328gAAAABJRU5ErkJggg==';

const Interests = () => {
  const t = useTranslations('common');
  const rights = t.raw('nftAvatar.rights' as any);

  return (
    <section className="text-left my-4">
      <div className="text-slate-400 bg-[#F6F8FA] p-4 rounded-sm">
        {/* {t('nftAvatar.canGetTitle', { score: 100 })} */}
        <h3 className="font-semibold text-sm mb-2">{rights.title}</h3>
        {rights.list.map((item: any, i: number) => (
          <p key={i}>{item}</p>
        ))}
      </div>
    </section>
  );
};

const NftAvatar = () => {
  return null;
  const router = useRouter();
  const [uuInfo, setUuInfo] = useUuInfo();
  const [isShow, setShow] = useNftReceiveModal();
  const [, setShowReceived] = useNftReceivedModal();
  const [isShowNotModal, setShowCanNotReceive] = useNftCanNOtReceiveModal();
  const toast = useToast();
  const web2LoginModal = useRef<ResgisterModalAction>(null);
  const {
    can_receive_avatar: isCanReceive,
    score_avatar: scoreAvatar,
    integral,
  } = uuInfo;
  const userData = useUserDataValue();

  useEffect(() => {
    !scoreAvatar && event(btnShow);
  }, []);

  if (!whiteList.includes(router.route)) return null;
  if (scoreAvatar) return null;

  const handleClick = async () => {
    !userData?.wallet_address && web2LoginModal?.current?.open();
    setShowCanNotReceive((userData?.wallet_address && integral < 500) || false);
    setShow(isCanReceive || false);
  };

  const handleReceive = async () => {
    // if (!isCanReceive) return;
    //临时测试
    setShowReceived(true);
    setUuInfo({
      ...uuInfo,
      score_avatar: true,
      avatar_time: Date.now() / 1000,
    });

    event(nftReceive);

    try {
      const { code, data = null } = await receiveAvatar();
      if (code === 200) {
        setShowReceived(true);
        console.log(data, data?.time);
        setUuInfo({
          ...uuInfo,
          score_avatar: true,
          avatar_time: data?.time ?? Date.now() / 1000,
        });
        console.log(data?.time ?? Date.now() / 1000);
        // toast({
        //   description: '恭喜您，领取成功',
        //   status: 'success',
        //   position: 'top',
        // });
      }
    } catch (error) {
      console.error(error);

      toast({
        description: error.message || '领取失败，请稍后重试',
        status: 'error',
        position: 'top',
      });
    }

    setShow(false);
  };

  let classNames = 'fixed right-8 md:bottom-32 bottom-44 w-24 h-24';
  classNames += isCanReceive ? ' cursor-pointer' : ' cursor-normal';

  //临时测试
  // if (!uuInfo['can_receive_avatar']) {
  //   setUuInfo({ ...uuInfo, can_receive_avatar: true });
  // }

  return (
    <>
      <div className={classNames} onClick={handleClick}>
        <img
          // className={isCanReceive ? '' : 'grayscale-[90%]'}
          src={
            isCanReceive
              ? '/images/nftAvatar/nft-avatar-receive.png'
              : '/images/nftAvatar/nft-avatar-received.png'
          }
        />
      </div>
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
      <ModalToReceive
        {...{
          isShow,
          setShow,
          handleReceive,
          integral,
          url: userData?.profile_image ?? defaultAvatar,
        }}
      />
      <ModalCanNotReceive
        {...{
          isShow: isShowNotModal,
          setShow: setShowCanNotReceive,
          integral,
          url: userData?.profile_image ?? defaultAvatar,
        }}
      />
    </>
  );
};

export const Avatar = (props: any) => {
  const { notconfig = {}, isshowtipmodalonclick = false } = props;
  const [isShow, setShow] = useNftReceivedModal();

  const [uuInfo] = useUuInfo();
  const { score_avatar: scoreAvatar, avatar_time: avatarTime } = uuInfo;

  return (
    <>
      <Image
        w={{ md: '120px' }}
        h={{ md: '120px' }}
        rounded="full"
        p={{ md: '25px' }}
        bg="linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1))"
        bgImg={scoreAvatar ? '/images/nftAvatar/nft-avatar.png' : ''}
        bgRepeat="no-repeat"
        bgSize="100% 100%"
        bgPos="center"
        {...props}
        src={props.url}
        {...(!scoreAvatar ? notconfig : {})}
        onClick={() => {
          if (isshowtipmodalonclick && scoreAvatar) {
            setShow(true);
          }
        }}
      />
      <ModalReceived url={props.url} {...{ isShow, setShow, avatarTime }} />
    </>
  );
};

export default NftAvatar;

function ModalToReceive(props: {
  isShow: boolean;
  setShow: any;
  handleReceive: any;
  integral: number;
  url: string;
}) {
  const t = useTranslations('common');
  const onClose = () => {
    props.setShow(false);
  };

  useEffect(() => {
    event(modalShow);
  }, []);

  return (
    <Modal isOpen={props.isShow} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ md: '640px', base: '90%' }}>
        <ModalHeader fontSize="14px"></ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="14px" textAlign="center">
          <div className="flex justify-center mb-3">
            <Image
              w={{ md: '120px' }}
              h={{ md: '120px' }}
              rounded="full"
              bgImg={'/images/nftAvatar/nft-avatar.png'}
              p={'25px'}
              bgRepeat="no-repeat"
              bgSize="100% 100%"
              bgPos="center"
              src={props.url}
            />
          </div>
          <p className="font-semibold text-sm w-[300px] mx-auto">
            {t('nftAvatar.canGetTitle', { score: props.integral })}
          </p>
          <Interests />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="yellow"
            size="md"
            onClick={props.handleReceive}
            // isLoading
            w="100%"
            style={{
              background: '#FB9D42',
            }}
          >
            {t('nftAvatar.Wear')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ModalReceived(props: any) {
  const t = useTranslations('common');

  const onClose = () => {
    props.setShow(false);
  };

  const time = format(
    props?.avatarTime ? new Date(props?.avatarTime * 1000) : Date.now(),
    'yyyy-MM-dd HH:mm',
  );

  return (
    <Modal isOpen={props.isShow} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ md: '660px', base: '90%' }}>
        <ModalHeader fontSize="14px"></ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="14px" textAlign="center">
          <div className="flex justify-center mb-3">
            <Image
              w={{ md: '120px' }}
              h={{ md: '120px' }}
              rounded="full"
              bgImg={'/images/nftAvatar/nft-avatar.png'}
              p={'25px'}
              bgRepeat="no-repeat"
              bgSize="100% 100%"
              bgPos="center"
              src={props.url}
            />
          </div>
          <p className="font-semibold text-sm w-[200px] mx-auto">
            {t('nftAvatar.receivedTitle', { time })}
          </p>
          <Interests />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="yellow"
            size="md"
            onClick={onClose}
            // isLoading
            w="100%"
            style={{
              background: '#FB9D42',
            }}
          >
            {t('nftAvatar.Acknowledge')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ModalCanNotReceive(props: any) {
  const t = useTranslations('common');
  const onClose = () => {
    props.setShow(false);
  };

  return (
    <Modal isOpen={props.isShow} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ md: '660px', base: '100%' }}>
        <ModalHeader fontSize="14px"></ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="14px" textAlign="center">
          <div className="flex justify-center mb-3 h-[120px]">
            <Image
              w={{ md: '120px', base: '120px' }}
              h={{ md: '120px', base: '120px' }}
              rounded="full"
              bgImg={'/images/nftAvatar/nft-avatar.png'}
              p={'25px'}
              bgRepeat="no-repeat"
              bgSize="100% 100%"
              bgPos="center"
              src={props.url}
            />
          </div>
          <h3 className="w-48 m-auto font-semibold text-left text-sm">
            {t('nftAvatar.goOn')}
          </h3>
          <Interests />

          <ContentList />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
