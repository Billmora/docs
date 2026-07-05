---
title: Invoice Theme Development
description: How to develop an Invoice theme to customize PDF generation, layout, and styling for client invoices in Billmora.
---

# Invoice Theme Development

The Invoice theme controls the PDF generation and public web-view structure of client invoices. Customizing the invoice theme allows you to match payment documents exactly to your branding and regional compliance requirements.

## Creating Your Theme

::: tip Faster Development with CLI
We highly recommend using the Billmora Artisan CLI to scaffold your theme. It automatically generates the folder, `theme.json`, Vite configuration, and copies default Blade views as a starting point.

```bash
php artisan billmora:theme:make mytheme --type=invoice
```

:::

1. **Create the Folder:** Set up a new directory under `/resources/themes/invoice/` (e.g., `mytheme`).
2. **Add `theme.json`:** Even though invoices don't compile external JS/CSS assets, you MUST include a `theme.json` file for Billmora to register the theme (see section below).

## Theme Metadata (`theme.json`)

The `theme.json` file must reflect the `"invoice"` type. The `assets` property is omitted as invoices generate inline CSS or attach inline generated PDFs over HTTP boundaries.

```json
{
  "name": "My Clean Invoice Theme",
  "description": "Minimalist invoice layouts suitable for print.",
  "author": "Your Name",
  "version": "1.0.0",
  "type": "invoice"
}
```

## Styling Strategy (Class styles)

Unlike Emails, which require inline `style="..."` elements for strict client compatibility, Invoices are directly rendered into a PDF document using DOMPDF (or similar engine) and displayed on the web.

You are fully supported to use `<style>` blocks with standard class-based CSS within your Blade views.

```html
<style>
  .invoice-header {
    background-color: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }
  .invoice-table th {
    font-weight: bold;
    text-align: left;
  }
</style>

<div class="invoice-header">
  <!-- Invoice content here -->
</div>
```

## Overriding Views

Copy the core invoice layout into your custom theme's `views/` directory (e.g., `/resources/themes/invoice/mytheme/views/invoice.blade.php`) and modify the HTML/CSS as required.

## Distribution & Installation

Once your invoice theme is complete, you can package it into a ZIP file for installation via the **System > Themes** section of the Admin panel.

You can easily package your theme using the Billmora Artisan CLI:

```bash
php artisan billmora:theme:export mytheme --type=invoice
```

This command will package the theme with the correct directory structure and save the distributable ZIP file to `storage/app/exports/`.

Alternatively, if you want to package it manually, refer to the [Packaging for Distribution](./reference/packaging.md) reference.

## Full File Structure

Below is an overview of a fully configured Invoice theme, taking the core `moraine` theme as a reference (organized with folders first).

```text
/resources/themes/invoice/moraine/
├── views
│   └── index.blade.php
└── theme.json
```
