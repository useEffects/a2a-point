import { BackButton, Header, HeaderTitle } from 'app/components/header';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { View } from 'react-native';
import * as Linking from 'expo-linking';
import { portfolioUrl, products, ProductType } from 'app/lib/constants';
import userStore from 'app/store/user';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const PremiumCreditsScreen = () => {
  const { user } = userStore();
  const handleBuyPremiumCredits = () => {
    const premiumProductListing = products.find(
      (p) => p.productType === ProductType.premiumListingsQuota,
    )!;
    const link = `${portfolioUrl}/api/pay/${premiumProductListing.stripeCode}/?user_id=${user.id}&isMobile=true`;
    console.log(link);
    Linking.openURL(link);
  };
  return (
    <View className="gap-12 flex-col flex-1">
      <View className="flex-grow p-4 flex-col gap-12 justify-between">
        <Text>
          Premium credits enable you to have your listings featured as premium
          listings!
        </Text>
        <Button onPress={handleBuyPremiumCredits}>
          <Text>Buy premium credit</Text>
        </Button>
      </View>
    </View>
  );
};

export function PremiumCreditsScreenHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <Header height={'auto'}>
      <View
        className="flex-row items-center pb-4"
        style={{ paddingTop: top + 16 }}
      >
        <View className="h-12 flex-row items-center gap-4">
          <BackButton />
          <HeaderTitle>Premium</HeaderTitle>
        </View>
      </View>
    </Header>
  );
}
