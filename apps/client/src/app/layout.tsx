import { ReactNode } from "react";
import "./globals.css"
import "tailwind-theme/global.css"
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "@/components/session-provider";
import { View } from "@/components/view";
import { ColorProvider } from "@/context/color";
import HeroBg from "@/assets/svg/hero-bg";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="en" suppressHydrationWarning>
    <head />
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ColorProvider>
          {/* <SessionProvider> */}
          <View>
            {children}
            <Toaster duration={3} />
          </View>
          {/* </SessionProvider> */}
        </ColorProvider>
      </ThemeProvider>
    </body>
  </html>);
}
