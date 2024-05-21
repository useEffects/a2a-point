import { useNavigation as useReactNavigation } from '@react-navigation/native'
import { RootStackParamList } from 'app/lib/misc/navigation'
import { StackNavigationProp } from '@react-navigation/stack'

export default function useNavigation() {
    return useReactNavigation<StackNavigationProp<RootStackParamList>>()
}