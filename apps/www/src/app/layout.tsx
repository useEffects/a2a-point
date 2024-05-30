"use client"

import { TryLogin } from "@/components/try-login";
import "@/styles/global.css";
import "@/styles/main.css";
import { PortalHost } from "app/components/primitives/portal";
import ChatsProvider from "app/components/providers/chats";
import { directusWSUrl } from "app/lib/constants";
import directusStore from "app/store/directus";
import { ReactNode, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "src/components/providers/theme";
import { View } from "src/components/view";
import { QueryClientProvider } from "src/context/query";
import "tailwind-theme/theme.css";


export default function RootLayout({ children }: { children: ReactNode }) {

  return (<html lang="en" suppressHydrationWarning>
    <head />
    <body>
      <SafeAreaProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider>
            <View>
              {children}
              <TryLogin />
              <PortalHost />
            </View>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </body>
  </html>);
}
