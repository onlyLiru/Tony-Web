import {
  Box,
  ChakraProps,
  Heading,
  Text,
  keyframes,
  HStack,
} from '@chakra-ui/react';
import { ReactNode, memo } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  children?: ReactNode;
  contentProps?: ChakraProps;
};

export const DBox = memo((props: Props) => {
  return (
    <Box
      fontFamily={'Inter'}
      bg={'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)'}
      rounded={'20px'}
      p={'20px'}
      w={'300px'}
      opacity={1}
      transition={'all .3s'}
      zIndex={12}
      {...props.contentProps}
      className="zoom120 md:zoom"
    >
      {props.children}
    </Box>
  );
});

export const Triangle = memo((props: Props) => {
  return (
    <Box
      borderColor={'#FFFFFF;'}
      position={'absolute'}
      borderStyle={'solid'}
      borderWidth={'20px 35px'}
      borderTopColor={'transparent'}
      w={0}
      h={0}
      left={'-59px'}
      borderLeftColor={'transparent'}
      borderBottomColor={'transparent'}
      {...props.contentProps}
    >
      {props.children}
    </Box>
  );
});

export const Rule = memo((props: { visible: boolean; isHlep?: boolean }) => {
  const t = useTranslations('points');
  return (
    <DBox
      contentProps={{
        position: 'absolute',
        right: { md: '-325px' },
        top: { md: props?.isHlep ? '-80px' : '20px', base: '50%' },
        left: { md: 'auto', base: '50%' },
        display: props.visible ? 'block' : 'none',
        transform: { md: 'translate(0)', base: 'translate(-50%, -50%)' },
      }}
    >
      <Box
        color={'#001E46'}
        fontSize={'10px'}
        fontWeight={'500'}
        pos={'relative'}
        zIndex={2}
        lineHeight={'14px'}
      >
        {t.raw('remark')?.map((item: any, i: number) => (
          <Box key={i}>
            <Text mb={'15px'}>{item.title}：</Text>
            {item?.content.map((cIitem: any, i: number) => (
              <Text mb={'15px'} key={i}>
                {cIitem}
              </Text>
            ))}
          </Box>
        ))}
      </Box>
      <Triangle
        contentProps={{
          top: props?.isHlep ? '130' : '30px',
          zIndex: 1,
          display: { md: 'block', base: 'none' },
        }}
      />
    </DBox>
  );
});

export const Manual = memo((props: { visible: boolean }) => {
  const t = useTranslations('points');
  return (
    <DBox
      contentProps={{
        position: 'absolute',
        right: { md: '-325px' },
        bottom: { md: '100px' },
        top: { md: 'auto', base: '50%' },
        left: { md: 'auto', base: '50%' },
        display: props.visible ? 'block' : 'none',
        transform: { md: 'translate(0)', base: 'translate(-50%, -50%)' },
        p: '35px 15px 25px',
      }}
    >
      <Box
        color={'#001E46'}
        fontSize={'10px'}
        fontWeight={'500'}
        lineHeight={'14px'}
        pos={'relative'}
        zIndex={2}
      >
        <Text>{t('uuudes')}</Text>
      </Box>
      <Triangle
        contentProps={{
          display: { md: 'block', base: 'none' },
          top: '37px',
          zIndex: 1,
          left: '-59px',
        }}
      />
    </DBox>
  );
});

export const rubberBand = keyframes`
  from {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }

  to {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
`;

export const progressAmi = keyframes`
  0% {
    transform: translate(-100%) scaleX(0);
    opacity: .1
  }

  20% {
    transform: translate(-100%) scaleX(0);
    opacity: .5
  }

  to {
    transform: translate(0) scaleX(1);
    opacity: 0
  }
`;

export const zoom = keyframes`
  0% {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
`;

export const Progress = memo((props: { schedule: number }) => {
  return (
    <>
      <Box
        w={'280px'}
        h={'14px'}
        rounded={'200px'}
        bg={'#FFFFFF'}
        pos={'relative'}
        border={'2px solid #FF9100'}
      >
        <Box
          bg={'linear-gradient(270deg, #FD8C02 3.28%, #FDE402 130.66%)'}
          rounded={'200px'}
          h={'full'}
          overflow={'hidden'}
          w={
            props?.schedule >= 10000
              ? '100%'
              : `${(props?.schedule - 50) / 100}%`
          }
          pos={'relative'}
        >
          <Box
            bg={'#FFFFFF'}
            rounded={'200px'}
            opacity={0}
            h={'full'}
            w={'full'}
            animation={`${progressAmi} 2.4s cubic-bezier(.23,1,.32,1) infinite;`}
          />
        </Box>
        <HStack
          mb={'7px'}
          justifyContent={'center'}
          position={'absolute'}
          left={0}
          right={0}
          top={0}
          h={'full'}
          spacing={'60px'}
        >
          <Box bg={'#FFFFFF'} h={'8px'} w={'8px'} rounded={'50%'} />
          <Box bg={'#FFFFFF'} h={'8px'} w={'8px'} rounded={'50%'} />
          <Box bg={'#FFFFFF'} h={'8px'} w={'8px'} rounded={'50%'} />
        </HStack>
      </Box>
      <Box
        w={'full'}
        mt={'7px'}
        color={'#FF9102'}
        fontSize={'14px'}
        fontWeight={'600'}
        lineHeight={'17px'}
        textAlign={'right'}
      >
        {!props?.schedule
          ? 0.1
          : `${props?.schedule >= 10000 ? 0 : (10000 - props?.schedule) / 100}${
              props?.schedule === 9900 ? '.0' : ''
            }`}
        U
      </Box>
    </>
  );
});
