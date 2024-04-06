import * as fs from 'fs';
import postcss from 'postcss';
import postcssValueParser from 'postcss-value-parser';
import convert from "color-convert"

type ColorVariables = {
    'background': string;
    'foreground': string;
    'card': string;
    'card-foreground': string;
    'popover': string;
    'popover-foreground': string;
    'primary': string;
    'primary-foreground': string;
    'secondary': string;
    'secondary-foreground': string;
    'muted': string;
    'muted-foreground': string;
    'accent': string;
    'accent-foreground': string;
    'destructive': string;
    'destructive-foreground': string;
    'border': string;
    'input': string;
    'ring': string;
};

const variableNames: (keyof ColorVariables)[] = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
];


// Function to read CSS file and extract colors
function extractColors(cssPath: string, isDarkTheme: boolean): ColorVariables {
    const colors = {} as ColorVariables;
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const rootSelector = isDarkTheme ? '.dark:root' : ':root';

    const parsedCss = postcss.parse(cssContent);

    parsedCss.walkRules((rule) => {
        if (rule.selector === rootSelector) {
            rule.walkDecls((decl) => {
                if (decl.prop.startsWith('--')) {
                    const variableName = decl.prop.slice(2).trim() as keyof ColorVariables;
                    if (variableNames.includes(variableName)) {
                        const parsedValue = postcssValueParser(decl.value);
                        let hslValues: number[] = [];
                        // Iterate through nodes to find HSL values
                        parsedValue.walk((node) => {
                            if (node.type === 'word') {
                                // Remove '%' character if present
                                const value = node.value.endsWith('%') ? parseFloat(node.value.slice(0, -1)) : parseFloat(node.value);
                                hslValues.push(value);
                            }
                        });
                        const hexColor = convert.hsl.hex([hslValues[0]!, hslValues[1]!, hslValues[2]!])
                        colors[variableName] = `#${hexColor}`;
                    }
                }
            });
        }
    });

    return colors;
}

// CSS file path
const cssPath = './shadcn-theme.css';

// Extract colors for light and dark themes
const lightThemeColors = extractColors(cssPath, false);
const darkThemeColors = extractColors(cssPath, true);

export const colorVariables: {
    light: ColorVariables,
    dark: ColorVariables
} = {
    light: lightThemeColors,
    dark: darkThemeColors
}

fs.writeFileSync("shadcn-theme.json", JSON.stringify(colorVariables))
