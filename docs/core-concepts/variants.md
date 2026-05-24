---
title: Variants
description: Adding additional customization options to client orders.
---

# Variants (Configurable Options)

**Variants** give your clients the flexibility to customize the [Package](/docs/core-concepts/packages) they are purchasing. This feature is identical to what is known as *Configurable Options* in other billing systems.

Examples of Variants usage:
- Selecting an Operating System (Ubuntu, CentOS, Windows) for a VPS.
- Adding extra IPs.
- Increasing RAM or Disk Space limits.

## Basic Concepts of Variants

Variants in Billmora have a Summary and an Options tab. You create the variant and link it to packages, then define its selectable options and pricing.

### Summary Tab

| Field | Description |
| :--- | :--- |
| **Name** | Enter the name of the package variant. |
| **Description** | Internal notes or description for this variant. This content is only visible to admin. |
| **Type** | Select the type of this variant (e.g., Dropdown, Radio). |
| **Code** | Enter a identifier used by the system to reference this item. This value should be short and consistent. |
| **Status** | Set the status of the variant to visible or hidden. |
| **Is Scalable?** | Enable to allow this variant to be scaling (upgraded/downgraded). |
| **Package** | Select the package this variant belongs to. |

### Options Tab

Here you manage the pricing options for this variant.

| Field | Description |
| :--- | :--- |
| **Name** | Enter the name of the variant option. |
| **Value** | Enter the value of the variant option. |

When adding a new price to a variant option, you configure similar fields to the Package Pricing:
- **Name**: Enter the name for this pricing option.
- **Type, Time Interval & Billing Period**: Select the billing behavior for this variant option.
- **Price & Setup Fee**: Set the price and any one-time setup fee for this variant option in the selected currency.
- **Enabled?**: Enable or disable this pricing option without deleting it.

> [!WARNING]
> **Important Relationship: Price Name Matching**  
> The system requires the **Name** of the Variant Price to exactly match the **Name** of the Package Price. When a client selects a billing cycle (e.g., "Monthly"), the system validates that the selected variant also has a price named "Monthly". If the variant does not have a price with a matching name, that variant cannot be purchased under that billing cycle.

## Plugin Integration

The **Code** and **Value** fields are particularly important when your Package uses a Provisioning Plugin Instance. These values are passed to the Provisioning Plugin to automate the setup of the chosen variant on the server.
