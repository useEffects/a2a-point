import { ReactNode } from "react";
import "@/styles/global.css"
import "@/styles/main.css"
import "tailwind-theme/theme.css"
import { ThemeProvider } from "@/components/providers/theme";
import { View } from "@/components/view";
import { QueryClientProvider } from "@/context/query";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="en" suppressHydrationWarning>
    <head />
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider>
          <View>
            {children}
          </View>
        </QueryClientProvider>
      </ThemeProvider>
    </body>
  </html>);
}
