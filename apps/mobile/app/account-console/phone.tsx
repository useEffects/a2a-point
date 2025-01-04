import { ScrollView } from 'app/components/utils/virtual-lists';
import { PhoneVerificationScreen as PhoneVerificationScreenBase } from 'app/screens/account-console/phone';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PhoneVerificationScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerClassName="flex-grow"
      contentContainerStyle={{ paddingTop: top }}
    >
      <PhoneVerificationScreenBase />
    </ScrollView>
  );
}
