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

## Tech Stack Overview

Billmora utilizes a modern PHP ecosystem:

- **Core Framework:** Laravel 12.x
- **Frontend Stack:** Tailwind CSS + AlpineJS + Laravel Blade. *Livewire 3.x is the primary reactive framework used for dynamic logic and components.*
- **Database Architecture:** Optimized Eloquent ORM + Event-Driven Auditing Queue.

## Getting Started

To dive in, check out the subsequent sections under the **Development** tab. They cover everything from creating custom Provisioning endpoints, crafting new Gateways, building standalone Modules, handling application Events, and more!
