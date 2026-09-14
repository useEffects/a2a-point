import { AuthCallbackScreen as AuthCallbackScreenBase } from 'app/screens/auth/callback';
import { useLocalSearchParams } from 'app/context/router';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();

  return <AuthCallbackScreenBase redirect={params.redirect as string} />;
}
