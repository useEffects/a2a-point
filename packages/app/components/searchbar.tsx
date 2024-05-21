import { SearchBarProps } from "@rneui/base";
import { SearchBar as RNESearchBar } from "@rneui/themed";
import { useColorScheme } from "app/hooks/color-scheme";
import { Dispatch, SetStateAction } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { X, Search } from "lucide-react-native"
import { Button } from "./ui/button";
import opacity from "hex-color-opacity";

export type CancelIconProps = {
    onPress: () => void,
    className?: string,
}

export default function SearchBar({ searchText, setSearchText, searchBarProps, cancelIconProps }: { searchText: string, setSearchText: Dispatch<SetStateAction<string>>, searchBarProps?: SearchBarProps, cancelIconProps?: CancelIconProps }) {
    const { colors } = useColorScheme()
    const containerStyle: StyleProp<ViewStyle> = {
        backgroundColor: "transparent",
        flexGrow: 1,
        borderColor: "transparent",
        borderWidth: 0,
        padding: 0
    }
    const inputContainerStyle: StyleProp<ViewStyle> = {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderStyle: "solid" as "solid" | "dotted" | "dashed" | undefined,
        borderRadius: 9999,
        borderBottomWidth: 1,
        flexGrow: 1,
        borderColor: colors.foreground,
        height: 40
    }
    const inputStyle: StyleProp<TextStyle> = {
        color: colors.foreground,
    }
    const CancelIcon = (props: CancelIconProps) => {
        const _props = cancelIconProps || props
        return searchText ? <Button variant={"base"} size={"none"} style={{ backgroundColor: opacity(colors.foreground, 0.1) }} className="p-1 rounded-full">
            <X size={14} color={colors.foreground} onPress={_props.onPress} />
        </Button> : <></>
    }
    const SearchIcon = () => {
        return <Search size={18} color={colors.primary} />
    }


    return <RNESearchBar
        value={searchText}
        onChange={e => setSearchText(e.nativeEvent.text)}
        {...searchBarProps}
        searchIcon={<SearchIcon />}
        clearIcon={<CancelIcon onPress={() => setSearchText("")} />}
        selectionColor={colors.primary}
        placeholderTextColor={colors["muted-foreground"]}
        containerStyle={Object.assign(containerStyle, searchBarProps?.containerStyle)}
        inputContainerStyle={Object.assign(inputContainerStyle, searchBarProps?.inputContainerStyle)}
        inputStyle={Object.assign(inputStyle, searchBarProps?.inputStyle)}
        placeholder="Search ..."
    />;
}