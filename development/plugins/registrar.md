---
title: Registrar Plugin Development
description: Guide for developing Registrar plugins to integrate third-party domain registrars into Billmora.
---

# Registrar Plugin Development

Billmora uses a **Lifecycle-Driven Architecture** for its registrar ecosystem. Developing a Registrar plugin allows you to integrate any third-party domain registrar directly into Billmora.

Because of this architecture, your plugin **never** needs to directly manipulate the registrant status. Billmora core engine handles all status transitions (`pending` → `active` → `expired`), billing, and event dispatching automatically. Your only responsibility is to communicate with the registrar API.

---

## 1. Directory Structure & Namespace

Registrar plugins must reside within the `plugin/Registrars/` directory. If you are building a registrar called **Example**, your directory layout must look like this:

```text
plugin/
└── Registrars/
    └── Example/
        ├── ExampleRegistrar.php
        ├── plugin.json
        └── database/
            └── migrations/
```

Consistent with PSR-4 standards, your plugin namespace should match the directory structure:
`namespace Plugins\Registrars\Example;`

---

## 2. The `plugin.json` Manifest

Every plugin requires a `plugin.json` manifest file. This file tells Billmora core engine how to discover and load your registrar. Ensure the format strictly follows this structure:

```json
{
    "name": "Example Registrar",
    "provider": "Example",
    "type": "registrar",
    "version": "1.0.0",
    "description": "Register and manage domains via Example API.",
    "author": "Your Name / Team",
    "icon": "https://url-to-your-registrar-logo.png"
}
```

::: info Configuration Metrics

- **`type`**: Must strictly be `"registrar"`.
- **`provider`**: The unique identifier/slug for your registrar plugin.
- **`icon`**: An absolute URL to the registrar logo, which will be displayed in the Admin Panel.
:::

---

## 3. The Main Plugin Class

Your registrar main PHP class must extend `App\Support\AbstractPlugin` and implement the `App\Contracts\RegistrarInterface`.

```php
<?php

namespace Plugins\Registrars\Example;

use App\Contracts\RegistrarInterface;
use App\Support\AbstractPlugin;
use App\Models\Registrant;
use App\Exceptions\RegistrarException;

class ExampleRegistrar extends AbstractPlugin implements RegistrarInterface
{
    // Implementation comes here...
}
```

---

## 4. Admin Configuration (`getConfigSchema`)

You do not need to build any HTML forms for your plugin admin settings. Billmora automatically renders the settings UI in the Admin Panel based on the schema you provide.

Use the `getConfigSchema()` method to define the credentials your registrar requires to communicate with the remote provider.

::: tip Schema Documentation
Billmora supports an extensive library of UI components (Selects, Toggles, Radios, Checkboxes, etc.).
Please read the [**Plugin Reference Schema Guide**](./reference/schema.md) to see the full list of supported fields and properties.
:::

```php
public function getConfigSchema(): array
{
    return [
        "api_key" => [
            "type"   => "password",
            "label"  => "API Key",
            "rules"  => "required|string"
        ],
        "sandbox" => [
            "type"    => "boolean",
            "label"   => "Sandbox Mode",
            "default" => true,
            "rules"   => "boolean"
        ]
    ];
}
```

::: tip
You can easily retrieve these values anywhere in your class later using `$this->getInstanceConfig("api_key");`.

If your registrar has no global configuration, return an empty array.
:::

---

## 5. Connection Testing (`testConnection`)

The `testConnection()` method is called when an admin saves the plugin configuration in the Admin Panel. This allows you to validate credentials and API connectivity before the plugin is activated.

```php
public function testConnection(array $config): bool
{
    if (empty($config["api_key"])) {
        throw new RegistrarException("API Key is required.");
    }
    
    // Test API connectivity
    $response = Http::withHeaders([
        "Authorization" => "Bearer " . $config["api_key"],
    ])->get($this->url("/account/test"));
    
    if (!$response->successful()) {
        throw new RegistrarException(
            "Failed to connect to registrar API: " . $response->status(),
            ["response" => $response->json() ?: $response->body()]
        );
    }
    
    return true;
}
```

::: warning
Always throw `RegistrarException` for connection failures. This ensures the error message is displayed to the admin and the full technical details are logged for debugging.
:::

---

## 6. Domain Availability (`checkAvailability`)

The `checkAvailability()` method is called when a user searches for a domain during the checkout process. Return an array indicating availability, premium status, and optional pricing.

```php
public function checkAvailability(string $domain): array
{
    $response = Http::withHeaders($this->headers())
        ->get($this->url("/domains/check"), [
            "domain" => $domain,
        ]);
    
    if (!$response->successful()) {
        throw new RegistrarException(
            "Failed to check domain availability",
            ["response" => $response->body()]
        );
    }
    
    $data = $response->json();
    
    return [
        "available" => $data["available"] ?? false,
        "premium" => $data["premium"] ?? false,
        "price" => $data["price"] ?? null,
    ];
}
```

### Return Value Reference

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `available` | `bool` | ✅ | — | `true` if the domain is available for registration |
| `premium` | `bool` | | `false` | `true` if the domain is a premium domain with special pricing |
| `price` | `float?` | | `null` | The registration price (only required for premium domains) |

---

## 7. Domain Registration (`create`)

The `create()` method is called when a new domain registration is purchased. This method should register the domain with the registrar and store any necessary identifiers in the registrant configuration.

```php
public function create(Registrant $registrant): void
{
    $sandbox = $this->getInstanceConfig("sandbox", false);
    
    $payload = [
        "domain" => $registrant->domain,
        "years" => $registrant->years,
        "registrant" => [
            "name" => $registrant->user->name,
            "email" => $registrant->user->email,
            "phone" => $registrant->user->phone,
            "address" => $registrant->user->address,
            "city" => $registrant->user->city,
            "state" => $registrant->user->state,
            "country" => $registrant->user->country,
            "postal_code" => $registrant->user->postal_code,
        ],
        "nameservers" => $registrant->nameservers ?? [],
    ];
    
    $response = Http::withHeaders($this->headers())
        ->post($this->url("/domains/register"), $payload);
    
    if (!$response->successful()) {
        throw new RegistrarException(
            "Failed to register domain " . $registrant->domain,
            ["response" => $response->body()]
        );
    }
    
    $data = $response->json();
    
    // Store the registrar domain ID for future operations
    $configuration = $registrant->configuration ?? [];
    $configuration["registrar_domain_id"] = $data["id"];
    
    $registrant->update([
        "configuration" => $configuration
    ]);
    
    Log::info("[Example] Domain registered", [
        "domain" => $registrant->domain,
        "registrar_id" => $data["id"],
    ]);
}
```

::: tip
Always store the registrar domain ID in the registrant configuration. This is required for subsequent operations like renewals, transfers, and nameserver updates.
:::

---

## 8. Domain Transfer (`transfer`)

The `transfer()` method is called when a user initiates a domain transfer from another registrar. The EPP (Extensible Provisioning Protocol) code is provided as the second parameter.

```php
public function transfer(Registrant $registrant, string $eppCode): void
{
    $payload = [
        "domain" => $registrant->domain,
        "epp_code" => $eppCode,
        "registrant" => [
            "name" => $registrant->user->name,
            "email" => $registrant->user->email,
            // ... other contact details
        ],
    ];
    
    $response = Http::withHeaders($this->headers())
        ->post($this->url("/domains/transfer"), $payload);
    
    if (!$response->successful()) {
        throw new RegistrarException(
            "Failed to initiate transfer for " . $registrant->domain,
            ["response" => $response->body()]
        );
    }
    
    $data = $response->json();
    
    $configuration = $registrant->configuration ?? [];
    $configuration["registrar_domain_id"] = $data["id"];
    $configuration["transfer_status"] = "pending";
    
    $registrant->update([
        "configuration" => $configuration
    ]);
}
```

::: warning
Domain transfers can take several days to complete. Your plugin should handle the transfer status appropriately and use `syncStatus()` to check for completion.
:::

---

## 9. Domain Renewal (`renew`)

The `renew()` method is called when a domain renewal is processed. The second parameter specifies the number of years to renew.

```php
public function renew(Registrant $registrant, int $years = 1): void
{
    $registrarId = $registrant->configuration["registrar_domain_id"] ?? null;
    
    if (!$registrarId) {
        throw new RegistrarException(
            "Registrar domain ID not found for " . $registrant->domain
        );
    }
    
    $response = Http::withHeaders($this->headers())
        ->post($this->url("/domains/" . $registrarId . "/renew"), [
            "years" => $years,
        ]);
    
    if (!$response->successful()) {
        throw new RegistrarException(
            "Failed to renew domain " . $registrant->domain,
            ["response" => $response->body()]
        );
    }
    
    Log::info("[Example] Domain renewed", [
        "domain" => $registrant->domain,
        "years" => $years,
    ]);
}
```

---

## 10. Nameserver Management

### Getting Nameservers (`getNameservers`)

Return the current nameservers for a domain.

```php
public function getNameservers(Registrant $registrant): array
{
    $registrarId = $registrant->configuration["registrar_domain_id"] ?? null;
    
    if (!$registrarId) {
        return ["ns1.example.com", "ns2.example.com"];
    }
    
    $response = Http::withHeaders($this->headers())
        ->get($this->url("/domains/" . $registrarId . "/nameservers"));
    
    if (!$response->successful()) {
        throw new RegistrarException(
            "Failed to fetch nameservers for " . $registrant->domain,
            ["response" => $response->body()]
        );
    }
    
    return $response->json("nameservers", []);
}
```

::: info Return Type
This method must return `array<int, string>` — an array of nameserver strings.
:::

### Setting Nameservers (`setNameservers`)

Update the nameservers for a domain.

```php
public function setNameservers(Registrant $registrant, array $nameservers): void
{
    $registrarId = $registrant->configuration["registrar_domain_id"] ?? null;
    
    if (!$registrarId) {
        throw new RegistrarException(
            "Registrar domain ID not found for " . $registrant->domain
        );
    }
    
    $response = Http::withHeaders($this->headers())
        ->put($this->url("/domains/" . $registrarId . "/nameservers"), [
            "nameservers" => $nameservers,
        ]);
    
    if (!$response->successful()) {
        throw new RegistrarException(
            "Failed to update nameservers for " . $registrant->domain,
            ["response" => $response->body()]
        );
    }
    
    // Update local configuration
    $configuration = $registrant->configuration ?? [];
    $configuration["nameservers"] = $nameservers;
    
    $registrant->update([
        "configuration" => $configuration
    ]);
}
```

::: info Parameter Type
The `$nameservers` parameter must be `array<int, string>` — an array of nameserver strings.
:::

---

## 11. Status Synchronization (`syncStatus`)

The `syncStatus()` method is called periodically to sync the domain status from the registrar. This ensures Billmora records stay up-to-date with the registrar actual state.

```php
public function syncStatus(Registrant $registrant): array
{
    $registrarId = $registrant->configuration["registrar_domain_id"] ?? null;
    
    if (!$registrarId) {
        return [
            "status" => $registrant->status,
            "expires_at" => $registrant->expires_at?->toDateTimeString(),
        ];
    }
    
    $response = Http::withHeaders($this->headers())
        ->get($this->url("/domains/" . $registrarId));
    
    if (!$response->successful()) {
        throw new RegistrarException(
            "Failed to sync status for " . $registrant->domain,
            ["response" => $response->body()]
        );
    }
    
    $data = $response->json();
    
    // Map registrar status to Billmora status
    $statusMap = [
        "active" => "active",
        "expired" => "expired",
        "pending_transfer" => "pending_transfer",
        "transferred" => "active",
        "cancelled" => "cancelled",
    ];
    
    $status = $statusMap[$data["status"]] ?? $registrant->status;
    
    return [
        "status" => $status,
        "expires_at" => $data["expiration_date"] ?? $registrant->expires_at?->toDateTimeString(),
    ];
}
```

### Return Value Reference

| Property | Type | Description |
|----------|------|-------------|
| `status` | `string` | The synced domain status (active, expired, pending_transfer, cancelled) |
| `expires_at` | `string?` | The expiration date in datetime format (YYYY-MM-DD HH:MM:SS) |

::: tip
Billmora automatically updates the registrant status and expiration date based on the values returned by this method.
:::

---

## 12. Error Handling & Auditing

For external API failures, always use **`App\Exceptions\RegistrarException`** instead of the generic `\Exception`.

This allows Billmora core engine to:
1. Display a **concise, user-friendly message** in the UI alert.
2. Record the **full technical response body** in the system audit logs for debugging.

```php
use App\Exceptions\RegistrarException;

// ...

if (!$response->successful()) {
    throw new RegistrarException(
        "Failed to register domain. Status: " . $response->status(),
        ["response" => $response->json() ?: $response->body()]
    );
}
```

---

## 13. Best Practices

### Logging

Use Laravel `Log` facade extensively. Billmora admin interface surfaces these logs for debugging.

```php
Log::info("[Example] Checking availability", ["domain" => $domain]);
Log::error("[Example] Registration failed", ["response" => $response->body()]);
Log::debug("[Example] API Payload", ["payload" => $payload]);
```

### Storing Registrar IDs

Always store the registrar domain ID in the registrant configuration after successful registration or transfer. This is critical for all subsequent operations.

```php
$configuration = $registrant->configuration ?? [];
$configuration["registrar_domain_id"] = $data["id"];
$registrant->update(["configuration" => $configuration]);
```

### Handling Sandbox Mode

Many registrars provide sandbox environments for testing. Use the configuration to switch between sandbox and production endpoints.

```php
private function url(string $path): string
{
    $sandbox = $this->getInstanceConfig("sandbox", false);
    $baseUrl = $sandbox 
        ? "https://api-sandbox.example.com" 
        : "https://api.example.com";
    
    return $baseUrl . $path;
}
```

### Database Migrations

If your registrar plugin requires its own database tables, place migrations in `database/migrations/`. All tables **must** use the `pr_` prefix.

::: tip
See the [**Plugin Conventions & Standards**](./reference/conventions.md#_4-database-migrations) guide for full details on table prefixes, migration naming, and model configuration.
:::

---

## 14. Conclusion

By implementing the `RegistrarInterface` methods and letting Billmora core engine handle the billing, invoicing, and customer management, you can build powerful domain registration integrations with minimal boilerplate. Your plugin only needs to focus on speaking to the registrar API — Billmora takes care of the rest!
