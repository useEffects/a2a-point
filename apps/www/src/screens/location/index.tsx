"use client"

import { useRenderAfterMount } from "@/hooks/render-after-mount"
import { LocationDetailed } from "app/screens/location-detailed"

export const LocationDetailedScreen = useRenderAfterMount(LocationDetailed)