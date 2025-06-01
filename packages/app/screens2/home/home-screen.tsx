import { Header, HeaderTitle } from 'app/components/header';
import { directusUrl, portfolioUrl } from 'app/lib/constants';
import { View } from 'react-native';
import Logo from 'app/components/svg/logo';
import { Screen } from 'app/components2/molecules/screen';
import { HomeScreenTemplate } from 'app/components2/templates/home/template';

export function HomeScreen() {
  return (
    <Screen>
      <HomeScreenTemplate />
    </Screen>
  );
}

export const HomeScreenHeader = () => {
  return (
    <Header>
      <View className="flex-row items-center gap-2 justify-between flex-1">
        <HeaderTitle>A2A Point</HeaderTitle>
        <View className="rounded-full bg-light p-1 border-border">
          <Logo height={32} width={32} />
        </View>
      </View>
    </Header>
  );
};

const externalLinks = [
  {
    label: 'Website',
    href: portfolioUrl,
  },
  {
    label: 'Dashboard',
    href: directusUrl,
  },
  {
    label: 'Courses',
    href: `${directusUrl}/courses`,
  },
  {
    label: 'News',
    href: `${directusUrl}/news`,
  },
];
