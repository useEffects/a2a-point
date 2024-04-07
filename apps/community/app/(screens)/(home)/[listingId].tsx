import { readItem } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import directusStore from "~/store/directus";
import { Listing, User } from "~/types";

type ListingDetailed = Listing & { user_created: Pick<User, "id" | "avatar" | "first_name" | "email"> }

export default function ListingScreen() {
  const { listingId } = useGlobalSearchParams()
  const navigator = useNavigation()
  const { rest } = directusStore()

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => await rest.request(readItem("listings", listingId as string, {
      fields: ["*", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.email"]
    })),
  }) as { data: ListingDetailed, isLoading: boolean }

  useEffect(() => {
    if (listing?.title) {
      navigator.setOptions({
        headerShown: true,
        headerTitle: listing.title
      })
    }
  }, [listing])

  return isLoading && (
    <View>

    </View>
  );
}