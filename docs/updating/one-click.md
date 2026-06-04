---
title: One-Click Update
description: Learn how to update Billmora automatically directly from your dashboard.
---

# One-Click Update

The easiest and recommended way to update your Billmora installation is through the built-in **System Update** feature. This one-click update process automatically downloads the latest release, installs dependencies, and runs database migrations for you.

## Requirements

Before you can use the automatic update feature, ensure your environment meets the following criteria:

- **PHP 8.2+** must be active.
- **PharData Extension** must be enabled (used to extract `.tar.gz` files).
- **Composer** must be available in your system path.
- **Disk Space** must have at least **100 MB** of free space available.
- **Writable Directory:** The root directory of your Billmora installation must be writable by the web server user.

::: info Automated Pre-Check
You don't need to check these manually! When you visit the System Update page, Billmora will automatically verify all of these requirements and warn you if anything is missing.
:::

## How to Update

1. Log in to your Billmora Admin Dashboard.
2. Navigate to **System > System Update**.
3. If a new version is available, you will see a banner and the release notes for the new version.
4. Click the **Update Now** button.

### What Happens Next?

Billmora will perform the following steps automatically in the background:
1. Enable **Maintenance Mode** so your users see a friendly "Under Maintenance" page.
2. Download the latest release from GitHub.
3. Extract and overwrite the necessary core files.
4. Run `composer install` to update PHP dependencies.
5. Run database migrations to update the database schema.
6. Clear and rebuild application caches.
7. Restart queue workers (if applicable).
8. Disable Maintenance Mode.

You can monitor the progress of these steps in real-time on the same page.

::: warning Manual Fallback
If the automatic update fails (usually due to strict server permissions or missing Composer), the update process will abort. In that case, you can always fall back to the manual update methods: [Linux Server](/docs/updating/linux-server) or [Web Hosting](/docs/updating/web-hosting).
:::
