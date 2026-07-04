---
title: Gateways
description: Guide to Payment Gateways in Billmora.
---

# Gateways

**Gateway Plugins** are responsible for processing payments in Billmora. They connect your platform to payment processors like Stripe, PayPal, or local bank transfers.

When a client pays an invoice, the Gateway plugin handles the transaction, verifies the payment via Webhooks (if applicable), and automatically marks the invoice as Paid in Billmora.

## Built-in Gateways

Billmora comes with the following built-in payment gateways out of the box:
- [PayPal](/docs/core-concepts/gateways/paypal)
- [Duitku](/docs/core-concepts/gateways/duitku)

## Adding a Gateway

To configure a payment gateway:
1. Navigate to **Admin Area** > **Plugins** > **Gateways**.
2. Find the desired gateway plugin and click **Configure**.
3. Enter your API Keys, Webhook Secrets, and toggle the plugin to **Enabled**.

Once enabled, clients will be able to select this payment method during checkout.
