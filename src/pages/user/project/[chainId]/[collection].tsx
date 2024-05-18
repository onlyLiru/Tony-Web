/**
 * buddy project 设置版税
 */
import { Input, useToast, Button } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UploadImage } from '@/features/Create';
import * as apis from '@/services/user';
import { useRouter } from 'next/router';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { useUserDataValue } from '@/store';
import { useTranslations } from 'next-intl';
import { BigNumber, Contract } from 'ethers';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { serverSideTranslations } from '@/i18n';
import type { GetServerSidePropsContext } from 'next';
import { addressReg } from '@/utils';

function getDetail(data: { chain_id: string; collection_address: string }) {
  return apis.getUserProjectItemsDetail(data).then((r) => r?.data);
}

function postDetail(data: apis.ApiUser.getUserProjectItemsDetail) {
  return apis.postUserProjectItemsDetail(data).then((r) => r?.data);
}

const ProjectEdit = () => {
  const { addresses, abis } = useSwitchChain();
  const [royaltyFeeLimit, setRoyaltyFeeLimit] = useState(20);
  const [project, setProject] = useState({
    name: '',
    banner: '',
    collection_address: '',
    chain_id: 5,
    logo: '',
  });
  const router = useRouter();
  const t = useTranslations('royalti');
  const { needSwitchChain, switchChain } = useSwitchChain({
    fixedChainId: Number(router.query.chainId),
  });
  const [defaultRes, setDefaultRes] = useState({
    logo: '',
    banner: '',
    royalty: '0',
    receiver: '',
  });
  const [royalty, setRoyalty] = useState('0');
  const [receiver, setReceiver] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const { signer } = useSignHelper();
  const userData = useUserDataValue();
  const [res, setRes] = useState([]);
  const toast = useToast();

  const { sign } = useSignHelper();
  const getInfo = useCallback(async () => {
    if (!router.query.chainId || !router.query.collection) return;
    const chainId = router.query.chainId as string;
    const collectionAddress = router.query.collection as string;
    const res = await getDetail({
      chain_id: chainId,
      collection_address: collectionAddress,
    });
    console.log(res);
    setDefaultRes({ ...defaultRes, ...res });
    setRoyalty(res?.royalty || '0');
    setReceiver(res?.receiver || '');
    setProject({
      ...project,
      ...res,
      ...{ collection_address: collectionAddress, chain_id: Number(chainId) },
    });
  }, [router.query.chainId, router.query.collection]);

  const contract = useMemo(
    () =>
      signer
        ? new Contract(
            addresses.COLLECTION_ROYALTI,
            abis.COLLECTION_ROYALTI,
            signer!,
          )
        : null,
    [signer],
  );

  // 需要校验宽高比例
  const handleBeforeUploadLogo = async (file: File) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      // 加载完成执行
      img.onload = () => {
        console.log(img.width, img.height);
        if (img.width / img.height === 1) {
          resolve(true);
        } else {
          toast({
            status: 'error',
            title: 'Image Size Error',
            variant: 'subtle',
          });
          resolve(false);
        }
      };
    });
  };

  const handleBeforeUploadBanner = async (file: File) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      // 加载完成执行
      img.onload = () => {
        console.log(img.width, img.height);
        if (img.width / img.height === 3 / 2) {
          resolve(true);
        } else {
          toast({
            status: 'error',
            title: 'Image Size Error',
            variant: 'subtle',
          });
          resolve(false);
        }
      };
    });
  };

  // 接口获取info
  const postInfo = useCallback(
    async (change: boolean) => {
      try {
        const signData = await sign();
        if (signData) {
          setEditLoading(true);
          const chainId = router.query.chainId as string;
          const collectionAddress = router.query.collection as string;
          const res = await postDetail({
            sign_data: signData,
            collection_address: collectionAddress,
            chain_id: Number(chainId),
            logo: project.logo,
            banner: project.banner,
          });
          console.log(res);
          if (res.status) {
            setEditLoading(false);
            if (!change) {
              toast({
                status: 'success',
                title: 'save success',
                variant: 'subtle',
              });
              router.push(`/user/${userData?.wallet_address}/project`);
            }
          }
        }
      } catch (error) {
        setEditLoading(false);
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    },
    [project],
  );

  // 合约获取版税：https://tbmo185znx.larksuite.com/docx/FFeOdqZhqohOLOxC9a5ugmkbsZg
  // 0 2 3 可以设置版税 1 4 不可以设置
  const getRoyalti = useCallback(async () => {
    try {
      console.log(
        'getRoyalti contract',
        signer,
        contract,
        userData?.wallet_address,
        router.query.collection,
      );
      const collectionAddress = router.query.collection;
      const res = await contract?.checkForCollectionSetter(collectionAddress);
      const res2 = await contract?.royaltyFeeLimit();
      setRes(res || []);
      setRoyaltyFeeLimit(BigNumber.from(res2).toNumber());
      console.log('xxxx 0x00000', res, BigNumber.from(res2).toNumber());
    } catch (error) {
      console.error(error);
    }
  }, [contract, userData?.wallet_address, router.query.collection]);

  const postRoyalti = useCallback(async () => {
    const collectionAddress = router.query.collection;
    if (
      res &&
      res.length &&
      res?.[0] &&
      res[1] !== undefined &&
      res?.[0] !== '0x0000000000000000000000000000000000000000'
    ) {
      setEditLoading(true);
      console.log(
        collectionAddress,
        userData?.wallet_address,
        receiver,
        royalty,
      );
      switch (res[1]) {
        case 0:
          const tx0 = await contract?.updateRoyaltyInfoForCollectionIfSetter(
            collectionAddress,
            userData?.wallet_address,
            receiver,
            Number(royalty) * 100,
          );
          console.log(tx0);
          return await tx0.wait();
        case 2:
          const tx2 = await contract?.updateRoyaltyInfoForCollectionIfOwner(
            collectionAddress,
            userData?.wallet_address,
            receiver,
            Number(royalty) * 100,
          );
          console.log(tx2);
          return await tx2.wait();
        case 3:
          const tx3 = await contract?.updateRoyaltyInfoForCollectionIfAdmin(
            collectionAddress,
            userData?.wallet_address,
            receiver,
            Number(royalty) * 100,
          );
          console.log(tx3);
          return await tx3.wait();
        case 1:
          toast({
            status: 'error',
            title: t('reason1'),
            variant: 'subtle',
          });
          return { status: 0 };
        case 4:
          toast({
            status: 'error',
            title: t('reason2'),
            variant: 'subtle',
          });
          return { status: 0 };
      }
    } else {
      setEditLoading(false);
      toast({ status: 'error', title: t('reason2'), variant: 'subtle' });
    }
  }, [
    res,
    router.query.collection,
    receiver,
    royalty,
    userData?.wallet_address,
  ]);

  const handleSave = useCallback(async () => {
    if (needSwitchChain) {
      await switchChain();
    }
    // 33333333 royChange
    const royChange =
      defaultRes?.receiver !== receiver ||
      Number(defaultRes?.royalty) !== Number(royalty);
    const logoChange =
      defaultRes?.logo !== project?.logo ||
      defaultRes?.banner !== project?.banner;
    if (
      !royalty ||
      Number(royalty) < 0 ||
      !/(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100$)/.test(royalty)
    ) {
      toast({
        status: 'error',
        title: `${t('royrule')}，${t('royholder')}`,
        variant: 'subtle',
      });
      return;
    }
    if (Number(royalty) > royaltyFeeLimit / 100) {
      toast({
        status: 'error',
        title: `${t('royrule2')}`,
        variant: 'subtle',
      });
      return;
    }
    if (!addressReg.test(receiver) && royChange) {
      toast({ status: 'error', title: t('addressrule'), variant: 'subtle' });
      return;
    }
    console.log(defaultRes, project);
    // save 前检查格式 提交接口、有改动就提交
    if (logoChange) {
      await postInfo(royChange);
    }

    if (royChange) {
      try {
        const res = await postRoyalti();
        if (res?.status) {
          setEditLoading(false);
          toast({
            status: 'success',
            title: 'save success',
            variant: 'subtle',
          });
          router.push(`/user/${userData?.wallet_address}/project`);
        } else {
          setEditLoading(false);
          toast({
            status: 'error',
            title: t('addressrule'),
            variant: 'subtle',
          });
        }
      } catch (error) {
        console.log(error.message);
        setEditLoading(false);
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    }

    if (!logoChange && !royChange) {
      router.push(`/user/${userData?.wallet_address}/project`);
    }
  }, [royalty, receiver, project]);
  // 获取集合信息
  useEffect(() => {
    getInfo();
    getRoyalti();
  }, [getInfo, getRoyalti]);

  return (
    <div
      className="py-4 md:py-20 px-4 md:px-0"
      style={{ background: '#2B2B2B' }}
    >
      <div className="container m-auto">
        <div
          className="text-xl font-bold md:text-3xl"
          style={{ color: 'rgba(255, 255, 255, 0.80)' }}
        >
          {project.name}
        </div>
        <form>
          <div
            className="font-bold mt-6 mb-2 md:mt-12"
            style={{ color: 'rgba(255, 255, 255, 0.80)' }}
          >
            {t('set')}
          </div>
          <div className="relative w-[300px] md:w-[600px]">
            <Input
              value={royalty}
              placeholder={t('royholder')}
              w={{ base: '300px', md: '600px' }}
              onChange={(v) => setRoyalty(v.target.value)}
              color="rgba(255, 255, 255, 0.40)"
              borderColor="rgba(255, 255, 255, 0.10)"
              backgroundColor={'transparent'}
              _focusVisible={{
                borderColor: 'rgba(255, 255, 255, 0.10)',
              }}
            />
            <div className="absolute right-2 top-2">%</div>
          </div>
          <div
            className="font-bold mt-6 mb-2 md:mt-12"
            style={{ color: 'rgba(255, 255, 255, 0.80)' }}
          >
            {t('setAddress')}
          </div>
          <div className="relative w-[300px] md:w-[600px]">
            <Input
              value={receiver}
              placeholder={t('addressholder')}
              w={{ base: '300px', md: '600px' }}
              onChange={(v) => setReceiver(v.target.value.trim())}
              color="rgba(255, 255, 255, 0.40)"
              borderColor="rgba(255, 255, 255, 0.10)"
              backgroundColor={'transparent'}
              _focusVisible={{
                borderColor: 'rgba(255, 255, 255, 0.10)',
              }}
            />
          </div>
          <div
            className="font-bold mt-6 mb-2 md:mt-12"
            style={{ color: 'rgba(255, 255, 255, 0.80)' }}
          >
            {t('setIcon')}
          </div>
          <UploadImage
            value={project.logo}
            onChange={(v) => setProject({ ...project, ...{ logo: v } })}
            wrapperProps={{
              w: { base: '100px', md: '200px' },
              h: { base: '100px', md: '200px' },
              rounded: '8px',
              backgroundColor: { base: 'transparent' },
              borderColor: {
                base: 'rgba(255, 255, 255, 0.10)',
              },
            }}
            beforeUpload={handleBeforeUploadLogo}
          />
          <div
            className="text-[rgba(0,0,0,.25)] text-sm mt-1 md:mt-2 mb-6"
            style={{ color: 'rgba(255, 255, 255, 0.80)' }}
          >
            {t('logoRule')}
          </div>
          <div
            className="font-bold mt-6 mb-2 md:mt-12"
            style={{ color: 'rgba(255, 255, 255, 0.80)' }}
          >
            {t('setBg')}
          </div>
          <UploadImage
            value={project.banner}
            onChange={(v) => setProject({ ...project, ...{ banner: v } })}
            wrapperProps={{
              w: { base: '300px', md: '600px' },
              h: { base: '200px', md: '400px' },
              rounded: '8px',
              backgroundColor: { base: 'transparent' },
              borderColor: {
                base: 'rgba(255, 255, 255, 0.10)',
              },
            }}
            beforeUpload={handleBeforeUploadBanner}
          />
          <div
            className="text-[rgba(0,0,0,.25)] text-sm mt-1 md:mt-2 mb-6"
            style={{ color: 'rgba(255, 255, 255, 0.80)' }}
          >
            {t('bannerRule')}
          </div>
          <Button
            // variant={'primary'}
            w="160px"
            onClick={handleSave}
            isLoading={editLoading}
            bg={'#E49F5C'}
            color={'#000'}
          >
            {t('save')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProjectEdit;
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  // 禁止国内ip
  let detectedIp = requestIp.getClientIp(req);
  // console.log(detectedIp, 'ip');
  // console.log(req.url, 'ip');
  // const ip = '156.146.56.115';

  if (detectedIp === '::1') {
    detectedIp = '156.146.56.115';
  }

  const xdbFilePath = path.join(process.cwd(), 'public', 'ip2region.xdb');
  // const dbPath = './ip2region.xdb';
  // or 'path/to/ip2region.xdb file path'
  const searcher = Searcher.newWithFileOnly(xdbFilePath);
  // 查询
  const geo = await searcher.search(detectedIp || '');

  if (geo && geo?.region?.split('|')[0] === '中国') {
    if (
      !(
        geo?.region?.split('|')[2] === '台湾省' ||
        geo?.region?.split('|')[2] === '香港'
      )
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/err',
        },
      };
    }
  }
  // console.log(geo, 'geo1');
  return {
    props: {
      messages: await serverSideTranslations(locale, ['royalti']),
    },
  };
}
