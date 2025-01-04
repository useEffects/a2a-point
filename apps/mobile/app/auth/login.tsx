import { ScrollView } from 'app/components/utils/virtual-lists';
import { LoginScreen as LoginScreenBase } from 'app/screens/auth/login';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: top, flex: 1 }}>
      <LoginScreenBase />
    </ScrollView>
  );
}
