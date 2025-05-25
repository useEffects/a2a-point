import { SeparatorText } from 'app/components/separator-text';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { directusUrl, portfolioUrl } from 'app/lib/constants';
import opacity from 'hex-color-opacity';
import { ExternalLink } from 'lucide-react-native';
import { View } from 'react-native';
import * as Linking from 'expo-linking';

export const QuickLinks = () => {
  const { colors } = useColorScheme();
  return (
    <View className="flex-col gap-4 px-4">
      <SeparatorText hideLeft>
        <Text className="font-medium">Quick links</Text>
      </SeparatorText>
      <View className="flex-row justify-between">
        {externalLinks.map(({ label, href }, index) => (
          <Button
            key={index}
            variant="base"
            size="none"
            style={{ backgroundColor: opacity(colors.info, 0.1) }}
            className="flex-row gap-1 py-1 px-2 rounded"
            onPress={() => Linking.openURL(href)}
          >
            <Text className="text-info">{label}</Text>
            <ExternalLink size={18} className="text-info" color={colors.info} />
          </Button>
        ))}
      </View>
    </View>
  );
};

const externalLinks = [
  {
    label: 'Website',
    href: portfolioUrl,
  },
  {
    label: 'Dashboard',
    href: directusUrl,
  },
  {
    label: 'Courses',
    href: `${directusUrl}/courses`,
  },
  {
    label: 'News',
    href: `${directusUrl}/news`,
  },
];
