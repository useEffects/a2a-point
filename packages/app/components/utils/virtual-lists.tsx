import React from 'react';
import {
  ScrollView as RNScrollView,
  FlatList as RNFlatList,
  FlatListProps,
  SectionList as RNSectionList,
  SectionListProps,
  ScrollViewProps,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { HorizontalFlatList as ISHorizontalFlatlist } from '@idiosync/horizontal-flatlist';
import { HorizontalFlatListProps } from '@idiosync/horizontal-flatlist/dist/horizontal-flat-list';

// Shared scroll settings
const sharedScrollProps: Partial<ScrollViewProps> = {
  bounces: false,
  overScrollMode: 'never' as const,
  bouncesZoom: false,
  alwaysBounceHorizontal: false,
  alwaysBounceVertical: false,
  showsVerticalScrollIndicator: Platform.OS === 'web',
  showsHorizontalScrollIndicator: Platform.OS === 'web',
};

// Exported default props per component type
export const ScrollViewDefaultProps: Partial<ScrollViewProps> = {
  ...sharedScrollProps,
};

export const FlatListDefaultProps: Partial<FlatListProps<any>> = {
  ...sharedScrollProps,
  renderScrollComponent: (scrollProps) => (
    <KeyboardAwareScrollView {...ScrollViewDefaultProps} {...scrollProps} />
  ),
};

export const SectionListDefaultProps: Partial<SectionListProps<any, any>> = {
  ...sharedScrollProps,
  renderScrollComponent: (scrollProps) => (
    <KeyboardAwareScrollView {...ScrollViewDefaultProps} {...scrollProps} />
  ),
};

export const HorizontalFlatListDefaultProps: Partial<
  HorizontalFlatListProps<any>
> = {
  ...sharedScrollProps,
};

// Custom ScrollView with defaults
export const ScrollView = (props: ScrollViewProps) => (
  <KeyboardAwareScrollView {...ScrollViewDefaultProps} {...props} />
);

// Custom FlatList with defaults
export const FlatList = <T,>(props: FlatListProps<T>) => (
  <RNFlatList {...FlatListDefaultProps} {...props} />
);

// Custom SectionList with defaults
export const SectionList = <ItemT, SectionT>(
  props: SectionListProps<ItemT, SectionT>,
) => <RNSectionList {...SectionListDefaultProps} {...props} />;

// Custom HorizontalFlatList with defaults
export const HorizontalFlatList = <T,>(props: HorizontalFlatListProps<T>) => (
  <ISHorizontalFlatlist {...HorizontalFlatListDefaultProps} {...props} />
);
