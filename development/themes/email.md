---
title: Email Theme Development
description: Instructions on creating custom email themes to completely rebrand Billmora's transactional notifications and templates.
---

# Email Theme Development

Billmora utilizes customized notification templates for system alerts, welcome emails, invoices, and payment confirmations. Creating a custom email theme allows you to rebrand the transactional communications entirely.

## Creating Your Theme

1. **Create the Folder:** Make a new directory under `/resources/themes/email/` (e.g., `mytheme`).
2. **Add `theme.json`:** Every theme requires this metadata file to register property with Billmora. Even though no assets are compiled, the JSON file is mandatory (see section below).

## Theme Metadata (`theme.json`)

It is mandatory to include a `theme.json` file. Ensure the `type` is set strictly to `"email"`. The `assets` property is omitted as emails do not compile frontend resources.

```json
{
    "name": "My Email Notification Theme",
    "description": "Customized HTML templates for system alerts.",
    "author": "Your Name",
    "version": "1.0.0",
    "type": "email"
}
```

## Styling Strategy (Inline CSS)

Because modern email clients (Gmail, Outlook, Apple Mail) often completely strip out external stylesheets (`<link ref="stylesheet">`) or `<style>` blocks in the `<head>`, Billmora supports **automatic CSS inlining**.

When designing your email `views/`, you should use standard HTML `style="..."` attributes for styling, or write CSS in the layout template's style block, which Billmora will attempt to auto-convert to inline styles during transmission. Rely on traditional table-based layouts for the highest compatibility across email clients.

## Overriding Views

Place custom Blade files inside the `views/` directory that mirror the relative path of the core email notifications. For example, to override the main layout wrapper, you would create `/resources/themes/email/mytheme/views/layout.blade.php`.

## Distribution & Installation

Once your email theme is ready, you can package it into a ZIP file for installation via the **System > Themes** section of the Admin panel.

For details on how to correctly structure your theme ZIP for the installer, refer to the [Packaging for Distribution](./reference/packaging.md) guide.

## Full File Structure

Below is an overview of a fully configured Email theme, taking the core `moraine` theme as a reference (organized with folders first).

```text
/resources/themes/email/moraine/
├── views
│   ├── components
│   │   └── items.blade.php
│   └── index.blade.php
└── theme.json
```
