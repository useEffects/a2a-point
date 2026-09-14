import { Stacked } from '../../../components/stacked';
import {
  NotificationsListScreen as NotificationsListScreenComponent,
  NotificationsListScreenHeader,
} from 'app/components/notifications';

export default function NotificationsListScreen() {
  return (
    <Stacked header={() => <NotificationsListScreenHeader />}>
      <NotificationsListScreenComponent />
    </Stacked>
  );
}
