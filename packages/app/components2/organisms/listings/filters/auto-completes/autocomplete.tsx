import { IconNode } from '@rneui/base';
import { UseQueryOptions } from '@tanstack/react-query';
import { Pressable } from 'app/components/pressable';
import SearchBar from 'app/components/searchbar';
import { CardList } from 'app/components2/molecules/card-list/card-list';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { FC, useContext, useState } from 'react';
import { View } from 'react-native';
import { useDebounce } from 'use-debounce';
import { ZodObject } from 'zod';
import { FiltersContext } from '../context';
import { useColorScheme } from 'app/hooks/color-scheme';
import Collapsible from 'react-native-collapsible';

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
  const [collapsed, setCollapsed] = useState(true);
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
    setCollapsed(true);
  };

  return (
    <View className="px-2 flex-col gap-2">
      <SearchBar
        searchText={searchText}
        setSearchText={(text) => {
          setSearchText(text);
          setCollapsed(!text);
        }}
        searchBarProps={{
          searchIcon: props.searchIcon,
          placeholder: props.placeholderText,
          inputStyle: {
            fontSize: 14,
          },
          inputContainerStyle: {
            borderColor: colors.border,
            borderWidth: 1,
            boxShadow: [],
          },
        }}
      />
      <Collapsible collapsed={collapsed}>
        <View className="p-2 rounded-xl bg-card border border-solid border-border">
          <CardList<T & { id: string }>
            component={(item) => (
              <Pressable
                onPress={() => onPress(item)}
                className="rounded-lg active:bg-accent"
              >
                {props.component(item)}
              </Pressable>
            )}
            skeletonComponent={props.skeletonComponent}
            queryOptions={createQOpts(debouncedSearchText)}
            flatListProps={{
              scrollEnabled: false,
            }}
            noMoreClassName="h-8 items-start pl-2"
          />
        </View>
      </Collapsible>
    </View>
  );
};
