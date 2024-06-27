import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { CompositeNavigationProp, useNavigation as useReactNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountConsoleParamList, MainTopTabParamList, RootStackParamList } from 'app/lib/misc/navigation';

type AppNavigationProp = CompositeNavigationProp<
    StackNavigationProp<RootStackParamList>,
    MaterialTopTabNavigationProp<MainTopTabParamList>
>;

export default function useNavigation() {
    return useReactNavigation<AppNavigationProp>()
}