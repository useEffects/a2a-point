"use client"

import { useRenderAfterMount } from "@/hooks/render-after-mount"
import ListingDetailedScreenComponent from "app/screens/listing-detailed"

export const ListingDetailedScreen = useRenderAfterMount(ListingDetailedScreenComponent)