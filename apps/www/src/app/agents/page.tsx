/** @jsxImportSource react */

import { Agents } from "@/components/client-components/agents";
import { memberRole } from "app/lib/constants";
import { getFeedbacksCountForUser, getListingsCountForUser, renderCardsQuery } from "app/lib/misc/queries";
import { MediumUsersCardProps, mediumUsersFields } from "app/lib/props";

export default async function () {
    const data = await renderCardsQuery<MediumUsersCardProps>({
        collection: "users",
        fields: mediumUsersFields,
        filter: {
            role: {
                _eq: memberRole
            }
        }
    }).then(res => Promise.all(res.map(async (user) => {
        const listingsCount = await getListingsCountForUser(user.id)
        const ratingsCount = await getFeedbacksCountForUser(user.id)
        return { ...user, listingsCount, ratingsCount }
    })))

    return <Agents data={data} />
}
