import { Stacked } from '../../../components/stacked';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ActivityScreen as ActivityScreenComponent,
  ActivityScreenHeader,
} from 'app/screens/activity';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function ActivityScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => <ActivityScreenHeader />,
    });
  }, [navigation]);

  return (
    <Stacked header={() => <ActivityScreenHeader />}>
      <ActivityScreenComponent />
    </Stacked>
  );
}
