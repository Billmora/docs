---
title: Web Hosting Updating
description: Step-by-step guide to updating Billmora on web hosting control panels like cPanel, Plesk, and DirectAdmin.
---

# Updating on Web Hosting

This guide explains how to update Billmora on web hosting control panels such as **cPanel, DirectAdmin, Plesk, Webuzo, aaPanel**, or other shared/managed hosting environments.

## 1. Backup

Before updating, it is critical to create a backup of your database and application files.
Use your control panel's Backup tool, File Manager, and phpMyAdmin (or equivalent) to export your database and zip your existing files.

## 2. Download the Latest Release

Download the latest `billmora.tar.gz` (or `.zip` equivalent) from the [GitHub Releases](https://github.com/Billmora/billmora/releases) page.

> [!CAUTION]
> Ensure you are downloading the full compiled release (`billmora.tar.gz` or `billmora.zip`), **not** the Source Code archive.

## 3. Upload and Extract

1. Log into your control panel's **File Manager**.
2. Navigate to your Billmora directory (e.g., `/home/username/billmora`).
3. Upload the new release archive you downloaded.
4. Extract the archive directly inside this folder, allowing it to **overwrite** existing files.
   *(Your `.env` config file and `storage/` directory will remain intact, as they are not included in the release archive, preserving your settings and uploaded data).*
5. Delete the uploaded archive file after successful extraction to save disk space.

## 4. Run Migrations & Clear Cache

You must now update the database to include any new structural changes and clear out old cached files to ensure the new version runs correctly.

### Using Terminal (Recommended)

Most modern control panels include an in-browser Terminal. Open it and run the following commands:

1. Navigate to your installation directory:
   ```bash
   cd /home/username/billmora
   ```
2. Run database migrations:
   ```bash
   php artisan migrate --seed --force
   ```
3. Clear the application caches:
   ```bash
   php artisan optimize:clear
   ```

> [!TIP]
> Depending on your web host, you might need to use the full path to PHP inside your terminal, for example: `/usr/local/bin/php artisan migrate --force` or `/opt/cpanel/ea-php82/root/usr/bin/php artisan migrate --force`.

### Without Terminal Access

If your shared host has absolutely no SSH or Terminal access, you might need to ask your hosting provider support to run `php artisan migrate --force` and `php artisan optimize:clear` for you inside the directory.

## 5. Restart Background Tasks

If you set up cron jobs for queue workers, they generally will pick up the new changes automatically on their next run. However, it's recommended to restart the queues to ensure any long-running ghost processes grab the new code.

### Via Terminal
```bash
php artisan queue:restart
```

**Congratulations!** Your Billmora installation is now updated.
