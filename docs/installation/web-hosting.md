# Web Hosting Installation

This guide explains how to install Billmora on web hosting control panels such as **cPanel, DirectAdmin, Plesk, Webuzo, aaPanel**, or other shared/managed hosting environments. 

> [!IMPORTANT]
> Billmora relies heavily on background tasks (cron jobs) and long-running queue workers. Shared hosting environments often restrict these features. For the best experience and performance, we strongly recommend a [Linux Server (VPS)](linux-server).

## 1. System Requirements

Ensure your hosting environment provides the following:

- **PHP** 8.2 or 8.3
- **Web Server:** NGINX, Apache, or LiteSpeed
- **Database:** MariaDB 10.4+ or MySQL 8.0+
- **Terminal/SSH Access:** Highly recommended for running installation commands.
- **Cron Jobs:** Required for background tasks.

### Required PHP Extensions
Ensure the following PHP extensions are enabled in your hosting panel's **PHP Selector** or **PHP Settings**:
- `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `intl`, `json`, `mbstring`, `openssl`, `pcre`, `pdo`, `pdo_mysql`, `redis`, `tokenizer`, `xml`, `zip`

---

## 2. Uploading the Files

Billmora comes pre-compiled in a release archive so you do not need Node.js or `npm`.

1. Download the latest `billmora.tar.gz` (or `.zip` equivalent) from the [GitHub Releases](https://github.com/Billmora/billmora/releases) page.
2. Log into your control panel's **File Manager** (or connect via FTP/SFTP).
3. **Do not** upload the files directly into your public directory (e.g., `public_html` or `htdocs`). This exposes your configuration (`.env`) to the public.
4. Instead, navigate to your home directory (usually `/home/username/`).
5. Create a new directory named `billmora`.
6. Upload and extract your `billmora.tar.gz` archive inside the `/home/username/billmora` folder.

---

## 3. Web Server & Domain Configuration

Because Billmora is a Laravel application, the web server must serve the `public/` directory, not the base folder. You have three options depending on your hosting provider's flexibility:

### Option A: Change Document Root (Recommended)
If your control panel allows it (common when adding an Addon Domain or Subdomain), simply set the **Document Root** to point inside the `public` folder of the uploaded files.
- Example Document Root: `/home/username/billmora/public`

### Option B: Symlink Method (For Primary Domains)
If you are installing Billmora on your primary domain which uses `public_html`, a clean approach is to replace `public_html` with a symlink pointing to the `public` directory.

1. Open your hosting panel's **Terminal** or connect via SSH.
2. Backup or remove the existing `public_html` directory (ensure it is empty):
   ```bash
   rm -rf /home/username/public_html
   ```
3. Create a symbolic link:
   ```bash
   ln -s /home/username/billmora/public /home/username/public_html
   ```

### Option C: Modifying index.php (Fallback Method)
If your host does not allow changing the document root or creating symlinks, you can move the contents of the `public` directory into your `public_html`.

1. In the File Manager, open the `/home/username/billmora/public` folder.
2. Select **all files** and **move** them to your main public directory (e.g., `public_html`).
3. Open the `public_html/index.php` file in the File Manager's code editor.
4. Modify the paths to point to your `billmora` folder:
   ```php
   // Change this line:
   require __DIR__.'/../vendor/autoload.php';
   // To this:
   require __DIR__.'/../billmora/vendor/autoload.php';

   // Change this line:
   $app = require_once __DIR__.'/../bootstrap/app.php';
   // To this:
   $app = require_once __DIR__.'/../billmora/bootstrap/app.php';
   ```
5. Save the file.

> [!WARNING]
> If you use Option C, the storage symlink command in step 5.4 will create a link inside `/home/username/billmora/public/storage`. You will need to manually move or symlink that folder into your `public_html/storage` for images and uploads to display.

---

## 4. Setup Database

1. Go to **MySQL® Databases** (or equivalent database wizard) in your control panel.
2. Create a new database (e.g., `username_billmora`).
3. Create a new Database User with a strong password.
4. Add the user to the database, granting **ALL PRIVILEGES**.

> [!WARNING]
> Laravel migrations require structural changes to tables. Assigning "All Privileges" to the database user is mandatory for a successful installation.

---

## 5. Environment & App Setup via Terminal

Most modern panels (cPanel, Plesk, aaPanel) include an in-browser **Terminal** app. Open it, or access your account via SSH.

Navigate to your Billmora directory:
```bash
cd /home/username/billmora
```

### 5.1 Configure Environment
Copy the example environment file and generate a security key:
```bash
cp .env.example .env
php artisan key:generate
```
Next, run the interactive setup wizard to configure your database connection:
```bash
php artisan billmora:env:setup
php artisan billmora:env:database
```
*(If the interactive prompt fails, you can manually open the `.env` file via your File Manager and enter your DB credentials).*

### 5.2 Database Migrations & Initial Data
Ensure the database tables are created.
```bash
php artisan migrate --seed
```

### 5.3 Create an Administrator
Create your first admin user account to access the dashboard.
```bash
php artisan billmora:user:make
```
*(Follow the prompts to set your email, password, and assign the 'administrator' role).*

### 5.4 Link Storage
Create a symbolic link for public assets (like images or uploads):
```bash
php artisan storage:link
```

---

## 6. Background Tasks (Cron Jobs)

Billmora uses Laravel's task scheduler to handle recurring services, invoices, and reminders.

Open the **Cron Jobs** section in your control panel and add a new job to run **Every Minute (* * * * *)**.

Set the command to:
```bash
/usr/local/bin/php /home/username/billmora/artisan schedule:run >> /dev/null 2>&1
```

> [!TIP]
> The absolute path to the PHP executable varies by panel and OS. 
> - **cPanel / DirectAdmin:** Often `/usr/local/bin/php` or `/opt/cpanel/ea-php82/root/usr/bin/php`
> - **Plesk:** Often `/opt/plesk/php/8.2/bin/php`
> - **aaPanel:** Often `/www/server/php/82/bin/php`
> 
> If the cron job isn't firing, check with your hosting provider for the correct path to PHP CLI for your PHP version.

### Queue Workers on Shared Hosting
A standard installation relies on `queue:work` running continuously using systemd or Supervisor—features generally prohibited on shared hosting.

By default, without a persistent worker, some background tasks like server provisioning or email sending may be significantly delayed or fail. You have two options:
1. **Change the `.env` connection (Easiest):** Edit `.env` and set `QUEUE_CONNECTION=sync`. This executes tasks immediately during page load, which hurts performance and makes actions feel sluggish.
2. **Cron-based Queue Worker:** Setup an additional cron job (running every minute) to process queues incrementally:
   ```bash
   /usr/local/bin/php /home/username/billmora/artisan queue:work --stop-when-empty >> /dev/null 2>&1
   ```

**Congratulations!** Billmora is now installed. Navigate to your domain URL in your browser to access the dashboard.
