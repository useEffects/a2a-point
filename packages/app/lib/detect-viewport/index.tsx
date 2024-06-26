import { ReactNode } from "react";
import InViewPortBase from "react-native-lightweight-inview";

export const InViewPort = ({ children, onEnter }: { children: ReactNode, onEnter: () => void }) => {
    return <InViewPortBase onChange={(isVisible) => isVisible && onEnter()}>
        {children}
    </InViewPortBase>
}