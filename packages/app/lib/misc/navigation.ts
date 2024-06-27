import { FilterValue, FilterKeys, FilterParam } from "app/screens/listings"

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
    "location-detailed": {
        id: string,
    },
    "post-feedback": {
        id: string,
        feedbackId?: string
    },
    "activity": undefined,
    "notifications": undefined,
    "post": {
        type: "buy" | "sale" | "give on rent" | "take on rent"
    },
    "locations-list": undefined,
    "users-list": undefined,
    "company-list": undefined,
    "login": undefined,
    "account-console": undefined,
    "members-list": {
        locationId: string
    }
}

export type MainTopTabParamList = {
    "home": undefined,
    "listings": { filters: FilterParam[] } | undefined,
    "offPlans": undefined,
    "profile": undefined,
    "chat": undefined,
}

export type AccountConsoleParamList = {
    "company": undefined,
    "phone": undefined,
    "membership": undefined,
    "verification": undefined,
}