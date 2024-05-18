import { FallbackImage, FallbackImageProps } from '@/components/Image';
import { useState } from 'react';

const fallbackSrc =
  'https://res.cloudinary.com/unemeta/image/upload/f_auto/f_auto,q_auto/v1/samples/i6sqns3vhvez0m54bk9u';

export const AssetImage = ({
  src,
  ...props
}: FallbackImageProps & { src?: string }) => {
  const [source, setSource] = useState(src || fallbackSrc);
  return (
    <FallbackImage
      src={source}
      onError={() => setSource(fallbackSrc)}
      {...props}
    />
  );
};
