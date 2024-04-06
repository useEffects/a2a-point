import { View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";

export default function Profile() {
  return <View>
    <Text className="text-foreground">Hello</Text>
    <ThemeToggle />
  </View>;
}