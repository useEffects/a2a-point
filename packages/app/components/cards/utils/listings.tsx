import { useRenderCardQuery } from "app/lib/misc/queries";
import { photoListingsFields, smallListingsFields } from "app/lib/props";
import { PhotoListingProps } from "../atoms/photo";
import { CommonFilters, commonFilters } from "../molecules/listings";

export const useSmallListingsQuery = ({ filter = {} }: { filter?: Record<string, any> }) => useRenderCardQuery({
    collection: "listings",
    fields: smallListingsFields,
    filter,
})

export const usePhotoListingsQuery = () => useRenderCardQuery<PhotoListingProps>({
    collection: "listings",
    fields: photoListingsFields,
    filter: commonFilters[CommonFilters.Photo](),
})