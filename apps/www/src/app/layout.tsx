import { ReactNode } from "react";
import "../styles/global.css";
import "../styles/main.css"
import "tailwind-theme/theme.css"

export default function Layout({ children }: { children: ReactNode }) {
    return <html>
        <body>
            {children}
        </body>
    </html>
}