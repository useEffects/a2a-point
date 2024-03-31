import { ReactNode, createContext, useContext } from "react";
import { directusUrl } from "~/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./auth";
import { View } from "react-native";
import { User } from "~/types";

export const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const authData = useContext(AuthContext);
  const { data: userData, isLoading } = useQuery({
    queryKey: ["User Data"],
    queryFn: async () => {
      return await fetch(`${directusUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${authData?.access_token}`,
        },
      }).then((res) => res.json());
    },
  });
  if (isLoading) return <View></View>;

  return userData ? (
    <UserContext.Provider value={userData.data as User}>
      {children}
    </UserContext.Provider>
  ) : (
    <View></View>
  );
}
