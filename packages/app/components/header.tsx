import { useColorScheme } from 'app/hooks/color-scheme';
import { cn } from 'app/lib/utils';
import { useNavigation, useRouter } from 'app/hooks/router';
import { MoveLeft } from 'lucide-react-native';
import { ReactNode } from 'react';
import { DimensionValue, Platform, View } from 'react-native';
import { Button } from './ui/button';
import { Text } from './ui/text';

export const headerHeight = 48;

export const BackButton = () => {
  const { colors } = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

  return navigation.canGoBack() ? (
    <Button
      size={'icon'}
      className="rounded-full w-8 h-8"
      variant={'ghost'}
      onPress={router.back}
    >
      <MoveLeft size={18} color={colors.primary} />
    </Button>
  ) : (
    <></>
  );
};

export const Header = ({
  children,
  height = headerHeight,
  className,
  shouldntGoBack,
}: {
  children: ReactNode;
  height?: DimensionValue;
  className?: string;
  shouldntGoBack?: boolean;
}) => {
  return (
    <View
      className={cn('flex-row items-center px-4 gap-2 bg-card', className)}
      style={{
        height: Platform.select({
          native: height,
          default: 72,
        }),
      }}
    >
      {Platform.OS === 'web' || shouldntGoBack ? <></> : <BackButton />}
      {children}
    </View>
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
    <Text className={cn('md:text-3xl text-xl font-bold', className)}>
      {children}
    </Text>
  );
};
