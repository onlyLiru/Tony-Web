import { usePropsValue } from '@/hooks/usePropsValue';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuProps,
} from '@chakra-ui/react';
import { merge } from 'lodash';
import React, { useMemo } from 'react';

export type MenuSelectItem = { label: string; value: string };

export type MenuSelectProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  placeholder?: React.ReactNode;
  options: MenuSelectItem[];
  wrapperProps?: BoxProps;
  menuProps?: MenuProps;
} & Omit<ButtonProps, 'value' | 'onChange'>;

export const MenuSelect: React.FC<MenuSelectProps> = (p) => {
  const {
    value,
    defaultValue,
    onChange,
    options = [],
    placeholder,
    menuProps,
    wrapperProps,
    ...props
  } = merge({ defaultValue: '' }, p);
  const [innerValue, setValue] = usePropsValue({
    value,
    defaultValue,
    onChange,
  });

  const current = useMemo(
    () => options.find((el) => el.value === innerValue),
    [options, innerValue],
  );
  return (
    <Box {...wrapperProps}>
      <Menu matchWidth autoSelect={false} {...menuProps}>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon fontSize={24} />}
          {...props}
        >
          {current?.label || placeholder}
        </MenuButton>
        <MenuList
          overflow={'hidden'}
          w="full"
          minW="full"
          border="2px solid"
          color="primary.gray"
          shadow={'none'}
          p={0}
        >
          {options.map((opt) => (
            <MenuItem
              color="primary.main"
              _hover={{
                color: 'white',
                bg: 'primary.main',
              }}
              py={3}
              px={5}
              onClick={() => setValue(opt.value)}
              key={opt.value}
            >
              {opt.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
