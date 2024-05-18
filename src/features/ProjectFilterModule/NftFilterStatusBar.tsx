import { Button, Flex, FlexProps } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import React, { useMemo, useContext } from 'react';
import { PopoverSelectOption } from '@/features/Select';
import { useTranslations } from 'next-intl';
import { NftFilterForm } from './NftFilterForm';
import { parseAttrs, stringifyAttrs } from './CollectionFilter';

export const NftFilterStatusBar = ({
  rightExtra,
  ...props
}: FlexProps & {
  rightExtra?: React.ReactNode | (() => React.ReactNode);
}) => {
  const t = useTranslations('common');
  const { reset, state, dispatch } = useContext(NftFilterForm.Context);

  const showSearchStateBar = useMemo(
    () =>
      Object.entries(state).filter(
        ([k, v]) =>
          k !== 'order_type' && k !== 'bulkList' && v !== '' && v !== undefined,
      ).length > 0,
    [state],
  );

  const isSellOptions = useMemo<PopoverSelectOption[]>(
    () => t.raw('filter.isSell' as any),
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
      const attrValueIndex = attrs[parentIndex]?.value.findIndex(
        (el) => el === attrValue,
      );
      if (parentIndex === -1) return { ...prev, attrs: '' };
      // attrs[parentIndex]!.value.splice(parentIndex, 1);
      // if (!attrs[parentIndex]!.value.length) {
      //   delete attrs[parentIndex];
      // }
      if (attrValueIndex !== undefined) {
        attrs[parentIndex]!.value.splice(attrValueIndex, 1);
        if (!attrs[parentIndex]!.value.length) {
          delete attrs[parentIndex]?.value[attrValueIndex];
          if (attrs[parentIndex]?.value.length === 0) {
            attrs.splice(parentIndex, 1);
          }
        }
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

  if (!showSearchStateBar) return <div />;
  return (
    <Flex
      w="full"
      wrap={'wrap'}
      m={{ base: '-0.25rem', md: '-0.5rem' }}
      {...props}
    >
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
      {!!state.is_sell && (
        <Button
          bg="#E8E8F2"
          h={{ base: '40px', md: '42px' }}
          fontSize="14px"
          rounded="8px"
          m={{ base: '0.25rem', md: '0.5rem' }}
          variant={'outline2border'}
          fontFamily="Inter"
          rightIcon={<CloseIcon w="10px" />}
          onClick={() => dispatch((prev) => ({ ...prev, is_sell: '' }))}
        >
          {isSellOptions.find((el) => el.value === state.is_sell)?.label}
        </Button>
      )}
      {(!!state.low || !!state.high) && (
        <Button
          bg="#E8E8F2"
          h={{ base: '40px', md: '42px' }}
          rounded="8px"
          fontSize="14px"
          m={{ base: '0.25rem', md: '0.5rem' }}
          fontFamily="Inter"
          variant={'outline2border'}
          rightIcon={<CloseIcon w="10px" />}
          onClick={() =>
            dispatch((prev) => ({
              ...prev,
              low: undefined,
              high: undefined,
            }))
          }
        >
          {(() => {
            if (state.low && !state.high) {
              return `Price: >= ${state.low}`;
            }
            if (!state.low && state.high) {
              return `Price: <= ${state.high}`;
            }
            return `Price: ${state.low}~${state.high}`;
          })()}
        </Button>
      )}
      {typeof rightExtra === 'function' ? rightExtra() : rightExtra}
    </Flex>
  );
};
