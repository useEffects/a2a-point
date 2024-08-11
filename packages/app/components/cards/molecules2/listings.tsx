import { AdvertisementCard, AdvertisementCardProps } from "app/components/cards/atoms/advertisements";
import { MediumListingCard, MediumListingCardProps } from "app/components/cards/atoms/medium";
import { queryFnType } from "app/components/infinite";
import { defaultLimit } from "app/lib/constants";
import { getListingMetrics, renderCardsQuery, renderCardsQuery2 } from "app/lib/misc/queries";
import { ListingCardMetrics, mediumListingsFields } from "app/lib/props";

export const IS_AD_TYPE = Symbol("isAdType")
export type ConfirmedAdvertisementCardProps = AdvertisementCardProps & { [IS_AD_TYPE]: boolean }

export const mediumCardListingsWithAds: queryFnType<(MediumListingCardProps & ListingCardMetrics) | ConfirmedAdvertisementCardProps> = async (apiOptions) => {
    const { limit = defaultLimit, offset = 0 } = apiOptions
    const currentPage = Math.floor(offset / limit)

    const adsLimit = limit / 5
    const adsOffset = currentPage * adsLimit

    const listings = await renderCardsQuery2<MediumListingCardProps>({
        collection: "listings",
        ...apiOptions,
    }).then(res => Promise.all(res.map(async r => {
        const metrics = await getListingMetrics(r.id)
        return { ...r, ...metrics }
    })))
    const ads = await renderCardsQuery2<AdvertisementCardProps>({
        collection: "advertisements",
        fields: ["id", "caption", "title", "photo", "link_to_open", "date_created", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email"],
        filter: {
            isActive: {
                _eq: true
            }
        },
        sort: ["-date_created"],
        limit: adsLimit,
        offset: adsOffset,
    }).then(res => res.map(r => ({ ...r, [IS_AD_TYPE]: true })))

    console.log(listings.length, ads.length, currentPage)

    return mergeArraysRandomly(listings, ads)
}

export const RenderMediumListingsAds = (props: (MediumListingCardProps & ListingCardMetrics) | ConfirmedAdvertisementCardProps) => {
    function isAdType(item: any): item is ConfirmedAdvertisementCardProps {
        return "caption" in item
    }

    if (isAdType(props)) {
        return <AdvertisementCard {...props} />
    } else {
        return <MediumListingCard {...props} />
    }
}

function mergeArraysRandomly<T1, T2>(array1: T1[], array2: T2[]): (T1 | T2)[] {
    const result: (T1 | T2)[] = [];
    let i = 0;
    let j = 0;

    if (array1.length > 0) {
        result.push(array1[i]!);
        i++;
    }

    while (i < array1.length && j < array2.length) {
        if (Math.random() < 0.5) {
            result.push(array1[i]!);
            i++;
        } else {
            result.push(array2[j]!);
            j++;
        }
    }

    while (j < array2.length) {
        result.push(array2[j]!);
        j++;
    }

    while (i < array1.length) {
        result.push(array1[i]!);
        i++;
    }

    return result;
}