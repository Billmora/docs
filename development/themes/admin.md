---
title: Admin Theme Development
description: Learn how to build custom admin themes to overhaul the look, feel, and dashboard interface of your Billmora installation.
---

# Admin Theme Development

The admin theme powers the core dashboard, management interfaces, and settings of Billmora. By creating a custom admin theme, you can completely overhaul the look and feel of the back office without altering the core system files.

## Creating Your Theme

1. **Create the Folder:** Create a new folder under `/resources/themes/admin/` (e.g., `mytheme`).
2. **Add `theme.json`:** Define your theme's metadata (see section below).
3. **Configure Vite:** Copy an existing `vite.config.js` into your new theme folder to handle Tailwind CSS and JS compilation.

## Theme Metadata (`theme.json`)

The `theme.json` file is required in the root of your theme folder for Billmora to discover and utilize it. For the admin theme, the `type` must be `"admin"`, and the `assets` property must dictate where Vite drops compiled files.

```json
{
    "name": "My Custom Admin Theme",
    "description": "A customized back-office experience.",
    "author": "Your Name",
    "version": "1.0.0",
    "type": "admin",
    "assets": "/themes/admin/mytheme"
}
```

## Theme Configuration (`config.blade.php`)

If you wish to allow Super Administrators to customize aspects of your Admin theme (like swapping logos or colors) without touching code, you can optionally include a `config.blade.php` file at the root. For more details on rendering admin configuration fields, see the [Configuration Reference](./reference/config.md).

## Compiling Assets

Because Billmora relies on environment variables to compile the correct theme, it is **highly recommended** to use `npx cross-env` to ensure cross-platform compatibility when building your theme.

To build your assets for production, run:
```bash
npx cross-env THEME=admin/mytheme vite build
```

To run the Vite dev server with hot-module replacement (HMR), run:
```bash
npx cross-env THEME=admin/mytheme vite dev
```

## Overriding Views

Any Blade file you place inside the `views/` directory of your theme will strictly override the core Billmora view of the exact same name and path. For example, to override the admin dashboard view located at `resources/views/admin/dashboard.blade.php`, you would create:
`/resources/themes/admin/mytheme/views/dashboard.blade.php`.

## Distribution & Installation

Once your admin theme is complete, you can package it into a ZIP file for distribution or installation on other Billmora instances via the **System > Themes** section of the Admin panel.

> [!IMPORTANT]
> The theme installer expects a specific ZIP file hierarchy. Most importantly, all public assets (CSS/JS) **must** be contained within an `assets/` folder in the ZIP.

For a comprehensive guide on structuring your theme ZIP, refer to the [Packaging for Distribution](./reference/packaging.md) reference.

## Full File Structure

Below is an overview of a fully configured Admin theme, taking the core `moraine` theme as a reference (organized with folders first). Use this hierarchy mapping when overriding template components.

```text
/resources/themes/admin/moraine/
├── css
│   └── app.css
├── js
│   └── app.js
├── views
│   ├── audits
│   │   ├── email
│   │   │   ├── index.blade.php
│   │   │   └── show.blade.php
│   │   ├── system
│   │   │   ├── index.blade.php
│   │   │   └── show.blade.php
│   │   ├── user
│   │   │   └── index.blade.php
│   │   └── index.blade.php
│   ├── automations
│   │   └── index.blade.php
│   ├── broadcasts
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── catalogs
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── components
│   │   ├── editor
│   │   │   └── text.blade.php
│   │   ├── modal
│   │   │   ├── content.blade.php
│   │   │   └── trigger.blade.php
│   │   ├── radio
│   │   │   ├── group.blade.php
│   │   │   └── option.blade.php
│   │   ├── table
│   │   │   └── sorthead.blade.php
│   │   ├── alert.blade.php
│   │   ├── browse.blade.php
│   │   ├── checkbox.blade.php
│   │   ├── input.blade.php
│   │   ├── multiselect.blade.php
│   │   ├── select.blade.php
│   │   ├── singleselect.blade.php
│   │   ├── slider.blade.php
│   │   ├── tabs.blade.php
│   │   ├── tags.blade.php
│   │   ├── textarea.blade.php
│   │   └── toggle.blade.php
│   ├── coupons
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── gateways
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── invoices
│   │   ├── refund
│   │   │   └── index.blade.php
│   │   ├── transaction
│   │   │   ├── create.blade.php
│   │   │   └── index.blade.php
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── layouts
│   │   ├── partials
│   │   │   ├── footer.blade.php
│   │   │   ├── header.blade.php
│   │   │   ├── pagination.blade.php
│   │   │   └── sidebar.blade.php
│   │   ├── app.blade.php
│   │   ├── meta.blade.php
│   │   └── script.blade.php
│   ├── livewire
│   │   ├── invoices
│   │   │   ├── invoice-create.blade.php
│   │   │   └── invoice-edit.blade.php
│   │   ├── orders
│   │   │   └── order-create.blade.php
│   │   ├── services
│   │   │   └── service-edit.blade.php
│   │   └── variants
│   │       ├── option-create.blade.php
│   │       └── option-edit.blade.php
│   ├── modules
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── orders
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── packages
│   │   ├── pricing
│   │   │   ├── create.blade.php
│   │   │   ├── edit.blade.php
│   │   │   └── index.blade.php
│   │   ├── provisioning
│   │   │   └── index.blade.php
│   │   ├── scaling
│   │   │   └── index.blade.php
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── plugins
│   │   └── index.blade.php
│   ├── provisionings
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── services
│   │   ├── cancellations
│   │   │   ├── edit.blade.php
│   │   │   └── index.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── settings
│   │   ├── api
│   │   │   ├── create.blade.php
│   │   │   └── index.blade.php
│   │   ├── auth
│   │   │   ├── social.blade.php
│   │   │   └── user.blade.php
│   │   ├── automation
│   │   │   ├── billing.blade.php
│   │   │   ├── scheduling.blade.php
│   │   │   ├── service.blade.php
│   │   │   └── ticket.blade.php
│   │   ├── captcha
│   │   │   ├── placement.blade.php
│   │   │   └── provider.blade.php
│   │   ├── currencies
│   │   │   ├── create.blade.php
│   │   │   ├── edit.blade.php
│   │   │   └── index.blade.php
│   │   ├── general
│   │   │   ├── company.blade.php
│   │   │   ├── credit.blade.php
│   │   │   ├── invoice.blade.php
│   │   │   ├── misc.blade.php
│   │   │   ├── ordering.blade.php
│   │   │   ├── service.blade.php
│   │   │   ├── social.blade.php
│   │   │   └── term.blade.php
│   │   ├── mail
│   │   │   ├── notification
│   │   │   │   ├── edit.blade.php
│   │   │   │   └── index.blade.php
│   │   │   └── mailer.blade.php
│   │   ├── punishments
│   │   │   ├── create.blade.php
│   │   │   └── index.blade.php
│   │   ├── roles
│   │   │   ├── create.blade.php
│   │   │   ├── edit.blade.php
│   │   │   └── index.blade.php
│   │   ├── taxes
│   │   │   ├── create.blade.php
│   │   │   ├── edit.blade.php
│   │   │   └── index.blade.php
│   │   ├── ticket
│   │   │   ├── notify.blade.php
│   │   │   ├── piping.blade.php
│   │   │   └── ticketing.blade.php
│   │   └── index.blade.php
│   ├── tasks
│   │   └── index.blade.php
│   ├── themes
│   │   └── index.blade.php
│   ├── tickets
│   │   ├── reply
│   │   │   └── index.blade.php
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   ├── transactions
│   │   ├── create.blade.php
│   │   └── index.blade.php
│   ├── users
│   │   ├── activity
│   │   │   ├── index.blade.php
│   │   │   └── show.blade.php
│   │   ├── create.blade.php
│   │   ├── credits.blade.php
│   │   ├── index.blade.php
│   │   ├── invoices.blade.php
│   │   ├── profile.blade.php
│   │   ├── services.blade.php
│   │   ├── summary.blade.php
│   │   └── tickets.blade.php
│   ├── variants
│   │   ├── option
│   │   │   ├── create.blade.php
│   │   │   ├── edit.blade.php
│   │   │   └── index.blade.php
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── index.blade.php
│   └── index.blade.php
├── theme.json
└── vite.config.js
```
