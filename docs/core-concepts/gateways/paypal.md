---
title: PayPal
description: Guide to configuring the PayPal payment gateway in Billmora.
---

# PayPal

The **PayPal** gateway is built into Billmora, allowing you to easily accept credit card and PayPal account payments from clients globally.

## Prerequisites

To use PayPal, you need a **PayPal Business Account**. You will also need to create a REST API App in the PayPal Developer Dashboard to obtain your credentials.

## Setting Up PayPal in Billmora

1. **Create an App**: Go to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications) and create a new App (Live or Sandbox).
2. **Get Credentials**: Copy your **Client ID** and **Client Secret**.
3. **Configure in Billmora**: 
   - Navigate to **Admin Area** > **Plugins** > **Gateways**.
   - Find the PayPal gateway and click **Configure**.
   - Enter your Client ID and Client Secret.
   - Choose whether you are using Sandbox (testing) or Live mode.
4. **Webhooks**: Billmora uses Webhooks to automatically mark invoices as Paid when the transaction clears.
   - In the PayPal Developer Dashboard, go to your App's Webhooks section and click **Add Webhook**.
   - Paste the Webhook URL provided in the Billmora configuration modal.
   - Select the `Payment sale completed` (or all events) checkbox.
   - Save and copy the **Webhook ID**, then paste it into the Billmora configuration modal.

Once configured and toggled to **Enabled**, clients will be able to select PayPal during checkout.
