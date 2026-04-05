---
title: Provisioning Plugin Development
description: Documentation on creating Provisioning plugins to integrate third-party service providers like game hosting and VPS into Billmora.
---
# Provisioning Plugin Development

Billmora uses a **Lifecycle-Driven Architecture** for its provisioning ecosystem. Developing a Provisioning plugin allows you to integrate any third-party service provider (game hosting, web hosting, VPS, etc.) directly into Billmora.

Because of this architecture, your plugin **never** needs to directly update the service status. Billmora's core engine handles all status transitions (`pending` → `active` → `suspended` → `terminated`), stock management, and event dispatching automatically. Your only responsibility is to communicate with the remote provider's API.

---

## 1. Directory Structure & Namespace

Provisioning plugins must reside within the `plugin/Provisionings/` directory. If you are building a provisioning called **Example**, your directory layout must look like this:

```text
plugin/
└── Provisionings/
    └── Example/
        ├── ExampleProvisioning.php
        └── plugin.json
```

Consistent with PSR-4 standards, your plugin namespace should match the directory structure:
`namespace Plugins\Provisionings\Example;`

---

## 2. The `plugin.json` Manifest

Every plugin requires a `plugin.json` manifest file. This file tells Billmora's core engine how to discover and load your provisioning plugin. Ensure the format strictly follows this structure:

```json
{
    "name": "Example Hosting",
    "provider": "Example",
    "type": "provisioning",
    "version": "1.0.0",
    "description": "Automatically provision and manage hosting services via Example API.",
    "author": "Your Name / Team",
    "icon": "https://url-to-your-provider-logo.png"
}
```

::: info Configuration Metrics

- **`type`**: Must strictly be `"provisioning"`.
- **`provider`**: The unique identifier/slug for your provisioning plugin.
- **`icon`**: An absolute URL to the provider's logo, which will be displayed in the Admin Panel.
  :::

---

## 3. The Main Plugin Class

Your provisioning's main PHP class must extend `App\Support\AbstractPlugin` and implement the `App\Contracts\ProvisioningInterface`.

```php
<?php

namespace Plugins\Provisionings\Example;

use App\Contracts\ProvisioningInterface;
use App\Support\AbstractPlugin;
use App\Models\Service;
use App\Exceptions\ProvisioningException;

class ExampleProvisioning extends AbstractPlugin implements ProvisioningInterface
{
    // Implementation comes here...
}
```

---

## 4. Admin Configuration (`getConfigSchema`)

You don't need to build any HTML forms for your plugin's admin settings. Billmora automatically renders the settings UI in the Admin Panel based on the schema you provide.

Use the `getConfigSchema()` method to define the credentials your provisioning plugin requires to communicate with the remote provider.

::: tip Schema Documentation
Billmora supports an extensive library of UI components (Selects, Toggles, Radios, Checkboxes, etc.).
Please read the [**Plugin Reference Schema Guide**](./reference/schema.md) to see the full list of supported fields and properties.
:::

```php
public function getConfigSchema(): array
{
    return [
        'panel_url' => [
            'type'        => 'url',
            'label'       => 'Panel URL',
            'placeholder' => 'https://panel.example.com',
            'rules'       => 'required|url'
        ],
        'api_key' => [
            'type'   => 'password',
            'label'  => 'API Key',
            'helper' => 'Requires an Application API key with read/write permissions.',
            'rules'  => 'required|string'
        ],
    ];
}
```

::: tip
You can easily retrieve these values anywhere in your class later using `$this->getInstanceConfig('api_key');`.
:::

---

## 5. Package Configuration (`getPackageSchema`)

This schema defines the **per-package** resource settings that an Admin configures when creating or editing a Package in the Admin Panel. These values typically represent the resource limits that the remote provider requires.

```php
public function getPackageSchema(): array
{
    return [
        'memory' => [
            'type'    => 'number',
            'label'   => 'Memory (MB)',
            'rules'   => 'required|integer|min:0',
            'default' => 1024
        ],
        'disk' => [
            'type'    => 'number',
            'label'   => 'Disk Space (MB)',
            'rules'   => 'required|integer|min:0',
            'default' => 5000
        ],
    ];
}
```

These values are stored in the `provisioning_config` JSON column of the `packages` table and are automatically passed to your lifecycle methods via `$service->package->provisioning_config`.

::: tip Dynamic Values with Variants
Billmora supports **Variants** — dynamic options with individual pricing (e.g., different server locations, different tiers). Variant codes are automatically merged into the package configuration at runtime, effectively overriding any matching keys. For example, if you define a Variant with code `location_id`, and the customer selects an option with value `5`, the `location_id` in the final configuration will be `5` instead of the package default.
:::

---

## 6. Checkout Schema (`getCheckoutSchema`)

This schema defines additional fields that the **end-user (client)** fills out during checkout. These are non-pricing, informational fields specific to the provisioning provider.

```php
public function getCheckoutSchema(): array
{
    return [
        'server_name' => [
            'type'        => 'text',
            'label'       => 'Server Name',
            'placeholder' => 'My Awesome Server',
            'rules'       => 'required|string|min:3|max:100'
        ],
    ];
}
```

These values are stored in the `configuration` JSON column of the `services` table and are accessible via `$service->configuration`.

---

## 7. Connection Testing (`testConnection`)

This method is called from the Admin Panel when the admin clicks "Test Connection". You must verify that the provided credentials can successfully communicate with the remote provider's API.

```php
public function testConnection(array $config): bool
{
    $url = rtrim($config['panel_url'], '/') . '/api/status';

    $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . $config['api_key'],
        'Accept'        => 'application/json',
    ])->get($url);

    if (!$response->successful()) {
        throw new ProvisioningException('Connection failed. HTTP Status: ' . $response->status(), ['response' => $response->json() ?: $response->body()]);
    }

    return true;
}
```

::: warning
The `$config` parameter is passed directly from the admin form input, **not** from `$this->getInstanceConfig()`. This is because the connection test may run before the config is saved.
:::

---

## 8. Service Lifecycle Methods

These are the core methods that Billmora calls automatically throughout a service's lifecycle. Each method receives the full `Service` Eloquent model.

### `create(Service $service)`

Called automatically when the first invoice is paid (via the `ProvisionOnInvoicePaid` listener). Your plugin must create the actual resource on the remote provider.

**Key data sources:**

| Source             | Access                                   | Description                                     |
| ------------------ | ---------------------------------------- | ----------------------------------------------- |
| Package Config     | `$service->package->provisioning_config` | Resource limits set by the Admin.               |
| Checkout Input     | `$service->configuration`                | Client-submitted data from `getCheckoutSchema`. |
| Variant Selections | `$service->variant_selections`           | Selected variant options with their values.     |
| User               | `$service->user`                         | The Billmora user who owns this service.        |

```php
public function create(Service $service): void
{
    $config = $service->package->provisioning_config ?? [];
    $clientInput = $service->configuration ?? [];

    // 1. Sync or create user on the remote provider
    // 2. Build the creation payload using $config and $clientInput
    // 3. Call the remote API to create the resource
    // 4. Throw a ProvisioningException if creation fails to capture full audited response
}
```

::: tip Stateless ID Resolution
If the remote provider supports an `external_id` concept (like Pterodactyl), you can pass `$service->id` as the external identifier during creation. This allows you to **avoid storing remote IDs** locally in Billmora's database, keeping the `subscription_id` column clean for gateway subscriptions (PayPal, Stripe, etc.).

If the remote provider does **not** support `external_id`, you can store the provider's resource ID in `$service->configuration` as a fallback strategy.
:::

### `suspend(Service $service)`

Called when a service must be suspended (overdue payment, admin action, etc.).

```php
public function suspend(Service $service): void
{
    $serverId = $this->resolveRemoteId($service);

    // Call the remote API to suspend the resource
}
```

### `unsuspend(Service $service)`

Called when a suspended service is reactivated (payment received, admin action, etc.).

```php
public function unsuspend(Service $service): void
{
    $serverId = $this->resolveRemoteId($service);

    // Call the remote API to unsuspend the resource
}
```

### `terminate(Service $service)`

Called when a service is permanently terminated.

```php
public function terminate(Service $service): void
{
    $serverId = $this->resolveRemoteId($service);

    // Call the remote API to delete the resource
}
```

### `renew(Service $service)`

Called when a recurring service is renewed. Many providers don't require any action here since the billing is handled by Billmora and the resource continues running.

```php
public function renew(Service $service): void
{
    // No action required for most providers (billing-only renewal)
}
```

### `scale(Service $service, array $newConfig)`

Called when a service's resource limits are upgraded or downgraded.

```php
public function scale(Service $service, array $newConfig): void
{
    $serverId = $this->resolveRemoteId($service);

    // Call the remote API to update resource limits
}
```

---

## 9. Client Actions

Client Actions allow end-users to interact with their provisioned services directly from the Billmora Client Area. These actions appear as buttons on the service detail page and can range from simple external links to dynamic forms with server-side validation.

::: info Security
Client Actions are **only available for active services**. Billmora's controller automatically verifies that the service belongs to the authenticated user and that the service status is `active` before any action is processed. You do not need to implement these checks yourself.
:::

### 9.1 Defining Actions with `getClientAction`

Return an associative array where each **key is a unique slug** that identifies the action. The slug is used internally for routing and must be unique within the plugin. Billmora supports **4 action types**:

| Type     | HTTP       | Behavior                                                                          |
| -------- | ---------- | --------------------------------------------------------------------------------- |
| `link`   | POST       | Redirects the user to an external URL via `handleClientAction`.                   |
| `page`   | GET        | Renders a custom Blade view inline within Billmora via `handleClientAction`.      |
| `submit` | POST       | Sends an immediate POST request with no additional input. Fast one-click actions. |
| `form`   | GET + POST | First renders a dynamic form (GET), then submits the validated data (POST).       |

#### Action Properties

| Property | Type     | Required          | Description                                                 |
| -------- | -------- | ----------------- | ----------------------------------------------------------- |
| `label`  | `string` | ✅                | The button text displayed to the client.                    |
| `icon`   | `string` | ✅                | A [Font Awesome](https://fontawesome.com/icons) icon class. |
| `type`   | `string` | ✅                | One of: `link`, `page`, `submit`, `form`.                   |
| `method` | `string` | Only for `submit` | HTTP method for the button (e.g., `POST`).                  |
| `schema` | `array`  | Only for `form`   | A schema array identical in format to `getConfigSchema()`.  |

::: tip Schema Reuse
The `schema` property inside a `form` action uses the **exact same schema format** as `getConfigSchema()`, `getPackageSchema()`, and `getCheckoutSchema()`. All field types (`text`, `select`, `toggle`, `password`, `textarea`, `radio`, `checkbox`, `number`, `email`, `url`) are fully supported. The `rules` property of each field is automatically extracted and validated server-side before `handleClientAction` is called.
:::

---

### 9.2 Action Types (Deep Dive)

Each action type has a specific flow through Billmora's `ProvisioningController`. Below is a detailed explanation for every type.

#### Type: `link`

The simplest action type. When clicked, Billmora sends a **POST** request to `handleClientAction`. Your handler should return a `redirect()->away()` response pointing to the external URL.

**Definition:**

```php
'panel' => [
    'label' => 'Login to Control Panel',
    'icon'  => 'fa-solid fa-server',
    'type'  => 'link',
],
```

**Handler:**

```php
case 'panel':
    $panelUrl = rtrim($this->getInstanceConfig('panel_url'), '/');
    return redirect()->away($panelUrl);
```

::: tip
You can also return a plain URL string instead of `redirect()->away()`. Billmora's controller will automatically detect valid URLs and redirect the user.

```php
case 'panel':
    return rtrim($this->getInstanceConfig('panel_url'), '/');
```

:::

---

#### Type: `page`

This type renders a **custom Blade view inline** within Billmora's Client Area layout. When clicked, a **GET** request is sent to `handleClientAction`. Your handler must return a `view()` instance. The view is rendered inside Billmora's service workspace, giving the user a seamless embedded experience.

**Definition:**

```php
'console' => [
    'label' => 'Web Console',
    'icon'  => 'fa-solid fa-terminal',
    'type'  => 'page',
],
```

**Handler:**

```php
case 'console':
    return view('provisioning.example::client.services.console', [
        'service' => $service,
        'token'   => $this->generateConsoleToken($service),
    ]);
```

::: info Custom View Placement
Place your `.blade.php` files inside your plugin's `resources/views/` directory. Billmora automatically registers the view namespace as `provisioning.{provider}::`.

```text
plugin/
└── Provisionings/
    └── Example/
        ├── ExampleProvisioning.php
        ├── plugin.json
        └── resources/
            └── views/
                └── client/
                    └── services/
                        └── console.blade.php
```

Render via: `view('provisioning.example::client.services.console')`
:::

::: tip
Billmora automatically injects a `$clientActions` variable into your view containing the full list of defined actions. You can use this to render navigation tabs or sidebar menus within your custom page.
:::

---

#### Type: `submit`

A one-click action that sends a **POST** request immediately without any additional user input. Ideal for fire-and-forget operations.

**Definition:**

```php
'restart' => [
    'label'  => 'Restart Server',
    'icon'   => 'fa-solid fa-rotate',
    'type'   => 'submit',
    'method' => 'POST',
],
```

**Handler:**

```php
case 'restart':
    // Execute the API call to the remote provider
    Http::withHeaders($this->headers())
        ->post($this->url('/servers/' . $remoteId . '/power/restart'));

    // Return null → Billmora shows a default success message
    return null;
```

**Return value behavior:**

- `null` → Shows Billmora's default success message.
- `string` → Shows your custom success message to the user.
- Throw `\Exception` → Billmora catches the exception and displays the error message.

---

#### Type: `form`

The most powerful action type. This creates a **two-step flow**:

1. **GET Request**: Billmora renders a dynamic form UI using the `schema` you defined in `getClientAction`. The form fields are automatically generated — no Blade files needed.
2. **POST Request**: When the user submits the form, Billmora **automatically validates** the input against the `rules` defined in each schema field. Only after validation passes does it call `handleClientAction` with the validated `$data`.

**Definition:**

```php
'reinstall' => [
    'label'  => 'Reinstall OS',
    'icon'   => 'fa-brands fa-ubuntu',
    'type'   => 'form',
    'schema' => [
        'os_list' => [
            'type'    => 'select',
            'label'   => 'Operating System',
            'options' => [
                'ubuntu-22-04' => 'Ubuntu 22.04 LTS',
                'ubuntu-24-04' => 'Ubuntu 24.04 LTS',
                'debian-12'    => 'Debian 12 (Bookworm)',
            ],
            'default' => 'ubuntu-22-04',
            'rules'   => 'required|in:ubuntu-22-04,ubuntu-24-04,debian-12',
        ],
        'confirm_wipe' => [
            'type'  => 'toggle',
            'label' => 'I understand all data will be lost',
            'rules' => 'accepted',
        ],
    ],
],
```

**Handler:**

```php
case 'reinstall':
    // $data is already validated by Billmora at this point
    $os = $data['os_list'];

    Http::withHeaders($this->headers())
        ->post($this->url('/servers/' . $remoteId . '/reinstall'), [
            'os' => $os,
        ]);

    // Return a string → Billmora shows it as a custom success message
    return "Server is being reinstalled with {$os}. Please wait a few minutes.";
```

::: warning Automatic Validation
You do **not** need to validate form input manually inside `handleClientAction`. Billmora's controller automatically extracts the `rules` from your `schema` and validates the request before calling your handler. If validation fails, the user is redirected back with error messages — your handler is never invoked.
:::

---

### 9.3 Putting It All Together

Here is a complete, production-ready implementation demonstrating all 4 action types:

```php
public function getClientAction(Service $service): array
{
    return [
        'panel' => [
            'label' => 'Login to Control Panel',
            'icon'  => 'fa-solid fa-server',
            'type'  => 'link',
        ],
        'console' => [
            'label' => 'Web Console',
            'icon'  => 'fa-solid fa-terminal',
            'type'  => 'page',
        ],
        'restart' => [
            'label'  => 'Restart Server',
            'icon'   => 'fa-solid fa-rotate',
            'type'   => 'submit',
            'method' => 'POST',
        ],
        'reinstall' => [
            'label'  => 'Reinstall OS',
            'icon'   => 'fa-brands fa-ubuntu',
            'type'   => 'form',
            'schema' => [
                'os_list' => [
                    'type'    => 'select',
                    'label'   => 'Operating System',
                    'options' => [
                        'ubuntu-22-04' => 'Ubuntu 22.04 LTS',
                        'ubuntu-24-04' => 'Ubuntu 24.04 LTS',
                    ],
                    'default' => 'ubuntu-22-04',
                    'rules'   => 'required|in:ubuntu-22-04,ubuntu-24-04',
                ],
                'confirm_wipe' => [
                    'type'  => 'toggle',
                    'label' => 'I understand all data will be lost',
                    'rules' => 'accepted',
                ],
            ],
        ],
    ];
}

public function handleClientAction(Service $service, string $slug, array $data = [])
{
    switch ($slug) {
        case 'panel':
            return redirect()->away(rtrim($this->getInstanceConfig('panel_url'), '/'));

        case 'console':
            return view('provisioning.example::client.services.console', [
                'service' => $service,
            ]);

        case 'restart':
            // Call remote provider API ...
            return null;

        case 'reinstall':
            $os = $data['os_list'];
            // Call remote provider API ...
            return "Reinstalling with {$os}. Please wait a few minutes.";

        default:
            throw new \Exception("Unknown action: {$slug}");
    }
}
```

::: warning
Always include a `default` case that throws an exception. This ensures unknown or misspelled slugs are caught early and logged properly by Billmora's error handling system.
:::

---

## 10. Error Handling & Auditing

For external API failures, always use **`App\Exceptions\ProvisioningException`** instead of the generic `\Exception`. 

This allows Billmora's core engine to:
1.  Display a **concise, user-friendly message** in the UI alert.
2.  Record the **full technical response body** in the system audit logs for debugging.

```php
use App\Exceptions\ProvisioningException;

// ...

if (!$response->successful()) {
    throw new ProvisioningException(
        "Failed to create server. Status: " . $response->status(),
        ['response' => $response->json() ?: $response->body()]
    );
}
```

---

## 11. Best Practices

### Logging

Use Laravel's `Log` facade extensively. Billmora's admin interface surfaces these logs for debugging.

```php
Log::info('[Example] Creating server', ['service_id' => $service->id]);
Log::error('[Example] Server creation failed', ['response' => $response->body()]);
Log::debug('[Example] API Payload', ['payload' => $payload]);
```

### Detailed Error Reporting

When an API call fails, throw a `ProvisioningException` and pass the raw response data (JSON or body) in the second argument. This ensures that administrators can see exactly why an action failed when reviewing the system logs, without overwhelming the user interface with technical blobs.

### Stateless ID Resolution (Recommended)

If the remote provider supports `external_id` or similar concepts, pass `$service->id` during creation. This eliminates the need to store remote IDs in Billmora's database and prevents potential conflicts with the `subscription_id` column (reserved for gateway subscriptions).

```php
// During creation
$payload['external_id'] = (string) $service->id;

// During subsequent actions (suspend, terminate, etc.)
private function resolveRemoteId(Service $service): int
{
    $response = Http::withHeaders($this->headers())
        ->get($this->url('/servers/external/' . $service->id));

    if (!$response->successful()) {
        throw new \Exception('Could not resolve remote server for Service #' . $service->id);
    }

    return (int) $response->json('attributes.id');
}
```

### Fallback: Storing Remote IDs in Configuration

If the remote provider does **not** support external IDs, store the provider's resource ID in the service's `configuration` JSON column:

```php
// After creation
$remoteId = $response->json('id');
$config = $service->configuration ?? [];
$config['remote_server_id'] = $remoteId;
$service->update(['configuration' => $config]);

// During subsequent actions
$remoteId = $service->configuration['remote_server_id'] ?? null;
if (!$remoteId) {
    throw new \Exception('Remote server ID not found for Service #' . $service->id);
}
```

### Handling Variants

Billmora's Variant system allows admins to define dynamic, priced options (e.g., server location, egg type). These are automatically injected into the configuration at runtime. Use a helper to merge them:

```php
private function mergeVariants(Service $service, array $config): array
{
    if (empty($service->variant_selections)) {
        return $config;
    }

    $optionIds = collect($service->variant_selections)->flatten()->filter()->toArray();
    $options = \App\Models\VariantOption::with('variant')->whereIn('id', $optionIds)->get();

    foreach ($options as $option) {
        if ($option->variant && $option->variant->code) {
            $config[$option->variant->code] = $option->value;
        }
    }

    return $config;
}
```

::: tip
Ensure that the **Variant Code** in Billmora matches the key name used in your `getPackageSchema()`. For example, if you define `location_id` in your package schema, the admin should create a Variant with code `location_id` so it auto-overrides the package default.
:::

### Database Migrations

If your provisioning plugin requires its own database tables, place migrations in `database/migrations/`. All tables **must** use the `pp_` prefix.

::: tip
See the [**Plugin Conventions & Standards**](./reference/conventions.md#_4-database-migrations) guide for full details on table prefixes, migration naming, and model configuration.
:::

---

## Conclusion

By implementing the `ProvisioningInterface` methods and letting Billmora's core engine handle the lifecycle transitions, stock management, and event dispatching, you can build powerful hosting integrations with minimal boilerplate. Your plugin only needs to focus on speaking to the remote provider's API — Billmora takes care of the rest!
