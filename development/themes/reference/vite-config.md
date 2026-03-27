---
title: Vite Configuration Reference
description: Reference setup and explanation of vite.config.js for compiling assets in Billmora custom themes.
---
# Vite Configuration Reference

When building a compiled theme for the `admin`, `client`, or `portal` areas, the `vite.config.js` file is responsible for wiring Tailwind CSS, Laravel Vite Plugin, and specifying where the compiled assets should be outputted.

Below is the standard reference configuration utilized by Billmora themes to ensure isolation and accurate path resolution.

## Standard `vite.config.js`

```javascript
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import fs from "fs";

// Resolve current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read theme metadata to determine output directory
const themeJsonPath = path.resolve(__dirname, 'theme.json');
let assetsOutDir = "/themes/admin/mytheme"; // Fallback path

if (fs.existsSync(themeJsonPath)) {
    const themeData = JSON.parse(fs.readFileSync(themeJsonPath, 'utf-8'));
    if (themeData.assets) {
        assetsOutDir = themeData.assets;
    }
}

// Ensure assets are compiled accurately to the public/ directory
const finalOutDir = path.resolve(process.cwd(), `public${assetsOutDir}`);

export default defineConfig({
    build: {
        outDir: finalOutDir,
        emptyOutDir: true,
        rollupOptions: {
            input: {
                style: path.resolve(__dirname, "css/app.css"),
                app: path.resolve(__dirname, "js/app.js"),
            },
            output: {
                entryFileNames: "js/[name].js",
                assetFileNames: "css/[name].css",
            },
        },
    },
    plugins: [
        laravel({
            input: [
                path.resolve(__dirname, "css/app.css"),
                path.resolve(__dirname, "js/app.js"),
            ],
            refresh: true, // Enables HMR during development
        }),
        tailwindcss(),
    ],
});
```

## How It Works

1. **Path Resolution:** The config reads where it is currently located (`__dirname`) so it can accurately target your specific theme's `css/app.css` and `js/app.js`.
2. **`theme.json` Parsing:** It imports your `theme.json` file to discover the value of the `assets` property.
3. **Output Targeting:** It updates Vite's `outDir` to point directly to `public/themes/{type}/{themeName}` instead of the default `public/build`.
4. **Isolated Compilation:** `emptyOutDir: true` means Vite will clear ONLY your theme's old compiled assets before replacing them, without interfering with the core framework or other themes.
