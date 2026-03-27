---
title: Plugin Conventions & Standards
description: Universal conventions and standards required for building interoperable Billmora Gateway, Provisioning, and Module plugins.
---
# Plugin Conventions & Standards

This guide documents the **universal conventions** that apply to all Billmora plugin types (Gateway, Provisioning, Module). These rules ensure consistency, prevent conflicts, and make plugins interoperable with Billmora's core engine.

---

## 1. Directory Structure

All plugins live under the `plugin/` directory, organized by type:

```text
plugin/
├── Gateways/
│   └── Example/
│       ├── ExampleGateway.php          ← Main class
│       ├── plugin.json                 ← Manifest
│       ├── database/migrations/        ← Auto-loaded by AbstractPlugin
│       ├── Models/                     ← Eloquent models
│       ├── Http/Controllers/           ← Controllers
│       ├── routes/                     ← admin.php, client.php, api.php
│       └── resources/views/            ← Blade templates
├── Provisionings/
│   └── ...
└── Modules/
    └── ...
```

::: tip
Not every directory is required. Only create what your plugin needs. A simple event-only module might only have the main class and `plugin.json`.
:::

---

## 2. Namespace & Autoloading

Billmora uses **PSR-4** autoloading configured in `composer.json`:

```json
"autoload": {
    "psr-4": {
        "Plugins\\": "plugin/"
    }
}
```

Your namespace must mirror the directory path exactly:

| Plugin Path | Namespace |
|-------------|-----------|
| `plugin/Gateways/Stripe/StripeGateway.php` | `Plugins\Gateways\Stripe` |
| `plugin/Provisionings/Pterodactyl/PterodactylProvisioning.php` | `Plugins\Provisionings\Pterodactyl` |
| `plugin/Modules/Announcement/AnnouncementModule.php` | `Plugins\Modules\Announcement` |
| `plugin/Modules/Announcement/Models/AnnouncementPost.php` | `Plugins\Modules\Announcement\Models` |

::: warning
After creating a new plugin or adding new classes, run `composer dump-autoload` to regenerate the autoload map.
:::

---

## 3. The `plugin.json` Manifest

Every plugin requires a `plugin.json` manifest file. This declares your plugin's identity to Billmora's core engine.

```json
{
    "name": "Human-Readable Name",
    "provider": "UniqueSlug",
    "type": "gateway | provisioning | module",
    "version": "1.0.0",
    "description": "Short description of what this plugin does.",
    "author": "Your Name / Team",
    "icon": "https://url-to-logo.png"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Display name shown in Admin Panel. |
| `provider` | ✅ | Unique slug, must match your directory name. Used for routing and view namespacing. |
| `type` | ✅ | One of: `gateway`, `provisioning`, `module`. |
| `version` | ✅ | Semantic version string. |
| `description` | ✅ | Short description for the plugin listing. |
| `author` | ✅ | Author name or team. |
| `icon` | | Absolute URL to logo (displayed on checkout for gateways). |

---

## 4. Database Migrations

### Table Prefix Convention

All plugin database tables **must** use a type-specific prefix to prevent name collisions with Billmora's core tables and other plugins:

| Plugin Type | Prefix | Example Table |
|-------------|--------|---------------|
| Gateway | `pg_` | `pg_stripe_logs` |
| Provisioning | `pp_` | `pp_pterodactyl_configs` |
| Module | `pm_` | `pm_announcement_posts` |

::: danger Never Use Unprefixed Tables
Using table names without the correct prefix (e.g., `announcements` instead of `pm_announcements`) may conflict with future Billmora core tables or other plugins. This is a strict requirement.
:::

### Migration File Location

Place migration files inside your plugin's `database/migrations/` directory. Billmora's `AbstractPlugin` automatically discovers and runs them during `php artisan migrate`.

```text
plugin/Modules/Example/
└── database/
    └── migrations/
        └── 2026_01_01_000000_create_pm_example_items_table.php
```

### Migration File Naming

Follow Laravel's standard migration naming convention with the prefixed table name:

```
{YYYY}_{MM}_{DD}_{HHMMSS}_create_{prefix}_{plugin}_{table}_table.php
```

**Examples:**
- `2026_03_23_000000_create_pm_announcement_posts_table.php`
- `2026_03_23_000001_create_pg_stripe_webhook_logs_table.php`
- `2026_03_23_000000_create_pp_cloudways_servers_table.php`

### Model Table Declaration

Your Eloquent models **must** explicitly declare the `$table` property with the prefixed table name, since Laravel's auto-guess will not include the prefix:

```php
namespace Plugins\Modules\Announcement\Models;

use Illuminate\Database\Eloquent\Model;

class AnnouncementPost extends Model
{
    protected $table = 'pm_announcement_posts';
}
```

---

## 5. View Namespacing

Billmora automatically registers a view namespace for your plugin based on `type` and `provider`:

```
{type}.{provider}::
```

| Plugin | Namespace | Example Usage |
|--------|-----------|---------------|
| Gateway `Example` | `gateway.example::` | `view('gateway.example::popup')` |
| Provisioning `Pterodactyl` | `provisioning.pterodactyl::` | `view('provisioning.pterodactyl::console')` |
| Module `Announcement` | `module.announcement::` | `view('module.announcement::admin.index')` |

Views must be placed inside `resources/views/` within your plugin directory:

```text
plugin/Modules/Announcement/
└── resources/
    └── views/
        ├── admin/
        │   └── index.blade.php
        └── client/
            └── show.blade.php
```

---

## 6. Route Registration

Billmora's `AbstractPlugin` auto-loads route files from the `routes/` directory with appropriate middleware, URL prefixes, and name prefixes:

| File | Middleware | URL Prefix | Name Prefix |
|------|-----------|------------|-------------|
| `routes/admin.php` | `web`, `auth`, `admin` | `/admin/{types}/{provider}` | `admin.{types}.{provider}.` |
| `routes/client.php` | `web`, `maintenance` | `/{provider}` | `client.{types}.{provider}.` |
| `routes/portal.php` | `web` | `/{provider}` | `portal.{types}.{provider}.` |
| `routes/api.php` | `api` | `/api/{types}/{provider}` | `api.{types}.{provider}.` |

> `{types}` is the **pluralized lowercase** version of `type` (e.g., `module` → `modules`).

**Example for a Module called `Announcement`:**

| File | URL Prefix | Name Prefix |
|------|------------|-------------|
| `routes/admin.php` | `/admin/modules/announcement` | `admin.modules.announcement.` |
| `routes/client.php` | `/announcement` | `client.modules.announcement.` |

::: tip
Only create the route files you need. If your plugin has no admin interface, skip `routes/admin.php`.
:::

---

## 7. Configuration Access

Config values defined in `getConfigSchema()` are stored in the database when the admin saves plugin settings. Access them anywhere in your plugin class:

```php
// Single value
$apiKey = $this->getInstanceConfig('api_key');

// With default fallback
$timeout = $this->getInstanceConfig('timeout', 30);
```

---

## 8. Audit Logging

Use the `AuditsSystem` trait in your controllers for tracking admin actions:

```php
use App\Traits\AuditsSystem;

class MyController extends Controller
{
    use AuditsSystem;

    public function store(Request $request)
    {
        $record = MyModel::create([...]);
        $this->recordCreate('module.example.create', $record->toArray());
    }

    public function update(Request $request, MyModel $record)
    {
        $old = $record->getOriginal();
        $record->update([...]);
        $this->recordUpdate('module.example.update', $old, $record->getChanges());
    }

    public function destroy(MyModel $record)
    {
        $this->recordDelete('module.example.delete', $record->toArray());
        $record->delete();
    }
}
```

---

## Conclusion

Following these conventions ensures your plugin integrates seamlessly with Billmora's core engine. For type-specific implementation details, refer to:
- [**Gateway Plugin Development**](./../gateway.md)
- [**Provisioning Plugin Development**](./../provisioning.md)
- [**Module Plugin Development**](./../module.md)
- [**Schema Engine Reference**](./schema.md)
