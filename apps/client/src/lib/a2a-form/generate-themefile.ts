import fs from 'fs';
import { theme } from "tailwind-theme/src/colors";
import * as changeCase from "change-case"

let latexCode = '';

for (const [colorName, colorValue] of Object.entries(theme.light)) {
    // Replace underscores and hyphens with 'X'
    const variableName = changeCase.camelCase(colorName);
    // Remove '#' from color value
    const cleanColorValue = colorValue.replace(/^#/, '');

    latexCode += `\\definecolor{${variableName}}{HTML}{${cleanColorValue.toUpperCase()}}\n`;
}

fs.writeFileSync("theme.tex", latexCode, 'utf-8');