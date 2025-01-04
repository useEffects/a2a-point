import { NotificationsListScreen as NotificationsListScreenBase } from 'app/components/notifications';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsListScreen() {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <NotificationsListScreenBase />
    </ScrollView>
  );
}
