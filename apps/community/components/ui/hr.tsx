import { View } from "react-native";
import { hairlineWidth } from 'nativewind/theme';

export const Hr = () => {
    return <View style={{ height: hairlineWidth }} className="bg-primary-foreground" />;
};
