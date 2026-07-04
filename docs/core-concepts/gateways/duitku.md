---
title: Duitku
description: Guide to configuring the Duitku payment gateway in Billmora.
---

# Duitku

The **Duitku** gateway is built into Billmora, providing seamless access to various Indonesian payment methods such as Virtual Accounts, QRIS, E-Wallets, and Retail Outlets.

## Prerequisites

To use this gateway, you must have an active **Duitku Merchant Account**.

## Setting Up Duitku in Billmora

1. **Get Credentials**: Log into your Duitku Merchant Dashboard and navigate to the **Project** settings to find your API credentials.
2. **Configure in Billmora**:
   - Navigate to **Admin Area** > **Plugins** > **Gateways**.
   - Find the Duitku gateway and click **Configure**.
   - Enter your **Merchant Code** and **API Key**.
   - Select your operating environment (Sandbox or Production).
3. **Callback URL (Webhooks)**: Duitku uses callbacks to notify Billmora when a payment is successful.
   - Enter the Callback URL provided by Billmora into your Duitku Project Settings (Callback URL configuration).

Once configured and toggled to **Enabled**, clients in Billmora will be able to pay their invoices using Duitku's supported payment channels.
