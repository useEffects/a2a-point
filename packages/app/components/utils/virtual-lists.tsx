import React from "react";
import { ScrollView as RNScrollView, ScrollViewProps, FlatList as RNFlatList, FlatListProps, SectionList as RNSectionList, SectionListProps, Platform } from "react-native";
import { HorizontalFlatList as ISHorizontalFlatlist } from '@idiosync/horizontal-flatlist'
import { HorizontalFlatListProps } from "@idiosync/horizontal-flatlist/dist/horizontal-flat-list";

const WithNoBounce = <P,>(Component: React.ComponentType<P>) => {
    // eslint-disable-next-line react/display-name
    return (props: P) => <Component {...props as P}
        bounces={false}
        overScrollMode="never"
        bouncesZoom={false}
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        showsHorizontalScrollIndicator={Platform.OS === "web"}
    />

}

export const ScrollView = WithNoBounce<ScrollViewProps>(RNScrollView);
export const FlatList = WithNoBounce<FlatListProps<any>>(RNFlatList);
export const SectionList = WithNoBounce<SectionListProps<any, any>>(RNSectionList);
export const HorizontalFlatList = WithNoBounce<HorizontalFlatListProps<any>>(ISHorizontalFlatlist);