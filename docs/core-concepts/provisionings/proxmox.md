---
title: Proxmox VE
description: Guide to integrating Proxmox VE with Billmora to automate KVM virtual machine provisioning.
---

# Proxmox VE

The Proxmox VE integration allows Billmora to automatically provision and manage KVM virtual machines based on your packages. This plugin utilizes Proxmox's Cloud-Init features to clone templates, set up networking, and resize disks on the fly.

## Prerequisites

Before configuring the plugin in Billmora, you must prepare your Proxmox server:

1. **API Token**: Create an API Token in Proxmox (`Datacenter` > `Permissions` > `API Tokens`).
   - The token must have privileges for `VM.Allocate`, `VM.Clone`, `VM.Config.*`, `VM.PowerMgmt`, `VM.Console`, and `Datastore.AllocateSpace`.
2. **Cloud-Init Template**: Create a KVM virtual machine, configure it with a Cloud-Init drive, install your preferred OS, and convert it to a template. Take note of the Template VM ID.
3. **Storage**: Ensure your target node has storage available that supports disk images (e.g., `local-lvm`, `zfs`, `ceph`).

## Adding the Instance

1. Navigate to **Admin Area** > **Plugins** > **Provisionings**.
2. Click **Create Instance** and select **Proxmox**.
3. Fill out the configuration form:
   - **Proxmox Host URL**: The URL to your Proxmox web interface (e.g., `https://192.168.1.10:8006`).
   - **API Token ID**: Format is `user@realm!tokenname` (e.g., `root@pam!billmora`).
   - **API Token Secret**: The UUID secret generated when the token was created.
   - **Verify SSL**: Toggle off if you are using self-signed certificates.

## Package Configuration

When creating or editing a Package linked to your Proxmox instance, you can configure the specific VM specifications:

- **Target Node**: The Proxmox node name to deploy VMs on (e.g. `pve`). Leave empty to auto-select the node with the most free memory.
- **Template VMID**: The VM ID of the Cloud-Init enabled template to clone for each order.
- **Target Storage**: The storage where the cloned VM disk will be placed (e.g. `local-lvm`, `ceph-pool`).
- **Network Bridge**: The Proxmox network bridge to attach the VM's network interface to (default: `vmbr0`).
- **CPU Cores**: Number of CPU cores to allocate to the VM.
- **Memory (MB)**: RAM in MB to allocate to the VM.
- **Disk Size (GB)**: Root disk size in GB. The template disk will be resized to this value.
- **Bandwidth Limit (GB)**: Monthly bandwidth limit in GB. Set to 0 for unlimited.
- **OS Templates (JSON)**: Define available OS options for client reinstall. Each key is the display name, value is the Proxmox VMID of the template (e.g. `{"Ubuntu 22.04": 201, "Debian 12": 202}`). Leave empty to use the default template only.
- **Start VM After Creation**: Toggle to automatically start the VM after provisioning is complete.

## Scaling

Billmora fully supports automated scaling for Proxmox. When a user purchases an upgrade (or downgrade) that modifies the CPU or RAM, the plugin will:
1. Update the VM configuration via the API.
2. Gracefully stop the KVM process.
3. Start the KVM process to apply the new hardware limits instantly.

## Variant Keys Reference

These internal keys can be used when configuring [Variants](/docs/core-concepts/variants), Custom Fields, and Checkout Schemas. By using the exact Variant Code, you can dynamically override the package's default limits or attributes during checkout.

| Variant Code | Value Format | Description |
| :--- | :--- | :--- |
| `cores` | Integer | The number of CPU Cores (e.g. `2`, `4`). |
| `memory` | Integer | RAM in Megabytes (e.g. `2048`, `4096`). |
| `disk_size` | Integer | Disk Size in Gigabytes (e.g. `50`, `100`). |
| `bandwidth` | Integer | Monthly bandwidth limit in GB (e.g. `1000`, `0` for unlimited). |
| `template_vmid` | Integer | The VMID of the template to clone (e.g. `200`). |
| `storage` | String | Target storage identifier (e.g. `local-lvm`). |
| `node` | String | Target Proxmox node (e.g. `pve`). |
| `network_bridge` | String | Proxmox network bridge (e.g. `vmbr0`). |
