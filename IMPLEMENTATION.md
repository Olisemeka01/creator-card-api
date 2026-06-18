# Creator Card Microservice API - Implementation Documentation

## Overview

This implementation provides a REST API for managing Creator Cards - shareable profile cards that allow creators to showcase their links and service rates. The API follows the Node.js template structure and includes comprehensive validation, error handling, and access controls.

## Features

- ✅ Create Creator Cards with customizable links and service rates
- ✅ Auto-generate slugs from titles (with random suffix for duplicates)
- ✅ Public and private card access with PIN protection
- ✅ Draft and published status workflow
- ✅ **Soft delete - records are never lost from the database**
- ✅ Comprehensive field-level validation
- ✅ Custom business rule error codes

## Architecture

```
├── models/creator-card.js          # MongoDB schema with paranoid delete
├── repository/creator-card/        # Data access layer
├── services/creator-card/          # Business logic layer
│   ├── index.js                   # Barrel export
│   ├── create.js                  # Create Creator Card
│   ├── get-by-slug.js            # Get Creator Card by slug
│   ├── delete.js                  # Delete Creator Card (soft delete)
│   ├── utils.js                   # Shared utilities (transformRecord)
│   ├── validation-schema.js       # VSL validation specs
│   └── slug-generator.js          # Slug auto-generation
└── endpoints/creator-card/         # HTTP endpoints
    ├── create.js                  # POST /creator-cards
    ├── get-by-slug.js            # GET /creator-cards/:slug
    └── delete.js                 # DELETE /creator-cards/:slug
```

## Soft Delete Behavior

**Important:** This implementation uses soft delete. No records are ever permanently deleted from the database.

| Operation | Database State |
|-----------|---------------|
| Create card | `deleted: null` |
| Delete card | `deleted: <timestamp>` |
| Retrieve deleted card | Returns 404 NF01 (not found) |

The record remains in MongoDB with the `deleted` field set to a timestamp. All queries filter by `deleted: null` to exclude deleted records from results.

## API Endpoints

### 1. Create Creator Card
`POST /creator-cards`

### 2. Retrieve Creator Card
`GET /creator-cards/:slug?access_code=PIN`

### 3. Delete Creator Card
`DELETE /creator-cards/:slug`

See [SETUP.md](SETUP.md) for detailed API documentation and Postman testing.
