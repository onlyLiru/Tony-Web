import React from 'react';
import Image from '@/components/Image';
import Upload, { UploadProps } from '@/components/Upload';
import { Spinner, Center, Icon, ChakraProps } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FaPen } from 'react-icons/fa';
import { ShimmerImage } from '@/components/Image';

interface UploadImageProps {
  onChange?: (p: string) => void;
  beforeUpload?: (file: File) => Promise<unknown>;
  value?: string;
  wrapperProps?: ChakraProps;
  uploadIcon?: React.ReactNode;
}

export const UploadImage = ({
  onChange,
  value,
  wrapperProps,
  beforeUpload,
  uploadIcon = (
    <ShimmerImage
      w={{ md: '42px', base: '14px' }}
      h={{ md: '42px', base: '14px' }}
      src="/images/user/addImgnew.png"
    />
  ),
}: UploadImageProps) => {
  const renderUploadImage: UploadProps['children'] = (state, actions) => {
    if (state.loading)
      return (
        <Spinner thickness="4px" speed="0.8s" emptyColor="gray.200" size="xl" />
      );
    if (state.value)
      return (
        <>
          <Center
            cursor={'pointer'}
            opacity={'0'}
            _hover={{ opacity: 1 }}
            zIndex={2}
            bg="blackAlpha.400"
            pos="absolute"
            top="0"
            right="0"
            bottom="0"
            left="0"
            display={{ md: 'flex', base: 'none' }}
          >
            <Icon
              as={FaPen}
              fontSize={22}
              mr={6}
              onClick={actions.chooseFile}
            />
            <Icon as={DeleteIcon} fontSize={22} onClick={actions.remove} />
          </Center>
          <Image w="full" h="full" objectFit={'cover'} src={state.value} />
        </>
      );
    return uploadIcon;
  };
  return (
    <Center
      w="240px"
      h="240px"
      rounded="lg"
      border="1px solid #D9D9D9"
      color="#f4f4f4"
      bgColor="#fff"
      overflow={'hidden'}
      // _hover={{
      //   color: '#ffffff',
      //   bg: '#f4f4f4',
      //   opacity: 0.7,
      // }}
      {...wrapperProps}
    >
      <Upload value={value} onChange={onChange} beforeUpload={beforeUpload}>
        {renderUploadImage}
      </Upload>
    </Center>
  );
};
