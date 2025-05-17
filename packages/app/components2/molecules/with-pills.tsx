import { ReactNode, useState } from 'react';
import { View } from 'react-native';

export const WithPills = ({
  pills,
  children,
}: {
  pills: string[];
  children: (args: {
    activePill: string;
    setActivePill: (pill: string) => void;
  }) => ReactNode;
}) => {
  const [activePill, setActivePill] = useState(pills[0]!);

  return (
    <View className="flex-col gap-4">
      {children({ activePill, setActivePill })}
    </View>
  );
};
