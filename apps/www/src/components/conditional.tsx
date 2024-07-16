"use client"

import { useRenderAfterMount } from "@/hooks/render-after-mount"
import { useIsSmallDevice } from "app/hooks/is-small-device"
import { ReactNode } from "react"

const ConditionalRenderBase = ({ mobile, large }: { mobile: ReactNode, large: ReactNode }) => {
    const isSmallDevice = useIsSmallDevice()
    return isSmallDevice ? mobile : large
}

export const ConditionalRender = useRenderAfterMount(ConditionalRenderBase)

