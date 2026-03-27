---
title: Billmora Schema Engine
description: A guide to Billmora's auto-rendering UI schema engine for dynamically building settings and forms via PHP arrays.
---
# Billmora Schema Engine

Billmora features a robust, auto-rendering UI schema engine built deep into its core. Instead of manually writing HTML forms (`.blade.php`) every time you need to collect data or settings, you simply return a standardized PHP Array. 

Billmora's core engine parses this array and renders the beautifully styled HTML components (inputs, selects, toggles) directly into the UI, complete with automatic validation handling.

## Where is it Used?

This exact schema structure is universal across the entire Billmora ecosystem. You will encounter it when building or configuring:
- **Gateways** (`plugin/Gateways/...`)
- **Provisionings** (`plugin/Provisionings/...`)
- **Modules** (`plugin/Modules/...`)
- **Store Packages & Checkout Flow**
- *Any other system requiring dynamic user inputs.*

---

## Schema Structure

The schema is an associative array where the **key** is the unique identifier (database column/JSON key) for the setting, and the **value** is an array defining the field's properties.

```php
public function getConfigSchema(): array // (Or any method returning a schema)
{
    return [
        'setting_key_name' => [
            'type'        => 'text',
            'label'       => 'Display Label',
            'helper'      => 'A small hint text below the input.', // Optional
            'placeholder' => 'Enter value...', // Optional
            'default'     => 'Default Value', // Optional
            'rules'       => 'required|string|max:255', // Laravel validation rules
        ],
        // ... more configuration fields
    ];
}
```

## Global Properties

These properties map to almost all supported field types dynamically:

| Property | Type | Description |
|----------|------|-------------|
| `type` | `string` | **Required.** Determines the HTML/UI component to render (e.g., `text`, `select`, `toggle`). |
| `label` | `string` | **Required.** The human-readable label displayed prominently above the field. |
| `rules` | `string`&#124;`array` | **Optional.** Valid Laravel validation rules. Billmora explicitly uses these to validate form submissions under the hood. |
| `helper` | `string` | **Optional.** Hint text displayed beneath the field to assist the user. |
| `default` | `mixed` | **Optional.** The default value pre-filled if the user/admin hasn't configured it yet. |

---

## Supported Field Types

Billmora natively supports an extensive library of UI components. Simply change the `type` property in your array to utilize them.

### 1. Standard Inputs
Used for single-line text inputs.
- **Types:** `text`, `email`, `url`, `number`, `password`
- **Extra Properties:**
  - `placeholder` (`string`): Hint text inside the empty input box.

```php
'api_key' => [
    'type'  => 'password',
    'label' => 'API Key',
    'rules' => 'required'
]
```

### 2. Multi-line Text (`textarea`)
Used for larger blocks of text, scripts, or descriptions.
- **Extra Properties:**
  - `placeholder` (`string`)

```php
'public_rsa_key' => [
    'type'  => 'textarea',
    'label' => 'Public RSA Key',
]
```

### 3. Boolean Switch (`toggle`)
Renders a modern, animated toggle switch UI (True/False).
- **Behavior:** Saves as a boolean (`true`/`false`). The `default` property must be a boolean.

```php
'sandbox_mode' => [
    'type'    => 'toggle',
    'label'   => 'Enable Sandbox Mode',
    'default' => true
]
```

### 4. Dropdown (`select`)
Renders a structured dropdown menu. 
- **Extra Properties:**
  - `options` (`array`): **Required.** An associative array where the `key` is the hidden HTML value, and the `value` is the visual display text.

```php
'environment' => [
    'type'    => 'select',
    'label'   => 'API Environment',
    'options' => [
        'development' => 'Development Server',
        'staging'     => 'Staging Server',
        'production'  => 'Live Production'
    ],
    'rules'   => 'required|in:development,staging,production'
]
```

### 5. Radio Buttons (`radio`)
Renders a grouped list of radio buttons (select only one).
- **Extra Properties:**
  - `options` (`array`): **Required.** Key/Value pairs similar to `select`.

```php
'server_location' => [
    'type'    => 'radio',
    'label'   => 'Server Deployment Region',
    'options' => [
        'us' => 'United States',
        'eu' => 'Europe',
        'sg' => 'Singapore'
    ],
    'default' => 'sg'
]
```

### 6. Multiple Checkboxes (`checkbox`)
Renders a list of independent checkboxes allowing multiple selections.
- **Behavior:** Saves as an **Array** of values.
- **Extra Properties:**
  - `options` (`array`): **Required.** Key/Value pairs.

```php
'feature_flags' => [
    'type'    => 'checkbox',
    'label'   => 'Enable Features',
    'options' => [
        'ftp'    => 'FTP Access',
        'ssh'    => 'SSH Access',
        'backup' => 'Daily Backups'
    ],
    'default' => ['ftp', 'backup']
]
```

---

## Conclusion

By adopting this standardized schema engine across the framework, Billmora ensures that whether you are writing a Gateway plugin, configuring a Server Provisioning, or adding dynamic fields to a Store Package checkout, the UI remains perfectly beautiful, perfectly validated, and completely uniform—all without ever touching a single blade file.
