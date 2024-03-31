import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return (
    <QueryClientProvider client={queryClient}>
      <ExpoRoot context={ctx} />
    </QueryClientProvider>
  );
}
registerRootComponent(App);
