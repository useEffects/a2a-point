import { Header } from 'app/components/header';
import { Text } from 'app/components/ui/text';
import { OffPlans } from 'app/screens/offplans';
import { View } from 'react-native';

export default function OffPlansScreen() {
    return <View className='flex-1'>
        <Header>
            <Text className='text-xl font-bold'>Off Plans</Text>
        </Header>
        <OffPlans />
    </View>;
}