import { AuthCallbackScreen as Base } from 'app/screens/auth/callback';
import { useLocalSearchParams } from 'expo-router';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();

  return <Base redirect={params.redirect as string} />;
}
