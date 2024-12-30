/** @jsxImportSource react */

import { TryLogin } from "@/components/try-login";
import "@/styles/global.css";
import "@/styles/main.css";
import { PortalHost } from "@/components/ui/primitives/portal";
import { Providers } from "@/components/providers/providers";
import { ReactNode } from "react";
import { ThemeProvider } from "src/components/providers/theme";
import { View } from "src/components/view";
import { QueryClientProvider } from "src/context/query";
import "@a2apoint/tailwind-theme/theme.css";
import { Metadata } from "next";
import { OpenProvider } from "@/hooks/open";

export const metadata: Metadata = {
  metadataBase: new URL("https://a2apoint.com"),
  title: "A2A Point | The one stop for all agents",
  description: "In the dynamic world of real estate, efficiency, transparency, and seamless collaboration are paramount. Introducing A2A POINT, a revolutionary portal designed exclusively for real estate agents, redefining the landscape of property transactions and deal management.",
  openGraph: {
    title: "A2A Point | The one stop for all agents",
    description: "In the dynamic world of real estate, efficiency, transparency, and seamless collaboration are paramount. Introducing A2A POINT, a revolutionary portal designed exclusively for real estate agents, redefining the landscape of property transactions and deal management.",
    type: "website",
    url: "https://a2apoint.com",
    locale: "en_US",
  },
  keywords: ["real estate", "agents", "property", "transactions", "deal management", "UAE", "dubai"],
  twitter: {
    title: "A2A Point | The one stop for all agents",
    images: ["https://a2apoint-misc.nyc3.digitaloceanspaces.com/app/logo.svg"]
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {

  return (<html lang="en" suppressHydrationWarning>
    <head />
    <body>
      <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <OpenProvider>
            <View>
              {children}
              <TryLogin />
            </View>
          </OpenProvider>
        </ThemeProvider>
      </Providers>
    </body>
  </html>);
}
