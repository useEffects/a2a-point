import { Text } from 'app/components/ui/text';
import { Dimensions, Image, Platform, View } from 'react-native';
import { Header, HeaderTitle } from 'app/components/header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'app/components/ui/card';
import OffplansImgLight from 'app/assets/locked-screens/light/offplans.jpg';
import OffplansImgDark from 'app/assets/locked-screens/dark/offplans.jpg';
import { useColorScheme } from 'app/hooks/color-scheme';

export function OffPlansScreen() {
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const { isDarkColorScheme } = useColorScheme();
  const { width, height } = Platform.select({
    web: {
      width: '100%',
      height: '100%',
    },
    default: {
      width: windowWidth,
      height: windowHeight,
    },
  });

  return (
    <View className="flex-1 relative">
      <View className="absolute top-0 left-0 right-0 bottom-0">
        {/** @ts-ignore */}
        <Image
          source={isDarkColorScheme ? OffplansImgDark : OffplansImgLight}
          alt=""
          width={width}
          height={height}
        />
      </View>
      <View className="flex-grow">
        <Card className="self-start w-full rounded-none">
          <CardHeader>
            <CardTitle className="text-success">
              Offplans coming soon!
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 flex-col items-center gap-4">
            <Text>
              Streamline your property sales with A2A POINT. Find curated UAE
              off-plan listings (global coming soon!) and craft personalized
              presentations in one click. Boost efficiency, impress clients, and
              close more deals.
            </Text>
          </CardContent>
        </Card>
        <View className="mt-auto bg-success h-10 native:h-12 rounded flex-col justify-center m-4">
          <Text className="text-success-foreground text-center font-medium">
            Coming soon
          </Text>
        </View>
      </View>
    </View>
  );
}

export function OffplansScreenHeader() {
  return (
    <Header>
      <HeaderTitle>Off plans</HeaderTitle>
    </Header>
  );
}
