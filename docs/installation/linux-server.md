# Linux Server Installation

This guide covers how to install Billmora on a dedicated Linux environment. This is the **recommended** way to run Billmora. 

## 1. System Requirements

Billmora requires a standard LNMP/LAMP stack. 
Supported Operating Systems (64-bit only):
- **Ubuntu:** 24.04, 22.04, 20.04
- **Debian:** 12, 11

Software requirements:
- **PHP** 8.2 or 8.3
- **Web Server:** NGINX or Apache
- **Database:** MariaDB 10.4+ or MySQL 8.0+
- **Cache/Queue:** Redis (Recommended)
- **Composer** v2

---

## 2. Install Dependencies

Below is an example of installing required dependencies on a fresh **Ubuntu/Debian** server. Run these commands as `root`.

```bash
# Update package lists
apt update -y && apt upgrade -y

# Install standard software
apt install -y software-properties-common curl apt-transport-https ca-certificates gnupg

# Add standard repositories (if required for newer PHP versions)
# For Ubuntu, add Ondrej's PHP PPA:
add-apt-repository -y ppa:ondrej/php
apt update

# Install PHP and required extensions
apt install -y php8.3 php8.3-{intl,cli,gd,mysql,pdo,mbstring,tokenizer,bcmath,xml,fpm,curl,zip,redis}

# Install MariaDB, Redis, and Web Server packages
apt install -y mariadb-server nginx tar unzip curl redis-server

# Install Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

# Install Certbot for SSL (Optional but Recommended)
apt install -y certbot python3-certbot-nginx python3-certbot-apache
```

---

## 3. Install Billmora

We provide a pre-built release archive containing all the necessary compiled theme assets, so you don't need Node.js or NPM installed on your server.

Create the directory where Billmora will live, download the latest release, and extract it:

```bash
mkdir -p /var/www/billmora
cd /var/www/billmora

# Download the latest Beta pre-built release (Recommended for testing)
curl -Lo billmora.tar.gz https://github.com/Billmora/billmora/releases/download/v0.6.0-beta.1/billmora.tar.gz

# Extract the archive
tar -xzvf billmora.tar.gz

# Install PHP dependencies
composer install --no-dev --optimize-autoloader
```

---

## 4. Environment & Database Setup

### 4.1 Database Creation
Log into your MariaDB/MySQL instance to create a database tailored for Billmora:
```bash
mysql -u root -p
```
Run the following SQL commands:
```sql
CREATE DATABASE billmora;
CREATE USER 'billmora'@'127.0.0.1' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON billmora.* TO 'billmora'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

### 4.2 Application Configuration
Billmora includes built-in commands to easily set up your `.env` file and generate necessary keys.

```bash
# Copy the example environment file
cp .env.example .env

# Generate the application key
php artisan key:generate
```

Run the interactive environment setup command:
```bash
php artisan billmora:env:setup
php artisan billmora:env:database
```
*(This command will guide you through setting your App URL, Database connection, Redis configuration, and Queues).*

### 4.3 Database Migrations & Initial Data
Ensure the database tables are created.
```bash
php artisan migrate --seed
```

### 4.4 Create an Administrator
Create your first admin user account to access the dashboard.
```bash
php artisan billmora:user:make
```
*(Follow the interactive prompts to set your email, password, and assign the 'administrator' role).*

### 4.5 Link Storage
```bash
php artisan storage:link
```

---

## 5. Webserver Configuration

You must configure your web server to serve the `public/` directory. First, ensure the web server user (`www-data`) owns the storage and cache files.

```bash
chown -R www-data:www-data /var/www/billmora

chmod -R 775 /var/www/billmora/storage
chmod -R 775 /var/www/billmora/bootstrap/cache
```

### NGINX (Recommended)

::: details NGINX with SSL (Using Certbot)
**1. Create the configuration file:**
```bash
nano /etc/nginx/sites-available/billmora.conf
```

**2. Paste the basic config (Certbot will automatically modify it to add SSL later):**
```nginx
server {
    listen 80;
    server_name billing.yourdomain.com;
    root /var/www/billmora/public;

    index index.php index.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**3. Enable the site and obtain SSL:**
```bash
ln -s /etc/nginx/sites-available/billmora.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Run certbot to automatically provision and install the SSL certificate
certbot --nginx -d billing.yourdomain.com
```
:::

::: details NGINX without SSL
If you are running behind a proxy like Cloudflare SSL or testing internally, use this configuration.

**1. Create the configuration file:**
```bash
nano /etc/nginx/sites-available/billmora.conf
```

**2. Paste the configuration:**
```nginx
server {
    listen 80;
    server_name billing.yourdomain.com;
    root /var/www/billmora/public;

    index index.php index.html;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**3. Enable the site:**
```bash
ln -s /etc/nginx/sites-available/billmora.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```
:::

### Apache

::: details Apache with SSL (Using Certbot)
**1. Create the configuration file:**
```bash
nano /etc/apache2/sites-available/billmora.conf
```

**2. Paste the basic config (Certbot will modify it to add SSL later):**
```apache
<VirtualHost *:80>
    ServerName billing.yourdomain.com
    DocumentRoot "/var/www/billmora/public"
    
    AllowEncodedSlashes On
    
    <Directory "/var/www/billmora/public">
        AllowOverride all
        Require all granted
    </Directory>
</VirtualHost>
```

**3. Enable the module, site, and obtain SSL:**
```bash
a2enmod rewrite
a2ensite billmora.conf
systemctl restart apache2

# Run certbot to automatically provision and install the SSL certificate
certbot --apache -d billing.yourdomain.com
```
:::

::: details Apache without SSL
**1. Create the configuration file:**
```bash
nano /etc/apache2/sites-available/billmora.conf
```

**2. Paste the configuration:**
```apache
<VirtualHost *:80>
    ServerName billing.yourdomain.com
    DocumentRoot "/var/www/billmora/public"
    
    AllowEncodedSlashes On
    
    <Directory "/var/www/billmora/public">
        AllowOverride all
        Require all granted
    </Directory>
</VirtualHost>
```

**3. Enable the module and site:**
```bash
a2enmod rewrite
a2ensite billmora.conf
systemctl restart apache2
```
:::

---

## 6. Background Workers (Cron & Systemd)

Billmora relies heavily on background tasks to manage provisioning and send emails. 

### 6.1 Cron Job
Open the crontab for the `www-data` user:
```bash
sudo crontab -u www-data -e
```
Add this line to the bottom:
```bash
* * * * * cd /var/www/billmora && php artisan schedule:run >> /dev/null 2>&1
```

### 6.2 Systemd Queue Worker
Instead of packages like Supervisor, we use the built-in systemd to keep your queue worker running in the background.

Create a new systemd service file:
```bash
nano /etc/systemd/system/billmora.service
```

Paste the following configuration:
```ini
[Unit]
Description=Billmora Queue Worker
After=network.target

[Service]
# We run as www-data to match web server permissions
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/billmora/artisan queue:work --sleep=3 --tries=3 --max-time=3600
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start your newly created service:
```bash
systemctl enable --now billmora.service
```

*(You can verify it is running at any time by executing `systemctl status billmora.service`)*

**Congratulations!** Billmora is now installed. Navigate to your domain URL in your browser to access the dashboard.
