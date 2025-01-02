import { LoginScreen as LoginScreenBase } from 'app/screens/auth/login';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }} className='flex-1'>
      <LoginScreenBase />
    </View>
  );
}
