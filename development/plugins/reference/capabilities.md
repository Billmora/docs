---
title: Plugin Capabilities Reference
description: Reference for capabilities shared by all Billmora plugin types — Module, Provisioning, Gateway, and Registrar.
---

# Plugin Capabilities Reference

All Billmora plugin types — **Module, Provisioning, Gateway, and Registrar** — extend the same `App\Support\AbstractPlugin` base class. Every capability documented here works identically across all plugin types.

---

## 1. Navigation Menus

Inject navigation items into Billmora's **Admin**, **Client**, or **Portal** areas by overriding the corresponding method. The `PluginManager` automatically collects and renders navigation from all active plugins, regardless of type.

### Admin Navigation

```php
public function getNavigationAdmin(): array
{
    return [
        'my_feature' => [
            'label'      => 'My Feature',
            'icon'       => 'lucide-server',
            'route'      => route('admin.provisionings.myplugin.index'),
            'permission' => 'provisionings.myplugin.manage', // optional
        ],
    ];
}
```

### Client Navigation

```php
public function getNavigationClient(): array
{
    return [
        'my_feature' => [
            'label' => 'My Feature',
            'icon'  => 'lucide-globe',
            'route' => route('client.provisionings.myplugin.index'),
        ],
    ];
}
```

### Portal Navigation

```php
public function getNavigationPortal(): array
{
    return [
        'my_feature' => [
            'label' => 'My Feature',
            'icon'  => 'lucide-user',
            'route' => route('portal.provisionings.myplugin.index'),
        ],
    ];
}
```

**Navigation item properties:**

| Property     | Type     | Required | Description                                                   |
| ------------ | -------- | -------- | ------------------------------------------------------------- |
| `label`      | `string` | ✅       | The text shown in the navigation menu.                        |
| `icon`       | `string` | ✅       | A Lucide icon name (e.g., `lucide-server`).                   |
| `route`      | `string` | ✅       | The fully resolved URL. Use the `route()` helper.             |
| `permission` | `string` |          | If set, the item is only shown to users with this permission. |
| `auth`       | `bool`   |          | `true` = only authenticated users. `false` = only guests.     |

::: warning
Navigation `route()` calls are resolved at boot time. Your `routes/admin.php` (or equivalent) must exist and be valid before the navigation is collected.
:::

---

## 2. Custom Permissions

Register custom permissions that appear in **Admin → Settings → Roles & Permissions**. Permissions are created automatically when the plugin is activated and removed when deactivated.

```php
public function getPermissions(): array
{
    return [
        'provisionings.myplugin.manage',
    ];
}
```

::: tip Naming Convention
Follow the pattern `{type}s.{provider}.{action}` to avoid conflicts. For example: `provisionings.proxmox.manage`, `gateways.stripe.view`.
:::

---

## 3. Custom Routes

Place route files inside the `routes/` directory. `AbstractPlugin` auto-loads them with the correct middleware, URL prefix, and name prefix.

| File                | Middleware             | URL Prefix                  | Name Prefix                  |
| ------------------- | ---------------------- | --------------------------- | ---------------------------- |
| `routes/admin.php`  | `web`, `auth`, `admin` | `/admin/{types}/{provider}` | `admin.{types}.{provider}.`  |
| `routes/client.php` | `web`, `maintenance`   | `/{provider}`               | `client.{types}.{provider}.` |
| `routes/portal.php` | `web`                  | `/{provider}`               | `portal.{types}.{provider}.` |
| `routes/api.php`    | `api`                  | `/api/{types}/{provider}`   | `api.{types}.{provider}.`    |

> `{types}` is the **pluralized lowercase** type (e.g., `provisioning` → `provisionings`).

::: tip
Only create the route files your plugin needs. See [**Conventions → Route Registration**](./conventions.md#_6-route-registration) for the full routing table with concrete examples.
:::

---

## 4. Database Migrations

Place migrations in the `database/migrations/` directory. `AbstractPlugin` discovers and runs them automatically during `php artisan migrate`.

See [**Conventions → Database Migrations**](./conventions.md#_4-database-migrations) for the required table prefix conventions (`pg_`, `pp_`, `pm_`, `pr_`).

---

## 5. Custom Views

Place Blade templates inside `resources/views/`. `AbstractPlugin` registers the view namespace automatically based on type and provider.

| Plugin                 | Namespace                | Example                                              |
| ---------------------- | ------------------------ | ---------------------------------------------------- |
| Provisioning `Proxmox` | `provisioning.proxmox::` | `view('provisioning.proxmox::admin.ip-pools.index')` |
| Gateway `Stripe`       | `gateway.stripe::`       | `view('gateway.stripe::popup')`                      |
| Module `Announcement`  | `module.announcement::`  | `view('module.announcement::admin.index')`           |
| Registrar `Example`    | `registrar.example::`    | `view('registrar.example::admin.index')`             |

---

## 6. Event Subscription (`getSubscribedEvents`)

Any plugin type can subscribe to Billmora's system-wide events by returning a map of event classes to handler method names.

```php
public function getSubscribedEvents(): array
{
    return [
        \App\Events\Invoice\Paid::class                      => 'onInvoicePaid',
        \App\Events\Service\ProvisioningActivated::class     => 'onServiceActivated',
    ];
}

public function onInvoicePaid(\App\Events\Invoice\Paid $event): void
{
    $invoice = $event->invoice;
    // ...
}

public function onServiceActivated(\App\Events\Service\ProvisioningActivated $event): void
{
    $service = $event->service;
    // ...
}
```

::: tip
If your plugin does not need to listen to any events, do not override `getSubscribedEvents()`. The default implementation in `AbstractPlugin` returns an empty array.
:::

See the [**Event Reference**](./events.md) for the complete list of all available events and their payload properties.

---

## 7. The `setup()` Lifecycle Hook

`AbstractPlugin` provides an optional `setup()` method called after `boot()`. Override it in your plugin to run any one-time initialization logic that should fire on every request where the plugin is active — without overriding the full `boot()` method.

```php
protected function setup(): void
{
    // Register additional bindings, macros, config overrides, etc.
    \Illuminate\Support\Facades\Config::set('my-service.debug', $this->getInstanceConfig('debug_mode', false));
}
```

::: tip
`setup()` is called after routes and migrations are already registered. It is the safest place for any custom IoC bindings or config overrides that depend on plugin settings.
:::

---

## 8. Accessing the Plugin Model (`getPluginModel`)

When a plugin is instantiated from a database record, `AbstractPlugin` automatically receives the Eloquent `Plugin` model instance. This gives you access to the plugin's database record (`id`, `name`, `is_active`) directly from within your plugin class.

This is especially useful when you need to scope data to a specific plugin instance (e.g., scoping IP pools to a specific Proxmox instance).

```php
$plugin = $this->getPluginModel();

if ($plugin) {
    $pluginId = $plugin->id;     // e.g., 3
    $name     = $plugin->name;   // e.g., "Proxmox Singapore"
}
```

**Common use case — scoping queries:**

```php
// Query records that belong to THIS specific plugin instance only
$ipPool = \Plugins\Provisionings\Proxmox\Models\ProxmoxIpPool::where('plugin_id', $this->getPluginModel()->id)
    ->where('is_active', true)
    ->first();
```
