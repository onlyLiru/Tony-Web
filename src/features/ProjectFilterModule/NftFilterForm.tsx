import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
  Switch,
} from '@chakra-ui/react';
import { useUrlState, Options } from '@/hooks/useUrlState';
import { PopoverSelectOption } from '@/features/Select';
import { useTranslations } from 'next-intl';
import {
  createContext,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { CollectionFilter, CollectionFilterProps } from './CollectionFilter';
import { ApiMarket } from '@/services/market';
import { useIsRare, useRareMode } from '@/store';
import { darkText, darkLabelColor, darkButton } from '@/utils/darkColor';
import { useRouter } from 'next/router';
type FormValueType = ApiMarket.ExploreQueryType;

type ContextType = {
  chainId: any;
  projectId: any;
  /** 是否隐藏orderType筛选器 */
  hideOrderTypeSelector?: boolean;
  /** 是否隐藏合集属性筛选器 */
  hideCollectionSelector?: boolean;
  state: Partial<FormValueType>;
  dispatch: (s: SetStateAction<Partial<FormValueType>>) => void;
  /** 重置表单 */
  reset: () => void;
} & Pick<CollectionFilterProps, 'collectionAddress' | 'ownerWalletAddress'>;

const Context = createContext<ContextType>({
  projectId: 1,
  chainId: undefined,
  state: {},
  dispatch: () => null,
  reset: () => null,
});

type ProviderProps = Pick<
  ContextType,
  | 'chainId'
  | 'projectId'
  | 'collectionAddress'
  | 'ownerWalletAddress'
  | 'hideOrderTypeSelector'
  | 'hideCollectionSelector'
> &
  PropsWithChildren &
  Options;

const Provider = ({
  children,
  hideOrderTypeSelector,
  hideCollectionSelector,
  ownerWalletAddress,
  collectionAddress,
  chainId,
  projectId,
  ...props
}: ProviderProps) => {
  const t = useTranslations('common');

  const defaultValue = useMemo<FormValueType>(() => {
    const d = {};
    if (hideOrderTypeSelector) return d;
    const orderType = t.raw('filter.orderType')[0].value;
    return { ...d, order_type: orderType };
  }, [hideOrderTypeSelector]);

  const [state, dispatch] = useUrlState<FormValueType>(defaultValue, {
    stringifyOptions: {
      skipEmptyString: true,
    },
    ...props,
  });
  const reset = () => {
    dispatch(defaultValue);
  };

  return (
    <Context.Provider
      value={{
        state,
        hideOrderTypeSelector,
        hideCollectionSelector,
        collectionAddress,
        ownerWalletAddress,
        chainId,
        projectId,
        dispatch,
        reset,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const NftFilterFormRoot = () => {
  const {
    state,
    dispatch,
    chainId,
    ownerWalletAddress,
    collectionAddress,
    hideCollectionSelector,
    projectId,
  } = useContext(Context);
  const [isRare, setIsRare] = useIsRare();
  const [isRareMode] = useRareMode();

  const [isCollectionPage, setIsCollectionPage] = useState(false);
  const router = useRouter();
  useMemo(() => {
    if (router.pathname === '/collection/[chain]/[id]') {
      setIsCollectionPage(true);
    }
  }, [router.pathname]);
  const t = useTranslations('common');
  const isSellOptions = useMemo<PopoverSelectOption[]>(
    () => t.raw('filter.isSell' as any),
    [t],
  );
  return (
    <VStack
      py={{ base: 0, md: 6 }}
      px={{ base: 0, md: 8 }}
      spacing={{ base: 5, md: '40px' }}
      fontFamily="PingFang HK"
      w="full"
    >
      <FormControl>
        {/* 稀有模式 */}
        {isCollectionPage && isRareMode ? (
          <HStack>
            <Text
              fontWeight={900}
              lineHeight={'29px'}
              fontSize={{ base: '16px', md: '20px' }}
              sx={isRare ? darkText : {}}
            >
              Rare Mode
            </Text>
            <Switch
              size="lg"
              onChange={(e) => {
                console.log(e.target.checked, 'e.target.checked');
                setIsRare(e.target.checked);
                // toggleColorMode();
              }}
              isChecked={isRare}
              _checked={{
                'span[aria-hidden="true"]': {
                  background: '#B5B5B5',
                  boxShadow:
                    'inset 0px 19.8066px 28.4403px -18.283px #14141F, inset 0px 3.55503px 5.58648px -2.03145px rgba(20, 20, 31, 0.5), inset 0px -41.6447px 34.5346px -32.5032px rgba(143, 142, 143, 0.3), inset 0px 49.7704px 50.7862px -24.3774px rgba(184, 184, 184, 0.3), inset 0px 2.03145px 9.14151px rgba(207, 207, 208, 0.3), inset 0px 0.507862px 20.3145px rgba(227, 227, 227, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '15px',
                },
                '.chakra-switch__thumb': {
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
                  boxShadow:
                    '0px 0px 6px rgba(255, 230, 0, 0.7), 0px 0px 20px rgba(255, 230, 0, 0.5), inset 0px 0px 4px rgba(255, 230, 0, 0.5)',
                  filter: 'blur(0.3px)',
                },
              }}
            ></Switch>
          </HStack>
        ) : (
          ''
        )}
      </FormControl>
      <FormControl>
        <FormLabel
          mb={{ base: '10px', md: '20px' }}
          fontSize={{ base: '16px', md: '20px' }}
          color={isRare ? darkLabelColor : 'primary.main'}
        >
          {t('filter.status')}
        </FormLabel>
        <VStack spacing={'16px'}>
          {isSellOptions.map((option, idx: number) => {
            const isActive = state.is_sell === option.value;
            let btnColor = null;
            if (isRare) {
              btnColor = darkButton.dark;
            } else {
              btnColor = darkButton.normal;
            }
            return (
              <Button
                fontWeight={400}
                fontFamily="PingFang HK"
                bg={isActive ? btnColor.bg.active : btnColor.bg.notActive}
                color={
                  isActive ? btnColor.color.active : btnColor.color.notActive
                }
                borderColor={
                  isActive
                    ? btnColor.borderColor.active
                    : btnColor.borderColor.notActive
                }
                key={idx}
                textShadow={
                  isActive
                    ? btnColor.textShadow.active
                    : btnColor.textShadow.notActive
                }
                backgroundClip={
                  isActive
                    ? btnColor.backgroundClip.active
                    : btnColor.backgroundClip.notActive
                }
                _hover={btnColor.hover}
                borderWidth={1}
                rounded="8px"
                w="full"
                h={{ base: '40px', md: '42px' }}
                fontSize={{ base: '14px', md: '16px' }}
                onClick={() =>
                  dispatch((prev) => ({
                    ...prev,
                    is_sell: option.value,
                  }))
                }
              >
                {option.label}
              </Button>
            );
          })}
        </VStack>
      </FormControl>
      <FormControl>
        <FormLabel
          mb={{ base: '10px', md: '20px' }}
          fontSize={{ base: '16px', md: '20px' }}
          color={isRare ? darkLabelColor : 'primary.main'}
        >
          {t('filter.price')}
        </FormLabel>
        <HStack spacing={6} align="center">
          <Input
            type="number"
            h={{ base: '40px', md: '42px' }}
            fontSize={{ base: '14px', md: '16px' }}
            textAlign={'center'}
            borderWidth={1}
            rounded="8px"
            value={state.low || ''}
            onChange={({ target }) => {
              dispatch((prev) => ({
                ...prev,
                low: String(target.value).replace(/^(.*\..{4}).*$/, '$1'),
              }));
            }}
            placeholder={t('filter.min')}
          />
          <Text fontSize={'16px'} color="primary.deepGray">
            {t('filter.to')}
          </Text>
          <Input
            h={{ base: '40px', md: '42px' }}
            fontSize={{ base: '14px', md: '16px' }}
            type="number"
            textAlign={'center'}
            borderWidth={1}
            rounded="8px"
            value={state.high || ''}
            onChange={({ target }) =>
              dispatch((prev) => ({
                ...prev,
                high: String(target.value).replace(/^(.*\..{4}).*$/, '$1'),
              }))
            }
            placeholder={t('filter.max')}
          />
        </HStack>
      </FormControl>
      {!hideCollectionSelector && (
        <CollectionFilter
          state={state}
          dispatch={dispatch}
          chainId={chainId}
          projectId={projectId}
          collectionAddress={collectionAddress}
          ownerWalletAddress={ownerWalletAddress}
        />
      )}
    </VStack>
  );
};

export const NftFilterForm = Object.assign(NftFilterFormRoot, {
  Context,
  Provider,
});
