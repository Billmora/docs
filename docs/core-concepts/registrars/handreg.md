---
title: Handreg (Manual)
description: Guide to using the Handreg manual domain registrar in Billmora.
---

# Handreg (Manual Registrar)

**Handreg** is a built-in registrar module designed for manual domain management. Unlike other registrar plugins, Handreg **does not connect to any external API**.

## How It Works

1. **Client Order**: A client places an order for a new domain, transfer, or renewal in Billmora.
2. **To-Do Entry**: Since Handreg does not process the registration automatically, Billmora places the order in a "Pending" state and creates a To-Do notification for the Administrator.
3. **Manual Action**: The Administrator logs into their preferred domain registrar (e.g., Namecheap, Cloudflare) and manually registers or renews the domain.
4. **Activation**: The Administrator returns to Billmora and manually marks the domain as Active, setting the correct expiry date.

## When to use Handreg

Handreg is incredibly useful in the following scenarios:
- You are reselling domains from a provider that doesn't offer an API.
- You want to manually verify and process every domain order to prevent fraud.
- You are managing local country-code TLDs (ccTLDs) that require manual paperwork before registration.

## Configuration

Handreg requires absolutely zero configuration. It is enabled by default and ready to use. Simply assign `Handreg` as the default registrar for any of your TLDs in **Admin Area** > **Domains** > **TLDs**.
