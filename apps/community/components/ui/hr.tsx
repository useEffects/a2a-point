import { View } from "react-native";
import { cn } from "~/lib/utils";

export const Hr = ({ orientation = "horizontal", className }: { orientation?: "horizontal" | "vertical", className?: string }) => {
    return <View style={{ width: orientation === "horizontal" ? "100%" : 1, height: orientation === "horizontal" ? 1 : "100%" }} className={cn("bg-border", className)} />;
};
