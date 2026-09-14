import { Header, HeaderTitle } from 'app/components/header';
import Logo from 'app/components/svg/logo';
import { View } from 'react-native';

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
