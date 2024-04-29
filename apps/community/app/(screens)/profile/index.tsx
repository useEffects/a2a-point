import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Header } from "~/components/header";
import Profile from "~/components/profile";
import { Text } from "~/components/ui/text";
import userStore from "~/store/user";

export default function ProfileScreen() {
  const { user } = userStore()
  const navigator = useNavigation()

  useEffect(() => {
    navigator.setOptions({
      header: () => <Header>
        <View className="flex-row justify-between items-center flex-1">
          <Text>Profile</Text>
          <ThemeToggle />
        </View>
      </Header>
    })
  })

  return <ScrollView>
    <Profile user={user} />
  </ScrollView>;
}