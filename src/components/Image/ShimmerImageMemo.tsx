import React, { forwardRef, memo } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import shimmer from './shimmer';

export type ShimmerImageProps = Omit<BoxProps, 'objectFit' | 'placeholder'> &
  Pick<
    NextImageProps,
    'src' | 'alt' | 'objectFit' | 'placeholder' | 'priority'
  >;

const ShimmerImageMemo = forwardRef<any, ShimmerImageProps>((props, ref) => {
  const {
    src = shimmer,
    alt,
    objectFit,
    placeholder,
    priority,
    ...boxProps
  } = props;
  const blurDateUrl = placeholder === 'blur' ? src : undefined;
  return (
    <Box ref={ref} pos="relative" overflow={'hidden'} {...boxProps}>
      <NextImage
        priority={priority}
        layout="fill"
        objectFit={objectFit || 'cover'}
        src={src}
        alt={alt}
        placeholder={placeholder}
        blurDataURL={blurDateUrl as string}
      />
    </Box>
  );
});

export default memo(ShimmerImageMemo);
