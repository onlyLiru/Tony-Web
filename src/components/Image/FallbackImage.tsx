import React from 'react';
import {
  Image as ChakraImage,
  ImageProps as ChakraImageProps,
} from '@chakra-ui/react';
import { getResizeImageUrl } from '@/utils';
import shimmer from './shimmer';

export type FallbackImageProps = ChakraImageProps & { srcSuffix?: string };

export function FallbackImage({
  src,
  srcSuffix,
  ...props
}: FallbackImageProps) {
  let url = getResizeImageUrl(src ?? '', srcSuffix);
  if (url.search('res.cloudinary.com') >= 0) {
    const urlArr = url.split('/upload');
    url = `${urlArr[0]}/upload/f_auto${urlArr[1]}`
  }
  return (
    <ChakraImage
      alt="unemeta content"
      fallback={
        <ChakraImage
          src={shimmer}
          w="full"
          h="full"
          {...props}
          objectFit="cover"
        />
      }
      {...props}
      src={url}
    />
  );
}
