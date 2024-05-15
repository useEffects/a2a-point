"use client"

import { ColorContext } from "@/context/color"
import * as React from "react"
import { SVGProps } from "react"
const HeroBg = (props: SVGProps<SVGSVGElement>) => {
    const color = React.useContext(ColorContext)
    return color ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1600" {...props}>
        <defs>
            <filter
                id="a"
                width="400%"
                height="400%"
                x="-100%"
                y="-100%"
                colorInterpolationFilters="sRGB"
                filterUnits="objectBoundingBox"
                primitiveUnits="userSpaceOnUse"
            >
                <feGaussianBlur
                    width="100%"
                    height="100%"
                    x="0%"
                    y="0%"
                    in="SourceGraphic"
                    result="blur"
                    stdDeviation={130}
                />
            </filter>
        </defs>
        <g filter="url(#a)">
            <ellipse
                cx={539.922}
                cy={391.478}
                fill={color.accent}
                rx={168}
                ry={113.5}
            />
            <ellipse
                cx={164.121}
                cy={293.598}
                fill={color.secondary}
                rx={168}
                ry={113.5}
            />
            <ellipse
                cx={249}
                cy={321.05}
                fill={color.primary}
                rx={168}
                ry={113.5}
            />
        </g>
    </svg>: <></>
}
export default HeroBg
