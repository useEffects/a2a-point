import { View } from "react-native";
import { CommonFilters, RenderListings, bodies, commonFilters } from "~/components/listings-cards/body/listings";
import { ExtraSmallListingCardProps } from "~/components/listings-cards/molecules/extra-small";
import { Hr } from "~/components/ui/hr";

export default function Saved() {
  return <View className="p-4 max-w-xl mx-auto w-full">
    <RenderListings<ExtraSmallListingCardProps>
      filterMethod={commonFilters[CommonFilters.SavedByMe]()}
      render={bodies.extraSmall}
      flatListProps={{
        ItemSeparatorComponent: () => <Hr className="my-4" />,
      }}
    />
  </View>
}
