# Theme Configuration Reference

Themes in Billmora can offer administrators customizable settings (such as branding colors, hero text, and logos) dynamically from the dashboard, without ever needing to edit code. This is achieved by placing a `config.blade.php` file at the root of your theme folder.

## The `config.blade.php` File

When Billmora detects a `config.blade.php` file inside your theme's directory (e.g., `/resources/themes/client/mytheme/config.blade.php`), a **"Configure"** button will automatically appear alongside your theme in the Admin Panel.

### Standard Structure

This file serves as a standalone view loaded within the Admin context. It must contain an HTML `<form>` that POSTs to the thematic configuration update route relative to the provided `$theme` model:

```blade
<form action="{{ route('admin.themes.config.update', $theme->id) }}" method="POST">
    @csrf

    <!-- Your custom input fields -->
    <input type="text" name="hero_title" value="{{ old('hero_title', $theme->config['hero_title'] ?? '') }}" />

    <button type="submit">Save</button>
</form>
```

### Retrieving & Saving Values

Data submitted by this form is serialized into the `config` JSON column of the database theme record.

Inside the `config.blade.php` form itself, you must retrieve previously saved values using the active theme model property: `$theme->config['key']`. 

However, in your actual **frontend theme views** (such as `views/layouts/app.blade.php` or `views/index.blade.php`), you should access these configurations using Billmora's dedicated global helper functions. These helpers correspond directly to the specific type of theme you are building:

| Theme Type | Helper Function             | Example Usage |
|------------|-----------------------------|---------------|
| **Admin**  | `adminThemeConfig()`        | `$adminThemeConfig('primary_color', '#1f2937')` |
| **Client** | `clientThemeConfig()`       | `$clientThemeConfig('hero_title', 'Welcome Back')` |
| **Portal** | `portalThemeConfig()`       | `$portalThemeConfig('catalog_title')` |
| **Email**  | `emailThemeConfig()`        | `$emailThemeConfig('footer_text', 'Default Footer')` |
| **Invoice**| `invoiceThemeConfig()`      | `$invoiceThemeConfig('company_logo')` |

The first argument is your configuration `key` name, and the optional second argument establishes a fallback default value if the key does not exist.

### Utilizing Components

When building your configuration page, you're entirely free to use custom raw HTML and Tailwind classes. However, leveraging Billmora's built-in Blade components maintains a consistent, native UI experience.

For example, utilizing the `portal` or `client` component library for standardized form inputs:

```blade
<x-portal::input 
    name="catalog_title"
    label="Catalog Product Title"
    value="{{ old('catalog_title', $theme->config['catalog_title'] ?? '') }}"
    required
/>

<x-client::textarea
    name="auth_message"
    label="Login Screen Message"
    rows="4"
    required
>{{ old('auth_message', $theme->config['auth_message'] ?? '') }}</x-client::textarea>
```

For advanced dynamic configurations—such as live color-pickers demonstrating color scales—you can freely embed AlpineJS `x-data` blocks within this file (as seen in the core Moraine theme). 
