import { ExtraSmallListingCardProps } from "app/components/cards/atoms/extra-small"
import { MediumListingCardProps } from "app/components/cards/atoms/medium"
import { PhotoListingProps } from "app/components/cards/atoms/photo"
import { SmallListingCardProps } from "app/components/cards/atoms/small"
import { DotSeparatedKeys } from "./helpers"
import { Amenity, Company, Document, Listing, Room, User } from "./types"

// Users

export type UsersCardMetrics = { ratingsCount: number, listingsCount: number }

export type SmallUsersCardProps = Pick<User, "id" | "avatar" | "first_name" | "last_name" | "computed_rating"> & { company: Pick<Company, "title" | "avatar" | "id"> | null }

export type MediumUsersCardProps = Pick<User, "id" | "avatar" | "first_name" | "last_name" | "computed_rating" | "tags" | "email" | "last_access" | "phone" | "description" | "plan"> & { company: Pick<Company, "title" | "avatar" | "id"> | null } & { document: Pick<Document, "verified"> | null }

export const smallUsersFields = ["id", "avatar", "first_name", "last_name", "computed_rating", "company.title", "company.avatar", "company.id"]

export const mediumUsersFields = ["id", "avatar", "first_name", "last_name", "computed_rating", "tags", "company.title", "company.avatar", "email", "last_access", "phone", "description", "plan", "document.verified"]


// Listings

export type ListingCardMetrics = { views: string | null, saves: string | null }

export const fullListingCardFields = ["*", "amenities.*, amenities.amenity.*"].concat(mediumUsersFields.map(field => `user_created.${field}`))

export const extraSmallListingsFields: DotSeparatedKeys<ExtraSmallListingCardProps>[] = ["id", "title", "budget", "deal_type", "price"];

export const smallListingsFields: DotSeparatedKeys<SmallListingCardProps>[] = ["id", "title", "budget", "deal_type", "user_created.id", "user_created.avatar", "date_created", "location.id", "location.title", "location.avatar", "tags", "price"];

export const mediumListingsFields: DotSeparatedKeys<MediumListingCardProps>[] = ["id", "title", "deal_type", "date_created", "budget", "description", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "location.avatar", "location.avatar", "location.id", "location.title", "price"];

export const photoListingsFields: DotSeparatedKeys<PhotoListingProps>[] = ["id", "title", "budget", "photo_1", "photo_2", "photo_3", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "price"];
export type DetailedAmenity = { amenity: Amenity, additional_detail: string }

export type FullListingDetailedProps = Listing & { user_created: MediumUsersCardProps } & { amenities: DetailedAmenity[] }


// Locations
export type SmallLocationCardProps = Pick<Room, "id" | "avatar" | "title">
export type MediumLocationCardProps = Pick<Room, "id" | "avatar" | "title"> & {
    members: {
        id: string,
        rooms_id: string,
        directus_users_id: {
            id: string
            avatar: string,
        }
    }[]
}
export type LocationCardMetrics = { membersCount: number, listingsCount: number }

export const smallLocationFields = ["id", "avatar", "title"]
export const mediumLocationFields = ["id", "avatar", "title", "members.*", "members.directus_users_id.id", "members.directus_users_id.avatar"]