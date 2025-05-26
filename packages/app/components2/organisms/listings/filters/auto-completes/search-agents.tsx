import {
  ExtraSmallLocationCard,
  ExtraSmallLocationCardSkeleton,
} from 'app/components2/molecules/locations/extra-small/component';
import {
  ExtraSmallLocationCardFields,
  ExtraSmallLocationCardProps,
} from 'app/components2/molecules/locations/extra-small/utils';
import { AutoComplete } from './autocomplete';
import { Building2 } from 'lucide-react-native';
import { useColorScheme } from 'app/hooks/color-scheme';
import { z } from 'zod';

export const SearchLocations = () => {
  const { colors } = useColorScheme();
  return (
    <AutoComplete<ExtraSmallLocationCardProps>
      component={ExtraSmallLocationCard}
      skeletonComponent={ExtraSmallLocationCardSkeleton}
      paramKey="agent"
      placeholderText="Type agent ..."
      queryKey={['users', 'auto complete search for users filter']}
      searchIcon={<Building2 color={colors.foreground} size={18} />}
      titleKey="title"
      renderCardsQueryParams={{
        collection: 'rooms',
        fields: ExtraSmallLocationCardFields,
        filter: {
          type: {
            _eq: 'group',
          },
        },
      }}
      zodSchema={zodSchema}
    />
  );
};

const zodSchema = z.object({
  id: z.string(),
  title: z.string(),
  avatar: z.string().nullable(),
});
