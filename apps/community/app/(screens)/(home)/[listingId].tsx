import { createItem, readItem, readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { CommonFilters, RenderListings, bodies, commonFilters } from "~/components/listings-cards/body/listings";
import { FullListingCard, FullListingDetailed } from "~/components/listings-cards/molecules/full";
import { SmallListingCardProps } from "~/components/listings-cards/molecules/small";
import { Button } from "~/components/ui/button";
import { Hr } from "~/components/ui/hr";
import { Text } from "~/components/ui/text";
import { queryClient } from "~/index";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { CardsHeader } from ".";

export default function ListingScreen() {
  const { listingId } = useGlobalSearchParams()
  const { user } = userStore()
  const navigator = useNavigation()
  const { rest } = directusStore()

  const viewedByQueryKey = ["viewed_by", listingId]
  const { data: viewedBy, isLoading: viewedByLoading } = useQuery({
    queryKey: viewedByQueryKey,
    queryFn: async () => await rest.request(readItems("listings_directus_users_1", {
      filter: {
        listings_id: {
          _eq: listingId
        }
      }
    })),
    initialData: null
  }) as { data: { id: string, listings_id: string, directus_users_id: string }[], isLoading: boolean }

  useEffect(() => {
    const addNewViewedBy = async () => {
      if (viewedBy && !viewedBy.length) {
        const res = await rest.request(createItem("listings_directus_users_1", {
          listings_id: listingId,
          directus_users_id: user.id
        }))
        console.log(res)
        queryClient.setQueryData(viewedByQueryKey, [res])
      }
    }
    addNewViewedBy()
  }, [viewedBy])

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => await rest.request(readItem("listings", listingId as string, {
      fields: ["*", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email", "amenities.additional_value", "amenities.amenities_id.*"]
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

  return !isLoading && listing && (
    <ScrollView className="flex-col" contentContainerClassName="items-center gap-4 py-4">
      <View className="web:max-w-lg">
        {Object.keys(listing).length && <FullListingCard {...listing} />}
        <Hr />
        <CardsHeader label="Featured" route={{ pathname: "/discover", params: { filter: CommonFilters.Featured } }} />
        <RenderListings<SmallListingCardProps> render={bodies.small} filterMethod={commonFilters[CommonFilters.Featured]()} flatListProps={{ horizontal: true }} />
      </View>
    </ScrollView>
  );
}