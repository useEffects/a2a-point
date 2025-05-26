import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Banknote, PiggyBank } from 'lucide-react-native';
import { View } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { RangeSelectorsTabBar } from './tab-bar';
import { rangeSelectorsData } from './utils';

export const RangeSelectors = () => {
  const { colors } = useColorScheme();
  return (
    <View className="rounded-3xl p-4 bg-card border border-solid border-border flex-col gap-4">
      <Text className='text-lg'>Select Price & Amneties</Text>
      <TabView
        renderScene={() => <></>}
        navigationState={{ index: 0, routes: rangeSelectorsData }}
        onIndexChange={() => {}}
        renderTabBar={RangeSelectorsTabBar}
      />
    </View>
  );
};
