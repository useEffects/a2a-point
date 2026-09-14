import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { cn } from 'app/lib/utils';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

export const BottomLoader = ({
  endReached,
  onEndReached,
}: {
  endReached: boolean;
  onEndReached: () => void;
}) => {
  const { colors } = useColorScheme();
  useEffect(() => {
    if (!endReached) {
      onEndReached();
    }
  }, [endReached, onEndReached]);
  return endReached ? (
    <NomoreItemsToShow />
  ) : (
    <View className="w-full h-20 flex-col justify-center items-center">
      <ActivityIndicator color={colors.info} />
      <Text className="text-center text-info">loading please wait ...</Text>
    </View>
  );
};

export const NomoreItemsToShow = (props: ViewProps) => {
  return (
    <View
      className={cn(
        'w-full h-20 flex-col justify-center items-center',
        props.className,
      )}
    >
      <Text className="text-destructive">No more items to show</Text>
    </View>
  );
};
