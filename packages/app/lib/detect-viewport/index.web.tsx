import { InView } from "react-intersection-observer";

export const InViewPort = ({ children, onEnter }: { children: React.ReactNode, onEnter: () => void }) => {
    return <InView onChange={(inView) => inView && onEnter()}>
        {children}
    </InView>
}