# Gateway Plugin Development

Billmora employs an enterprise-grade, **Event-Driven Architecture (EDA)** for its payment gateway ecosystem. Developing a Gateway plugin allows you to integrate any third-party payment processor directly into Billmora with minimal friction.

Because of the EDA design, your plugin **never** needs to directly manipulate the database to mark invoices as paid or create transactions. Your only responsibility is to process the payment session and return a standardized Data Transfer Object (DTO) when the gateway pings Billmora back.

---

## 1. Directory Structure & Namespace

Gateway plugins must reside within the `plugin/Gateways/` directory. If you are building a gateway called **Example**, your directory layout must look like this:

```text
plugin/
└── Gateways/
    └── Example/
        ├── ExampleGateway.php
        ├── plugin.json
        └── resources/
            └── views/
                └── popup.blade.php    (optional, for View Mode)
```

Consistent with PSR-4 standards, your plugin namespace should match the directory structure:
`namespace Plugins\Gateways\Example;`

---

## 2. The `plugin.json` Manifest

Every plugin requires a `plugin.json` manifest file. This file tells Billmora's core engine how to discover and load your gateway. Ensure the format strictly follows this structure:

```json
{
    "name": "Example Checkout",
    "provider": "Example",
    "type": "gateway",
    "version": "1.0.0",
    "description": "Accept credit card payments worldwide via Example API.",
    "author": "Your Name / Team",
    "icon": "https://url-to-your-gateway-logo.png"
}
```

::: info Configuration Metrics
* **`type`**: Must strictly be `"gateway"`.
* **`provider`**: The unique identifier/slug for your gateway.
* **`icon`**: An absolute URL to the gateway's logo, which will be displayed on the client checkout page.
:::

---

## 3. The Main Plugin Class

Your gateway's main PHP class must extend `App\Support\AbstractPlugin` and implement the `App\Contracts\GatewayInterface`.

```php
<?php

namespace Plugins\Gateways\Example;

use App\Contracts\GatewayInterface;
use App\Support\AbstractPlugin;
use App\Support\GatewayCallbackResponse;
use Illuminate\Http\Request;

class ExampleGateway extends AbstractPlugin implements GatewayInterface
{
    // Implementation comes here...
}
```

---

## 4. Admin Configuration (`getConfigSchema`)

You don't need to build any HTML forms for your plugin's admin settings. Billmora automatically renders the settings UI in the Admin Panel based on the schema you provide.

Use the `getConfigSchema()` method to define the credentials your gateway requires.

::: tip Schema Documentation
Billmora supports an extensive library of UI components (Selects, Toggles, Radios, Checkboxes, etc.). 
Please read the [**Plugin Reference Schema Guide**](./schema.md) to see the full list of supported fields and properties.
:::

```php
public function getConfigSchema(): array
{
    return [
        'public_key' => [
            'type'  => 'text',
            'label' => 'Example Public Key',
            'rules' => 'required|string'
        ],
        'secret_key'  => [
            'type'  => 'password', // Renders as a masked password input
            'label' => 'Example Secret Key',
            'rules' => 'required|string'
        ],
        'environment'  => [
            'type'    => 'select',
            'label'   => 'Environment',
            'options' => [
                'sandbox'    => 'Sandbox / Test',
                'production' => 'Production / Live'
            ],
            'rules'   => 'required|in:sandbox,production'
        ],
    ];
}
```

::: tip
You can easily retrieve these values anywhere in your class later using `$this->getInstanceConfig('secret_key');`.
:::

---

## 5. Processing Payments

There are two methods responsible for initiating payments: `isApplicable` and `pay`.

### 5.1 `isApplicable`

Determine if your gateway should be visible to the client on the checkout page. You can restrict availability based on the invoice's currency, minimum checkout amount, or any other business logic.

```php
public function isApplicable(float $amount, string $currency): bool
{
    // Example: Only allow USD, and only if invoice is > $5.00
    if ($currency !== 'USD' || $amount < 5.00) {
        return false;
    }

    return true;
}
```

::: tip
If your gateway supports all currencies and amounts, simply `return true;`.
:::

### 5.2 `pay`

This method is triggered when the client clicks **"Pay Now"**. You must use your gateway's API to generate a payment session or token. Billmora's `PaymentController` calls this method and passes the following parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `$invoiceNumber` | `string` | The Billmora invoice number (e.g., `INV-00001`). |
| `$amount` | `float` | The total amount due on the invoice. |
| `$currency` | `string` | ISO 4217 currency code (e.g., `IDR`, `USD`). |
| `$options` | `array` | Additional context (see below). |

**The `$options` array contains:**

| Key | Type | Description |
|-----|------|-------------|
| `description` | `string` | Auto-generated payment description (e.g., `Payment for Invoice #INV-00001`). |
| `user` | `array` | The authenticated user's data (name, email, billing address, etc.). |
| `items` | `array` | Invoice line items with descriptions and amounts. |
| `return_url` | `string` | URL to redirect the user back to the invoice page after payment. |

::: warning Important Callback URLs
Always pass Billmora's core webhook/return URLs to your gateway provider so they know where to send the user or API payload after payment:
- **Webhook URL:** `route('api.gateways.webhook', ['plugin' => $this->getPluginModel()->id])`
- **Return URL:** `route('client.gateways.return', ['plugin' => $this->getPluginModel()->id])`
:::

Billmora supports two rendering modes for the client checkout experience. The `pay()` method must return an array with the following structure:

```php
return [
    'success' => true,       // bool: Was the session created successfully?
    'type'    => 'redirect', // string: 'redirect' or 'view'
    'data'    => $value,     // mixed: URL string or View instance
    'message' => '...',      // string (optional): Error message if success is false
];
```

---

#### Option A: Redirect Mode (Standard)

If your gateway generates a hosted checkout URL (like standard PayPal or Stripe Checkout), return a `redirect` response. Billmora will redirect the user's browser to the external URL.

```php
public function pay(string $invoiceNumber, float $amount, string $currency, array $options = []): mixed
{
    $secretKey = $this->getInstanceConfig('secret_key');
    
    // Call your Gateway's API to generate a checkout session...
    $session = Http::withHeaders([
        'Authorization' => 'Bearer ' . $secretKey,
    ])->post('https://api.example.com/checkout', [
        'amount'      => $amount,
        'currency'    => $currency,
        'reference'   => $invoiceNumber,
        'webhook_url' => route('api.gateways.webhook', ['plugin' => $this->getPluginModel()->id]),
        'return_url'  => route('client.gateways.return', ['plugin' => $this->getPluginModel()->id]),
    ]);

    if (!$session->successful()) {
        return [
            'success' => false,
            'message' => 'Failed to create checkout session. Please try again.',
        ];
    }

    return [
        'success' => true,
        'type'    => 'redirect',
        'data'    => $session->json('checkout_url'),
    ];
}
```

---

#### Option B: View Mode (Popups / Inline HTML)

If your gateway uses a JavaScript popup (like Midtrans Snap or Duitku Pop) or if you want to render a completely custom Blade template, return a `view` response. Billmora will directly output your HTML to the client's browser without reloading the page frame.

```php
public function pay(string $invoiceNumber, float $amount, string $currency, array $options = []): mixed
{
    // Generate checkout token from gateway...
    $paymentToken = $this->createToken($invoiceNumber, $amount, $currency);

    return [
        'success' => true,
        'type'    => 'view',
        'data'    => view('gateway.example::popup', [
            'token'  => $paymentToken,
            'amount' => $amount,
        ]),
    ];
}
```

::: info Custom View Placement
Place your `.blade.php` files inside your plugin's `resources/views/` directory. Billmora automatically registers the view namespace as `gateway.{provider}::`.

```text
plugin/
└── Gateways/
    └── Example/
        ├── ExampleGateway.php
        ├── plugin.json
        └── resources/
            └── views/
                └── popup.blade.php
```

Render via: `view('gateway.example::popup')`
:::

---

## 6. Receiving Callbacks (Webhook vs Return)

Billmora explicitly separates background server webhooks from browser-based redirects to ensure maximum stability and prevent session/CSRF conflicts.

::: info Security
Billmora's `CallbackController` automatically handles all security layers for you:
- **Audit logging**: Every incoming webhook and return payload is recorded to the system audit log.
- **Plugin validation**: The controller verifies the plugin exists, is active, and is of type `gateway`.
- **Error containment**: All exceptions are caught, reported, and returned as appropriate HTTP responses.

Your plugin only needs to focus on **parsing the gateway's response** and **verifying the signature**.
:::

When these methods are triggered, you **must** return the `GatewayCallbackResponse` Data Transfer Object (DTO). Billmora's core architecture will catch this DTO and automatically update the database.

---

### 6.1 `webhook()` — Stateless Background API

Triggered by server-to-server HTTP POST requests from the gateway provider. There is **no active user session** here — no cookies, no CSRF token, no browser.

**What happens internally:**
1. The `CallbackController` receives the raw request.
2. Your `webhook()` method parses and verifies the payload.
3. If `isValid` and `isSuccess` are both `true`, Billmora dispatches the `PaymentCaptured` event.
4. The event listener automatically updates the invoice status, creates a transaction record, and triggers downstream events (provisioning, notifications, etc.).
5. Returns a JSON `200` response to the gateway provider.

```php
public function webhook(Request $request): GatewayCallbackResponse
{
    // 1. Verify cryptographic signature to prevent spoofing
    $expectedSignature = hash_hmac('sha256', $request->getContent(), $this->getInstanceConfig('secret_key'));
    $isValidSignature = hash_equals($expectedSignature, $request->header('X-Signature', ''));
    
    // 2. Parse the payment data
    $paymentStatus = $request->input('payment_status');
    
    // 3. Return the parsed data to Billmora
    return new GatewayCallbackResponse(
        isValid: $isValidSignature,
        isSuccess: $paymentStatus === 'paid',
        orderNumber: $request->input('metadata.invoice_number'),
        gatewayReference: $request->input('transaction_id'),
        amount: (float) $request->input('amount_received'),
        fee: (float) $request->input('gateway_fee')
    );
}
```

::: warning
Never throw exceptions inside `webhook()`. Always return a `GatewayCallbackResponse` with `isValid: false` if something goes wrong. This allows Billmora to respond with a proper HTTP 400 status to the gateway provider, preventing unnecessary retries.
:::

---

### 6.2 `return()` — Stateful Browser Redirect

Triggered when the user is explicitly redirected back to Billmora via **GET** request after leaving the gateway's hosted checkout page. This route has full Laravel session and cookie support.

**What happens internally:**
1. The `CallbackController` receives the browser redirect.
2. Your `return()` method parses the query parameters.
3. If `isValid` and `isSuccess` are both `true`, Billmora dispatches the `PaymentCaptured` event.
4. The user's browser is redirected to the `redirectUrl` you specify in the DTO, with a flash success/error message.

```php
public function return(Request $request): GatewayCallbackResponse
{
    $invoiceNumber = $request->query('invoiceId');
    $status = $request->query('status');

    return new GatewayCallbackResponse(
        isValid: true,
        isSuccess: $status === 'success',
        orderNumber: $invoiceNumber,
        redirectUrl: route('client.invoices.show', $invoiceNumber)
    );
}
```

::: tip
The `redirectUrl` property in the DTO is used by the controller to redirect the user's browser. If you omit it, Billmora will redirect to `url('/dashboard')` as a fallback.
:::

::: info Dual Capture Safety
Many gateways send **both** a webhook and a return simultaneously. Billmora is designed to handle this gracefully — the `PaymentCaptured` event is idempotent. Even if both `webhook()` and `return()` trigger for the same invoice, the payment will only be processed once.
:::

---

## 7. The Callback DTO (`GatewayCallbackResponse`)

You **never** need to manually execute `Invoice::update()` or `Transaction::create()` in your plugin codebase. Billmora will automatically process all database updates and audit logging via the `PaymentCaptured` event if your plugin returns `isSuccess: true` via the `GatewayCallbackResponse` object.

### Constructor Parameters

```php
new GatewayCallbackResponse(
    isValid: true,
    isSuccess: true,
    orderNumber: 'INV-00001',
    gatewayReference: 'txn_1234567890',
    amount: 150000.00,
    fee: 4500.00,
    redirectUrl: route('client.invoices.show', 'INV-00001')
);
```

### Property Reference

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `isValid` | `bool` | ✅ | — | `true` if the payload signature passes your security checks. Prevents fake callbacks. |
| `isSuccess` | `bool` | | `false` | `true` if the original payment was successfully captured/paid. |
| `orderNumber` | `string` | | `''` | The target Billmora Invoice Number (e.g., `INV-00001`). |
| `gatewayReference` | `string?` | | `null` | The unique Transaction ID from the gateway server. Stored for reconciliation. |
| `amount` | `float` | | `0.0` | The total monetary amount successfully captured. |
| `fee` | `float` | | `0.0` | Transaction fees explicitly charged by the gateway provider. |
| `redirectUrl` | `string?` | | `null` | Forces the user's browser redirect. **Only used inside `return()`**, ignored inside `webhook()`. |

::: warning Critical: `isValid` vs `isSuccess`
These two flags serve different purposes:
- **`isValid`**: "Is this callback payload authentic and not forged?" — Set to `false` if signature verification fails. Billmora will respond with HTTP 400 and **not** process any payment.
- **`isSuccess`**: "Did the payment actually succeed?" — Set to `false` if the customer cancelled, payment was declined, or the capture failed. Billmora will acknowledge the webhook but **not** mark the invoice as paid.
:::

---

## 8. Database Migrations

If your gateway plugin requires its own database tables, place migrations in `database/migrations/`. All tables **must** use the `pg_` prefix.

::: tip
See the [**Plugin Conventions & Standards**](./conventions.md#_4-database-migrations) guide for full details on table prefixes, migration naming, and model configuration.
:::

---

## Conclusion

By simply defining `getConfigSchema()`, initiating the session in `pay()`, and mapping incoming responses to the `GatewayCallbackResponse` inside `webhook()` and `return()`, you can build powerfully robust integrations. Billmora's core engine will handle all logging, security, and database state transitions for you!
