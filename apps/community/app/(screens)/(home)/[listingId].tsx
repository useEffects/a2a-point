import { createItem, readItem, readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { CommonFilters, RenderListings, bodies, commonFilters } from "~/components/listings-cards/body/listings";
import { FullListingCard, FullListingDetailed } from "~/components/listings-cards/molecules/full";
import { SmallListingCardProps } from "~/components/listings-cards/molecules/small";
import { queryClient } from "~/index";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { CardsHeader } from ".";
import { Separator } from "~/components/ui/separator";
import { Header } from "~/components/header";
import { Text } from "~/components/ui/text";
import { shortString } from "~/lib/helpers";

export default function ListingScreen() {
  const { listingId } = useGlobalSearchParams()
  const { user } = userStore()
  const navigator = useNavigation()
  const { rest } = directusStore()
  const [ready, setReady] = useState(false)
  const [listing, setListing] = useState<FullListingDetailed | null>(null)

  useEffect(() => {
    if (listing?.title) {
      navigator.setOptions({
        header: () => <Header>
          <Text>{shortString(listing.title, 40)}</Text>
        </Header>
      })
    }
  }, [listing])

  useEffect(() => {
    if(!listingId) return
    async function addViewCount() {
      try {
        const viewedBy = await queryClient.fetchQuery({
          queryKey: ["listings_directus_users_1", listingId, user.id, "viewed_by"],
          queryFn: async () => await rest.request(readItems("listings_directus_users_1", {
            filter: {
              listings_id: {
                _eq: listingId
              },
              directus_users_id: {
                _eq: user.id
              }
            }
          }))
        })
        if (!viewedBy?.length) {
          await rest.request(createItem("listings_directus_users_1", {
            listings_id: listingId,
            directus_users_id: user.id
          }))
        }
        const _listing = await rest.request(readItem("listings", listingId as string, {
          fields: ["*", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email", "amenities.additional_value", "amenities.amenities_id.*"]
        }))
        setListing(_listing as FullListingDetailed)
      } catch (error) {
        router.replace("/")
      }
    }
    addViewCount()
  }, [listingId])

  return listing && (
    <ScrollView className="flex-col" contentContainerClassName="items-center gap-4 py-4">
      <View className="web:max-w-lg">
        {Object.keys(listing).length && <FullListingCard {...listing} />}
        <Separator />
        <CardsHeader label="Featured" route={{ pathname: "/discover", params: { filter: CommonFilters.Premium } }} />
        <RenderListings<SmallListingCardProps> render={bodies.small} filterMethod={commonFilters[CommonFilters.Premium]()} flatListProps={{ horizontal: true }} />
      </View>
    </ScrollView>
  );
}