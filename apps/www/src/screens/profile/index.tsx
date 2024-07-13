"use client"

import { useRenderAfterMount } from "@/hooks/render-after-mount"
import { ProfileScreen as ProfileScreenBase } from "app/screens/profile"

export const ProfileScreen = useRenderAfterMount(ProfileScreenBase)