import { ScrollView } from 'app/components/utils/virtual-lists';
import { VerificationApplyScreen as VerificationApplyScreenBase } from 'app/screens/account-console/verification-apply';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerificationScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerClassName="flex-grow"
      contentContainerStyle={{ paddingTop: top }}
    >
      <VerificationApplyScreenBase />
    </ScrollView>
  );
}
