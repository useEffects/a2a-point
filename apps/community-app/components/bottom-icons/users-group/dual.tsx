import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const UsersGroupDual = (props: SvgProps) => (
  <Svg
    
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill={props.color} d="M15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
    <Path
      fill={props.color}
      d="M19.5 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM4.5 7.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
      opacity={0.4}
    />
    <Path
      fill={props.color}
      d="M18 16.5c0 1.933-2.686 3.5-6 3.5s-6-1.567-6-3.5S8.686 13 12 13s6 1.567 6 3.5Z"
    />
    <Path
      fill={props.color}
      d="M22 16.5c0 1.38-1.79 2.5-4 2.5s-4-1.12-4-2.5 1.79-2.5 4-2.5 4 1.12 4 2.5ZM2 16.5C2 17.88 3.79 19 6 19s4-1.12 4-2.5S8.21 14 6 14s-4 1.12-4 2.5Z"
      opacity={0.4}
    />
  </Svg>
)
export default UsersGroupDual
