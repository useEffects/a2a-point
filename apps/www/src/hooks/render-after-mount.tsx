import { ComponentType, useEffect, useState } from "react";

export const useRenderAfterMount = <P extends object,>(WrappedComponent: ComponentType<P>) => {
    return (props: P) => {
        const [mounted, setMounted] = useState(false)
        useEffect(() => {
            setMounted(true)
        }, [])
        return mounted ? <WrappedComponent {...props} /> : null
    }
}