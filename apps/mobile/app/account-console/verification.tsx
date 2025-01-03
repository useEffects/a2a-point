import { ScrollView } from 'app/components/utils/virtual-lists';
import { VerificationApplyScreen as VerificationApplyScreenBase } from 'app/screens/account-console/verification-apply';

export default function VerificationScreen() {
  return (
    <ScrollView contentContainerClassName="flex-grow">
      <VerificationApplyScreenBase />
    </ScrollView>
  );
}
