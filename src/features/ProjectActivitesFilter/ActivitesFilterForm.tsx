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
} from '../ProjectFilterModule/CollectionFilter';
import { ApiMarket } from '@/services/market';

type FormValueType = {
  events?: string[];
} & ApiMarket.NftCollectionQueryType;

type ContextType = {
  chainId: any;
  state: Partial<FormValueType>;
  dispatch: (s: SetStateAction<Partial<FormValueType>>) => void;
  reset: () => void;
} & Pick<CollectionFilterProps, 'projectId'>;

const defaultValue = {
  events: undefined,
};

const Context = createContext<ContextType>({
  projectId: 0,
  chainId: undefined,
  state: {},
  dispatch: () => null,
  reset: () => null,
});

type ProviderProps = Pick<ContextType, 'projectId' | 'chainId'> &
  PropsWithChildren;

const Provider = ({
  children,
  chainId,
  projectId,
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
        projectId,
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
  const { state, dispatch, chainId, projectId } = useContext(Context);

  const t = useTranslations('common');
  const eventOptions = useMemo<PopoverSelectOption[]>(
    () => t.raw('activites.filters' as any),
    [t],
  );

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
          color="primary.main"
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
                bg={active ? '#544AEC' : 'white'}
                color={active ? 'white' : 'primary.main'}
                borderColor={active ? '#544AEC' : 'primary.gray'}
                key={idx}
                _hover={{
                  bg: '#544AEC',
                  color: 'white',
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
        projectId={projectId}
      />
    </VStack>
  );
};

export const ActivitesFilterForm = Object.assign(ActivitesFilterFormRoot, {
  Context,
  Provider,
});
