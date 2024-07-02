/** @jsxImportSource react */

import { Agents } from "@/components/client-components/agents";
import { memberRole } from "app/lib/constants";
import { renderCardsQuery } from "app/lib/misc/queries";
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
    })

    return <Agents data={data} />
}
