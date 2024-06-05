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
    "notifications": undefined
}

export type TopTabParamList = {
    "home": undefined,
    "search": undefined,
    "offPlans": undefined,
    "profile": undefined,
    "login": undefined,
    "chat": undefined,
    "post": undefined
}