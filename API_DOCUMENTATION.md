# API Documentation

## Authentication

### Register Admin
**Endpoint**: `POST /api/auth/register`

**Request**:
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response** (201):
```json
{
  "message": "Admin registered successfully",
  "admin": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com"
  },
  "token": "jwt_token"
}
```

---

### Login Admin
**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "username": "admin",
  "password": "securepassword"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "admin": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com"
  },
  "token": "jwt_token"
}
```

---

## Orders

### Create Order
**Endpoint**: `POST /api/orders`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "gameName": "Elden Ring",
  "steamPriceInr": 479,
  "customerPrice": 690
}
```

**Response** (201):
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "gameName": "Elden Ring",
    "steamPriceInr": 479,
    "exchangeRate": 1.30,
    "convertedBdt": 622.70,
    "roundedBdt": 625,
    "paymentCharge": 7.81,
    "finalCost": 632.81,
    "customerPrice": 690,
    "profit": 57.19,
    "status": "Pending",
    "createdAt": "2026-06-19T10:30:00Z"
  }
}
```

---

### Get All Orders
**Endpoint**: `GET /api/orders`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "message": "Orders retrieved successfully",
  "count": 5,
  "orders": [...]
}
```

---

### Get Order by ID
**Endpoint**: `GET /api/orders/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "message": "Order retrieved successfully",
  "order": {...}
}
```

---

### Update Order
**Endpoint**: `PUT /api/orders/{id}`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "gameName": "Updated Game Name",
  "steamPriceInr": 500,
  "customerPrice": 700,
  "status": "Delivered"
}
```

**Response** (200):
```json
{
  "message": "Order updated successfully",
  "order": {...}
}
```

---

### Delete Order
**Endpoint**: `DELETE /api/orders/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "message": "Order deleted successfully"
}
```

---

## Dashboard

### Get Dashboard Stats
**Endpoint**: `GET /api/dashboard/stats`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "message": "Dashboard stats retrieved successfully",
  "stats": {
    "totalOrders": 25,
    "totalRevenue": 15000.50,
    "totalProfit": 2500.75,
    "avgProfitPerOrder": 100.03,
    "todayOrders": 3,
    "todayRevenue": 2000,
    "todayProfit": 350
  }
}
```

---

### Get Analytics
**Endpoint**: `GET /api/dashboard/analytics`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "message": "Analytics retrieved successfully",
  "analytics": {
    "daily": [
      {
        "date": "2026-06-19",
        "orders": 5,
        "revenue": 3500,
        "profit": 600
      }
    ]
  }
}
```

---

## Settings

### Get Settings
**Endpoint**: `GET /api/settings`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "message": "Settings retrieved successfully",
  "settings": {
    "id": "uuid",
    "currencyApiUrl": "https://api.exchangerate-api.com/...",
    "chargePer1000": 12.50,
    "minProfit": 50,
    "maxProfit": 100,
    "updatedAt": "2026-06-19T10:00:00Z"
  }
}
```

---

### Update Settings
**Endpoint**: `PUT /api/settings`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "chargePer1000": 15,
  "minProfit": 40,
  "maxProfit": 150
}
```

**Response** (200):
```json
{
  "message": "Settings updated successfully",
  "settings": {...}
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "details": "Game name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Order not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
