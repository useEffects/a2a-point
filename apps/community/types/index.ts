export type Listing = {
    id: number;
    status: string;
    sort: null | any;
    user_created: string;
    date_created: string;
    user_updated: null | string;
    date_updated: null | string;
    title: string;
    type: string;
    tags: string[];
    location: string;
    visibility: null | any;
    photo: string;
    bathrooms: number;
    bedrooms: number;
    garages: number;
    floors: number;
    price: number;
    carpet_area: number;
    expected_broker_fees: number;
    mode_of_payment: string;
};

export type SocialMedia = {
    social_media: string;
    link: string;
}

export type WorkExperience = {
    company_name: string;
    title: string;
    company_logo: string;
    location: string;
    description: string;
    start_date: string;
    end_date: string | null;
}

export type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string | null;
    location: string | null;
    title: string | null;
    description: string | null;
    tags: string[] | null;
    avatar: string;
    language: string | null;
    tfa_secret: string | null;
    status: string;
    role: string;
    token: string;
    last_access: string;
    last_page: string;
    provider: string;
    external_identifier: string;
    auth_data: string;
    email_notifications: boolean;
    appearance: any | null;
    theme_dark: any | null;
    theme_light: any | null;
    theme_light_overrides: any | null;
    theme_dark_overrides: any | null;
    social_media: SocialMedia[];
    work_experience: WorkExperience[];
}


export type Room = {
    date_created: string;
    id: string;
    isGroup: boolean;
    members: string[];
    messages: string[];
    title: string | null;
    user_created: string;
    avatar: string;
};

export type Message = {
    id: string;
    content: string;
    date_created: string;
    image: string | null;
    room: string;
    user_created: string;
};
