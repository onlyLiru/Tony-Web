import { AspectRatio, Box, keyframes } from '@chakra-ui/react';
import { DashedCircleIcon } from './DashedCircleIcon';
import { ShimmerImage } from '@/components/Image';
import soldOutImg from '../../../../public/images/common/so.png';
import { StaticImageData } from 'next/image';

const Spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const BannerImageCard = ({
  img,
  status,
  bgc,
}: {
  img: string | StaticImageData;
  status?: string;
  bgc?: string;
}) => {
  return (
    <AspectRatio
      role="group"
      ratio={0.8}
      w="full"
      maxW={{ base: '188px', md: '400px' }}
      cursor="pointer"
    >
      <Box pos="relative" w="full" h="full" overflow={'visible !important'}>
        <AspectRatio
          top={{ base: 7, md: 14 }}
          ratio={1}
          pos="absolute"
          w={'110%'}
          transform="matrix(0.98, -0.17, -0.17, -0.98, 0, 0);"
          zIndex={1}
        >
          <Box
            w="full"
            rounded={'50px'}
            h="full"
            bg={bgc ? bgc : '#BCBCBC4D'}
          />
        </AspectRatio>

        <AspectRatio
          pos="absolute"
          zIndex={-1}
          ratio={1}
          w="200%"
          maxW={{ base: '258px', md: '550px' }}
        >
          <>
            <DashedCircleIcon
              opacity={{ base: 0, md: 1 }}
              r={275}
              color="#E5E8EB"
              w="full"
              h="full"
              strokeWidth={3}
              animation={`${Spin} 40s linear infinite`}
            />
            <DashedCircleIcon
              opacity={{ base: 1, md: 0 }}
              r={129}
              color="#E5E8EB"
              w="full"
              h="full"
              strokeWidth={3}
              animation={`${Spin} 40s linear infinite`}
            />
          </>
        </AspectRatio>

        <ShimmerImage
          className="Hb003"
          zIndex={2}
          boxShadow={'lg'}
          placeholder="blur"
          src={img}
          rounded={'30px'}
          w="full"
          h="full"
          objectFit={'cover'}
          transition="all 0.3s ease"
          _hover={{
            boxShadow: 'xl',
            transform: 'scale(1.01)',
          }}
        />
        {status === 'end' && (
          <ShimmerImage
            priority
            src={soldOutImg}
            width={{ md: '119px', base: '48px' }}
            height={{ md: '106px', base: '41.5px' }}
            bottom={{ md: '24px', base: '11.5px' }}
            right={{ md: '16px', base: '9px' }}
            pos={'absolute'}
            zIndex={'1000'}
          />
        )}
      </Box>
    </AspectRatio>
  );
};

export default BannerImageCard;
