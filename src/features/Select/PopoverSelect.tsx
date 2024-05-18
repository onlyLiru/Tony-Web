import {
  Box,
  BoxProps,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { usePropsValue } from '@/hooks/usePropsValue';
import { merge } from 'lodash';
import { useTranslations } from 'next-intl';
import { BsChevronDown } from 'react-icons/bs';

export type PopoverSelectOption = {
  label: string;
  value: string;
  className?: string;
};
type PopoverSelectProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  options: PopoverSelectOption[];
} & Omit<BoxProps, 'value' | 'defaultValue' | 'onChange'>;

export const PopoverSelect: React.FC<PopoverSelectProps> = (p) => {
  const t = useTranslations('common');
  const props = merge({ defaultValue: '' }, p);
  const { value, defaultValue, onChange, options, ...boxProps } = props;
  const [innerValue, setValue] = usePropsValue({
    value,
    defaultValue,
    onChange,
  });

  const currentLabel = useMemo(
    () => options.find((el) => el.value === innerValue)?.label,
    [value, t],
  );
  return (
    <Box {...boxProps} fontFamily="Inter">
      <Popover matchWidth isLazy>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <InputGroup>
                <Input
                  rounded="8px"
                  readOnly
                  pl="20px"
                  h={{ base: '40px', md: '42px' }}
                  bg="transparent"
                  fontWeight={'400'}
                  color="rgba(255, 255, 255, 0.80)"
                  _placeholder={{
                    color: 'rgba(255, 255, 255, 0.80)',
                    fontWeight: '700',
                  }}
                  cursor="pointer"
                  borderColor={'rgba(255, 255, 255, 0.10) !important'}
                  value={currentLabel || ''}
                  borderWidth={1}
                  fontSize={{ base: '14px', md: '16px' }}
                />
                <InputRightElement
                  h={{ base: '40px', md: '42px' }}
                  mr="10px"
                  children={
                    <Icon
                      as={BsChevronDown}
                      fontSize={'20px'}
                      transform={isOpen ? 'rotate(180deg)' : undefined}
                      color={'primary.deepGray'}
                    />
                  }
                />
              </InputGroup>
            </PopoverTrigger>
            <PopoverContent
              border="none"
              p="0"
              shadow="lg"
              overflow="hidden"
              w="auto"
            >
              <PopoverBody p="0">
                {props.options.map((option) => (
                  <Button
                    className={option.className}
                    w="full"
                    onClick={() => {
                      setValue(option.value! ?? option.label);
                      onClose();
                    }}
                    fontFamily="Inter"
                    key={option.value! ?? option.label}
                    rounded="none"
                    justifyContent="flex-start"
                    variant="ghost"
                    size="lg"
                    color={'black'}
                  >
                    {option.label}
                  </Button>
                ))}
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </Box>
  );
};
