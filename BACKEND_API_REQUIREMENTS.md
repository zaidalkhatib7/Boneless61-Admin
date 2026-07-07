# Boneless 61 CMS Backend API Requirements

This document lists the backend API gaps blocking the Boneless 61 production CMS.
The CMS is intended for restaurant staff, so order management must work from a live
queue. Staff should not copy/paste UUIDs or guess API routes.

## Current API Base URL

```text
https://boneless.glanzly-service.de/api/
```

All routes below are relative to that API base.

## What Works Today

The CMS can already authenticate and load back-office resources such as branches,
menu categories, menu items, option groups, options, and offers.

The order status screen can load an order queue from:

```http
GET /admin/orders
```

The API documentation currently lists these admin order status actions:

```http
POST /admin/orders/{order}/confirm
POST /admin/orders/{order}/send-to-delivery
```

These are not enough for production order handling because the CMS also needs to
cancel orders, complete pickup orders, complete delivery orders, and display
customer details.

## Missing Required Endpoints

### 1. Official Admin Order List Endpoint

Please document and stabilize:

```http
GET /admin/orders
```

Required query params:

| Param | Required | Description |
| --- | --- | --- |
| `status` | No | Filter by one status or groups such as `active`, `past`, `pending` |
| `type` | No | `DELIVERY` or `PICKUP` |
| `search` | No | Search by order number, customer name, phone, or UUID |
| `page` | No | Pagination page |
| `per_page` | No | Pagination page size |

The CMS currently depends on this endpoint for the live order queue.

### 2. Admin Order Detail Endpoint

Please provide or document:

```http
GET /admin/orders/{order}
```

The CMS needs this for full order details, customer data, delivery address,
pickup branch, order items, notes, and status history.

### 3. Cancel Order Endpoint

The CMS needs:

```http
POST /admin/orders/{order}/cancel
```

Current live issue:

```text
The route api/admin/orders/{order}/cancel could not be found.
```

Expected behavior:

| From status | To status |
| --- | --- |
| `PENDING` | `CANCELLED` |
| `CONFIRMED` | `CANCELLED` |
| `PREPARING` | `CANCELLED` |

Please confirm whether `OUT_FOR_DELIVERY` can also be cancelled.

### 4. Complete Pickup Endpoint

Pickup orders should not go to `OUT_FOR_DELIVERY`.

Please provide one exact endpoint for completing a pickup order. Recommended:

```http
POST /admin/orders/{order}/complete-pickup
```

Expected behavior:

| Order type | From status | To status |
| --- | --- | --- |
| `PICKUP` | `PREPARING` | `DELIVERED` |

Current live issue when the CMS tries a completion route:

```text
The route api/admin/orders/{order}/complete could not be found.
```

If the backend prefers another final pickup status such as `READY_FOR_PICKUP` or
`PICKED_UP`, please document the exact status names and transitions.

### 5. Complete Delivery Endpoint

Delivery orders need a final step after dispatch.

Please provide one exact endpoint. Recommended:

```http
POST /admin/orders/{order}/mark-delivered
```

Expected behavior:

| Order type | From status | To status |
| --- | --- | --- |
| `DELIVERY` | `OUT_FOR_DELIVERY` | `DELIVERED` |

The existing docs mention `OUT_FOR_DELIVERY -> DELIVERED`, but no admin endpoint
is documented for this transition.

### 6. Confirm Valid Dispatch Endpoint

The docs list:

```http
POST /admin/orders/{order}/send-to-delivery
```

Please confirm this is the only supported route for:

| Order type | From status | To status |
| --- | --- | --- |
| `DELIVERY` | `PREPARING` | `OUT_FOR_DELIVERY` |

The CMS should not need fallback routes like `/out-for-delivery`.

## Required Order Response Shape

Every order in `GET /admin/orders` and `GET /admin/orders/{order}` should include
enough data for staff to understand and process it without opening another system.

Required fields:

```json
{
  "id": "019f288f-dac9-732e-989a-305c9b3fba60",
  "order_number": "B61-00001",
  "type": "PICKUP",
  "status": "PREPARING",
  "customer": {
    "id": "customer-uuid",
    "full_name": "Rocco Valentino",
    "phone": "+963 933 123 456",
    "email": "rocco@boneless61.com"
  },
  "total_syp": 34500,
  "created_at": "2026-07-03T18:19:04Z",
  "branch": {
    "id": "branch-uuid",
    "name": "Downtown Hub"
  },
  "delivery_address": null,
  "items": [
    {
      "id": "item-uuid",
      "name_en": "Boneless Wrap",
      "name_ar": "راب بونلس",
      "quantity": 1,
      "unit_price_syp": 29500,
      "total_syp": 29500,
      "options": []
    }
  ]
}
```

For delivery orders, include:

```json
{
  "type": "DELIVERY",
  "delivery_address": {
    "recipient_name": "Rocco Valentino",
    "phone": "+963 933 123 456",
    "city": "Damascus",
    "area": "Abu Rummaneh",
    "address_line": "Building 42, Al-Jalaa St.",
    "notes": "Gate code, floor, landmark, etc.",
    "latitude": 33.5138,
    "longitude": 36.2765
  }
}
```

## Current Data Problem

The CMS currently shows:

```text
Customer: -
Phone: -
```

The backend order list/detail response must include customer name and phone in a
stable location. Either of these shapes is acceptable:

```json
{
  "customer": {
    "full_name": "Rocco Valentino",
    "phone": "+963 933 123 456"
  }
}
```

or:

```json
{
  "customer_name": "Rocco Valentino",
  "customer_phone": "+963 933 123 456"
}
```

The nested `customer` object is preferred.

## Required Order Workflows

### Delivery Order

```text
PENDING or CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED
```

Required actions:

| Button in CMS | Endpoint | Transition |
| --- | --- | --- |
| Confirm order | `POST /admin/orders/{order}/confirm` | `PENDING/CONFIRMED -> PREPARING` |
| Send to delivery | `POST /admin/orders/{order}/send-to-delivery` | `PREPARING -> OUT_FOR_DELIVERY` |
| Mark delivered | `POST /admin/orders/{order}/mark-delivered` | `OUT_FOR_DELIVERY -> DELIVERED` |
| Cancel order | `POST /admin/orders/{order}/cancel` | Allowed active status -> `CANCELLED` |

### Pickup Order

```text
PENDING or CONFIRMED -> PREPARING -> DELIVERED
```

Required actions:

| Button in CMS | Endpoint | Transition |
| --- | --- | --- |
| Confirm order | `POST /admin/orders/{order}/confirm` | `PENDING/CONFIRMED -> PREPARING` |
| Complete pickup | `POST /admin/orders/{order}/complete-pickup` | `PREPARING -> DELIVERED` |
| Cancel order | `POST /admin/orders/{order}/cancel` | Allowed active status -> `CANCELLED` |

## Error Response Requirements

All admin API errors should return JSON, not HTML.

Examples:

### Unauthenticated

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "message": "Unauthenticated."
}
```

### Invalid Status Transition

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json
```

```json
{
  "message": "This order cannot be sent to delivery from status PENDING."
}
```

### Not Found

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "message": "Order not found."
}
```

## Response After Status Update

Every status action should return the updated order object so the CMS can refresh
the card immediately.

```json
{
  "message": "Order status updated.",
  "data": {
    "id": "019f288f-dac9-732e-989a-305c9b3fba60",
    "order_number": "B61-00001",
    "type": "PICKUP",
    "status": "DELIVERED",
    "customer": {
      "full_name": "Rocco Valentino",
      "phone": "+963 933 123 456"
    },
    "total_syp": 34500,
    "created_at": "2026-07-03T18:19:04Z"
  }
}
```

## Backend Questions To Confirm

1. Is `PENDING` a real status in the admin API, and should the CMS allow
   `PENDING -> PREPARING` through the confirm endpoint?
2. What is the exact final delivery endpoint: `/mark-delivered`, `/delivered`,
   or another route?
3. What is the exact final pickup endpoint: `/complete-pickup`, `/complete`,
   or another route?
4. Should pickup orders use only `DELIVERED`, or should the backend add
   `READY_FOR_PICKUP` and `PICKED_UP`?
5. Which statuses can be cancelled by admin?
6. Where should customer name and phone appear in the order response?
7. Should `GET /admin/orders` support pagination and filters in the first
   production release?

## Frontend Impact

The CMS can display the live queue and show the correct buttons by order type.
It is blocked from production order handling until the backend exposes the
missing status endpoints and returns customer contact data.
