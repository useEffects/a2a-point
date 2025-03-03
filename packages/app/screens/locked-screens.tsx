import { ArrowUpRight } from 'app/components/icons';
import { Button, ButtonProps } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useRouter } from 'app/hooks/router';
import { cn } from 'app/lib/utils';
import { ReactNode } from 'react';
import { Dimensions, ImageSourcePropType, Platform, View } from 'react-native';
import { Image } from 'expo-image';

type LockedScreenProps = {
  className?: string;
  image: ImageSourcePropType;
  headerTitle: string;
  header?: () => ReactNode;
  title: string;
  description: string;
  bottomComponent?: () => ReactNode;
};

export default function LockedScreen(props: LockedScreenProps) {
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

export const GoToLoginButton = (props: ButtonProps) => {
  const router = useRouter();
  const { colors } = useColorScheme();

  return (
    <Button
      onPress={() => router.push('/auth/login')}
      variant={'default'}
      size={'default'}
      className="flex-row items-center w-full"
      {...props}
    >
      <Text>Take me to login screen</Text>
      <ArrowUpRight
        className="text-primary-foreground"
        color={colors['primary-foreground']}
      />
    </Button>
  );
};

export const GoToLoginComponent = () => {
  const { colors } = useColorScheme();

  return (
    <View className="flex-col gap-1 w-full">
      <Text className="text-sm text-center text-destructive">
        Locked screen! Login to unlock
      </Text>
      <GoToLoginButton />
    </View>
  );
};

export const GoToAccountConsole = () => {
  const router = useRouter();
  const { colors } = useColorScheme();

  return (
    <View className="flex-col gap-1 w-full">
      <Text className="text-sm text-center text-destructive">
        Locked screen! Verify account to unlock
      </Text>
      <Button
        onPress={() => router.push('/account-console')}
        variant={'default'}
        size={'default'}
        className="flex-row items-center w-full"
      >
        <Text>Take me to account console</Text>
        <ArrowUpRight
          className="text-primary-foreground"
          color={colors['primary-foreground']}
        />
      </Button>
    </View>
  );
};
