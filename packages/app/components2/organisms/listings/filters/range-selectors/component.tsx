import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Banknote, PiggyBank } from 'lucide-react-native';
import { View } from 'react-native';
import {
  NavigationState,
  Route,
  SceneMap,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';
import { RangeSelectorsTabBar } from './tab-bar';
import { rangeSelectorsData } from './utils';
import { PriceScene } from './scenes/price';
import { ComponentType, useState } from 'react';

export const RangeSelectors = () => {
  const { colors } = useColorScheme();
  const [navigationState, setNavigationState] = useState<
    NavigationState<Route>
  >({
    index: 0,
    routes: [...rangeSelectorsData],
  });
  return (
    <View className="rounded-3xl p-4 bg-card border border-solid border-border flex-col gap-4 h-[352]">
      <Text className="text-lg">Select Price & Amneties</Text>
      <TabView
        style={{ height: 200 }}
        renderScene={renderScene}
        navigationState={navigationState}
        onIndexChange={(index) => setNavigationState((s) => ({ ...s, index }))}
        renderTabBar={RangeSelectorsTabBar}
      />
    </View>
  );
};

const renderScene = SceneMap({
  price: PriceScene,
  size: PriceScene,
  bedrooms: PriceScene,
  bathrooms: PriceScene,
  parking: PriceScene,
} as Record<(typeof rangeSelectorsData)[number]['key'], () => JSX.Element>);
