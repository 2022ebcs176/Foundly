# Foundly Backend - API Documentation & Frontend Integration Guide

## Overview
This document outlines all API endpoints, request/response data types, and essential information needed for frontend integration.

**Base URL:** `http://localhost:9292/api`
**Content-Type:** `application/json`

---

## 1. AUTHENTICATION APIs

### 1.1 User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body (RegisterRequest):**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `String`
- Success: User authentication token or confirmation message
- Error: 400 Bad Request with error message

**Data Types:**
- `username`: String
- `email`: String
- `password`: String (should be encrypted on backend)

---

### 1.2 User Login
**Endpoint:** `POST /api/auth/login`

**Request Body (LoginRequest):**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `String`
- Success: Authentication token or session ID
- Error: 400 Bad Request if credentials invalid

**Data Types:**
- `email`: String
- `password`: String

---

## 2. FOUND ITEMS APIs

### 2.1 Post a Found Item
**Endpoint:** `POST /api/found-items/post`
**Content-Type:** `application/json`

**Request Body (FoundItemRequest):**
```json
{
  "itemName": "string (required)",
  "itemColor": "string (required)",
  "itemDescription": "string (required)",
  "itemHighlight": "string (required)",
  "time": "HH:mm (LocalTime, optional)",
  "date": "yyyy-MM-dd (LocalDate, optional)",
  "venue": "string (required)",
  "postedBy": "string (required) - username",
  "itemCategory": "string (required)",
  "itemImages": ["string array of image URLs or base64 (optional)"]
}
```

**Response (FoundItem Entity):**
```json
{
  "id": "Long",
  "itemName": "string",
  "itemColor": "string",
  "itemDescription": "string",
  "itemHighlight": "string",
  "time": "HH:mm",
  "date": "yyyy-MM-dd",
  "venue": "string",
  "postedBy": "string",
  "itemCategory": "string",
  "itemImages": ["string array"]
}
```

**Error Response:**
```json
{
  "error": "string",
  "details": "string (optional)"
}
```

**Data Types:**
- `itemName`: String
- `itemColor`: String
- `itemDescription`: String
- `itemHighlight`: String
- `time`: LocalTime (format: HH:mm)
- `date`: LocalDate (format: yyyy-MM-dd)
- `venue`: String
- `postedBy`: String (username of poster)
- `itemCategory`: String
- `itemImages`: List<String> (URLs or encoded images)
- `id`: Long (auto-generated)

---

### 2.2 Get All Found Items
**Endpoint:** `GET /api/found-items/all`

**Query Parameters (all optional):**
- `category`: String - Filter by item category
- `venue`: String - Filter by venue

**Response:** `List<FoundItem>`
```json
[
  {
    "id": "Long",
    "itemName": "string",
    "itemColor": "string",
    "itemDescription": "string",
    "itemHighlight": "string",
    "time": "HH:mm",
    "date": "yyyy-MM-dd",
    "venue": "string",
    "postedBy": "string",
    "itemCategory": "string",
    "itemImages": ["string array"]
  }
]
```

**Supported Categories:** (Based on service implementation, needs to match backend)
- Common categories: Electronics, Jewelry, Documents, Clothing, Bags, Keys, Other

---

### 2.3 Get Items by User
**Endpoint:** `GET /api/found-items/user/{username}`

**Path Parameters:**
- `username`: String - Username of the poster

**Response:** `List<FoundItem>` (same structure as 2.2)

---

### 2.4 Search Items
**Endpoint:** `GET /api/found-items/search`

**Query Parameters (both optional):**
- `category`: String - Filter by category
- `name`: String - Filter by item name (partial match)

**Response:** `List<FoundItem>` (same structure as 2.2)

---

### 2.5 Get Items by Category
**Endpoint:** `GET /api/found-items/category/{category}`

**Path Parameters:**
- `category`: String - Category name

**Response:** 
- 200 OK: `List<FoundItem>` (same structure as 2.2)
- 204 No Content: Empty list if no items found

---

### 2.6 Get All Categories
**Endpoint:** `GET /api/found-items/categories`

**Response:** `List<String>`
```json
[
  "category1",
  "category2",
  "category3"
]
```

---

## 3. CLAIM APIs

### 3.1 Place a Claim on a Found Item
**Endpoint:** `POST /api/found-items/{id}/claim`

**Path Parameters:**
- `id`: Long - Item ID to claim

**Headers (Required):**
- `X-API-KEY`: String - API key for authentication (currently username, should be JWT/session token)

**Request Body (ClaimRequest):**
```json
{
  "meetingDate": "yyyy-MM-dd (LocalDate, required)",
  "meetingTime": "HH:mm (LocalTime, required)",
  "adminName": "string (required)",
  "contactPersonName": "string (required)",
  "contactNumber": "string (required)",
  "idProofNumber": "string (required)"
}
```

**Response (Claim Entity):**
```json
{
  "id": "Long",
  "claimer": "string (username)",
  "contactPersonName": "string",
  "contactNumber": "string",
  "idProofNumber": "string",
  "meetingDate": "yyyy-MM-dd",
  "meetingTime": "HH:mm",
  "adminName": "string",
  "foundItem": {
    // Complete FoundItem object nested
    "id": "Long",
    "itemName": "string",
    // ... all FoundItem properties
  }
}
```

**Error Responses:**
- 400 Bad Request: Invalid data or authentication missing
- 500 Internal Server Error: Server error with message

**Data Types:**
- `meetingDate`: LocalDate (format: yyyy-MM-dd)
- `meetingTime`: LocalTime (format: HH:mm)
- `adminName`: String
- `contactPersonName`: String
- `contactNumber`: String (phone number)
- `idProofNumber`: String (ID proof reference)
- `claimer`: String (username, derived from X-API-KEY header)

---

## 4. DATA ENTITIES

### User Entity
```java
{
  "id": Long,                    // Auto-generated
  "username": String,            // Unique, required
  "email": String,              // Unique, required
  "password": String            // Encrypted, required
}
```

### FoundItem Entity
```java
{
  "id": Long,                    // Auto-generated
  "itemName": String,
  "itemColor": String,
  "itemDescription": String,
  "itemHighlight": String,
  "time": LocalTime,             // Format: HH:mm
  "date": LocalDate,             // Format: yyyy-MM-dd
  "venue": String,
  "postedBy": String,            // Username of poster
  "itemCategory": String,
  "itemImages": List<String>     // Array of image URLs
}
```

### Claim Entity
```java
{
  "id": Long,                    // Auto-generated
  "claimer": String,             // Username claiming the item
  "contactPersonName": String,
  "contactNumber": String,
  "idProofNumber": String,
  "meetingDate": LocalDate,      // Format: yyyy-MM-dd
  "meetingTime": LocalTime,      // Format: HH:mm
  "adminName": String,
  "foundItem": FoundItem         // Reference to the found item
}
```

---

## 5. IMPORTANT FRONTEND INTEGRATION NOTES

### Date & Time Formats
- **LocalDate Format:** `yyyy-MM-dd` (e.g., "2024-01-21")
- **LocalTime Format:** `HH:mm` (e.g., "14:30" for 2:30 PM)
- Frontend MUST format dates and times in these exact formats when sending requests
- Backend returns dates/times in these formats

### File Upload
- Maximum single file size: **5MB**
- Maximum total request size: **25MB**
- Upload directory: `/uploads/`
- Images are stored as URLs in `itemImages` list

### CORS Configuration
- Currently allows all origins: `@CrossOrigin("*")`
- Update in production for security

### Authentication
- Currently uses basic API-KEY in headers (`X-API-KEY`)
- **TODO:** Should implement JWT tokens instead
- Username passed via header for claim operations

### Response Types
- Success responses use `ResponseEntity` with HTTP status codes
- Error responses include:
  - `error`: String description
  - `details`: Optional detailed error message

### Server Configuration
- **Server Port:** `9292`
- **Database:** H2 (in-memory for dev, can be configured)
- **H2 Console:** Available at `http://localhost:9292/my-secret-db-console`

### Validation Requirements
- Email must be unique and valid format
- Username must be unique
- All required fields must be provided
- Contact number should be valid phone format
- ID Proof Number cannot be empty/null

---

## 6. SAMPLE REQUEST/RESPONSE FLOWS

### Flow 1: Register & Login
```
1. POST /api/auth/register
   Request: { username, email, password }
   Response: Token/Success message

2. POST /api/auth/login
   Request: { email, password }
   Response: Token/Session ID
```

### Flow 2: Post a Found Item
```
1. POST /api/found-items/post
   Request: FoundItemRequest with all item details
   Response: FoundItem entity with generated ID
```

### Flow 3: Claim an Item
```
1. GET /api/found-items/all (to find item to claim)
   Response: List of FoundItems

2. POST /api/found-items/{itemId}/claim
   Headers: { X-API-KEY: username }
   Request: ClaimRequest with meeting details
   Response: Claim entity with found item reference
```

---

## 7. HTTP STATUS CODES USED

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 204 | No Content - Successful but no items |
| 400 | Bad Request - Invalid data or missing authentication |
| 500 | Internal Server Error - Server-side error |

---

## 8. CRITICAL MISMATCHES TO AVOID

✅ **DO:**
- Use exact date formats: `yyyy-MM-dd` for dates, `HH:mm` for times
- Include all required fields in requests
- Use correct headers for authentication (`X-API-KEY`)
- Handle null values for optional time/date fields
- Store and validate email format

❌ **DON'T:**
- Use different date formats (e.g., MM/DD/YYYY)
- Send missing required fields
- Forget the API-KEY header for claim operations
- Store passwords in plain text
- Assume API returns inconsistent data types

---

## Database Tables Generated
- `app_users` - User information
- `found_items` - Found items listings
- `found_item_images` - Images linked to items
- `claim` - Claims on items

---

*Last Updated: January 21, 2026*
*Version: 1.0 - Initial API Documentation*
