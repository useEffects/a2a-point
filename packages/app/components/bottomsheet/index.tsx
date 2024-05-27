import { BottomSheet as RNEBottomSheet } from "@rneui/themed";
import { Dispatch, ReactNode, SetStateAction } from "react";

export default function BottomSheet(props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, onBackdropPress: () => void, children: ReactNode }) {
    return <RNEBottomSheet
        isVisible={props.open}
        onBackdropPress={props.onBackdropPress}
        backdropStyle={{ backgroundColor: "transparent" }}
        containerStyle={{ backgroundColor: "transparent" }}
        scrollViewProps={{
            keyboardShouldPersistTaps: "handled"
        }}
    >
        {props.children}
    </ RNEBottomSheet>
}