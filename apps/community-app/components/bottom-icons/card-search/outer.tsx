import * as React from "react"
import Svg, { SvgProps, Path, Circle } from "react-native-svg"
const CardSearchOutline = (props: SvgProps) => (
  <Svg
  
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M14 4c3.771 0 5.657 0 6.828 1.172C22 6.343 22 8.229 22 12v1M10 4C6.229 4 4.343 4 3.172 5.172 2 6.343 2 8.229 2 12c0 3.771 0 5.657 1.172 6.828C4.343 20 6.229 20 10 20h3M10 16H6"
    />
    <Circle cx={18} cy={17} r={3} stroke={props.color} strokeWidth={1.5} />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m20.5 19.5 1 1M2 10h5m15 0H11"
    />
  </Svg>
)
export default CardSearchOutline
