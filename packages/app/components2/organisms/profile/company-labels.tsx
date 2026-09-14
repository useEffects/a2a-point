import { Text } from 'app/components/ui/text';
import { Company, User } from 'app/lib/types';
import { View } from 'react-native';

export const CompanyLabels = () => {
  return (
    <View className="flex-col gap-4 py-4">
      <Text className="text-xl font-semibold">Company</Text>
      <View className="p-4 rounded bg-card border border-solid border-border"></View>
    </View>
  );
};
