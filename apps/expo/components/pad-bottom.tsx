import { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PadBottom({ children }: { children: ReactNode }) {
    const insets = useSafeAreaInsets()

    return <View style={{ paddingBottom: insets.bottom, flex: 1 }}>
        {children}
    </View>
}