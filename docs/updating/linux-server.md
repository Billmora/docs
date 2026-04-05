---
title: Linux Server Updating
description: Step-by-step guide for updating Billmora on a dedicated Linux server.
---

# Updating on Linux Server

This guide covers how to update your existing Billmora installation on a dedicated Linux environment.

## 1. Backup

Before performing any update, it's strongly recommended to backup your database and application files.

```bash
# Backup the database
mysqldump -u root -p billmora > billmora_backup_$(date +%F).sql

# Backup the application files (optional but recommended)
tar -czvf billmora_files_backup_$(date +%F).tar.gz /var/www/billmora
```

## 2. Download Latest Release

Navigate to your Billmora installation directory and download the latest pre-built release from GitHub.

```bash
cd /var/www/billmora

# Download the latest pre-built release archive
# Replace the URL with the actual latest release link!
curl -Lo billmora-update.tar.gz https://github.com/Billmora/billmora/releases/latest/download/billmora.tar.gz
```

> [!CAUTION]
> Ensure you are downloading the full compiled release (`billmora.tar.gz` or `billmora.zip`), **not** the Source Code archive, to avoid having to compile front-end assets manually.

## 3. Extract and Overwrite

Extract the downloaded archive directly over your existing files. Ensure the web server user retains ownership.

```bash
# Extract the archive, overwriting existing files
tar -xzvf billmora-update.tar.gz

# Ensure permissions are correct
chown -R www-data:www-data /var/www/billmora
```

## 4. Install Dependencies

Update the PHP dependencies using Composer to ensure any new vendor packages are installed.

```bash
# Switch to the web server user if necessary, or run as root
composer install --no-dev --optimize-autoloader
```

## 5. Database Migrations & Clearing Cache

Run the database migrations to apply any new schema changes, and clear the application cache.

```bash
# Run migrations, forcing them to run without confirmation in production
php artisan migrate --seed --force

# Clear cached configuration, routes, and views
php artisan optimize:clear

# Rebuild the cache (optional but recommended for performance)
php artisan optimize
```

## 6. Restart Queue Worker

If you have a queue worker running in the background (via Systemd or Supervisor), restart it to ensure it uses the newly updated codebase.

```bash
# Restart the systemd service
systemctl restart billmora.service
```

Alternatively, you can gracefully restart workers using artisan:
```bash
php artisan queue:restart
```

**Congratulations!** Your Billmora installation is now up to date.
