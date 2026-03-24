# Module Plugin Development

Billmora uses an **Event-Driven Architecture (EDA)** for its module ecosystem. Developing a Module plugin allows you to extend Billmora's functionality with custom features — from simple webhook integrations to full-stack pages with their own database, controllers, and views.

Because of the EDA design, your plugin can **react to any system-wide event** (invoices, services, tickets, users, etc.) without modifying any core code. Billmora's `AbstractPlugin` handles all the heavy lifting: route registration, view namespacing, migration discovery, and event wiring. Your only responsibility is to define what your module does.

---

## 1. Directory Structure & Namespace

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
* **`type`**: Must strictly be `"module"`.
* **`provider`**: The unique identifier/slug for your module. Must match the directory name.
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

## 5. Event Subscription (`getSubscribedEvents`)

The `ModuleInterface` requires you to implement `getSubscribedEvents()`. This is the core mechanism that allows your module to **react to system-wide events** dispatched by Billmora's core engine — without modifying any core code.

Return an associative array mapping **Event classes** to **method names** on your plugin class:

```php
public function getSubscribedEvents(): array
{
    return [
        \App\Events\Invoice\Created::class  => 'onInvoiceCreated',
        \App\Events\Invoice\Paid::class     => 'onInvoicePaid',
    ];
}
```

Then define the corresponding handler methods on your class:

```php
public function onInvoiceCreated(\App\Events\Invoice\Created $event): void
{
    $invoice = $event->invoice;
    $user = $invoice->user;
    
    // React to the event — send notification, log to external service, etc.
}

public function onInvoicePaid(\App\Events\Invoice\Paid $event): void
{
    $invoice = $event->invoice;
    // React to the event...
}
```

::: tip Event Reference
Billmora dispatches 31+ events across Invoice, Order, Service, Ticket, Transaction, and User categories. See the [**Event Reference**](./reference/events.md) for the complete list of available events and their payload properties.
:::

::: info
If your module does not need to listen to any events (e.g., it only provides pages/routes), return an empty array:
```php
public function getSubscribedEvents(): array
{
    return [];
}
```
:::

---

## 6. Permissions

Define custom permissions that can be assigned to admin roles. These permissions are automatically registered and can be assigned via Admin Panel → Roles & Permissions.

```php
public function getPermissions(): array
{
    return [
        'modules.example.view',
        'modules.example.manage',
    ];
}
```

---

## 7. Navigation Menus

Modules can inject navigation items into any of Billmora's three areas: **Admin**, **Client**, and **Portal**.

### Admin Navigation

```php
public function getNavigationAdmin(): array
{
    return [
        'example' => [
            'label'      => 'Example',
            'icon'       => 'lucide-megaphone',
            'route'      => route('admin.modules.example.index'),
            'permission' => 'modules.example.manage',
        ],
    ];
}
```

### Client Navigation

```php
public function getNavigationClient(): array
{
    return [
        'example' => [
            'label' => 'Example',
            'icon'  => 'lucide-megaphone',
            'route' => route('client.modules.example.index'),
        ],
    ];
}
```

### Portal Navigation

```php
public function getNavigationPortal(): array
{
    return [
        'example' => [
            'label' => 'Example',
            'icon'  => 'lucide-megaphone',
            'route' => route('portal.modules.example.index'),
        ],
    ];
}
```

::: tip
The `permission` property in admin navigation ensures the link is only shown to admins who have the corresponding permission assigned.
:::

---

## 8. Routes

Place your route files inside the `routes/` directory. Billmora's `AbstractPlugin` automatically loads them with appropriate middleware and prefixes.

::: tip Route Convention
See the [**Plugin Conventions & Standards**](./reference/conventions.md#_6-route-registration) guide for the complete routing table including middleware, URL prefixes, and name prefixes.
:::

**Example `routes/admin.php`:**

```php
<?php

use Illuminate\Support\Facades\Route;
use Plugins\Modules\Example\Http\Controllers\Admin\ExampleController;

Route::middleware('permission:modules.example.manage')->group(function () {
    Route::get('/', [ExampleController::class, 'index'])->name('index');
    Route::get('/create', [ExampleController::class, 'create'])->name('create');
    Route::post('/', [ExampleController::class, 'store'])->name('store');
    Route::get('/{record}/edit', [ExampleController::class, 'edit'])->name('edit');
    Route::put('/{record}', [ExampleController::class, 'update'])->name('update');
    Route::delete('/{record}', [ExampleController::class, 'destroy'])->name('destroy');
});
```

**Example `routes/client.php`:**

```php
<?php

use Illuminate\Support\Facades\Route;
use Plugins\Modules\Example\Http\Controllers\Client\ExampleController;

Route::get('/', [ExampleController::class, 'index'])->name('index');
Route::get('/{slug}', [ExampleController::class, 'show'])->name('show');
```

---

## 9. Database Migrations

If your module requires its own database tables, place migrations in `database/migrations/`. All tables **must** use the `pm_` prefix.

::: tip
See the [**Plugin Conventions & Standards**](./reference/conventions.md#_4-database-migrations) guide for full details on table prefixes, migration naming, and model configuration.
:::

---

## 10. Custom Views

Place Blade templates inside `resources/views/`. Billmora automatically registers the view namespace as `module.{provider}::`.

```text
plugin/
└── Modules/
    └── Example/
        └── resources/
            └── views/
                ├── admin/
                │   ├── index.blade.php
                │   ├── create.blade.php
                │   └── edit.blade.php
                └── client/
                    ├── index.blade.php
                    └── show.blade.php
```

Render via: `view('module.example::admin.index')` or `view('module.example::client.show')`.

---

## Conclusion

By implementing the `ModuleInterface` methods and letting Billmora's event system handle the wiring, you can build powerful extensions with minimal boilerplate. Whether you need a simple webhook integration (event-only) or a full-stack feature with its own database, routes, controllers, and views — the `AbstractPlugin` foundation gives you everything you need to build it cleanly and maintainably.
