import { Stacked } from '../../components/stacked';
import {
  LoginScreen as LoginScreenComponent,
  LoginScreenHeader,
} from 'app/screens/auth/login';

export default function LoginScreen() {
  return (
    <Stacked header={() => <LoginScreenHeader />}>
      <LoginScreenComponent />
    </Stacked>
  );
}
