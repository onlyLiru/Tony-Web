import { Button, FormControl, FormLabel, VStack } from '@chakra-ui/react';
import {
  createContext,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
} from 'react';
import { useUrlState } from '@/hooks/useUrlState';
import { useTranslations } from 'next-intl';
import { PopoverSelectOption } from '../Select';
import {
  CollectionFilter,
  CollectionFilterProps,
} from '../FilterModule/CollectionFilter';
import { ApiMarket } from '@/services/market';
import { darkText, darkLabelColor, darkButton } from '@/utils/darkColor';

type FormValueType = {
  events?: string[];
} & ApiMarket.NftCollectionQueryType;

type ContextType = {
  chainId: any;
  state: Partial<FormValueType>;
  dispatch: (s: SetStateAction<Partial<FormValueType>>) => void;
  reset: () => void;
} & Pick<CollectionFilterProps, 'collectionAddress' | 'ownerWalletAddress'>;

const defaultValue = {
  events: undefined,
};

const Context = createContext<ContextType>({
  chainId: undefined,
  state: {},
  dispatch: () => null,
  reset: () => null,
});

type ProviderProps = Pick<
  ContextType,
  'collectionAddress' | 'ownerWalletAddress' | 'chainId'
> &
  PropsWithChildren;

const Provider = ({
  children,
  chainId,
  ownerWalletAddress,
  collectionAddress,
  ...props
}: ProviderProps) => {
  const [state, dispatch] = useUrlState<FormValueType>(defaultValue, {
    ...props,
    parseOptions: {
      arrayFormat: 'bracket',
    },
    stringifyOptions: {
      arrayFormat: 'bracket',
    },
  });
  const reset = () => dispatch(defaultValue);
  return (
    <Context.Provider
      value={{
        chainId,
        ownerWalletAddress,
        collectionAddress,
        state,
        dispatch,
        reset,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const ActivitesFilterFormRoot = () => {
  const { state, dispatch, chainId, collectionAddress, ownerWalletAddress } =
    useContext(Context);

  const t = useTranslations('common');
  const eventOptions = useMemo<PopoverSelectOption[]>(
    () => t.raw('activites.filters' as any),
    [t],
  );
  const btnColor = darkButton.normal;
  return (
    <VStack
      py={{ base: 0, md: 6 }}
      px={{ base: 0, md: 8 }}
      w="full"
      spacing={{ base: 5, md: '40px' }}
    >
      <FormControl>
        <FormLabel
          mb={{ base: '10px', md: '20px' }}
          fontSize={{ base: '16px', md: '20px' }}
          color="rgba(255, 255, 255, 0.80)"
        >
          {t('filter.status')}
        </FormLabel>
        <VStack spacing={'18px'} w="full">
          {eventOptions.map((el, idx) => {
            const active = state.events?.includes(el.value)!;
            return (
              <Button
                fontWeight={400}
                fontFamily="PingFang HK"
                bg={active ? btnColor.bg.active : btnColor.bg.notActive}
                color={
                  active ? btnColor.color.active : btnColor.color.notActive
                }
                borderColor={
                  active
                    ? btnColor.borderColor.active
                    : btnColor.borderColor.notActive
                }
                key={idx}
                _hover={{
                  bg: btnColor.hover.bg,
                  color: btnColor.hover.color,
                }}
                borderWidth={1}
                rounded="6px"
                w="full"
                h={{ base: '40px', md: '42px' }}
                fontSize={{ base: '14px', md: '16px' }}
                onClick={() =>
                  dispatch((prev) => {
                    const events = active
                      ? prev.events?.filter((c: string) => c !== el.value)
                      : [...(prev.events || []), el.value];
                    return {
                      ...prev,
                      events,
                    };
                  })
                }
              >
                {el.label}
              </Button>
            );
          })}
        </VStack>
      </FormControl>
      <CollectionFilter
        state={state}
        chainId={chainId}
        dispatch={dispatch}
        collectionAddress={collectionAddress}
        ownerWalletAddress={ownerWalletAddress}
      />
    </VStack>
  );
};

export const ActivitesFilterForm = Object.assign(ActivitesFilterFormRoot, {
  Context,
  Provider,
});
