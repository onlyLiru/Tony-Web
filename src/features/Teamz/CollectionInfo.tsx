import { Box, Flex, Text, Stack, Grid, Link } from '@chakra-ui/react';
import Image from '@/components/Image';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';

export const CollectionInfo = (props: any) => {
  const t = useTranslations('teamz');
  const collectionData = [
    {
      name: 'CloneX',
      url: 'https://www.unemeta.com/zh/collection/1/0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B',
      pic: 'https://i.seadn.io/gae/XN0XuD8Uh3jyRWNtPTFeXJg_ht8m5ofDx6aHklOiy4amhFuWUa0JaR6It49AH8tlnYS386Q0TW_-Lmedn0UET_ko1a3CbJGeu5iHMg?w=500&auto=format',
    },
    {
      name: 'TAG',
      url: 'https://www.unemeta.com/zh/collection/1/0xc067D3e859cBc2C4a8Cf9bE96BEbfa24B0cba5A6',
      pic: 'https://i.seadn.io/gcs/files/881dd359904e1d4472a0d2bbbd34351f.gif?w=500&auto=format',
    },
    {
      name: 'Hanazawa',
      url: 'https://www.unemeta.com/zh/collection/1/0x095dCcA826ef15c8ac06088BE7F5fF85c506191a',
      pic: 'https://i.seadn.io/gcs/files/76c8afdb7c991d7c01c1c93a278bed85.png?w=500&auto=format',
    },
    {
      name: 'WGG',
      url: 'https://www.unemeta.com/collection/1/0x9401518f4EBBA857BAA879D9f76E1Cc8b31ed197',
      pic: 'https://i.seadn.io/gae/LpZeqz7YqWALr_i4bbMyP4RzXXoprZdO2e-U8W8uqPvk7V11NMeaMvzTjNoEKZL1lagcLjPSpEm7xnm0SXKyPmBEVdwJi6ZxNQBMIA?w=500&auto=format',
    },
    {
      name: 'AKCB',
      url: 'https://www.unemeta.com/collection/1/0x77372a4cc66063575b05b44481f059be356964a4',
      pic: 'https://i.seadn.io/gcs/files/48e81fed9fa93c77c004f8013c6cf268.png?auto=format&w=384',
    },
    {
      name: 'BAYC',
      url: 'https://www.unemeta.com/collection/1/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      pic: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?w=500&auto=format',
    },
    {
      name: 'Drji',
      url: 'https://www.unemeta.com/collection/1/0x438295B5082Dc6a0cc50960E3513D5D7F23405C4',
      pic: 'https://i.seadn.io/gcs/files/9ddb826c1ac1864d1e27a5fe6322b79a.jpg?w=500&auto=format',
    },
    {
      name: 'Yuliverse',
      url: 'https://twitter.com/TheYuliverse',
      pic: 'https://www.unemeta.com/_next/image?url=https%3A%2F%2Fstorage.unemeta.cn%2Ffile%2Fyuliverse.png&w=3840&q=75',
    },
    {
      name: 'FlowerLolita',
      url: 'https://www.unemeta.com/collection/1/0x81D8e220A6240D1B6Dc42d13eD7e0316aa89f265',
      pic: 'https://i.seadn.io/gae/q65NCr6qcQdfBjfuk1-GE67EvYDhODfrlfpx8wKE5wqf_DnRAkdclPDSkfRSUttXkgHr-DcMaarG8dPVUDEN1RllFmNejsN-p8gPvg?w=500&auto=format',
    },
    {
      name: 'Ultiverse',
      url: 'https://www.unemeta.com/collection/1/0x3fD36d72f05fb1AF76EE7Ce9257ca850fAbA91ed',
      pic: 'https://i.seadn.io/gcs/files/a3f8c2e59c4d856dae07579ccdbbda3e.gif?w=500&auto=format',
    },
    {
      name: 'neo stackey',
      url: 'https://www.unemeta.com/zh/collection/1/0xf80d2B1572541713B7e2eb47cA2500BD9A7b917c',
      pic: 'https://i.seadn.io/gcs/files/0450a127ad7fef7c9cab3c1125f58dee.png?auto=format&w=384',
    },
    {
      name: 'Panlo',
      url: 'https://www.unemeta.com/zh/collection/1/0x06eb1Dd99ED2daC37d0C677114370BB656e0809a',
      pic: 'https://cdn.discordapp.com/attachments/963027029903675432/1096086036360216626/2c3ab3e69e6831c77aa7cfc42bac2bb6.png',
    },
    {
      name: 'CNW',
      url: 'https://www.unemeta.com/collection/1/0x697c139E46779F1677EFA6Ee1a836F4448D905Bb',
      pic: 'https://cdn.discordapp.com/attachments/963027029903675432/1096085068063195236/0f9be92248250c1fddab91eadbca8a38.png',
    },
    {
      name: 'ALPACADABRA',
      url: 'https://www.unemeta.com/zh/collection/1/0x3DB5463A9e2d04334192C6f2DD4B72DeF4751A61',
      pic: 'http://storage.unemeta.cn/img/Ix-3eVb6isQrSlBVV8SMH8jUAuLzIwXYEUI56nc2P0gB_DEwP87-HzzF9xmskLobQMT5J038GZLQ-sEv6QIwrsxjZJGMFnvxffq4dsfDn9p2cw',
    },
    {
      name: 'Matr1x',
      url: 'https://www.unemeta.com/zh/collection/1/0x9a27d13a4896baa03843a0728dff6007d665f8ee',
      pic: 'http://storage.unemeta.cn/img/1KGrDm5UnTz0ytMimzzU_f-jzuuLlKaN571pT-yShR9QbTAx_LiOjHW_QVW_oOPJ8pD5suXu-HN8fmrjGjpEWK3vrtvAd8vHvqXF-zsLU8TpzA',
    },
  ];
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgImage="url('/images/teamz/teamzBg.png')"
      bgSize={{ base: 'cover', md: 'cover' }}
      w={'full'}
      h={{ md: 1080, base: '' }}
      pt={'45px'}
      pb={'70px'}
    >
      <Text
        fontSize={{ md: '60px', base: '30px' }}
        fontWeight={'Bold'}
        color="#AAFF01"
        mb={'36px'}
      >
        {t('collectionPartner')}
      </Text>
      <Text
        fontSize={{ md: '20px', base: '12px' }}
        color="#fff"
        maxW={992}
        minW={318}
        textAlign="center"
        mb={{ md: '78x', base: '61px' }}
        px={{ md: '', base: '25px' }}
      >
        {t('collectionPartnerSub')}
      </Text>
      <Grid
        gridTemplateColumns={{
          md: '185px 185px 185px 185px 185px',
          base: '56px 56px 56px 56px 56px',
        }}
        gridTemplateRows={{ md: '185px 185px 185px', base: '56px 56px 56px' }}
        gridRowGap={{ md: '80px', base: '12px' }}
        gridColumnGap={{ md: '129px', base: '12px' }}
      >
        {collectionData.map((item) => (
          // <Box
          //   w={{ md: '185px', base: '56px' }}
          //   h={{ md: '185px', base: '56px' }}
          //   borderRadius={{ md: '32px', base: '8px' }}
          //   bgSize="cover"
          //   bg={'url('+item.pic+')'}
          //   key={item.name}
          // ></Box>
          <Link href={item.url} key={item.name} target="_blank">
            <Image
              w={{ md: '185px', base: '56px' }}
              h={{ md: '185px', base: '56px' }}
              borderRadius={{ md: '32px', base: '8px' }}
              src={item.pic}
            />
          </Link>
        ))}
      </Grid>
    </Flex>
  );
};
