import { Dimensions, View } from 'react-native';
import { ProfileTemplateProps } from './types';
import { Text } from 'app/components/ui/text';
import { CompanyLabels } from 'app/components2/organisms/profile/company-labels';
import { profileTabBarRoutes } from 'app/components2/organisms/profile/utils';
import {
  LucideIcon,
  BriefcaseBusiness,
  TrendingUp,
  MessageSquare,
} from 'lucide-react-native';
import { TabBarWithIcon } from 'app/components2/molecules/tabbar-icon';
import { SceneMap, TabView } from 'react-native-tab-view';
import { FC, useState } from 'react';
import { ListingsPosted } from 'app/components2/organisms/profile/listings-posted';

export const ProfileTemplate = ({
  user,
  company,
  document,
}: ProfileTemplateProps) => {
  const [index, setIndex] = useState(0);
  const { height: windowHeight } = Dimensions.get('window');
  return (
    <View
      className="bg-background rounded-tr-3xl rounded-tl-3xl p-4"
      style={{ height: windowHeight - 96 - 32 - 8 }}
    >
      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderTabBar={TabBar}
        renderScene={renderScene}
      />
    </View>
  );
};

type KeyType = (typeof profileTabBarRoutes)[number]['key'];

const iconMap: Record<KeyType, LucideIcon> = {
  first: BriefcaseBusiness,
  second: TrendingUp,
  third: MessageSquare,
};

const routes = profileTabBarRoutes.map((r) => ({ ...r }));

const TabBar = TabBarWithIcon(routes, iconMap);

const renderScene = SceneMap({
  first: CompanyLabels,
  second: ListingsPosted,
  third: CompanyLabels,
} as Record<KeyType, FC>);
