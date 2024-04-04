import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core"
import { RequireContext } from "expo-router/build/types";

export const queryClient = new QueryClient();

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return (
    <QueryClientProvider client={queryClient}>
      <ExpoRoot context={ctx as RequireContext} />
    </QueryClientProvider>
  );
}
registerRootComponent(App);
