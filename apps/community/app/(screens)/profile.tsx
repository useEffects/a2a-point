import { View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";
import userStore from "~/store/user";

export default function Profile() {
  const { user } = userStore()
  console.log(user)
  return <View>
    <Text className="text-foreground">Hello</Text>
    <ThemeToggle />
  </View>;
}