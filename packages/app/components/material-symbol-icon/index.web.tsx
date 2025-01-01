import { useQuery } from "@tanstack/react-query"
import { portfolioUrl } from "app/lib/constants"
import InlineSvg from "react-inlinesvg"

export const MaterialSymbolIcon = (props: { name: string } & { fill?: string, height?: number, width?: number }) => {
    const { name, fill = "white", height = 24, width = 24 } = props
    const { data: icon } = useQuery({
        queryKey: ["Fetching icon", name],
        queryFn: async () => fetch(`${portfolioUrl}/api/icons/${name}`).then(res => res.text()),
        enabled: !!name,
    })

    return icon ? <InlineSvg color={"white"} fill={fill} width={width} height={height} src={icon} /> : <></>
}