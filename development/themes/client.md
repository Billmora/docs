---
title: Client Theme Development
description: Guide for developing custom client area themes to match Billmora to your exact brand identity.
---

# Client Theme Development

The client area is where your customers log in, manage their services, and view their invoices. Customizing the client theme allows you to match Billmora perfectly to your brand identity.

## Creating Your Theme

::: tip Faster Development with CLI
We highly recommend using the Billmora Artisan CLI to scaffold your theme. It automatically generates the folder, `theme.json`, Vite configuration, and copies default Blade views as a starting point.

```bash
php artisan billmora:theme:make mytheme --type=client
```

:::

1. **Create the Folder:** Create a new folder under `/resources/themes/client/` (e.g., `mytheme`).
2. **Add `theme.json`:** Define your theme's metadata and explicitly set the `assets` target (see section below).
3. **Configure Vite:** Drop in a `vite.config.js` file to handle dynamic compilation of your `css/app.css` and `js/app.js` using Laravel Vite context.

## Theme Metadata (`theme.json`)

The `theme.json` file is required for Billmora to register your theme. Ensure the `type` is set strictly to `"client"`.

```json
{
  "name": "My Custom Client Theme",
  "description": "Bespoke client servicing portal.",
  "author": "Your Name",
  "version": "1.0.0",
  "type": "client",
  "assets": "/themes/client/mytheme"
}
```

## Theme Configuration (`config.blade.php`)

You can allow administrators to customize your theme (e.g., changing colors or text) by placing a `config.blade.php` at the root of your theme. This file renders the settings page in the Admin Panel. See the [Configuration Reference](./reference/config.md) for full details on building this form.

## Compiling Assets

Billmora utilizes environment variables via `cross-env` to target specific themes during the build process. We highly recommend using `npx` to execute these commands.

To build your assets for production:

```bash
npx cross-env THEME=client/mytheme vite build
```

To run the Vite development server with Hot Module Replacement (HMR):

```bash
npx cross-env THEME=client/mytheme vite dev
```

## Overriding Views

The client area templates are highly modular. By placing a Blade file inside your theme's `views/` directory matching the relative path of a core view, Billmora will automatically serve your custom file instead.

## Distribution & Installation

Once your client theme is complete, you can package it into a ZIP file for installation on other Billmora instances via the **System > Themes** section of the Admin panel.

You can easily package your theme using the Billmora Artisan CLI:

```bash
php artisan billmora:theme:export mytheme --type=client
```

This command will automatically build your assets (if applicable), package them with the correct directory structure (placing all public-facing CSS/JS/Image files inside the `assets/` folder), and save the distributable ZIP file to `storage/app/exports/`.

Alternatively, if you want to package it manually, refer to the [Packaging for Distribution](./reference/packaging.md) guide.

## Full File Structure

Below is an overview of a fully configured Client theme, taking the core `moraine` theme as a reference (organized with folders first).

```text
/resources/themes/client/moraine/
config.blade.php
theme.json
vite.config.js
css
└── app.css
js
├── app.js
└── editor.js
views
├── index.blade.php
├── maintenance.blade.php
├── account
│   ├── credit.blade.php
│   ├── security.blade.php
│   └── settings.blade.php
├── auth
│   ├── login.blade.php
│   ├── register.blade.php
│   ├── password
│   │   ├── forgot.blade.php
│   │   └── reset.blade.php
│   └── two-factor
│       ├── backup.blade.php
│       ├── recovery.blade.php
│       ├── setup.blade.php
│       └── verify.blade.php
├── checkout
│   ├── cart.blade.php
│   └── complete.blade.php
├── components
│   ├── alert.blade.php
│   ├── captcha.blade.php
│   ├── checkbox.blade.php
│   ├── input.blade.php
│   ├── select.blade.php
│   ├── slider.blade.php
│   ├── textarea.blade.php
│   ├── toggle.blade.php
│   ├── editor
│   │   └── text.blade.php
│   ├── modal
│   │   ├── content.blade.php
│   │   └── trigger.blade.php
│   └── radio
│       ├── group.blade.php
│       └── option.blade.php
├── domains
│   └── workspaces
├── invoices
│   ├── index.blade.php
│   └── show.blade.php
├── layouts
│   ├── app.blade.php
│   ├── meta.blade.php
│   ├── script.blade.php
│   └── partials
│       ├── footer.blade.php
│       ├── header.blade.php
│       ├── pagination.blade.php
│       └── sidebar.blade.php
├── livewire
│   ├── service
│   │   └── scaling-wizard.blade.php
│   └── store
│       ├── domain-configure.blade.php
│       ├── domain-search.blade.php
│       └── package-checkout.blade.php
├── registrants
│   ├── index.blade.php
│   ├── show.blade.php
│   └── workspaces
│       ├── autorenew.blade.php
│       ├── nameservers.blade.php
│       ├── overview.blade.php
│       └── registrar.blade.php
├── services
│   ├── index.blade.php
│   ├── show.blade.php
│   └── workspaces
│       ├── cancellation.blade.php
│       ├── overview.blade.php
│       ├── provisioning.blade.php
│       └── scaling.blade.php
├── store
│   ├── index.blade.php
│   ├── catalog
│   │   └── index.blade.php
│   ├── domains
│   │   ├── index.blade.php
│   │   └── show.blade.php
│   └── package
│       └── show.blade.php
└── tickets
    ├── create.blade.php
    ├── index.blade.php
    └── reply
        └── index.blade.php
```
