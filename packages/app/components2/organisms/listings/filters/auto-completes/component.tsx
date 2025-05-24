import { Text } from 'app/components/ui/text';
import { CardList } from 'app/components2/molecules/card-list/card-list';
import { SearchResults } from 'app/components2/molecules/search-results';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Building2, MapPin, Search, Users2 } from 'lucide-react-native';
import { View } from 'react-native';
import { createLocationsSearchQpts } from './queries';

export const ListingsFiltersAutoCompletes = () => {
  const { colors } = useColorScheme();
  return (
    <View className="flex-col gap-4 bg-background p-4">
      {/* <SeparatorText hideLeft>
        <View className="flex-row gap-4 items-center">
          <Search color={colors.subtext} size={18} />
          <Text> Search </Text>
        </View>
      </SeparatorText> */}
      <Text>Search</Text>
      <SearchResults>
        <SearchResults.SearchBar
          searchBarProps={{
            searchIcon: <MapPin size={18} color={colors['card-foreground']} />,
            placeholder: 'Search Locations ...',
            inputStyle: {
              fontSize: 14,
            },
          }}
        />
        <SearchResults.Results>
          {({ debouncedSearchText }) => (
            <CardList
              component={() => <></>}
              skeletonComponent={() => <></>}
              flatListProps={{ scrollEnabled: false }}
              queryOptions={createLocationsSearchQpts({
                query: { search: debouncedSearchText },
              })}
            />
          )}
        </SearchResults.Results>
      </SearchResults>
      <SearchResults>
        <SearchResults.SearchBar
          searchBarProps={{
            searchIcon: <Users2 size={18} color={colors['card-foreground']} />,
            placeholder: 'Search Agents ...',
            inputStyle: {
              fontSize: 14,
            },
          }}
        />
      </SearchResults>
      <SearchResults>
        <SearchResults.SearchBar
          searchBarProps={{
            searchIcon: (
              <Building2 size={18} color={colors['card-foreground']} />
            ),
            placeholder: 'Search Companies ...',
            inputStyle: {
              fontSize: 14,
            },
          }}
        />
      </SearchResults>
    </View>
  );
};
