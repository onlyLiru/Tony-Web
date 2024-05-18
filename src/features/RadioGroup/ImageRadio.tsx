import { useField } from 'formik';
import {
  Image,
  UseRadioProps,
  useRadio,
  ImageProps,
  chakra,
  useRadioGroupContext,
  Center,
  Text,
} from '@chakra-ui/react';
import * as React from 'react';

type Props = UseRadioProps &
  ImageProps & {
    image: string;
    text: string;
  };

export const ImageRadio = React.forwardRef((props: Props, ref) => {
  const { image, text, ...radioProps } = props;
  const group = useRadioGroupContext();

  const isChecked = group.value.toString() === props.value?.toString();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ checked, ...field }] = useField({
    name: props.name!,
    type: 'radio',
    value: radioProps.value?.toString(),
    checked: isChecked,
  });

  const { getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio({
      isChecked: isChecked,
      ...field,
    });

  return (
    <chakra.label {...htmlProps} cursor="pointer" textAlign={'center'}>
      <input {...getInputProps({}, ref)} hidden />
      <Center
        {...getCheckboxProps()}
        w={'144px'}
        h="144px"
        bg="#f2f2f2"
        cursor="pointer"
        border="2px solid #f2f2f2"
        p="12px"
        borderRadius="16px"
        _checked={{
          borderColor: 'primary.main',
        }}
        _hover={{
          borderColor: 'primary.main',
        }}
      >
        <Image objectFit={'contain'} src={image} {...getLabelProps()} />
      </Center>
      <Text
        mt="10px"
        fontSize={{ base: '14px', md: '16px' }}
        fontWeight={'600'}
      >
        {text}
      </Text>
    </chakra.label>
  );
});
