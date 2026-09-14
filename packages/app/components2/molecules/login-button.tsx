import { Button, ButtonProps } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useRouter } from 'app/context/router';
import { useColorScheme } from 'app/hooks/color-scheme';
import { ArrowUpRight } from 'lucide-react';
import { View } from 'react-native';

export const GoToLoginComponent = () => {
  return (
    <View className="flex-col gap-1 w-full">
      <Text className="text-sm text-center text-destructive">
        Locked screen! Login to unlock
      </Text>
      <GoToLoginButton />
    </View>
  );
};

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
      <ArrowUpRight color={colors['primary-foreground']} />
    </Button>
  );
};
