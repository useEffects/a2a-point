import { useRenderCardQuery } from "app/lib/misc/queries"
import { SmallLocationCardProps, smallLocationFields } from "app/lib/props"

export const useSmallLocationsQuery = () => {
    return useRenderCardQuery<SmallLocationCardProps>({
        collection: "rooms",
        fields: smallLocationFields,
        filter: {
            type: {
                _eq: "group"
            }
        },
        limit: 15
    })
}