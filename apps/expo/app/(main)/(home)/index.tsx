import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { ConfirmedAdvertisementCardProps, mediumCardListingsWithAds, RenderMediumListingsAds } from "app/components/cards/queries/listings";
import InfiniteList from "app/components/infinite";
import { Separator } from "app/components/ui/separator";
import { ListingCardMetrics } from "app/lib/props";

export default function () {
    return <InfiniteList<(MediumListingCardProps & ListingCardMetrics) | ConfirmedAdvertisementCardProps>
        initialItems={[]}
        component={({ item }) => <RenderMediumListingsAds item={item} />}
        queryFn={mediumCardListingsWithAds}
        queryKey={["Listings page medium cards with ads"]}
        flatListProps={{
            ItemSeparatorComponent: () => <Separator />,
            contentContainerClassName: "max-w-xl"
        }}
        infinite
    />
}