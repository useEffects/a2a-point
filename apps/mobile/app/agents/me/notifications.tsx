import { NotificationsListScreen as NotificationsListScreenBase } from 'app/components/notifications';
import { ScrollView } from 'app/components/utils/virtual-lists';

export default function NotificationsListScreen() {
  return (
    <ScrollView>
      <NotificationsListScreenBase />
    </ScrollView>
  );
}
