---
title: Development Guide
description: Official Billmora Developer Documentation for extending capabilities with custom integrations, themes, and Event-Driven Architecture.
---
# Development Guide

Welcome to the **Billmora Developer Documentation**! This section is dedicated to developers who want to extend Billmora's capabilities by building custom integrations, themes, or exploring our Event-Driven Architecture (EDA).

## Core Philosophy

Billmora is built heavily around **Modularity and Extensibility**. We designed the system so you don't need to modify core application files to add new features. Instead, you can leverage:

- **Plugins:** Self-contained packages that add functionality such as Payment Gateways, Server Provisioning, or standalone Modules.
- **Events:** Hook into application lifecycles (like invoice generation, payment capture, service suspension) to trigger custom logic.
- **Themes:** Completely customize the look and feel of specific areas like the `admin` panel, `client` portal, `email` templates, or `invoices` using Blade components and Tailwind CSS.

## Directory Structure

When developing for Billmora, you will primarily work within the following directories:

- `/plugin/` - The heart of all third-party and custom extensions. This directory is actively monitored and its classes are autoloaded via the `Plugins\` PHP namespace.
    - `/plugin/Gateways/` - For adding new payment processors.
    - `/plugin/Provisionings/` - For server automation (e.g., Pterodactyl, cPanel).
    - `/plugin/Modules/` - For general-purpose add-ons (e.g., Announcements, Affiliates).
- `/resources/themes/` - Where the UI templates and assets are structured. Themes are organized into specific subfolders for their designated areas:
    - `/admin/`
    - `/client/`
    - `/portal/`
    - `/email/`
    - `/invoice/`

## Developer Tools (CLI)

Billmora provides powerful Artisan commands to speed up your development workflow. You can easily scaffold new plugins or themes with all the necessary boilerplate code, and export them into distributable ZIP files ready for installation via the Admin Panel.

### Scaffolding (Make Commands)

Use these commands to generate a new plugin or theme structure. The CLI is interactive, so if you omit any options, it will prompt you for them.

```bash
# Create a new Plugin (Provisioning, Gateway, Module, or Registrar)
php artisan billmora:plugin:make {name} {--type=}

# Create a new Theme (Client, Admin, Portal, Email, or Invoice)
php artisan billmora:theme:make {name} {--type=}
```
> **Tip:** When creating a new theme, Billmora will automatically copy the default Blade views (from the `moraine` theme) into your new theme's directory, giving you a complete starting point!

### Exporting Commands

When your plugin or theme is ready for distribution or production, you can package it into a `.zip` file. This ZIP file is fully compatible with Billmora's drag-and-drop installer in the Admin Panel.

```bash
# Export a Plugin
php artisan billmora:plugin:export {name} {--type=}

# Export a Theme
php artisan billmora:theme:export {name} {--type=}
```
The exported ZIP files will be saved in `storage/app/exports/`.

## Tech Stack Overview

Billmora utilizes a modern PHP ecosystem:

- **Core Framework:** Laravel 12.x
- **Frontend Stack:** Tailwind CSS + AlpineJS + Laravel Blade. *Livewire 3.x is the primary reactive framework used for dynamic logic and components.*
- **Database Architecture:** Optimized Eloquent ORM + Event-Driven Auditing Queue.

## Getting Started

To dive in, check out the subsequent sections under the **Development** tab. They cover everything from creating custom Provisioning endpoints, crafting new Gateways, building standalone Modules, handling application Events, and more!
