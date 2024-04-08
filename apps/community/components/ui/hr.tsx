import { View } from "react-native";
import { cn } from "~/lib/utils";

export const Hr = ({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) => {
    return <View style={{ width: orientation === "horizontal" ? "100%" : 1, height: orientation === "horizontal" ? 1 : "100%" }} className="bg-border" />;
};
