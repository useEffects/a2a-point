"use client"

import { useRenderAfterMount } from "@/hooks/render-after-mount"
import { UsersListComponent } from "app/screens/users-list"

export const Agents = useRenderAfterMount(UsersListComponent)