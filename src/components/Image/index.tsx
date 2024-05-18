/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * FIXME
 * 缺少loading skeleton
 * 缺少 fallback
 */
import React from 'react';
import {
  Image as ChakraImage,
  ImageProps as ChakraImageProps,
} from '@chakra-ui/react';
import { getResizeImageUrl } from '@/utils';
import { ImageSizeEnum } from '@/contract/types';
import shimmer from './shimmer';

/**
 * @ImageSizeEnum
 *  public: auto
 *  list: 350*350
 *  detail: 800*800
 *  small: 100*100
 */
type ImageSize = {
  imageSize?: ImageSizeEnum;
  srcSuffix?: string;
};
export default function Image({
  src,
  imageSize,
  srcSuffix,
  ...props
}: ChakraImageProps & ImageSize) {
  let url = getResizeImageUrl(src ?? '', srcSuffix);
  if (url.search('res.cloudinary.com') >= 0) {
    const urlArr = url.split('/upload');
    url = `${urlArr[0]}/upload/f_auto${urlArr[1]}`
  }
  return (
    <ChakraImage
      alt="unemeta"
      fallbackSrc="/images/common/placeholder.png"
      {...props}
      src={url}
    />
  );
}

Image.SkeletonFallback = (props: ChakraImageProps) => (
  <ChakraImage src={shimmer} w="full" h="full" objectFit="cover" {...props} />
);

export * from './FallbackImage';
export * from './ShimmerImage';
