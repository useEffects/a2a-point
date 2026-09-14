import { CompanyStats } from 'app/components/company-stats';
import { SeparatorText } from 'app/components/separator-text';
import { Text } from 'app/components/ui/text';
import { View } from 'react-native';

export const AtYourGlance = () => {
  return (
    <View className="px-4 flex-col gap-4">
      <SeparatorText hideLeft>
        <Text className="font-medium">At your Glance</Text>
      </SeparatorText>
      <CompanyStats className="gap-4" />
    </View>
  );
};
