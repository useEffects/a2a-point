import { Screen } from 'app/components2/molecules/screen';
import { ProfileTemplate } from 'app/components2/templates/profile/component';
import { ProfileTemplateProps } from 'app/components2/templates/profile/types';
import { useColorScheme } from 'app/hooks/color-scheme';

export const ProfileScreen = (props: ProfileTemplateProps) => {
  const { colors } = useColorScheme();
  return (
    <Screen
      scrollViewProps={{
        style: { backgroundColor: colors.accent },
      }}
    >
      <ProfileTemplate {...props} />
    </Screen>
  );
};
