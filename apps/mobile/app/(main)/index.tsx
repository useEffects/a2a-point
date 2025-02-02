import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen as HomeScreenBase } from 'app/screens/home';
import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Header } from 'app/components/header';
import { Text } from 'app/components/ui/text';

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: (
        <Header shouldntGoBack>
          <Text className="text-xl font-bold">A2APoint</Text>
        </Header>
      ),
      headerShown: true,
    });
  }, [navigation]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: top,
      }}
    >
      <HomeScreenBase />
    </ScrollView>
  );
}
