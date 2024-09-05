import path from "path";
import * as fs from "fs/promises"
import Maizzle, { Config } from "@maizzle/framework";
import Mustache from "mustache"
import emailTemplatesMaizzleConfig from "email-templates/config"
import { merge } from "lodash";

async function renderEmail() {
    const packagePath = path.join(__dirname, "../../packages/email-templates")
    const templatesDir = path.join(packagePath, "src/templates")
    const templatePath = path.join(templatesDir, "newsletter.html")

    const rawTemplate = await fs.readFile(templatePath).then(res => res.toString())

    const view = {
        markdown: markdown
    }

    const customized = Mustache.render(rawTemplate, view)

    const emailTemplatesMaizzleFinalConfig = merge<Config, Config>(emailTemplatesMaizzleConfig, {
        build: {
            templates: {},
            components: {
                root: packagePath
            },
            tailwind: {
                config: `${packagePath}/tailwind.config.js`,
                css: `${packagePath}/src/css/tailwind.css`
            }
        },
        filters: {}
    })

    const { html } = await Maizzle.render(customized, {
        maizzle: emailTemplatesMaizzleFinalConfig
    })

    return html
}

async function sendNewsLetter() {
    const html = await renderEmail()
    // const view = {
    //     markdown: markdown,
    // }
    // const customized = Mustache.render(html, view)
    // return customized
    return html
}

sendNewsLetter().then(html => fs.writeFile("./test.html", html))

const markdown = `# Dillinger
## _The Last Markdown Editor, Ever_

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Dillinger is a cloud-enabled, mobile-ready, offline-storage compatible,
AngularJS-powered HTML5 Markdown editor.

- Type some Markdown on the left
- See HTML in the right
- ✨Magic ✨

## Features

- Import a HTML file and watch it magically convert to Markdown
- Drag and drop images (requires your Dropbox account be linked)
- Import and save files from GitHub, Dropbox, Google Drive and One Drive
- Drag and drop markdown and HTML files into Dillinger
- Export documents as Markdown, HTML and PDF

Markdown is a lightweight markup language based on the formatting conventions
that people naturally use in email.
As [John Gruber] writes on the [Markdown site][df1]

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually- written in Markdown! To get a feel
for Markdown's syntax, type some text into the left window and
watch the results in the right.
`
