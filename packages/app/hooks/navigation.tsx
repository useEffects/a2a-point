import { useNavigation as useReactNavigation, CompositeNavigationProp } from '@react-navigation/native'
import { RootStackParamList, TopTabParamList } from 'app/lib/misc/navigation'
import { StackNavigationProp } from '@react-navigation/stack'
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';

type AppNavigationProp = CompositeNavigationProp<
    StackNavigationProp<RootStackParamList>,
    MaterialTopTabNavigationProp<TopTabParamList>
>;

export default function useNavigation() {
    return useReactNavigation<AppNavigationProp>()
}