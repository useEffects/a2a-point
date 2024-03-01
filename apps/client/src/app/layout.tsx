import { ReactNode } from "react";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "@/components/session-provider";

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
        <SessionProvider>
          {children}
          <Toaster duration={3} />
        </SessionProvider>
      </ThemeProvider>
    </body>
  </html>);
}
