import { useQuery } from "@tanstack/react-query"
import { portfolioUrl } from "app/lib/constants"
import { SvgXml } from "react-native-svg"

export const MaterialSymbolIcon = (props: { name: string } & { fill?: string, height?: number, width?: number }) => {
    const { name, fill = "white", height = 24, width = 24, ...rest } = props
    const { data: icon } = useQuery({
        queryKey: ["Fetching icon", name],
        queryFn: async () => fetch(`${portfolioUrl}/api/icons/${name}`).then(res => res.text()),
        enabled: !!name,
    })
    return icon ? <SvgXml color={"white"} fill={fill} width={width} height={height} xml={icon} {...rest} /> : <></>
}