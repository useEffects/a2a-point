import { BottomSheet as RNEBottomSheet } from "@rneui/themed";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Separator } from "../ui/separator";
import { Platform } from "react-native";

export default function BottomSheet(props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, onBackdropPress: () => void, children: ReactNode }) {
    return <RNEBottomSheet
        isVisible={props.open}
        onBackdropPress={props.onBackdropPress}
        backdropStyle={{ backgroundColor: "transparent" }}
        containerStyle={{ backgroundColor: "transparent" }}
        scrollViewProps={{
            bounces: false,
            overScrollMode: "never",
            bouncesZoom: false,
            alwaysBounceHorizontal: false,
            alwaysBounceVertical: false,
            showsVerticalScrollIndicator: Platform.OS === "web",
            showsHorizontalScrollIndicator: Platform.OS === "web",
        }}
    >
        <Separator />
        {props.children}
    </ RNEBottomSheet>
}