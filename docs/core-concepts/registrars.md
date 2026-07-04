---
title: Registrars
description: Guide to Domain Registrars in Billmora.
---

# Registrars

**Registrar Plugins** allow Billmora to register, transfer, renew, and manage domain names automatically by connecting to third-party domain providers.

When a client orders a domain, Billmora talks to the active Registrar plugin to execute the registration logic. The plugin also handles syncing domain expiry dates, managing nameservers, and updating WHOIS contact information.

## Built-in Registrars

Billmora currently includes one built-in registrar plugin out of the box:

- **Handreg**: A manual registrar module. This plugin does not connect to any external API. Instead, it acts as a placeholder that allows clients to place domain orders in Billmora, which prompts the administrator to manually register the domain at their preferred provider and activate the domain in Billmora.

You can also install additional third-party Registrar plugins. Once installed and activated, you can configure them in **Admin Area** > **Plugins** > **Registrars**.

## Configuring TLDs

After setting up a Registrar instance, you must assign it to your Top-Level Domains (TLDs). 
1. Go to **Admin Area** > **Domains** > **TLDs**.
2. Edit a TLD (e.g., `.com`).
3. Select the target Registrar from the dropdown.

Now, all `.com` registrations will be routed to that specific Registrar plugin.
