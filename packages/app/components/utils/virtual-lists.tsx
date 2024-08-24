import React from "react";
import {
  ScrollView as RNScrollView,
  FlatList as RNFlatList,
  FlatListProps,
  SectionList as RNSectionList,
  SectionListProps,
  Platform,
  ScrollViewProps,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { HorizontalFlatList as ISHorizontalFlatlist } from '@idiosync/horizontal-flatlist';
import { HorizontalFlatListProps } from "@idiosync/horizontal-flatlist/dist/horizontal-flat-list";

// Custom ScrollView with default props applied
export const ScrollView = (props: ScrollViewProps) => {
  return (
    <KeyboardAwareScrollView
      {...props}
      bounces={false}
      overScrollMode="never"
      bouncesZoom={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={Platform.OS === "web"}
      showsHorizontalScrollIndicator={Platform.OS === "web"}
    />
  );
};

// Custom FlatList with default props applied
export const FlatList = <T,>(props: FlatListProps<T>) => {
  return (
    <RNFlatList
      {...props}
      bounces={false}
      overScrollMode="never"
      bouncesZoom={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={Platform.OS === "web"}
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      renderScrollComponent={(scrollProps) => (
        <KeyboardAwareScrollView {...scrollProps} />
      )}
    />
  );
};

// Custom SectionList with default props applied
export const SectionList = <ItemT, SectionT>(
  props: SectionListProps<ItemT, SectionT>
) => {
  return (
    <RNSectionList
      {...props}
      bounces={false}
      overScrollMode="never"
      bouncesZoom={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={Platform.OS === "web"}
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      renderScrollComponent={(scrollProps) => (
        <KeyboardAwareScrollView {...scrollProps} />
      )}
    />
  );
};

// Custom HorizontalFlatList with default props applied
export const HorizontalFlatList = <T,>(props: HorizontalFlatListProps<T>) => {
  return (
    <ISHorizontalFlatlist
      {...props}
      bounces={false}
      overScrollMode="never"
      bouncesZoom={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={Platform.OS === "web"}
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      renderScrollComponent={(scrollProps) => (
        <KeyboardAwareScrollView {...scrollProps} />
      )}
    />
  );
};
