import { CommonFilters } from "app/components/cards/molecules/listings"
import { FilterKeys, FilterType } from "app/screens/listings"

export type RootStackParamList = {
    "app": undefined,
    "listing-detailed": {
        id: string
    },
    "room-detailed": {
        id: string
    },
    "profile-detailed": {
        id: string
    },
    "location-listings": {
        id: string,
    },
    "post-feedback": {
        id: string,
        feedbackId?: string
    },
    "activity": undefined,
    "notifications": undefined,
    "post": undefined,
    "locations-list": undefined,
    "users-list": undefined,
    "company-list": undefined,
}

export type TopTabParamList = {
    "home": undefined,
    "listings": {
        key: FilterKeys,
        id: string
    } | undefined,
    "search": undefined,
    "offPlans": undefined,
    "profile": undefined,
    "login": undefined,
    "chat": undefined,
}