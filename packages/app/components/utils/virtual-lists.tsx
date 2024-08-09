import React from "react";
import { ScrollViewProps, FlatList as RNFlatList, FlatListProps, SectionList as RNSectionList, SectionListProps, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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

export const ScrollView = WithNoBounce<ScrollViewProps>(KeyboardAwareScrollView);

export const FlatList = <T,>(props: FlatListProps<T>) => {
    const Component = WithNoBounce<FlatListProps<T>>(RNFlatList);
    return <Component {...props} renderScrollComponent={props => <KeyboardAwareScrollView {...props} />} />;
};

export const SectionList = <ItemT, SectionT>(props: SectionListProps<ItemT, SectionT>) => {
    const Component = WithNoBounce<SectionListProps<ItemT, SectionT>>(RNSectionList);
    return <Component {...props} renderScrollComponent={props => <KeyboardAwareScrollView {...props} />} />;
};

export const HorizontalFlatList = <T,>(props: HorizontalFlatListProps<T>) => {
    const Component = WithNoBounce<HorizontalFlatListProps<T>>(ISHorizontalFlatlist);
    return <Component {...props} renderScrollComponent={props => <KeyboardAwareScrollView {...props} />} />;
};