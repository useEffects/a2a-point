import { writeFileSync } from "fs"

import { colorVariables } from "./shadcn-theme"

const _colorVariables = JSON.stringify(colorVariables)
writeFileSync("shadcn-theme.json", _colorVariables)