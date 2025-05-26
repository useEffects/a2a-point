import { IconNode } from '@rneui/base';
import { UseQueryOptions } from '@tanstack/react-query';
import { Pressable } from 'app/components/pressable';
import SearchBar from 'app/components/searchbar';
import { CardList } from 'app/components2/molecules/card-list/card-list';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { FC, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDebounce } from 'use-debounce';
import { ZodObject } from 'zod';
import { FiltersContext } from '../context';
import { pressableWrapper } from 'app/components2/molecules/lib/pressable-wrapper';
import { useColorScheme } from 'app/hooks/color-scheme';

type AutoCompleteProps<T extends Record<string, any>, K extends keyof T> = {
  placeholderText: string;
  searchIcon: IconNode;
  paramKey: 'location' | 'agent' | 'company';
  queryKey: any[];
  renderCardsQueryParams: Parameters<typeof renderCardsQuery2<T>>[0];
  component: FC<T>;
  skeletonComponent: FC<{}>;
  titleKey: K;
  zodSchema: ZodObject<any>;
};

export const AutoComplete = <
  T extends { id: string },
  K extends keyof T = keyof T,
>(
  props: AutoCompleteProps<T, K>,
) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 300);
  const { setFilters } = useContext(FiltersContext);
  const { colors } = useColorScheme();

  const createQOpts = (search: string) =>
    ({
      queryKey: [...props.queryKey, search],
      queryFn: async () =>
        renderCardsQuery2({
          ...props.renderCardsQueryParams,
          search,
        }),
      initialData: [],
      enabled: !!search,
    }) as UseQueryOptions<(T & { id: string })[]>;

  const onPress = (item: T) => {
    setFilters((prev) => ({
      ...prev,
      search: {
        ...prev.search,
        [props.paramKey]: item,
      },
    }));
    setSearchText(item[props.titleKey] as string);
  };

  return (
    <View className="px-2">
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        searchBarProps={{
          searchIcon: props.searchIcon,
          placeholder: props.placeholderText,
          inputStyle: {
            fontSize: 14,
          },
          inputContainerStyle: {
            borderColor: colors.border,
            borderWidth: StyleSheet.hairlineWidth,
            boxShadow: [],
          },
        }}
      />
      <View style={{ height: searchText ? 200 : 0 }}>
        <CardList<T & { id: string }>
          component={pressableWrapper(onPress, props.component)}
          skeletonComponent={props.skeletonComponent}
          queryOptions={createQOpts(debouncedSearchText)}
          flatListProps={{
            scrollEnabled: false,
          }}
        />
      </View>
    </View>
  );
};
