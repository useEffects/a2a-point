const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require("path")

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot);
const tailwindThemePath = path.resolve(workspaceRoot, "./packages/tailwind-theme")
const appPath = path.resolve(workspaceRoot, "./packages/app")
config.watchFolders = [tailwindThemePath, appPath]
// config.resolver.nodeModulesPaths = [
//     path.resolve(projectRoot, "node_modules"),
//     path.resolve(workspaceRoot, "node_modules"),
// ];
// config.resolver.disableHierarchicalLookup = true;

const cssPath = path.resolve(workspaceRoot, "./packages/tailwind-theme/theme.css")
module.exports = withNativeWind(config, { input: cssPath });
