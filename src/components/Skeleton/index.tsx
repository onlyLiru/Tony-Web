import { Box, BoxProps, VStack } from '@chakra-ui/react';
import React from 'react';

type SkeletonProps = BoxProps;

const SkeletonRoot = (props: SkeletonProps) => (
  <Box className="shimmer" {...props} />
);

const Title = (props: SkeletonProps) => (
  <SkeletonRoot
    rounded={'full'}
    h={{ base: '18px', md: '32px' }}
    mb={{ base: '12px', md: '24px' }}
    {...props}
  />
);

const Text = (props: SkeletonProps) => (
  <SkeletonRoot rounded={'full'} h={{ base: '14px', md: '24px' }} {...props} />
);

const Content = ({ rows = 2, ...props }: SkeletonProps & { rows?: number }) => {
  return (
    <VStack w="full" spacing={{ base: '12px', md: '24px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Text key={i} {...props} />
      ))}
      <Text {...props} w="40%" />
    </VStack>
  );
};

export const Skeleton = Object.assign(SkeletonRoot, {
  Title,
  Text,
  Content,
});
