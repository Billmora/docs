---
title: Packages
description: Guide to creating and managing products or services (Packages) in Billmora.
---

# Packages

**Packages** are the core of what you sell to clients. A Package defines a specific product, complete with pricing, stock limitations, scaling options, and the Provisioning Plugin that will run when a client purchases it. In other platforms, these are usually referred to as *Products* or *Services*.

Every Package must be connected to one [Catalog](/docs/core-concepts/catalogs).

## Creating a New Package

When you create or edit a Package, there are several key tabs you must configure: Summary, Pricing, Provisioning Plugin, and Scaling.

### Summary Tab

| Field | Description |
| :--- | :--- |
| **Catalog** | Select the catalog to which this package belongs. |
| **Name** | Enter the name of the product package. |
| **Slug** | Enter a unique URL-friendly identifier for this package. It will be used in product URLs. |
| **Description** | Provide a brief description of the package. HTML element supported. |
| **Icon** | Choose an icon file to represent the package. |
| **Stock** | Enter the total available stock for this package. Use -1 for unlimited stock. |
| **Per User Limit** | Set the maximum number of this package a single user can purchase. Use -1 for no limit. |
| **Allow Cancellation** | Enable to let customers request service cancellation for this package. |
| **Allow Quantity** | Enable to let customers purchase multiple or single quantities of this package. |
| **Status** | Set the status of the package to visible or hidden. |

### Pricing Tab

Billmora supports various pricing structures per package.

| Field | Description |
| :--- | :--- |
| **Name** | Enter the name for this pricing option (e.g., "Monthly", "Annual"). |
| **Type** | Select the type of pricing for this package (`free`, `onetime`, `recurring`). |
| **Time Interval & Billing Period** | Choose the billing interval and period (how often the customer will be billed) for this pricing option. |
| **Currency Code** | Displays the currency used for this price. This value cannot be changed here. |
| **Price** | Set the price for this package in the selected currency. |
| **Setup Fee** | Enter any one-time setup fee for this pricing option. |
| **Enabled?** | Enable or disable this pricing option without deleting it. |

> [!WARNING]
> **Important Relationship: Price Name Matching**  
> If your Package has customizable options (Variants), the system requires the **Name** of the Variant Price to exactly match the **Name** of the Package Price. If you rename a Package Price, you must also rename the corresponding Variant Prices, otherwise clients will not be able to purchase those variants.

### Provisioning Plugin Tab

This is where you connect the product to your server automation.

| Field | Description |
| :--- | :--- |
| **Provisioning Plugin Instance** | Select the Provisioning Plugin instance to link with this package. Once selected, you'll be able to configure specific schema options required by the Provisioning Plugin. |

### Scaling Tab

If you want to allow clients to upgrade or downgrade their service, you configure that here.

| Field | Description |
| :--- | :--- |
| **Scalable To** | Select the packages that this package can be scaled up or down to. |

## Connecting Variants

If your Package has customizable options (e.g., clients can choose an operating system when ordering a VPS), you need to set up **Variants**. Learn more in the [Variants](/docs/core-concepts/variants) guide.
