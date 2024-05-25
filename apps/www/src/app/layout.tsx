import "@/styles/global.css";
import "@/styles/main.css";
import { ReactNode } from "react";
import { ThemeProvider } from "src/components/providers/theme";
import { View } from "src/components/view";
import { QueryClientProvider } from "src/context/query";
import "tailwind-theme/theme.css";

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
