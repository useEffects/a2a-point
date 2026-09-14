import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { cn } from 'app/lib/utils';
import { GoToLoginComponent } from 'app/screens/locked-screens';
import { Dimensions, ImageSourcePropType, View } from 'react-native';
import { Image } from 'expo-image';
import { ReactNode } from 'react';

export function LockedScreen(props: LockedScreenProps) {
  const { width, height } = Dimensions.get('window');
  const Bottom = props.bottomComponent;

  return (
    <View className="flex-1 relative">
      <Image
        source={props.image}
        alt="locked screen bg"
        style={{
          width,
          height,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
        }}
      />
      <View
        style={{ opacity: 0.95 }}
        className={cn('absolute top-0 left-0 -bottom-4 right-0 bg-background')}
      />
      <View className="flex-grow px-4 flex-col justify-center max-w-md mx-auto">
        <View className="flex-col gap-4">
          <Text className="text-2xl font-bold text-primary text-center">
            {props.title}
          </Text>
          <Separator />
          <Text className="text-subtext text-center">{props.description}</Text>
        </View>
      </View>
      <View className="p-4 w-full md:max-w-sm mx-auto native:max-w-none">
        {Bottom ? <Bottom /> : <GoToLoginComponent />}
      </View>
    </View>
  );
}

type LockedScreenProps = {
  className?: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
  bottomComponent?: () => ReactNode;
};
