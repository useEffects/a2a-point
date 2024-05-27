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
    "activity": undefined
}

export type TopTabParamList = {
    "home": undefined,
    "search": undefined,
    "notifications": undefined,
    "profile": undefined,
    "login": undefined,
    "chat": undefined,
    "post": undefined
}