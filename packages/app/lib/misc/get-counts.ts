import directusStore from "app/store/directus"
import { aggregate } from "@directus/sdk"

export const getListingsCountForUser = async (userId: string) => {
    const { rest } = directusStore.getState()
    const getListingsCount = await rest.request(aggregate("listings", {
        aggregate: {
            count: ["*"]
        },
        query: {
            filter: {
                user_created: {
                    _eq: userId
                }
            }
        }
    }))
    return getListingsCount?.[0]!.count as unknown as number
}

export const getFeedbacksCountForUser = async (userId: string) => {
    const { rest } = directusStore.getState()
    const getFeedbacksCount = await rest.request(aggregate("feedbacks", {
        aggregate: {
            count: ["*"]
        },
        query: {
            filter: {
                agent: {
                    _eq: userId
                }
            }
        }
    }))
    return getFeedbacksCount?.[0]!.count as unknown as number
}

export const getListingsCount = async () => {
    const { rest } = directusStore.getState()
    const getListingsCount = await rest.request(aggregate("listings", {
        aggregate: {
            count: ["*"]
        },
    }))
    return getListingsCount?.[0]!.count as unknown as number
}

export const getListingsCountForLocation = async (locationId: string) => {
    const { rest } = directusStore.getState()
    const getListingsCount = await rest.request(aggregate("listings", {
        aggregate: {
            count: ["*"]
        },
        query: {
            filter: {
                location: {
                    _eq: locationId
                }
            }
        }
    }))
    return getListingsCount?.[0]!.count as unknown as number
}

export const getMembersCountForLocation = async (locationId: string) => {
    const { rest } = directusStore.getState()
    const membersCount = await rest.request(aggregate("rooms_directus_users", {
        aggregate: {
            count: ["*"]
        }, query: {
            filter: {
                rooms_id: {
                    _eq: locationId
                }
            }
        }
    }))
    return membersCount?.[0]!.count as unknown as number
}

export const getCompaniesCount = async () => {
    const { rest } = directusStore.getState()
    const companiesCount = await rest.request(aggregate("companies", {
        aggregate: {
            count: ["*"]
        }
    }))
    return companiesCount?.[0]!.count as unknown as number
}

export const getLocationsCount = async () => {
    const { rest } = directusStore.getState()
    const locationsCount = await rest.request(aggregate("rooms", {
        aggregate: {
            count: ["*"]
        },
        query: {
            filter: {
                type: {
                    _eq: "group"
                }
            }
        }
    }))
    return locationsCount?.[0]!.count as unknown as number
}

export const getUsersCount = async () => {
    const { rest } = directusStore.getState()
    const usersCount = await rest.request(aggregate("directus_users", {
        aggregate: {
            count: ["*"]
        }
    }))
    return usersCount?.[0]!.count as unknown as number
}