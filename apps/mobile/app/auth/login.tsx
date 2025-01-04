import { ScrollView } from 'app/components/utils/virtual-lists';
import { LoginScreen as LoginScreenBase } from 'app/screens/auth/login';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ paddingTop: top, paddingBottom: bottom }}
      className="flex-1"
    >
      <LoginScreenBase />
    </ScrollView>
  );
}
