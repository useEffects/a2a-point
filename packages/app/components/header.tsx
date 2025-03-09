import { useColorScheme } from 'app/hooks/color-scheme';
import { cn } from 'app/lib/utils';
import { useNavigation, useRouter } from 'app/hooks/router';
import { MoveLeft } from 'lucide-react-native';
import { ReactNode } from 'react';
import { DimensionValue, Platform, View } from 'react-native';
import { Button } from './ui/button';
import { Text } from './ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Separator } from './ui/separator';

export const headerHeight = 48;

export const BackButton = () => {
  const { colors } = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

  return navigation.canGoBack() ? (
    <Button
      size={'icon'}
      className="rounded-full"
      variant={'ghost'}
      onPress={router.back}
    >
      <MoveLeft size={18} color={colors.primary} />
    </Button>
  ) : (
    <></>
  );
};

export const Header = ({ children }: { children: ReactNode }) => {
  const { top } = useSafeAreaInsets();

  return (
    <>
      <View style={{ paddingTop: top + 16 }} className="bg-card pb-4 px-4">
        <View className="h-12 flex-row items-center">{children}</View>
      </View>
      <Separator />
    </>
  );
};

export const HeaderTitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Text className={cn('md:text-3xl text-2xl font-bold', className)}>
      {children}
    </Text>
  );
};
