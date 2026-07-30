---
title: Module Plugin Development
description: Learn how to build Module plugins to extend Billmora's core functionality with custom pages, logic, and webhook integrations.
---

# Module Plugin Development

Billmora uses an **Event-Driven Architecture (EDA)** for its module ecosystem. Developing a Module plugin allows you to extend Billmora's functionality with custom features — from simple webhook integrations to full-stack pages with their own database, controllers, and views.

Because of the EDA design, your plugin can **react to any system-wide event** (invoices, services, tickets, users, etc.) without modifying any core code. Billmora's `AbstractPlugin` handles all the heavy lifting: route registration, view namespacing, migration discovery, and event wiring. Your only responsibility is to define what your module does.

---

## 1. Directory Structure & Namespace

::: tip Faster Development & Distribution with CLI
We highly recommend using the Billmora Artisan CLI to scaffold and package your plugin.

```bash
# Scaffold the plugin boilerplate structure
php artisan billmora:plugin:make myplugin --type=module

# Package the plugin into a ZIP file for distribution
php artisan billmora:plugin:export myplugin --type=module
```

:::

Module plugins must reside within the `plugin/Modules/` directory. If you are building a module called **Example**, your directory layout must look like this:

```text
plugin/
└── Modules/
    └── Example/
        ├── ExampleModule.php
        ├── plugin.json
        ├── database/
        │   └── migrations/           (optional)
        ├── Models/                    (optional)
        ├── Http/
        │   └── Controllers/          (optional)
        ├── routes/
        │   ├── admin.php             (optional)
        │   └── client.php            (optional)
        └── resources/
            └── views/                (optional)
```

Consistent with PSR-4 standards, your plugin namespace should match the directory structure:
`namespace Plugins\Modules\Example;`

::: tip
Not every directory is required. A simple event-only module (like Discord notifications) might only have the main class and `plugin.json`. Only create what your module needs.
:::

---

## 2. The `plugin.json` Manifest

Every plugin requires a `plugin.json` manifest file. This file tells Billmora's core engine how to discover and load your module. Ensure the format strictly follows this structure:

```json
{
  "name": "Example Module",
  "provider": "Example",
  "type": "module",
  "version": "1.0.0",
  "description": "A custom module that extends Billmora functionality.",
  "author": "Your Name / Team"
}
```

::: info Configuration Metrics

- **`type`**: Must strictly be `"module"`.
- **`provider`**: The unique identifier/slug for your module. Must match the directory name.
  :::

---

## 3. The Main Plugin Class

Your module's main PHP class must extend `App\Support\AbstractPlugin` and implement the `App\Contracts\ModuleInterface`.

```php
<?php

namespace Plugins\Modules\Example;

use App\Contracts\ModuleInterface;
use App\Support\AbstractPlugin;

class ExampleModule extends AbstractPlugin implements ModuleInterface
{
    // Implementation comes here...
}
```

---

## 4. Admin Configuration (`getConfigSchema`)

You don't need to build any HTML forms for your plugin's admin settings. Billmora automatically renders the settings UI in the Admin Panel based on the schema you provide.

Use the `getConfigSchema()` method to define the settings your module requires.

::: tip Schema Documentation
Billmora supports an extensive library of UI components (Selects, Toggles, Radios, Checkboxes, etc.).
Please read the [**Plugin Configuration Schema Guide**](./reference/schema.md) to see the full list of supported fields and properties.
:::

```php
public function getConfigSchema(): array
{
    return [
        'webhook_url' => [
            'type'  => 'text',
            'label' => 'Webhook URL',
            'rules' => 'required|url'
        ],
        'enabled' => [
            'type'    => 'toggle',
            'label'   => 'Enable Notifications',
            'default' => true,
            'rules'   => 'boolean'
        ],
    ];
}
```

::: tip
You can easily retrieve these values anywhere in your class later using `$this->getInstanceConfig('webhook_url');`.

If your module has no global configuration, return an empty array.
:::

---

## 5. Building Your Module

Unlike Gateways or Registrars which have strict lifecycle methods (`pay()`, `renew()`, etc.), Modules are entirely free-form. You build them by leveraging Billmora's **Shared Plugin Capabilities**.

Because your module extends `AbstractPlugin`, it automatically inherits the ability to:

- **Listen to Events:** Override `getSubscribedEvents()` to react to core actions (like sending a Discord message when an invoice is paid).
- **Inject Navigation:** Override `getNavigationAdmin()`, `getNavigationClient()`, or `getNavigationPortal()` to add menu links.
- **Register Custom Routes:** Simply place `routes/admin.php` or `routes/client.php` in your plugin directory.
- **Render Custom Views:** Place blade files in `resources/views/` and render them via `view('module.example::...')`.
- **Add Database Tables:** Place migrations in `database/migrations/` (using the `pm_` table prefix).
- **Define Permissions:** Override `getPermissions()` to add custom ACL rules.

::: tip Comprehensive Reference
Please read the [**Plugin Capabilities Reference**](./reference/capabilities.md) for full code examples, return types, and property tables for all the features listed above.
:::

---

## Conclusion

By implementing the `ModuleInterface` and leveraging Billmora's shared plugin capabilities, you can build powerful extensions with minimal boilerplate. Whether you need a simple webhook integration (event-only) or a full-stack feature with its own database, routes, controllers, and views — the `AbstractPlugin` foundation gives you everything you need.
