import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { Header } from "~/components/header";
import { CommonFilters, RenderListings, bodies, commonFilters } from "~/components/listings-cards/body/listings";
import { ExtraSmallListingCardProps } from "~/components/listings-cards/molecules/extra-small";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

export default function Saved() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header>
        <Text>Saved Listings</Text>
      </Header>
    })
  }, [navigation])

  return <View className="p-4 max-w-xl mx-auto w-full">
    <RenderListings<ExtraSmallListingCardProps>
      filterMethod={commonFilters[CommonFilters.SavedByMe]()}
      render={bodies.extraSmall}
      flatListProps={{
        ItemSeparatorComponent: () => <Separator className="my-4" />,
      }}
    />
  </View>
}
