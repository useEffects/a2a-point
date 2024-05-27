import { StringToBoolean } from "class-variance-authority/dist/types";

export type File = {
    id: string;
    storage: string;
    filename_disk: string;
    filename_download: string;
    title: string;
    type: string;
    folder: string;
    uploaded_by: string;
    uploaded_on: string;
    modified_by: string | null;
    modified_on: string;
    charset: string | null;
    filesize: number;
    width: number;
    height: number;
    duration: number | null;
    embed: string | null;
    description: string | null;
    location: string | null;
    tags: string[] | null;
    metadata: Record<string, any>;
    focal_point_x: number | null;
    focal_point_y: number | null;
};

export type Amenity = {
    id: number,
    icon: string,
    label: string
}

export type ListingAmenity = {
    id: number;
    listings_id: string;
    amenities_id: number;
    additional_value: null | string;
};

export type Listing = {
    id: string;
    status: string;
    sort: null;
    user_created: User;
    date_created: string;
    date_updated: string;
    title: string;
    type: string;
    deal_type: string;
    tags: string[];
    bathrooms: number;
    bedrooms: number;
    garages: number;
    floors: number;
    price: number;
    carpet_area: number;
    expected_broker_fees: number;
    address: string;
    description: string;
    mode_of_payments: string[];
    comment_room: null;
    featured: boolean;
    amenities: ListingAmenity[];
    saved_by: any[];
    viewed_by: any[];
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
    type: "group" | "dm";
    members: string[];
    title: string | null;
    user_created: string;
    avatar: string | null;
};

export type Message = {
    id: string;
    content: string;
    date_created: string;
    assets: string[] | null;
    room: string;
    user_created: string;
};

export type Advertisement = {
    id: string;
    sort?: any;
    user_created: string;
    date_created: string;
    title: string;
    photo: string;
    caption: string;
    isActive: boolean;
}

export type Notification = {
    id: number | string;
    timestamp: string;
    status: "inbox" | "archived";
    recipient: string;
    sender: string;
    subject: string;
    message: string;
    collection: string;
    item: string;
};

export type Feedback = {
    id: string;
    date_created: string;
    user_created: string;
    rating: number;
    content: string;
    agent: string;
}