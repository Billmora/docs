---
title: Provisionings
description: Guide to understanding Provisioning Plugins in Billmora and how they automate your server management.
---

# Provisionings

**Provisioning Plugins** are the bridge between Billmora and your server infrastructure. They automate the lifecycle of a service, including creation, suspension, termination, renewal, and scaling, without requiring you to manually log in to the destination control panel.

Whenever a client purchases a Package, the linked Provisioning Plugin takes over and interacts with the third-party API (like Proxmox, Pterodactyl, or DirectAdmin) to deliver the service.

## Built-in Provisionings

Billmora comes with several built-in provisioning plugins ready to be used out of the box:

- [Proxmox VE](/docs/core-concepts/provisionings/proxmox) - Automate KVM Virtual Machines.
- [Pterodactyl](/docs/core-concepts/provisionings/pterodactyl) - Automate game server hosting.
- [DirectAdmin](/docs/core-concepts/provisionings/directadmin) - Automate shared web hosting.

To use a built-in plugin, you must first create an **Instance** of the plugin in your Billmora Admin Area, provide the necessary API credentials, and then link it to your Packages.

## Plugin Instances

You can create multiple instances of the same plugin. For example, if you have three different DirectAdmin servers, you can create three separate DirectAdmin instances in Billmora, each with its own API credentials and host URL. When creating a Package, you can select which specific instance it should use.

## Custom Provisionings

If your infrastructure relies on software that isn't supported out of the box, you can create a custom Provisioning Plugin. Billmora provides a developer-friendly API to build plugins that handle custom lifecycles. See the [Development Documentation](/development/plugins/provisioning) for more details.
