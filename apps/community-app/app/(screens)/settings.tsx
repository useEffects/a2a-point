import { View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";

export default function Settings() {
  return <View>
    <Text className="text-black">Hello</Text>
    <ThemeToggle />
  </View>;
}
