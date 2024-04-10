"use client"

import { ColorContext } from "@/context/color"
import * as React from "react"
import { SVGProps } from "react"
const Wavy = (props: SVGProps<SVGSVGElement>) => {
  const color = React.useContext(ColorContext)

  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 800" {...props}>
    <defs>
      <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor={color.primary} />
        <stop offset="100%" stopColor={color.secondary} />
      </linearGradient>
    </defs>
    <path
      fill="url(#a)"
      d="M-10 10c85.417 2.292 241.25 15.583 410 11s233.333-32.375 400-33 233.333 28.542 400 30c166.667 1.458 233.333-27.583 400-23 166.667 4.583 233.333 46.042 400 45 166.667-1.042 264.583-125 400-50 135.417 75 854.167 220.417 250 410S156.25 795.833-500 900"
      opacity="NaN"
      transform="translate(5.824 367.047)"
    />
  </svg>
}
export default Wavy