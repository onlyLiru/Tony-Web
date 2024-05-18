import { Box, ButtonGroup, HStack, IconButton, Stack } from '@chakra-ui/react';
import React, { useMemo, useContext } from 'react';
import { PopoverSelect, PopoverSelectOption } from '@/features/Select';
import { useTranslations } from 'next-intl';
import { NftFilterForm } from './NftFilterForm';
import { FilterContainer } from './FilterContainer';
import { FilterSwitch, Grid2x2, Grid3x3 } from './Icons';
import { useIsRare } from '@/store';
import { darkBg } from '@/utils/darkColor';

type NftTopFilterBarProps = {
  rightExtra?: React.ReactNode | (() => React.ReactNode);
};

export const NftTopFilterBar = (props: NftTopFilterBarProps) => {
  const t = useTranslations('common');
  const { state, dispatch, hideOrderTypeSelector } = useContext(
    NftFilterForm.Context,
  );
  const { toggleFilterLayout, changeCardSize, isOpen, isSmallCard } =
    useContext(FilterContainer.Context);

  const orderTypeOptions = useMemo<PopoverSelectOption[]>(
    () => t.raw('filter.orderType' as any),
    [t],
  );
  const [isRare] = useIsRare();
  return (
    <Box
      pt={{ base: '20px', md: '40px' }}
      pb={{ base: '20px', md: '24px' }}
      px={{ base: 5, md: 8 }}
      w="full"
      zIndex={10}
      pos={{ base: 'relative', md: 'sticky' }}
      top={{ base: '0', md: '80px' }}
      bg={isRare ? darkBg : '#2B2B2B'}
      sx={{
        backdropFilter: 'blur(12px)',
      }}
    >
      <Stack
        w="full"
        spacing={0}
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
        fontFamily="Inter"
      >
        <HStack
          spacing={{ base: 0, md: '36px' }}
          w={{ base: '100%', md: 'auto' }}
        >
          <IconButton
            h="42px"
            w="42px"
            display={{ base: 'none', md: 'inline-flex' }}
            onClick={() => toggleFilterLayout()}
            rounded="8px"
            variant="outline"
            borderWidth={1}
            aria-label=""
            className={isOpen ? 'Ex002' : 'Ex001'}
            bg={isOpen ? 'transparent' : '#E49F5C'}
            color={isOpen ? 'rgba(255, 255, 255, 0.80)' : '#000'}
            borderColor="rgba(255, 255, 255, 0.10)"
            fontSize="18px"
            _hover={{
              bg: '#E49F5C',
              color: '#000',
            }}
            _active={{
              bg: '#E49F5C',
              color: '#000',
            }}
            icon={<FilterSwitch />}
          />
          <ButtonGroup
            display={{ base: 'none', md: 'inline-flex' }}
            variant="outline"
            isAttached
          >
            <IconButton
              h="42px"
              w="70px"
              fontSize={'18px'}
              rounded={'8px'}
              className="Ex009"
              onClick={() => changeCardSize('large')}
              aria-label=""
              bg={isSmallCard ? 'transparent' : '#E49F5C'}
              color={isSmallCard ? 'rgba(255, 255, 255, 0.80)' : '#000'}
              _active={{
                bg: '#E49F5C',
                color: '#000',
              }}
              _hover={{
                bg: '#E49F5C',
                color: '#000',
              }}
              borderColor="rgba(255, 255, 255, 0.10)"
              icon={<Grid2x2 />}
            />
            <IconButton
              h="42px"
              w="70px"
              fontSize={'18px'}
              rounded={'8px'}
              className="Ex010"
              onClick={() => changeCardSize('small')}
              aria-label=""
              bg={!isSmallCard ? 'transparent' : '#E49F5C'}
              color={!isSmallCard ? 'rgba(255, 255, 255, 0.80)' : '#000'}
              _active={{
                bg: '#E49F5C',
                color: '#000',
              }}
              _hover={{
                bg: '#E49F5C',
                color: '#000',
              }}
              borderColor="rgba(255, 255, 255, 0.10)"
              icon={<Grid3x3 />}
            />
          </ButtonGroup>

          {!hideOrderTypeSelector && (
            <PopoverSelect
              w={{ base: 'full', md: '320px' }}
              options={orderTypeOptions}
              value={state.order_type}
              onChange={(val) =>
                dispatch((prev) => ({ ...prev, order_type: val }))
              }
              bg={'transparent'}
              color={'rgba(255, 255, 255, 0.80)'}
            />
          )}
        </HStack>
        {typeof props.rightExtra === 'function'
          ? props.rightExtra()
          : props.rightExtra}
      </Stack>
    </Box>
  );
};
