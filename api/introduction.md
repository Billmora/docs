---
title: API Introduction
description: Official Billmora REST API Documentation for external integrations and automation.
---

# API Introduction

Welcome to the **Billmora REST API Documentation**. The Billmora API allows external applications, custom billing portals, and automation scripts to interact seamlessly with your Billmora installation.

::: info Postman & Bruno Support
Since our API documentation is fully automated with OpenAPI, you no longer need a manual collection zip! You can directly click **"Download OpenAPI Document"** inside the [Interactive Reference](/api/reference) page and import that JSON file directly into Postman, Bruno, or Insomnia to instantly get all endpoints, payloads, and authentication setup.
:::

The API provides predictable, resource-oriented URLs and uses standard HTTP verbs (GET, POST, PUT, DELETE) to manage data. All data is returned as JSON.

## Base URL

All API requests should be made to the `/api/v1` prefix of your Billmora installation.

```text
https://your-billmora-domain.com/api/v1
```

## Content Types

When sending `POST` or `PUT` requests, you must include the `Accept` and `Content-Type` headers to ensure the API processes your payload correctly.

```http
Accept: application/json
Content-Type: application/json
```

## Response Structure

Successful responses will return HTTP status codes in the `2xx` range along with a JSON body representing the resource.

Errors will return status codes in the `4xx` or `5xx` ranges, along with an error message:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "status": ["The selected status is invalid."]
  }
}
```

## Authentication

Billmora API uses **Bearer Tokens** for authentication (powered by Laravel Sanctum).

To interact with the API, you must first generate an API Token:

1. Log in to your Billmora Admin Dashboard.
2. Navigate to **Settings > API Tokens**.
3. Create a new token and assign the necessary permissions (Abilities).
4. Copy the plain-text token (you won't be able to see it again).

Include this token in the `Authorization` header of all your API requests:

```http
Authorization: Bearer 1|TzXy...your_token_here...
```

_(Note: You can also input this token directly in the **Interactive Reference** to test endpoints live)._

## Pagination

Endpoints that return multiple records (like `/api/v1/orders` or `/api/v1/invoices`) use standard pagination. You can control the pages using query parameters:

- `?page=2` (Navigate to a specific page)
- `?per_page=50` (Change the number of records per page)

## Rate Limiting

To maintain stability, the Billmora API implements Rate Limiting. By default, you are allowed to make a maximum of **60 requests per minute**. If you exceed this limit, the API will return a `429 Too Many Requests` status code.

---

🎉 **Ready to get started?** Head over to the [Interactive Reference](/api/reference) to explore the complete list of endpoints, try live requests, and download the OpenAPI specification.
