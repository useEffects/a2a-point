import { Amenity, Company, Document, Listing, ListingAmenity, Room, User } from "./types"

// Users

export type SmallUsersCardProps = Pick<User, "id" | "avatar" | "first_name" | "last_name" | "computed_rating"> & { company: Pick<Company, "title" | "avatar" | "id"> | null }

export type MediumUsersCardProps = Pick<User, "id" | "avatar" | "first_name" | "last_name" | "computed_rating" | "tags" | "email" | "last_access" | "phone" | "description" | "plan"> & { company: Pick<Company, "title" | "avatar" | "id"> | null } & { document: Pick<Document, "verified"> | null }

export const smallUsersFields = ["id", "avatar", "first_name", "last_name", "computed_rating", "company.title", "company.avatar", "company.id"]

export const mediumUsersFields = ["id", "avatar", "first_name", "last_name", "computed_rating", "tags", "company.title", "company.avatar", "email", "last_access", "phone", "description", "plan", "document.verified"]


// Listings

export const fullListingCardFields = ["*", "amenities.*, amenities.amenity.*"].concat(mediumUsersFields.map(field => `user_created.${field}`))

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

export const smallLocationFields = ["id", "avatar", "title"]
export const mediumLocationFields = ["id", "avatar", "title", "members.id", "members.rooms_id", "members.directus_users_id.id", "members.directus_users_id.avatar"]