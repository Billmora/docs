---
title: DirectAdmin
description: Guide to integrating DirectAdmin with Billmora to automate shared web hosting.
---

# DirectAdmin

The DirectAdmin integration automates the creation, suspension, and deletion of shared web hosting accounts.

## Prerequisites

1. A DirectAdmin server with an active reseller or admin account.
2. DirectAdmin Packages (created in the DirectAdmin panel) that match the limits you want to sell.

## Adding the Instance

1. Navigate to **Admin Area** > **Plugins** > **Provisionings**.
2. Click **Create Instance** and select **DirectAdmin**.
3. Enter your DirectAdmin Host URL, Username, and Password/Login Key.

## Package Configuration

When you link your Billmora Package to the DirectAdmin instance, you will need to configure the following options:

- **DirectAdmin Package**: Select a User Package that you have already created in your DirectAdmin server. This ensures all limits (disk space, domains, emails) are correctly applied upon account creation.
- **IP Assignment**: Choose between `Server IP (Main)`, `Shared IP (Reseller Default)`, or `Assign (Dedicated IP)`.
- **Send DA Welcome Email**: Toggle whether to send the DirectAdmin built-in welcome email to the user upon account creation.

## Variant Keys Reference

These internal keys can be used when configuring [Variants](/docs/core-concepts/variants), Custom Fields, and Checkout Schemas. By using the exact Variant Code, you can dynamically override the package's default limits or attributes during checkout.

| Variant Code | Value Format | Description |
| :--- | :--- | :--- |
| `package_name` | String | The exact name of the DirectAdmin package (e.g. `starter_plan`, `pro_plan`). |
| `ip` | String | The IP assignment method (`server`, `shared`, or `assign`). |
