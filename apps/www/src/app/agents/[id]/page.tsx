/** @jsxImportSource react */

import { ProfileScreen } from "@/screens/profile"
import { Company, User, Document } from "app/lib/types"
import { directusUrl, memberRole, portfolioUrl } from "app/lib/constants"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"
import { fetchAllData } from "@/lib/helpers"
import { buildAssetUrl } from "app/lib/helpers"
import { Metadata } from "next"

const fetchAgent = async (id: string) => {
    const { token } = directusStore.getState()

    return queryClient.fetchQuery({
        queryKey: ["Fetch Profile Data", id],
        queryFn: async () => await fetch(`${directusUrl}/users/${id}/?fields=${["*", "company.*", "document.*"].join(",")}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => res.data) as Promise<User & { company: Company | null } & { document: Document | null }>,
    })
}

export const revalidate = 60

export default async function agentDetailed ({ params }: { params: { id: string } }) {
    const { id } = params
    const data = await fetchAgent(id)

    return <ProfileScreen user={data} company={data.company} document={data.document} />
}

export async function generateStaticParams() {
    return fetchAllData<{ id: string }>("users", {
        role: {
            _eq: memberRole
        }
    }, ["id"])
}

export async function generateMetaData({ params }: { params: { id: string } }) {
    const {id} = params
    const agent = await fetchAgent(id)
    const agentImage = agent.avatar
    const image = agentImage ? buildAssetUrl(agentImage) : "https://a2apoint-misc.nyc3.digitaloceanspaces.com/app/logo.svg"

    return {
        title: agent.first_name,
        description: '',
        metadataBase: new URL(`${portfolioUrl}/agents/${id}`),
        icons: image,
        openGraph: {
            title: agent.first_name,
            description: '',
            type: "website",
            url: `${portfolioUrl}/agents/${id}`,
            locale: "en_US",
            images: {
                url: image,
            }
        },
        twitter: {
            title: agent.first_name,
            images: image
        }
    } as Metadata
}