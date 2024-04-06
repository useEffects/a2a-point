import postcss, { Declaration, Plugin } from 'postcss';
import { theme } from './colors';
import { writeFileSync } from 'fs';
import convert from "color-convert"

export * from "./colors"

export function generateThemeCSS(): Plugin {
    return {
        postcssPlugin: 'generate-theme-css',
        OnceExit: (root) => {
            const generateThemeVariables = (theme: any, selector: string) => {
                const declarations = Object.entries(theme).map(([key, value]) => {
                    const hsl = convert.hex.hsl(value as string);
                    return `\t\t--${key}: ${hsl[0]} ${hsl[1]}% ${hsl[2]}%;`;
                }).join('\n');
                // Wrap the declarations in the provided selector
                return `${selector} {\n${declarations}\n}`;
            };

            // Generate CSS variables for both light and dark themes
            const lightThemeCSS = generateThemeVariables(theme.light, ':root');
            const darkThemeCSS = generateThemeVariables(theme.dark, '.dark:root');

            // Construct the final CSS content
            const cssContent = `/*Auto Generated*/\n\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n\t${lightThemeCSS}\n\t${darkThemeCSS}\n}`;

            // Write the generated CSS to a file
            writeFileSync(`${process.cwd()}/global.css`, cssContent);

            console.log('Global CSS file generated successfully.');
        },
    };
}

// Call the function to generate the global CSS file
const processor = postcss([generateThemeCSS()]);
processor.process('', { from: undefined }).catch((error) => {
    console.error('Error generating global CSS:', error);
});


