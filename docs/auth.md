## Authentication

### 1. User Registration

- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Type**: Internal

#### Request Body
```json
{
  "email": "string",
  "first_name": "string",
  "last_name": "string",
  "password": "string",
  "repeat_password": "string",
  "recaptcha_ref": "string",
}
```

#### Response
- **Status 201**: User created successfully
- **Status 409**: Existing email address

### 2. User Login

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Type**: Internal
  
#### Request Body
```json
{
  "username": "string",
  "password": "string",
  "recaptcha_ref": "string",
}
```

#### Response
- **Status 200**: Login successful
```json
{
  "token": "string"
}
```
- **Status 404**: User not found
- **Status 401**: Unauthorized


### 3. User Logout

- **Endpoint:** `/auth/logout`
- **Method:** `POST`
- **Type**: Internal
  
#### Headers
- **Authorization:** `Bearer <token>`

#### Response
- **Status 200**: Logout successful
- **Status 401**: Unauthorized

### 4. User Verify

- **Endpoint:** `/auth/verify`
- **Method:** `POST`
- **Type**: Internal
  
#### Headers
- **Authorization:** `Bearer <token>`

#### Response
- **Status 200**: Session has been verify successfully
```json
{
  "email": "string",
  "role": "string",
}
```
- **Status 401**: Unauthorized

### 5. User

- **Endpoint:** `/auth/user`
- **Method:** `POST`
- **Type**: Internal

#### Headers
- **Authorization:** `Bearer <token>`

#### Response
- **Status 200**: User profile
```json
{
  "user": {
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "created_at": "date",
},
}
```
- **Status 401**: Unauthorized

## Notes
- Passwords must be at least 8 characters long and contain a mix of letters, numbers, and symbols.