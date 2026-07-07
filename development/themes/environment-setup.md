---
title: Theme Development Environment Setup
description: Set up your local development environment with Node.js and npm to build and compile Billmora custom themes.
---

# Environment Setup

Before you can develop or compile a Billmora theme, you need **Node.js** and **npm** installed on your local machine or development server. This is only required for theme asset compilation — your production server running Billmora does **not** need Node.js.

> [!NOTE]
> The pre-built Billmora release already includes compiled assets for the default `moraine` theme. Node.js is only needed when you are **creating or modifying** a custom theme.

## Required Versions

| Tool        | Minimum Version | Recommended          |
| ----------- | --------------- | -------------------- |
| **Node.js** | 18.x (LTS)      | 22.x (LTS)           |
| **npm**     | 9.x             | bundled with Node.js |

---

## Installing Node.js

### Using NVM (Recommended for Linux / macOS)

[NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) is the recommended way to install and manage Node.js on Linux and macOS. It allows you to switch between versions easily.

**1. Install NVM:**

Visit the [NVM releases page](https://github.com/nvm-sh/nvm/releases) to get the latest version, then run the install script with the version number you find there. For example:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

> [!TIP]
> Always check the [latest release on GitHub](https://github.com/nvm-sh/nvm/releases/latest) and replace the version number in the URL above with the newest one available.

**2. Reload your shell:**

```bash
source ~/.bashrc
# or if you use zsh:
source ~/.zshrc
```

**3. Install the latest LTS version of Node.js:**

```bash
nvm install --lts
nvm use --lts
```

**4. Verify the installation:**

```bash
node -v
npm -v
```

---

### Using NodeSource (Linux Server / Ubuntu / Debian)

If you prefer a system-wide installation on a Linux server without NVM:

```bash
# Install NodeSource setup script for Node.js 22.x LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify
node -v
npm -v
```

---

### Using the Official Installer (Windows / macOS)

Download and run the official installer from the Node.js website:

👉 **[https://nodejs.org](https://nodejs.org)** — Download the **LTS** version.

The installer will automatically add `node` and `npm` to your system `PATH`.

After installation, open a new terminal and verify:

```bash
node -v
npm -v
```

---

### Using Volta (Alternative Cross-Platform Manager)

[Volta](https://volta.sh) is a modern, cross-platform Node.js version manager that works well on Windows, macOS, and Linux.

```bash
# Install Volta
curl https://get.volta.sh | bash

# Install and pin Node.js LTS
volta install node@lts
```

---

## Installing Theme Dependencies

Once Node.js is installed, navigate to your theme directory and install the required packages.

Each Billmora theme has its own `package.json` defining its dependencies (Vite, Tailwind CSS, etc.).

```bash
# Navigate to your theme directory
cd /path/to/billmora/resources/themes/admin/mytheme

# Install dependencies
npm install
```

> [!TIP]
> If you scaffolded your theme using the Artisan CLI (`php artisan billmora:theme:make`), the `package.json` and `vite.config.js` are already pre-configured for you.

---

## Next Steps

With your environment set up, you are ready to start building. Refer to the specific theme guide for your target area:

- [Admin Theme](../themes/admin) — The core dashboard, settings, and management interfaces for staff.
- [Client Theme](../themes/client) — The main hub where customers register, purchase products, view invoices, and manage their services.
- [Portal Theme](../themes/portal) — The public-facing landing environment for guest users, announcements, and company terms.

For details on the Vite configuration used by all themes, see the [Vite Config Reference](./reference/vite-config).
