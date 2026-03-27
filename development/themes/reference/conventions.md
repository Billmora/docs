---
title: Theme Conventions & Standards
description: Universal standards and best practices for creating maintainable, conflict-free Billmora themes.
---
# Theme Conventions & Standards

This guide documents the **universal conventions** that apply to all Billmora custom themes (Admin, Client, Portal, Email, Invoice). These rules ensure your custom themes are maintainable, conflict-free, and seamlessly integrate into the Billmora ecosystem.

---

## 1. Directory Structure & Naming

The folder name of your new theme (e.g., `/admin/mytheme`) must perfectly match your `theme.json` internal structure output.

**Rules:**
- Written in **all-lowercase** without spaces.
- If your theme name consists of multiple words, use `kebab-case` (e.g., `/client/my-dark-theme`).

When overriding views, strictly map your `views/` folder structure to correspond with Billmora's core framework structure:

| Core View Path | Theme Override Path |
|----------------|---------------------|
| `views/auth/login.blade.php` | `views/auth/login.blade.php` |
| `views/account/settings.blade.php` | `views/account/settings.blade.php` |

::: danger Avoid Flat View Hierarchies
Never place views like `login.blade.php` at the root of your `views/` directory if the core system expects it to be inside an `auth/` sub-directory. Structural parity is required for the override to be resolved properly.
:::

---

## 2. Styling with Tailwind CSS

Billmora relies heavily on **Tailwind CSS**. 

**When writing custom views or components:**
- Utilize standard Tailwind utility classes directly in your HTML tags instead of writing custom CSS rules in `app.css`.
- Rely on `@apply` sparingly and only for highly repetitive component abstractions (like `.btn-primary` or `.card-panel`).

::: warning Namespace Conflicts
Avoid forcing global element selectors (like `button {}` or `div {}`) into your compileable `css/app.css`. Limit styles to classes or IDs. Global selectors will inadvertently inherit into core components if an un-overridden view is loaded alongside your custom layout.
:::

---

## 3. Preserving Livewire Reactivity

Because Billmora utilizes **Livewire v3** for its primary interactive layer:

- **Do NOT** override or destroy attributes like `wire:model`, `wire:click`, or `wire:submit` that are present in the core layout files you are copying. Removing these bindings severs the component's communication with the server.
- If you use **AlpineJS** for frontend UI toggles (e.g., dropdowns, modals, alerts), stick to standard `x-data` and `x-show` bindings. Alpine runs harmoniously alongside Livewire.

---

## 4. Theme Metadata (`theme.json`)

Every theme, compiled or not, **must** contain a `theme.json` file in its root directory. This manifest handles core theme discovery.

```json
{
    "name": "Human-Readable Name",
    "description": "Short description of what the theme looks like.",
    "author": "Your Name / Team",
    "version": "1.0.0",
    "type": "admin | client | portal | email | invoice",
    "assets": "/themes/admin/mytheme"
}
```

### Semantic Versioning
Always use [Semantic Versioning](https://semver.org/) (e.g., `1.0.0`) inside your `theme.json`. If you distribute your theme to other users, semantic versioning communicates exactly when an update brings new features (`1.1.0`) versus hotfixes for visual bugs (`1.0.1`).

---

## Conclusion

Following these formatting standards and best practices will make your Theme development predictable and robust. For implementation details on specific theme directories and compilation, refer to the individual theme development guides.
