import { ReactNode } from "react";
import "@/styles/global.css"
import "@/styles/main.css"
import "tailwind-theme/theme.css"
import { ThemeProvider } from "@/components/providers/theme";
import { View } from "@/components/view";
import { AuthTokenProvider } from "@/context/auth";
import { ColorProvider } from "@/context/color";

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
        <AuthTokenProvider>
          <ColorProvider>
            <View>
              {children}
            </View>
          </ColorProvider>
        </AuthTokenProvider>
      </ThemeProvider>
    </body>
  </html>);
}
