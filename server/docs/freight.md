## Freight

### 1. Shipments

-   **Endpoint:** `/freight`
-   **Method:** `POST`

#### Headers

-   **Authorization:** `Bearer <token>`

#### Request Body

```json
{
    "page": "number|optional"
}
```

#### Response

-   **Status 200**: Process successfully

```json
  "data": "object",
  "totalPages": "number",
  "currentPage": "number",
```

### 2. Adding of Shipment

-   **Endpoint:** `/freight/b/:type`
-   **Method:** `POST`
-   **Type**: `Internal`

#### Headers

-   **Authorization:** `Bearer <token>`

#### Params

-   Freight type

#### Request Body

```json
{
    "shipper": "object",
    "consignee": "object",
    "shipment": "object",
    "shipping": "object"
}
```

#### Response

-   **Status 200**: Process successfully
-   **Status 404**: Freight id not found

### 3. Updating of Shipment

-   **Endpoint:** `/freight/u/:type/:id`
-   **Method:** `POST`
-   **Type**: `Internal`

#### Headers

-   **Authorization:** `Bearer <token>`

#### Params

-   Freight type
-   Freight id

#### Request Body

```json
{
    "shipper": "object",
    "consignee": "object",
    "shipment": "object",
    "shipping": "object"
}
```

#### Response

-   **Status 200**: Process successfully

### 3. Deleting of Shipment

-   **Endpoint:** `/freight/d/:id`
-   **Method:** `POST`
-   **Type**: `Internal`

#### Params

-   Freight id

#### Headers

-   **Authorization:** `Bearer <token>`

#### Response

-   **Status 200**: Process successfully
-   **Status 404**: Freight id not found

### 4. Get info of freight using id

-   **Endpoint:** `/:id`
-   **Method:** `GET`

#### Params

-   Freight id

#### Headers

-   **Authorization:** `Bearer <token>`

#### Response

-   **Status 200**: Process successfully

```json
  "data": "object",
```

-   **Status 404**: Freight id not found
