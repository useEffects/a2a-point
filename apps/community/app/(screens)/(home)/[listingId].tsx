import { readItem } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { RenderListings, bodies, sortFeatured } from "~/components/listings-cards/body";
import { FullListingCard, FullListingDetailed } from "~/components/listings-cards/molecules/full";
import { Hr } from "~/components/ui/hr";
import { Text } from "~/components/ui/text";
import directusStore from "~/store/directus";


export default function ListingScreen() {
  const { listingId } = useGlobalSearchParams()
  const navigator = useNavigation()
  const { rest } = directusStore()

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => await rest.request(readItem("listings", listingId as string, {
      fields: ["*", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.email", "amenities.additional_value", "amenities.amenities_id.*"]
    })),
  }) as { data: FullListingDetailed, isLoading: boolean }

  useEffect(() => {
    if (listing?.title) {
      navigator.setOptions({
        headerShown: true,
        headerTitle: listing.title
      })
    }
  }, [listing])

  return !isLoading && (
    <ScrollView contentContainerStyle={{ gap: 16, padding: 8 }}>
      <FullListingCard {...listing} />
      <Hr />
      <Text>Browse Featured Listings</Text>
      <RenderListings render={bodies.small} filter={sortFeatured} horizontal />
    </ScrollView>
  );
}