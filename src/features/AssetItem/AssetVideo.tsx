import { Box, BoxProps, useBoolean, Center, Icon } from '@chakra-ui/react';
import { useRef } from 'react';
import { BsFillPlayFill } from 'react-icons/bs';
import { AssetImage } from './AssetImage';

export const AssetVideo = ({
  cover,
  src,
  ...props
}: BoxProps & { src: string; cover?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [show, action] = useBoolean(false);

  const renderVideo = () => (
    <video
      loop
      src={src}
      style={{ height: '100%', width: '100%' }}
      ref={videoRef}
      controlsList="nodownload"
      autoPlay={show}
      controls={show}
      playsInline
      preload="metadata"
      onPause={() => {
        action.off();
      }}
    />
  );

  return (
    <Box pos="relative" w="full" h="full" {...props}>
      {!show && (
        <Center
          zIndex={2}
          pos="absolute"
          left="50%"
          top="50%"
          w="48px"
          h="48px"
          transform="translate(-50%, -50%)"
          bg="rgba(159, 159, 159, 0.4)"
          backdropFilter="blur(10px)"
          rounded="full"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            action.toggle();
            videoRef.current?.play();
          }}
        >
          <Icon as={BsFillPlayFill} color="white" fontSize={'24px'} />
        </Center>
      )}
      {(() => {
        if (!cover) return renderVideo();
        return show ? (
          renderVideo()
        ) : (
          <AssetImage
            w="full"
            h="full"
            src={cover}
            srcSuffix="s=350"
            objectFit="contain"
          />
        );
      })()}
    </Box>
  );
};
