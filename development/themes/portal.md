---
title: Portal Theme Development
description: Guide on customizing the public-facing Portal theme, including storefront styling, announcement layouts, and knowledgebase design.
---
# Portal Theme Development

The Portal acts as the public-facing storefront or landing environment for your Billmora installation, specifically designed for guest users to browse products, read announcements, or access the knowledgebase before logging in to the client area.

## Creating Your Theme

1. **Create the Folder:** Make a new directory under `/resources/themes/portal/` (e.g., `mytheme`).
2. **Add `theme.json`:** Define the metadata (see section below).
3. **Configure Vite:** Handle CSS and JS compilation using Webpack/Vite.

## Theme Metadata (`theme.json`)

It is mandatory to include a `theme.json` file. Set the `type` to `"portal"` so the system correctly allocates the theme to the frontend storefront.

```json
{
    "name": "My Portal Theme",
    "description": "A beautiful storefront for hosting sales.",
    "author": "Your Name",
    "version": "1.0.0",
    "type": "portal",
    "assets": "/themes/portal/mytheme"
}
```

## Theme Configuration (`config.blade.php`)

Just like the Client theme, you can allow administrators to customize your Portal theme (e.g., changing colors or hero text) by creating a `config.blade.php` at the root of your theme. This automatically adds a "Configure" options panel in the system Admin area. Refer to the [Configuration Reference](./reference/config.md) for specifics on structuring this file.

## Compiling Assets

Because you are compiling isolated assets for a specific portal theme, you must prepend your build commands with the `THEME` environment variable. Using `npx cross-env` is the officially recommended approach.

To build your assets for production:
```bash
npx cross-env THEME=portal/mytheme vite build
```

To run the Vite development server (HMR):
```bash
npx cross-env THEME=portal/mytheme vite dev
```

## Overriding Views

Place custom Blade files inside the `views/` directory. They will automatically override any corresponding core portal views. This gives you 100% control over the public user experience and HTML structure.

## Full File Structure

Below is an overview of a fully configured Portal theme, taking the core `moraine` theme as a reference (organized with folders first).

```text
/resources/themes/portal/moraine/
├── css
│   └── app.css
├── js
│   └── app.js
├── views
│   ├── components
│   │   ├── input.blade.php
│   │   └── textarea.blade.php
│   ├── layouts
│   │   ├── partials
│   │   │   ├── footer.blade.php
│   │   │   └── header.blade.php
│   │   ├── app.blade.php
│   │   ├── meta.blade.php
│   │   └── script.blade.php
│   ├── terms
│   │   ├── condition.blade.php
│   │   ├── privacy.blade.php
│   │   └── service.blade.php
│   └── index.blade.php
├── theme.json
└── vite.config.js
```
