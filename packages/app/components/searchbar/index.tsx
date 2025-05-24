import { SearchBar as RNESearchBar, SearchBarProps } from '@rneui/themed';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Dispatch, SetStateAction } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { Button } from '../ui/button';
import { merge } from 'lodash';

export default function SearchBar({
  searchText,
  setSearchText,
  searchBarProps = {},
}: {
  searchText: string;
  setSearchText: (newSearchText: string) => void;
  searchBarProps?: SearchBarProps;
}) {
  const { colors } = useColorScheme();
  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: 'transparent',
    flexGrow: 1,
    borderColor: 'transparent',
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    // width: 1
  };
  const inputContainerStyle: StyleProp<ViewStyle> = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderStyle: 'solid' as 'solid' | 'dotted' | 'dashed' | undefined,
    borderRadius: 8,
    borderBottomWidth: 1,
    flexGrow: 1,
    borderColor: colors.card,
    height: 40,
  };
  const inputStyle: StyleProp<TextStyle> = {
    color: colors['accent-foreground'],
    fontSize: 16,
    borderWidth: 0,
  };
  const CancelIcon = () => {
    return searchText ? (
      <Button
        variant={'base'}
        size={'none'}
        style={{ backgroundColor: colors.background }}
        className="p-1 rounded-full"
        onPress={() => setSearchText('')}
      >
        <X size={14} color={colors['accent-foreground']} />
      </Button>
    ) : (
      <></>
    );
  };
  const SearchIcon = () => {
    return <Search size={18} color={colors['accent-foreground']} />;
  };

  return (
    <RNESearchBar
      {...merge(
        {
          searchIcon: searchBarProps.searchIcon ?? <SearchIcon />,
          clearIcon: searchBarProps.clearIcon ?? <CancelIcon />,
        } as SearchBarProps,
        {
          value: searchText,
          placeholder: 'Search ...',
          onChangeText: setSearchText,
          selectionColor: colors.primary,
          placeholderTextColor: colors['accent-foreground'],
          containerStyle,
          inputContainerStyle,
          inputStyle: inputStyle!,
        } as SearchBarProps,
        searchBarProps,
      )}
    />
  );
}
