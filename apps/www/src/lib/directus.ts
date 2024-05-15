import { createDirectus, rest, staticToken } from "@directus/sdk";
import { directusToken, directusUrl } from "./constants";

export const directus = createDirectus(directusUrl)
    .with(staticToken(directusToken!)).with(rest());