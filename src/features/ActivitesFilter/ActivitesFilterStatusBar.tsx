import { Button, Flex, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useMemo, useContext } from 'react';
import { PopoverSelectOption } from '@/features/Select';
import { useTranslations } from 'next-intl';
import { ActivitesFilterForm } from './ActivitesFilterForm';
import { FilterContainer } from '../FilterModule';
import { parseAttrs, stringifyAttrs } from '../FilterModule/CollectionFilter';
import { FilterSwitch } from '../FilterModule/Icons';

export const ActivitesFilterStatusBar = () => {
  const t = useTranslations('common');
  const { reset, state, dispatch } = useContext(ActivitesFilterForm.Context);
  const { toggleFilterLayout, isOpen } = useContext(FilterContainer.Context);

  const showSearchStateBar = useMemo(
    () => state.events?.length! > 0,
    [state.events],
  );

  const eventOptions = useMemo<PopoverSelectOption[]>(
    () => t.raw('activites.filters' as any),
    [t],
  );

  /** 状态栏属性移除事件 */
  const removeUrlAttr = (str: string) => {
    const [attrType, attrValue] = str.split('|');
    if (!attrType || !attrValue) return;
    dispatch((prev) => {
      const attrs = parseAttrs(prev.attrs || '[]');
      // 找出匹配attr
      const parentIndex = attrs.findIndex((el) => el.trait_type === attrType);
      if (parentIndex === -1) return { ...prev, attrs: '' };
      attrs[parentIndex]!.value.splice(parentIndex, 1);
      if (!attrs[parentIndex]!.value.length) {
        delete attrs[parentIndex];
      }
      return {
        ...prev,
        attrs: attrs.filter(Boolean).length > 0 ? stringifyAttrs(attrs) : '',
      };
    });
  };

  const attrs = useMemo(
    () =>
      parseAttrs(state.attrs)
        .filter((el) => Array.isArray(el.value))
        .reduce<string[]>(
          (a, v) => [...a, ...v?.value?.map((a) => `${v.trait_type}|${a}`)],
          [],
        ),
    [state.attrs],
  );

  return (
    <Flex
      py={5}
      px={{ base: 5, md: 8 }}
      w="full"
      zIndex={10}
      pos={{ base: 'relative', md: 'sticky' }}
      top={{ base: '0', md: '80px' }}
      bg={'#2B2B2B'}
      sx={{
        backdropFilter: 'blur(12px)',
      }}
    >
      <IconButton
        flexShrink={0}
        h="42px"
        w="42px"
        display={{ base: 'none', md: 'inline-flex' }}
        onClick={() => toggleFilterLayout()}
        rounded="8px"
        variant="outline"
        borderWidth={1}
        aria-label=""
        className={isOpen ? 'Ex002' : 'Ex001'}
        bg={isOpen ? 'transparent' : 'transparent'}
        color={'rgba(255, 255, 255, 0.80)'}
        borderColor="rgba(255, 255, 255, 0.10)"
        mr="35px"
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
      {showSearchStateBar && (
        <Flex wrap={'wrap'} m={{ base: '-0.25rem', md: '-0.5rem' }} w="full">
          <Button
            bg="#E8E8F2"
            h={{ base: '40px', md: '42px' }}
            fontSize="14px"
            rounded="8px"
            fontFamily="Inter"
            variant={'outline2border'}
            onClick={reset}
            m={{ base: '0.25rem', md: '0.5rem' }}
          >
            {t('filter.clear')}
          </Button>
          {!!state.address && (
            <Button
              bg="#E8E8F2"
              h={{ base: '40px', md: '42px' }}
              fontSize="14px"
              rounded="8px"
              m={{ base: '0.25rem', md: '0.5rem' }}
              variant={'outline2border'}
              fontFamily="Inter"
              rightIcon={<CloseIcon w="10px" />}
              onClick={() => dispatch((prev) => ({ ...prev, address: '' }))}
            >
              {t('filter.collections')}
            </Button>
          )}
          {!!attrs.length &&
            attrs.map((attr) => (
              <Button
                bg="#E8E8F2"
                h={{ base: '40px', md: '42px' }}
                fontSize="14px"
                rounded="8px"
                m={{ base: '0.25rem', md: '0.5rem' }}
                key={attr}
                variant={'outline2border'}
                fontFamily="Inter"
                rightIcon={<CloseIcon w="10px" />}
                onClick={() => removeUrlAttr(attr)}
              >
                {attr.split('|')[1]}
              </Button>
            ))}
          {Array.isArray(state.events) &&
            state.events.map((ev) => (
              <Button
                bg="#E8E8F2"
                h={{ base: '40px', md: '42px' }}
                fontSize="14px"
                rounded="8px"
                m={{ base: '0.25rem', md: '0.5rem' }}
                key={ev}
                variant={'outline2border'}
                fontFamily="Inter"
                rightIcon={<CloseIcon w="10px" />}
                onClick={() =>
                  dispatch((prev) => ({
                    ...prev,
                    events: (prev.events || []).filter((c: string) => c !== ev),
                  }))
                }
              >
                {eventOptions.find((item) => item.value === ev)?.label}
              </Button>
            ))}
        </Flex>
      )}
    </Flex>
  );
};
