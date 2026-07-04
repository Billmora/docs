---
title: Pterodactyl
description: Guide to integrating Pterodactyl with Billmora to automate game server provisioning.
---

# Pterodactyl

The Pterodactyl integration allows Billmora to automatically create, suspend, and manage game servers.

## Prerequisites

1. **Application API Key**: Create an Application API Key in your Pterodactyl Admin Panel.
   - Requires permissions for Nodes, Allocations, Users, and Servers (Read & Write).
2. **Eggs and Nests**: Ensure your Pterodactyl panel has the desired Nests and Eggs configured.

## Adding the Instance

1. Navigate to **Admin Area** > **Plugins** > **Provisionings**.
2. Click **Create Instance** and select **Pterodactyl**.
3. Enter your Panel URL and Application API Key.

## Package Configuration

Link your Package to the Pterodactyl instance and configure the exact server limits and attributes:

- **Dedicated Location IDs**: Comma separated (e.g. `1, 2`). Used for auto-deployment allocation.
- **Require Dedicated IP**: Toggle whether the server requires a dedicated IP on deployment.
- **Port Range**: Comma separated ports or ranges (e.g. `25565, 25570-25580`).
- **Nest ID**: The ID of the target Nest in Pterodactyl.
- **Egg ID**: The ID of the target Egg in Pterodactyl.
- **Docker Image**: Leave empty to use the Egg's default Docker Image.
- **Startup Command**: Leave empty to use the Egg's default Startup Command.
- **Memory (MB)**: Total memory allowed for the server.
- **Swap (MB)**: Swap limit for the server (-1 for unlimited).
- **Disk Space (MB)**: Disk space limit.
- **CPU Limit (%)**: 100% is 1 core. Set to 0 for unlimited.
- **Block IO Weight**: Block IO Priority Weight (10-1000).
- **Database Limit**: Maximum number of databases allowed.
- **Allocation Limit**: Maximum number of extra network allocations allowed.
- **Backup Limit**: Maximum number of backups allowed.
- **Disable OOM Killer**: Toggle to disable the Out-Of-Memory Killer.
- **Environment Variables (JSON)**: Variables required by the Egg (e.g. `{"SERVER_JARFILE": "server.jar"}`). Leave empty to automatically use the Egg's default environment variables.

## Variant Keys Reference

These internal keys can be used when configuring [Variants](/docs/core-concepts/variants), Custom Fields, and Checkout Schemas. By using the exact Variant Code, you can dynamically override the package's default limits or attributes during checkout.

| Variant Code | Value Format | Description |
| :--- | :--- | :--- |
| `memory` | Integer | RAM in Megabytes (e.g. `2048`, `4096`). |
| `swap` | Integer | Swap memory in Megabytes (e.g. `0`, `-1`). |
| `disk` | Integer | Disk Space in Megabytes (e.g. `10000`, `20000`). |
| `cpu` | Integer | CPU limit percentage (e.g. `100` for 1 core, `0` for unlimited). |
| `io` | Integer | Block IO weight (10-1000). |
| `databases` | Integer | Database limit count (e.g. `1`, `3`). |
| `allocations` | Integer | Extra network allocations count (e.g. `1`, `5`). |
| `backups` | Integer | Backup limit count (e.g. `2`, `10`). |
| `egg_id` | Integer | The target Egg ID on Pterodactyl. |
| `location_ids` | String | Comma separated location IDs (e.g. `1, 2`). |
