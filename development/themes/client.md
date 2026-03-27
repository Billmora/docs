# Client Theme Development

The client area is where your customers log in, manage their services, and view their invoices. Customizing the client theme allows you to match Billmora perfectly to your brand identity.

## Creating Your Theme

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

## Full File Structure

Below is an overview of a fully configured Client theme, taking the core `moraine` theme as a reference (organized with folders first).

```text
/resources/themes/client/moraine/
├── css
│   └── app.css
├── js
│   └── app.js
├── views
│   ├── account
│   │   ├── credit.blade.php
│   │   ├── security.blade.php
│   │   └── settings.blade.php
│   ├── auth
│   │   ├── password
│   │   │   ├── forgot.blade.php
│   │   │   └── reset.blade.php
│   │   ├── two-factor
│   │   │   ├── backup.blade.php
│   │   │   ├── recovery.blade.php
│   │   │   ├── setup.blade.php
│   │   │   └── verify.blade.php
│   │   ├── login.blade.php
│   │   └── register.blade.php
│   ├── checkout
│   │   ├── cart.blade.php
│   │   └── complete.blade.php
│   ├── components
│   │   ├── editor
│   │   │   └── text.blade.php
│   │   ├── modal
│   │   │   ├── content.blade.php
│   │   │   └── trigger.blade.php
│   │   ├── radio
│   │   │   ├── group.blade.php
│   │   │   └── option.blade.php
│   │   ├── alert.blade.php
│   │   ├── captcha.blade.php
│   │   ├── checkbox.blade.php
│   │   ├── input.blade.php
│   │   ├── select.blade.php
│   │   ├── slider.blade.php
│   │   ├── textarea.blade.php
│   │   └── toggle.blade.php
│   ├── invoices
│   │   ├── index.blade.php
│   │   └── show.blade.php
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
│   │   ├── service
│   │   │   └── scaling-wizard.blade.php
│   │   └── store
│   │       └── package-checkout.blade.php
│   ├── services
│   │   ├── workspaces
│   │   │   ├── cancellation.blade.php
│   │   │   ├── overview.blade.php
│   │   │   ├── provisioning.blade.php
│   │   │   └── scaling.blade.php
│   │   ├── index.blade.php
│   │   └── show.blade.php
│   ├── store
│   │   ├── catalog
│   │   │   └── index.blade.php
│   │   ├── package
│   │   │   └── show.blade.php
│   │   └── index.blade.php
│   ├── tickets
│   │   ├── reply
│   │   │   └── index.blade.php
│   │   ├── create.blade.php
│   │   └── index.blade.php
│   ├── index.blade.php
│   └── maintenance.blade.php
├── theme.json
└── vite.config.js
```
