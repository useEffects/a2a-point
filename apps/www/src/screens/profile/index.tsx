"use client"

import { useRenderAfterMount } from "@/hooks/render-after-mount"
import { ProfileScreen as ProfileScreeBase } from "app/screens/profile"

export const ProfileScreen = useRenderAfterMount(ProfileScreeBase)