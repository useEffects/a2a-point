import { OffPlansScreen as OffPlansScreenBase } from 'app/screens/offplans';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OffPlansScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <View className="flex-1" style={{ paddingTop: top }}>
      <OffPlansScreenBase />
    </View>
  );
}
