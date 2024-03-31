import { ReactNode, createContext, useEffect, useState } from "react";
import {
  createDirectus,
  rest,
  authentication,
  AuthenticationData,
} from "@directus/sdk";
import { directusUrl } from "~/lib/constants";
import { View } from "react-native";

export const AuthContext = createContext<AuthenticationData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState<AuthenticationData | null>(null);
  useEffect(() => {
    (async function () {
      const directus = createDirectus(directusUrl)
        .with(
          authentication("cookie", {
            credentials: "include",
            autoRefresh: true,
          })
        )
        .with(rest());
      const result = await directus.login("admin@example.com", "admin");
      setAuthData(result);
    })();
  }, []);

  if (!authData) return <View></View>;

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}
