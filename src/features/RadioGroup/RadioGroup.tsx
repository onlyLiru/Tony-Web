import { useField } from 'formik';
import {
  RadioGroup as ChakraRadioGroup,
  RadioGroupProps as ChakraRadioGroupProps,
} from '@chakra-ui/react';
import * as React from 'react';

type Props = ChakraRadioGroupProps;

export const RadioGroup = ({ name, children, ...props }: Props) => {
  const [field, , { setValue }] = useField({ name, value: props.value } as any);

  const namedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return;

    return React.cloneElement(child, {
      name,
    } as any);
  });

  return (
    <ChakraRadioGroup
      {...props}
      {...field}
      onChange={setValue}
      children={namedChildren}
    />
  );
};
