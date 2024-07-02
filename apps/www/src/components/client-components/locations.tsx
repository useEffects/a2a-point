"use client"

import { useRenderAfterMount } from "@/hooks/render-after-mount"
import { LocationsList } from "app/screens/locations-list"

export const LocationsScreen = useRenderAfterMount(LocationsList)