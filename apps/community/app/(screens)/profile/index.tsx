import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import Profile from "~/components/profile";
import userStore from "~/store/user";

export default function ProfileScreen() {
  const { user } = userStore()
  const navigator = useNavigation()

  useEffect(() => {
    navigator.setOptions({
      headerRight: () => <ThemeToggle />
    })
  })

  return <ScrollView>
    <Profile user={user} />
  </ScrollView>;
}