---
title: Packaging for Distribution
description: Learn how to correctly structure and package your Billmora themes into ZIP archives for seamless installation via the Admin UI.
---

# Packaging for Distribution

To distribute your theme or install it using the **Install Theme** button in the Billmora Admin UI, you must package your files into a ZIP archive following a specific directory structure. This ensures that the system correctly identifies the theme and places assets in the appropriate public directories.

## ZIP Archive Structure

The Billmora theme installer expects the following hierarchy within your ZIP file. You can either place these files at the root of the ZIP or within a single top-level directory (e.g., `my-theme/theme.json`).

```text
my-theme.zip
├── assets/              <-- Required for public files
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   └── app.js
│   └── images/
├── views/               <-- Required: Template overrides
│   ├── layouts/
│   ├── index.blade.php
│   └── ...
├── theme.json           <-- Required: Metadata
└── config.blade.php     <-- Optional: Themes configuration settings
```

### Folder Mapping

When a theme is installed, the system maps the ZIP contents as follows:

| Folder/File in ZIP | Destination in Billmora                     | Purpose                                     |
| :----------------- | :------------------------------------------ | :------------------------------------------ |
| `theme.json`       | `resources/themes/{type}/{provider}/`       | Metadata and discovery.                     |
| `views/`           | `resources/themes/{type}/{provider}/views/` | Blade templates and overrides.              |
| `assets/`          | `public/themes/{type}/{provider}/`          | **Publicly accessible** CSS, JS, and media. |
| `config.blade.php` | `resources/themes/{type}/{provider}/`       | Admin-side configuration UI.                |

## Important Requirements

### 1. The `assets/` Directory

> [!IMPORTANT]
> All files that need to be accessible via a web browser (CSS, JavaScript, Images, Fonts) **must** be placed inside a directory named `assets` at the root of your package.
>
> If you place a `css/` or `js/` folder directly in the root of the ZIP, they will **not** be copied to the public directory and your theme will appear broken.

### 2. Pre-built Assets

The Billmora installer handles file placement but **does not run build tools** like Vite or npm. You must compile your assets for production before packaging.

**Recommended build command:**
```bash
npx cross-env THEME={type}/{provider} vite build
```

After building:
1. Copy the compiled files into the `assets/` directory of your package.
2. Zip the entire structure.

### 3. Manifest Validation

Your `theme.json` must contain the following keys for the installer to accept it:

- `name`: The display name of the theme.
- `provider`: A unique slug for the theme developer/name.
- `type`: Must be one of `admin`, `client`, `portal`, `email`, or `invoice`.

## Verification Before Uploading

Before uploading your ZIP to the Billmora Admin area, verify:

- `theme.json` is at the root or exactly one level deep.
- All public assets are inside `assets/`.
- The ZIP file size is within the allowed limit (default: 50MB).
