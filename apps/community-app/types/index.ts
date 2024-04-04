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

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  location: string | null;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  avatar: string | null;
  language: string | null;
  tfa_secret: string | null;
  status: "active" | "inactive";
  role: string;
  token: string | null;
  last_access: string;
  last_page: string;
  provider: string;
  external_identifier: string | null;
  auth_data: any;
  email_notifications: boolean;
  appearance: any;
  theme_dark: any;
  theme_light: any;
  theme_light_overrides: any;
  theme_dark_overrides: any;
};

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
