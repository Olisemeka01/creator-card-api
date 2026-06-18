# Creator Card API

A Node.js backend API for managing creator cards with support for public/private access and service rates.

---

## Project Structure

```
├── app.js                    # Entry point, server setup
├── bootstrap.js              # App initialization
├── core/                     # Core utilities (@app-core)
├── endpoints/                # API route definitions
│   └── creator-card/         # Creator Card CRUD endpoints
│       ├── create.js         # POST /creator-cards
│       ├── get-by-slug.js    # GET /creator-cards/:slug
│       └── delete.js         # DELETE /creator-cards/:slug
├── services/
│   └── creator-card/         # Creator Card business logic
│       ├── create.js
│       ├── get-by-slug.js
│       ├── delete.js
│       └── validation-schema.js
├── models/                   # Mongoose schemas
├── repository/               # Data access layer
├── messages/                 # Error messages
│   └── creator-card.js
└── middlewares/              # Request interceptors
```

---

## API Endpoints

### 1. Create Creator Card

**Endpoint:** `POST /creator-cards`

**Request Body:**

```json
{
  "title": "My Creator Profile",
  "description": "Welcome to my creator card",  // optional
  "slug": "my-creator-profile",                // optional - auto-generated if not provided
  "creator_reference": "abcd1234efgh5678ijkk",
  "links": [
    {
      "title": "YouTube",
      "url": "https://youtube.com/@channel"
    },
    {
      "title": "Twitter",
      "url": "https://twitter.com/username"
    }
  ],
  "service_rates": {                             // optional
    "currency": "USD",
    "rates": [
      {
        "name": "Video Shoutout",
        "description": "A personalized video message",
        "amount": 100
      },
      {
        "name": "Brand Deal",
        "description": "Sponsored content on my channel",
        "amount": 500
      }
    ]
  },
  "status": "published",                        // "draft" or "published"
  "access_type": "public",                      // optional - "public" or "private", defaults to "public"
  "access_code": "123456"                       // optional - required if access_type is "private"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Creator Card Created Successfully.",
  "status": "success",
  "data": {
    "id": "01KVD6VNG925G7BQYXMSB0Q6TM",
    "title": "My Creator Profile",
    "description": "Welcome to my creator card",
    "slug": "my-creator-profile",
    "creator_reference": "abcd1234efgh5678ij",
    "links": [...],
    "service_rates": {...},
    "status": "published",
    "access_type": "public",
    "created": 1781781091849,
    "updated": 1781781091849,
    "deleted": null
  }
}
```

**Error Responses:**

| Error | Status | Message |
|-------|--------|---------|
| Slug already exists | 409 | `"Slug is already taken"` |
| Access code on public card | 400 | `"access_code can only be set on private cards"` |
| Missing access code | 400 | `"access_code is required when access_type is private"` |
| Validation error | 400 | Various field validation errors |

---

### 2. Get Creator Card by Slug

**Endpoint:** `GET /creator-cards/:slug`

**Path Parameter:**
- `slug` - The unique slug of the creator card

**Query Parameter:**
- `access_code` (optional) - Required for private cards

**Example:** `GET /creator-cards/my-creator-profile?access_code=123456`

**Success Response (200 OK):**

```json
{
  "message": "Creator Card Retrieved Successfully.",
  "status": "success",
  "data": {
    "id": "01KVD6VNG925G7BQYXMSB0Q6TM",
    "title": "My Creator Profile",
    "description": "Welcome to my creator card",
    "slug": "my-creator-profile",
    "creator_reference": "abcd1234efgh5678ij",
    "links": [...],
    "service_rates": {...},
    "status": "published",
    "access_type": "public",
    "created": 1781781091849,
    "updated": 1781781091849
  }
}
```

**Error Responses:**

| Error | Status | Message |
|-------|--------|---------|
| Card not found | 404 | `"Creator card not found"` |
| Card is draft | 404 | `"Creator card not found"` |
| Access code required | 400 | `"This card is private. An access code is required"` |
| Invalid access code | 400 | `"Invalid access code"` |

---

### 3. Delete Creator Card

**Endpoint:** `DELETE /creator-cards/:slug`

**Path Parameter:**
- `slug` - The unique slug of the creator card to delete

**Request Body:**

```json
{
  "creator_reference": "abcd1234efgh5678ij"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Creator Card Deleted Successfully.",
  "status": "success",
  "data": {
    "id": "01KVD6VNG925G7BQYXMSB0Q6TM",
    "title": "My Creator Profile",
    "deleted": 1781781091849
  }
}
```

**Error Responses:**

| Error | Status | Message |
|-------|--------|---------|
| Card not found | 404 | `"Creator card not found"` |
| Invalid creator reference | 403 | `"Invalid creator reference"` |

---

## Field Validation

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | ✅ | 3-100 characters |
| `description` | string | ❌ | Max 500 characters |
| `slug` | string | ❌ | 5-50 characters |
| `creator_reference` | string | ✅ | Exactly 20 characters |
| `links[].title` | string | ✅ | 1-100 characters |
| `links[].url` | string | ✅ | Max 200 characters, must start with `http://` or `https://` |
| `service_rates.currency` | string | ❌ | Must be: `NGN`, `USD`, `GBP`, or `GHS` |
| `service_rates.rates[].name` | string | ✅ | 3-100 characters |
| `service_rates.rates[].description` | string | ✅ | Max 250 characters |
| `service_rates.rates[].amount` | number | ✅ | Minimum 1 |
| `status` | string | ✅ | Must be: `draft` or `published` |
| `access_type` | string | ❌ | Must be: `public` or `private` (defaults to `public`) |
| `access_code` | string | ❌ | Exactly 6 characters (required when `access_type` is `private`) |

---

## Error Response Format

All errors follow this standard format:

```json
{
  "status": "error",
  "message": "Error message description",
  "code": "ERROR_CODE"
}
```

---

## Postman Collection

A Postman collection for testing these endpoints can be found in the `postman_collections/` folder.

---

**Version:** 1.0.0
