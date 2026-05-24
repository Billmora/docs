---
title: Domains
description: Managing domain registration, TLDs, and pricing rules.
---

# Domains & TLDs

In addition to regular hosting products, Billmora has a built-in **Domains** registration and management system. Domain Modules (*Registrar Modules*) handle the workflow for domain registration, renewal, and transfer.

To sell domain names, you must first configure **TLDs** (Top-Level Domains).

## Managing TLDs

A TLD is the extension of a domain, such as `.com`, `.net`, or `.id`. In the TLDs menu, you can configure registration rules, default registrars, and pricing for each extension.

### Field Glossary

| Field | Description |
| :--- | :--- |
| **TLD** | Top-level domain extension (e.g. com, net). Make sure to always include the leading dot (.). |
| **Minimum Years** | Minimum number of years for registration. |
| **Maximum Years** | Maximum number of years for registration. |
| **Grace Period (Days)** | Number of days after expiration before the domain enters redemption. |
| **Redemption Period (Days)** | Number of days after grace period before the domain is terminated. |
| **Default Registrar** | Select the default registrar for this TLD. If set to *None*, domains must be processed manually. |
| **Status** | Set whether this TLD is visible in the store. |

### Pricing by Currency

You must define register, transfer, and renew pricing for each currency separately.

| Field | Description |
| :--- | :--- |
| **Currency** | The currency for these prices. |
| **Enabled** | Toggle to enable pricing for this currency. |
| **Register Price** | Price to register a new domain. |
| **Transfer Price** | Price to transfer an existing domain. |
| **Renew Price** | Price to renew the domain. |

## Domain Lifecycle

Domains in Billmora have statuses such as *Active*, *Expired*, *Cancelled*, and *Pending Transfer*. Billmora's automation will ensure renewal invoices are created according to your *Automation Settings*. If the client does not pay, the domain will enter the **Grace Period**, followed by the **Redemption Period**, before ultimately being terminated at the Registrar.
