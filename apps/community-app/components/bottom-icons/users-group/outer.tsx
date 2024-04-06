import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"
const UsersGroupOutline = (props: SvgProps) => (
  <Svg
    
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Circle cx={12} cy={6} r={4} stroke={props.color} strokeWidth={1.5} />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M18 9c1.657 0 3-1.12 3-2.5S19.657 4 18 4M6 9C4.343 9 3 7.88 3 6.5S4.343 4 6 4M17.197 15c.51.588.803 1.271.803 2 0 2.21-2.686 4-6 4s-6-1.79-6-4 2.686-4 6-4c.34 0 .675.019 1 .055M20 19c1.754-.385 3-1.359 3-2.5s-1.246-2.115-3-2.5M4 19c-1.754-.385-3-1.359-3-2.5s1.246-2.115 3-2.5"
    />
  </Svg>
)
export default UsersGroupOutline
