## Track

### 1. Track

-   **Endpoint:** `/track/:id`
-   **Method:** `GET`
-   **Type:** `Internal`

#### Headers

-   **Authorization:** `Bearer <token>`

#### Params

-   Freight id

#### Response

-   **Status 200**: Process successfully

```json
  "events": "object",
  "origin": "string",
  "destination": "string",
  "status": "string",
  "markerPositions": "object",
```

-   **Status 404**: Freight id not found
