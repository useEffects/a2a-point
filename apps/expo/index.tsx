// import "@expo/metro-runtime"
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { QueryClientProvider } from "app/context/query";
import { RequireContext } from "expo-router/build/types";
import { StatusBar } from "expo-status-bar";

// https://docs.expo.dev/router/reference/troubleshooting/#expo_router_app_root-not-defined

// Must be exported or Fast Refresh won't update the context
export function App() {
    const ctx = require.context("./app");
    return (
        <QueryClientProvider>
            <ExpoRoot context={ctx as RequireContext} />
        </QueryClientProvider>
    );
}
registerRootComponent(App);

