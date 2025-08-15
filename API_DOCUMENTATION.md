# API Documentation

This document outlines all available API endpoints, their purposes, required permissions, and expected request/response structures.

## Table of Contents

-   [Authentication](#authentication)
-   [Users](#users)
-   [Verifications](#verifications)
-   [Locations](#locations)
-   [Announcements](#announcements)
-   [Community Posts](#community-posts)
-   [Comments](#comments)
-   [Votes](#votes)
-   [Donation Events](#donation-events)
-   [Donation Transactions](#donation-transactions)
-   [Notifications](#notifications)
-   [Statistics](#statistics)

## Authentication

### Register a new user

-   **URL**: `POST /api/auth/register`
-   **Description**: Register a new user account
-   **Role**: Guest
-   **Request Body**:

    ```json
    {
        "first_name": "string",
        "last_name": "string",
        "username": "string",
        "email": "string",
        "phone": "string (optional)",
        "password": "string",
        "password_confirmation": "string"
    }
    ```

    **Validation Rules**:

    -   `first_name`: required|string|max:255
    -   `last_name`: required|string|max:255
    -   `username`: required|string|max:255|unique:users
    -   `email`: required|string|email|max:255|unique:users
    -   `phone`: nullable|string|max:20
    -   `password`: required|string|min:8|confirmed

-   **Response (201 Created)**:

    ```json
    {
        "message": "User registered successfully",
        "user": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "username": "johndoe",
            "avatar_url": "https://...",
            "avatar_url_full": "https://...",
            "email": "john@example.com",
            "phone": "+1234567890",
            "email_verified_at": null,
            "created_at": "2025-08-12T11:45:00.000000Z",
            "updated_at": "2025-08-12T11:45:00.000000Z"
        },
        "access_token": "1|abcdefghijk...",
        "token_type": "Bearer"
    }
    ```

    **Error Responses**:

    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Login

-   **URL**: `POST /api/auth/login`
-   **Description**: Authenticate user and retrieve access token
-   **Role**: Guest
-   **Request Body**:

    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```

    **Validation Rules**:

    -   `email`: required|string|email
    -   `password`: required|string

-   **Response (200 OK)**:

    ```json
    {
        "message": "Login successful",
        "user": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "username": "johndoe",
            "avatar_url": "https://...",
            "avatar_url_full": "https://...",
            "email": "john@example.com",
            "phone": "+1234567890",
            "email_verified_at": "2025-08-12T12:00:00.000000Z",
            "created_at": "2025-08-10T10:00:00.000000Z",
            "updated_at": "2025-08-12T11:45:00.000000Z",
            "location": {
                "id": 1,
                "governorate": "Beirut",
                "district": "Achrafieh"
            }
        },
        "access_token": "1|abcdefghijk...",
        "token_type": "Bearer",
        "isAdmin": false
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Invalid credentials
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Forgot Password

-   **URL**: `POST /api/auth/forgot-password`
-   **Description**: Request password reset OTP code
-   **Role**: Guest
-   **Request Body**:

    ```json
    {
        "email": "string"
    }
    ```

    **Validation Rules**:

    -   `email`: required|email

-   **Response (200 OK)**:

    ```json
    {
        "message": "If your email exists in our records, you will receive a password reset code."
    }
    ```

    **Notes**:

    -   Always returns 200 OK to prevent email enumeration
    -   OTP code is valid for 10 minutes
    -   In development, the OTP is logged in the Laravel log

### Reset Password

-   **URL**: `POST /api/auth/reset-password`
-   **Description**: Reset password using OTP code
-   **Role**: Guest
-   **Request Body**:

    ```json
    {
        "code": "string (6 digits)",
        "email": "string",
        "password": "string",
        "password_confirmation": "string"
    }
    ```

    **Validation Rules**:

    -   `code`: required|string (6 digits)
    -   `email`: required|email|exists:users,email
    -   `password`: required|string|min:8|confirmed

-   **Response (200 OK)**:

    ```json
    {
        "message": "Password has been reset successfully."
    }
    ```

    **Error Responses**:

    -   `422 Unprocessable Entity` - Invalid/expired code or validation errors
    -   `500 Internal Server Error` - Server error

### Logout

-   **URL**: `POST /api/auth/logout`
-   **Description**: Invalidate current authentication token
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **Response (200 OK)**:

    ```json
    {
        "message": "Successfully logged out"
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Get Current User

-   **URL**: `GET /api/me`
-   **Description**: Get authenticated user's profile
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **Response (200 OK)**:

    ```json
    {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe",
        "avatar_url": "https://...",
        "avatar_url_full": "https://...",
        "email": "john@example.com",
        "phone": "+1234567890",
        "email_verified_at": "2025-08-12T12:00:00.000000Z",
        "created_at": "2025-08-10T10:00:00.000000Z",
        "updated_at": "2025-08-12T11:45:00.000000Z",
        "location": {
            "id": 1,
            "governorate": "Beirut",
            "district": "Achrafieh"
        }
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

## Users

### Get User Profile

-   **URL**: `GET /api/user/profile`
-   **Description**: Get the authenticated user's profile
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "username": "johndoe",
            "avatar_url": "https://...",
            "avatar_url_full": "https://...",
            "email": "john@example.com",
            "phone": "+1234567890",
            "email_verified_at": "2025-08-12T12:00:00.000000Z",
            "created_at": "2025-08-10T10:00:00.000000Z",
            "updated_at": "2025-08-12T11:45:00.000000Z",
            "location": {
                "id": 1,
                "governorate": "Beirut",
                "district": "Achrafieh"
            }
        },
        "message": "User profile retrieved successfully"
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Update Profile

-   **URL**: `PUT /api/user/profile`
-   **Description**: Update the authenticated user's profile
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: multipart/form-data (for file uploads)
-   **Request Body**:

    ```json
    {
        "first_name": "string (optional)",
        "last_name": "string (optional)",
        "username": "string (optional, unique)",
        "email": "string (optional, email, unique)",
        "phone": "string (optional, max:15)",
        "location_id": "integer (optional, exists:locations,id)",
        "avatar_url": "file (optional, image, max:5MB, mimes:jpeg,png,jpg,gif,webp)",
        "delete_avatar": "boolean (optional)"
    }
    ```

    **Validation Rules**:

    -   All fields are optional (use `sometimes` rule)
    -   `first_name`: string|max:255
    -   `last_name`: string|max:255
    -   `username`: string|min:3|max:255|unique:users,username,{user_id}
    -   `email`: email|max:255|unique:users,email,{user_id}
    -   `phone`: nullable|string|max:15
    -   `location_id`: nullable|exists:locations,id
    -   `avatar_url`: image|mimes:jpeg,png,jpg,gif,webp|max:5120
    -   `delete_avatar`: boolean

-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "username": "johndoe",
            "avatar_url": "https://...",
            "avatar_url_full": "https://...",
            "email": "john.updated@example.com",
            "phone": "+1234567890",
            "email_verified_at": "2025-08-12T12:00:00.000000Z",
            "created_at": "2025-08-10T10:00:00.000000Z",
            "updated_at": "2025-08-12T14:30:00.000000Z",
            "location": {
                "id": 2,
                "governorate": "Mount Lebanon",
                "district": "Metn"
            }
        },
        "message": "User updated successfully"
    }
    ```

    **Notes**:

    -   When updating `avatar_url`, the old avatar is automatically deleted
    -   Set `delete_avatar: true` to remove the current avatar
    -   Only include fields that need to be updated

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### List All Users (Admin)

-   **URL**: `GET /api/users`
-   **Description**: List all users with pagination (15 per page)
-   **Role**: Admin
-   **Permissions**: `view users`
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **Query Parameters**:
    -   `page`: integer (optional, default: 1)
-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "data": [
                {
                    "id": 1,
                    "first_name": "John",
                    "last_name": "Doe",
                    "username": "johndoe",
                    "avatar_url": "https://...",
                    "avatar_url_full": "https://...",
                    "email": "john@example.com",
                    "phone": "+1234567890",
                    "email_verified_at": "2025-08-12T12:00:00.000000Z",
                    "created_at": "2025-08-10T10:00:00.000000Z",
                    "updated_at": "2025-08-12T11:45:00.000000Z",
                    "location": {
                        "id": 1,
                        "governorate": "Beirut",
                        "district": "Achrafieh"
                    }
                }
                // ... more users
            ],
            "current_page": 1,
            "first_page_url": "http://localhost/api/users?page=1",
            "from": 1,
            "last_page": 5,
            "last_page_url": "http://localhost/api/users?page=5",
            "links": [
                // pagination links
            ],
            "next_page_url": "http://localhost/api/users?page=2",
            "path": "http://localhost/api/users",
            "per_page": 15,
            "prev_page_url": null,
            "to": 15,
            "total": 75
        },
        "message": "Users retrieved successfully"
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to view users
    -   `500 Internal Server Error` - Server error

### Get User by ID (Admin)

-   **URL**: `GET /api/users/{user}`
-   **Description**: Get a specific user's details by ID
-   **Role**: Admin
-   **Permissions**: `view users`
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **URL Parameters**:
    -   `user`: integer (required) - The ID of the user to retrieve
-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Smith",
            "username": "janesmith",
            "avatar_url": "https://...",
            "avatar_url_full": "https://...",
            "email": "jane@example.com",
            "phone": "+1987654321",
            "email_verified_at": "2025-08-11T09:30:00.000000Z",
            "created_at": "2025-08-10T11:20:00.000000Z",
            "updated_at": "2025-08-12T10:15:00.000000Z",
            "location": {
                "id": 3,
                "governorate": "North",
                "district": "Tripoli"
            }
        },
        "message": "User retrieved successfully"
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to view users
    -   `404 Not Found` - User not found
    -   `500 Internal Server Error` - Server error

### Create User (Admin)

-   **URL**: `POST /api/users`
-   **Description**: Create a new user (admin only)
-   **Role**: Admin
-   **Permissions**: `create users`
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json
-   **Request Body**:

    ```json
    {
        "first_name": "string (required)",
        "last_name": "string (required)",
        "username": "string (required, unique)",
        "email": "string (required, email, unique)",
        "phone": "string (optional, max:20)",
        "password": "string (required, min:8)",
        "password_confirmation": "string (required, same:password)",
        "location_id": "integer (optional, exists:locations,id)"
    }
    ```

    **Validation Rules**:

    -   `first_name`: required|string|max:255
    -   `last_name`: required|string|max:255
    -   `username`: required|string|max:255|unique:users
    -   `email`: required|string|email|max:255|unique:users
    -   `phone`: nullable|string|max:20
    -   `password`: required|string|min:8|confirmed
    -   `location_id`: nullable|exists:locations,id

-   **Response (201 Created)**:

    ```json
    {
        "data": {
            "id": 3,
            "first_name": "New",
            "last_name": "User",
            "username": "newuser",
            "avatar_url": null,
            "avatar_url_full": null,
            "email": "new@example.com",
            "phone": null,
            "email_verified_at": null,
            "created_at": "2025-08-12T15:00:00.000000Z",
            "updated_at": "2025-08-12T15:00:00.000000Z"
        },
        "message": "User created successfully"
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to create users
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Update User (Admin)

-   **URL**: `PUT /api/users/{user}`
-   **Description**: Update a user's details (admin only)
-   **Role**: Admin
-   **Permissions**: `edit users`
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: multipart/form-data (for file uploads)
-   **URL Parameters**:
    -   `user`: integer (required) - The ID of the user to update
-   **Request Body**:
    Same as Update Profile endpoint, but with admin privileges
-   **Response (200 OK)**:
    Same as Update Profile endpoint

    **Notes**:

    -   Admins can update any user's profile
    -   All fields are optional
    -   Password updates require a separate endpoint

### Delete User (Admin)

-   **URL**: `DELETE /api/users/{user}`
-   **Description**: Delete a user (admin only)
-   **Role**: Admin
-   **Permissions**: `delete users`
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **URL Parameters**:
    -   `user`: integer (required) - The ID of the user to delete
-   **Response (204 No Content)**:

    ```json
    {}
    ```

    **Notes**:

    -   User's avatar is automatically deleted
    -   This action is irreversible

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to delete users
    -   `404 Not Found` - User not found
    -   `500 Internal Server Error` - Server error

### Promote to Moderator (Admin)

-   **URL**: `POST /api/users/{user}/promote-to-moderator`
-   **Description**: Promote a user to moderator role
-   **Role**: Admin
-   **Permissions**: `manage users`
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **URL Parameters**:
    -   `user`: integer (required) - The ID of the user to promote
-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Smith",
            "username": "janesmith",
            "email": "jane@example.com",
            "roles": [
                {
                    "id": 2,
                    "name": "moderator",
                    "guard_name": "web",
                    "created_at": "2025-08-10T10:00:00.000000Z",
                    "updated_at": "2025-08-10T10:00:00.000000Z",
                    "pivot": {
                        "model_id": 2,
                        "role_id": 2,
                        "model_type": "App\\Models\\User"
                    }
                }
            ]
        },
        "message": "User promoted to moderator successfully"
    }
    ```

    **Notes**:

    -   This endpoint adds the 'moderator' role to the user
    -   Users can have multiple roles

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to manage users
    -   `404 Not Found` - User not found
    -   `500 Internal Server Error` - Server error

## Verifications

### Submit Verification Request

-   **URL**: `POST /api/verifications`
-   **Description**: Submit a verification request with identity documents
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: multipart/form-data
-   **Request Body**:
    -   `document_type`: string (required) - Type of document (id_card, passport, driver_license)
    -   `documents[]`: file[] (required) - Array of document images (1-7 files)
-   **Validation Rules**:
    -   `document_type`: required|in:id_card,passport,driver_license
    -   `documents[]`: required|array|min:1|max:7
    -   `documents.*`: file|mimes:jpeg,png,jpg,pdf|max:10240 (10MB max per file)
-   **Response (201 Created)**:

    ```json
    {
        "success": true,
        "message": "Verification request submitted successfully.",
        "data": {
            "id": 1,
            "user_id": 123,
            "document_type": "id_card",
            "status": "pending",
            "image_urls": ["path/to/document1.jpg"],
            "created_at": "2025-08-12T12:00:00.000000Z",
            "updated_at": "2025-08-12T12:00:00.000000Z",
            "user": {
                "id": 123,
                "first_name": "John",
                "last_name": "Doe",
                "username": "johndoe",
                "email": "john@example.com"
            }
        }
    }
    ```

    **Notes**:

    -   Only one pending verification request is allowed per user
    -   Documents are stored privately and only accessible to admins
    -   Supported file types: JPEG, PNG, JPG, PDF
    -   Maximum 7 documents per request
    -   Maximum 10MB per file

    **Error Responses**:

    -   `400 Bad Request` - User already has a pending verification request
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Get My Verification Requests

-   **URL**: `GET /api/users/{user}/verifications`
-   **Description**: Get paginated list of verification requests for the authenticated user
-   **Role**: Authenticated User (owner or admin)
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **URL Parameters**:
    -   `user`: integer (required) - ID of the user whose verifications to retrieve
-   **Query Parameters**:
    -   `page`: integer (optional) - Page number for pagination (default: 1)
    -   `per_page`: integer (optional) - Number of items per page (default: 15, max: 100)
-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "User verification requests retrieved successfully.",
        "data": [
            {
                "id": 1,
                "user_id": 123,
                "document_type": "id_card",
                "status": "approved",
                "notes": "Documents verified successfully",
                "verified_at": "2025-08-12T14:30:00.000000Z",
                "created_at": "2025-08-12T12:00:00.000000Z",
                "updated_at": "2025-08-12T14:30:00.000000Z",
                "image_urls": ["path/to/document1.jpg"],
                "verifier": {
                    "id": 1,
                    "first_name": "Admin",
                    "last_name": "User",
                    "username": "admin"
                }
            }
        ],
        "pagination": {
            "total": 1,
            "per_page": 15,
            "current_page": 1,
            "last_page": 1,
            "from": 1,
            "to": 1
        }
    }
    ```

    **Notes**:

    -   Users can only view their own verification requests
    -   Admins can view any user's verification requests
    -   Response includes pagination metadata
    -   `notes` and `verifier` details are only shown for processed requests (approved/rejected)

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to view these verifications
    -   `500 Internal Server Error` - Server error

### Get Verification Request

-   **URL**: `GET /api/verifications/{verification}`
-   **Description**: Get details of a specific verification request
-   **Role**: Admin or request owner
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **URL Parameters**:
    -   `verification`: integer (required) - ID of the verification request
-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Verification request retrieved successfully.",
        "data": {
            "id": 1,
            "user_id": 123,
            "verifier_id": 1,
            "document_type": "id_card",
            "status": "approved",
            "notes": "Documents verified successfully",
            "verified_at": "2025-08-12T14:30:00.000000Z",
            "created_at": "2025-08-12T12:00:00.000000Z",
            "updated_at": "2025-08-12T14:30:00.000000Z",
            "image_urls": ["path/to/document1.jpg"],
            "image_full_urls": ["full/url/to/document1.jpg"],
            "user": {
                "id": 123,
                "first_name": "John",
                "last_name": "Doe",
                "username": "johndoe",
                "email": "john@example.com"
            },
            "verifier": {
                "id": 1,
                "first_name": "Admin",
                "last_name": "User",
                "username": "admin"
            }
        }
    }
    ```

    **Notes**:

    -   Users can only view their own verification requests
    -   Admins can view any verification request
    -   `image_full_urls` are only included for admins
    -   `notes` are only shown for processed requests (approved/rejected) or to admins

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to view this verification
    -   `404 Not Found` - Verification request not found
    -   `500 Internal Server Error` - Server error

### List All Verification Requests (Admin)

-   **URL**: `GET /api/verifications`
-   **Description**: Get paginated list of all verification requests (admin only)
-   **Role**: Admin
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **Query Parameters**:
    -   `page`: integer (optional) - Page number for pagination (default: 1)
    -   `per_page`: integer (optional) - Number of items per page (default: 15, max: 100)
    -   `status`: string (optional) - Filter by status (pending, approved, rejected)
    -   `user_id`: integer (optional) - Filter by user ID
    -   `document_type`: string (optional) - Filter by document type (id_card, passport, driver_license)
    -   `sort_by`: string (optional) - Field to sort by (created_at, updated_at, verified_at)
    -   `sort_order`: string (optional) - Sort order (asc, desc) - default: desc
-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Verification requests retrieved successfully.",
        "data": [
            {
                "id": 1,
                "user_id": 123,
                "verifier_id": 1,
                "document_type": "id_card",
                "status": "approved",
                "verified_at": "2025-08-12T14:30:00.000000Z",
                "created_at": "2025-08-12T12:00:00.000000Z",
                "updated_at": "2025-08-12T14:30:00.000000Z",
                "user": {
                    "id": 123,
                    "first_name": "John",
                    "last_name": "Doe",
                    "username": "johndoe"
                }
            }
        ],
        "pagination": {
            "total": 1,
            "per_page": 15,
            "current_page": 1,
            "last_page": 1,
            "from": 1,
            "to": 1
        }
    }
    ```

    **Notes**:

    -   Only accessible by admins
    -   Response includes pagination metadata
    -   User details are included for each verification
    -   Use query parameters to filter and sort results

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have admin privileges
    -   `500 Internal Server Error` - Server error

### Update Verification Status (Admin)

-   **URL**: `PUT /api/verifications/{verification}/{status}`
-   **Description**: Update the status of a verification request (approve/reject)
-   **Role**: Admin
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json
-   **URL Parameters**:
    -   `verification`: integer (required) - ID of the verification request
    -   `status`: string (required) - New status (approved, rejected)
-   **Request Body**:
    ```json
    {
        "notes": "string (optional) - Reason for approval/rejection"
    }
    ```
-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Verification status updated successfully.",
        "data": {
            "id": 1,
            "user_id": 123,
            "document_type": "id_card",
            "status": "approved",
            "notes": "Documents verified successfully",
            "verified_at": "2025-08-12T14:30:00.000000Z",
            "created_at": "2025-08-12T12:00:00.000000Z",
            "updated_at": "2025-08-12T14:30:00.000000Z",
            "user": {
                "id": 123,
                "first_name": "John",
                "last_name": "Doe",
                "username": "johndoe",
                "is_verified": true
            },
            "verifier": {
                "id": 1,
                "first_name": "Admin",
                "last_name": "User"
            }
        }
    }
    ```

    **Notes**:

    -   Only works for pending verification requests
    -   Approving a verification marks the user as verified
    -   Rejecting a verification deletes the uploaded documents
    -   The verifier is automatically set to the current admin user

    **Error Responses**:

    -   `400 Bad Request` - Invalid status or verification already processed
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have admin privileges
    -   `404 Not Found` - Verification request not found
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Delete Verification Request

-   **URL**: `DELETE /api/verifications/{verification}`
-   **Description**: Delete a verification request and its associated documents
-   **Role**: Admin or request owner
-   **Headers**:
    -   `Authorization`: Bearer {token}
-   **URL Parameters**:
    -   `verification`: integer (required) - ID of the verification request to delete
-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Verification request deleted successfully."
    }
    ```

    **Notes**:

    -   Users can only delete their own pending verification requests
    -   Admins can delete any verification request
    -   Deletes all associated document files from storage
    -   This action cannot be undone

    **Error Responses**:

    -   `400 Bad Request` - Cannot delete a processed verification request (for non-admins)
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to delete this verification
    -   `404 Not Found` - Verification request not found
    -   `500 Internal Server Error` - Server error

## Locations

### List Locations

-   **URL**: `GET /api/locations`
-   **Description**: Retrieve a list of all locations
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 1,
                "governorate": "Beirut",
                "district": "Achrafieh",
                "created_at": "2025-08-01 10:00:00",
                "updated_at": "2025-08-01 10:00:00"
            },
            {
                "id": 2,
                "governorate": "Mount Lebanon",
                "district": "Metn",
                "created_at": "2025-08-01 10:00:00",
                "updated_at": "2025-08-01 10:00:00"
            }
        ],
        "message": "Locations retrieved successfully"
    }
    ```

    **Notes**:

    -   Returns all available locations
    -   Locations are not paginated as the list is typically small
    -   Sorted by creation date (newest first)

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Get Location

-   **URL**: `GET /api/locations/{location}`
-   **Description**: Retrieve details of a specific location
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
-   **URL Parameters**:
    -   `location`: integer (required) - ID of the location to retrieve
-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "governorate": "Beirut",
            "district": "Achrafieh",
            "created_at": "2025-08-01 10:00:00",
            "updated_at": "2025-08-01 10:00:00"
        },
        "message": "Location retrieved successfully"
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `404 Not Found` - Location not found
    -   `500 Internal Server Error` - Server error

### Create Location (Admin)

-   **URL**: `POST /api/locations`
-   **Description**: Create a new location (Admin only)
-   **Role**: Admin
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json
    -   `Accept`: application/json
-   **Request Body**:

    ```json
    {
        "governorate": "string (required, max:255)",
        "district": "string (required, max:255)"
    }
    ```

    **Validation Rules**:

    -   `governorate`: required|string|max:255
    -   `district`: required|string|max:255

-   **Response (201 Created)**:

    ```json
    {
        "data": {
            "id": 3,
            "governorate": "North",
            "district": "Tripoli",
            "created_at": "2025-08-12 15:30:00",
            "updated_at": "2025-08-12 15:30:00"
        },
        "message": "Location created successfully"
    }
    ```

    **Notes**:

    -   Both governorate and district are required
    -   Combination of governorate and district must be unique
    -   Created location is returned in the response

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have admin privileges
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Update Location (Admin)

-   **URL**: `PUT /api/locations/{location}`
-   **Description**: Update an existing location (Admin only)
-   **Role**: Admin
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json
    -   `Accept`: application/json
-   **URL Parameters**:
    -   `location`: integer (required) - ID of the location to update
-   **Request Body**:

    ```json
    {
        "governorate": "string (required, max:255)",
        "district": "string (required, max:255)"
    }
    ```

    **Validation Rules**:

    -   `governorate`: required|string|max:255
    -   `district`: required|string|max:255

-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 3,
            "governorate": "North Governorate",
            "district": "Tripoli District",
            "created_at": "2025-08-12 15:30:00",
            "updated_at": "2025-08-12 16:45:00"
        },
        "message": "Location updated successfully"
    }
    ```

    **Notes**:

    -   Both governorate and district must be provided
    -   Combination of governorate and district must be unique (excluding the current record)
    -   All fields are required and will be updated
    -   Returns the updated location with refreshed timestamps

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have admin privileges
    -   `404 Not Found` - Location not found
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Delete Location (Admin)

-   **URL**: `DELETE /api/locations/{location}`
-   **Description**: Permanently delete a location (Admin only)
-   **Role**: Admin
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
-   **URL Parameters**:

    -   `location`: integer (required) - ID of the location to delete

-   **Response (200 OK)**:

    ```json
    {
        "message": "Location deleted successfully"
    }
    ```

    **Notes**:

    -   This action is irreversible
    -   The location will be permanently removed from the system
    -   Ensure no other records reference this location before deletion

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have admin privileges
    -   `404 Not Found` - Location not found
    -   `409 Conflict` - Cannot delete location as it's being used by other records
    -   `500 Internal Server Error` - Server error

## Announcements

### List Announcements

-   **URL**: `GET /api/announcements`
-   **Description**: Retrieve a paginated list of announcements sorted by creation date (newest first)
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
-   **Query Parameters**:
    -   `page`: integer (optional) - Page number for pagination (default: 1)
    -   `per_page`: integer (optional) - Number of items per page (default: 10, max: 100)
    -   `priority`: string (optional) - Filter by priority (low, medium, high)
-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 1,
                "title": "System Maintenance",
                "content": "Scheduled maintenance this weekend.",
                "priority": "high",
                "image_urls": ["announcements/image1.jpg"],
                "image_full_urls": [
                    "http://example.com/storage/announcements/image1.jpg"
                ],
                "created_at": "2025-08-10 14:30:00",
                "updated_at": "2025-08-10 14:30:00",
                "user": {
                    "id": 1,
                    "username": "admin",
                    "first_name": "Admin",
                    "last_name": "User",
                    "avatar": "http://example.com/storage/avatars/1.jpg"
                }
            }
        ],
        "message": "Announcements retrieved successfully",
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 5,
            "path": "http://example.com/api/announcements",
            "per_page": 10,
            "to": 10,
            "total": 50
        }
    }
    ```

    **Notes**:

    -   Returns 10 announcements per page by default
    -   Includes user information for the announcement creator
    -   Image URLs include both relative and full paths
    -   Sorted by creation date (newest first)

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to view announcements
    -   `500 Internal Server Error` - Server error

### Get Announcement

-   **URL**: `GET /api/announcements/{announcement}`
-   **Description**: Retrieve details of a specific announcement
-   **Role**: Any User
-   **URL Parameters**:
    -   `announcement`: integer (required) - ID of the announcement to retrieve
-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "title": "System Maintenance",
            "content": "Scheduled maintenance this weekend from 10 PM to 2 AM.",
            "priority": "high",
            "image_urls": ["announcements/image1.jpg"],
            "image_full_urls": [
                "http://example.com/storage/announcements/image1.jpg"
            ],
            "created_at": "2025-08-10 14:30:00",
            "updated_at": "2025-08-10 14:30:00",
            "user": {
                "id": 1,
                "username": "admin",
                "first_name": "Admin",
                "last_name": "User",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            }
        },
        "message": "Announcement retrieved successfully"
    }
    ```

    **Notes**:

    -   Includes complete announcement details
    -   Shows the user who created the announcement
    -   Image URLs include both relative and full paths

    **Error Responses**:

    -   `404 Not Found` - Announcement not found
    -   `500 Internal Server Error` - Server error

### Create Announcement (Admin/Moderator)

-   **URL**: `POST /api/announcements`
-   **Description**: Create a new announcement (Admin/Moderator only)
-   **Role**: Admin, Moderator
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: multipart/form-data
    -   `Accept`: application/json
-   **Request Body**:

    ```json
    {
        "title": "string (required, max:255) - Title of the announcement",
        "content": "string (required) - Main content of the announcement",
        "priority": "string (optional) - Priority level (low, medium, high). Default: medium",
        "image_urls[]": "file[] (optional) - Array of images to upload (max 5MB each, jpeg,png,jpg,gif,svg)"
    }
    ```

    **Example using cURL**:

    ```bash
    curl -X POST http://example.com/api/announcements \
      -H "Authorization: Bearer {token}" \
      -F "title=System Maintenance" \
      -F "content=Planned maintenance this weekend" \
      -F "priority=high" \
      -F "image_urls[]=@/path/to/image1.jpg" \
      -F "image_urls[]=@/path/to/image2.jpg"
    ```

-   **Response (201 Created)**:

    ```json
    {
        "data": {
            "id": 1,
            "title": "System Maintenance",
            "content": "Planned maintenance this weekend from 10 PM to 2 AM.",
            "priority": "high",
            "image_urls": [
                "announcements/abc123.jpg",
                "announcements/def456.jpg"
            ],
            "image_full_urls": [
                "http://example.com/storage/announcements/abc123.jpg",
                "http://example.com/storage/announcements/def456.jpg"
            ],
            "created_at": "2025-08-10 14:30:00",
            "updated_at": "2025-08-10 14:30:00",
            "user": {
                "id": 1,
                "username": "admin",
                "first_name": "Admin",
                "last_name": "User",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            }
        },
        "message": "Announcement created successfully"
    }
    ```

    **Notes**:

    -   Maximum file size per image: 5MB
    -   Allowed image types: jpeg, png, jpg, gif, svg
    -   Images are stored in the 'announcements' directory
    -   The authenticated user is automatically set as the announcement creator
    -   Priority defaults to 'medium' if not specified

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to create announcements
    -   `413 Payload Too Large` - One or more files exceed the size limit
    -   `415 Unsupported Media Type` - Invalid file type
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error (any uploaded files are automatically cleaned up)

### Update Announcement (Admin/Moderator)

-   **URL**: `POST /api/announcements/{announcement}`
-   **Description**: Update an existing announcement (Admin/Moderator only)
-   **Role**: Admin, Moderator (must be the creator or have admin rights)
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: multipart/form-data
    -   `Accept`: application/json
    -   `X-HTTP-Method-Override`: PUT (if needed for some clients)
-   **URL Parameters**:
    -   `announcement`: integer (required) - ID of the announcement to update
-   **Request Body**:

    ```json
    {
        "title": "string (optional, max:255) - Updated title of the announcement",
        "content": "string (optional) - Updated content of the announcement",
        "priority": "string (optional) - Updated priority level (low, medium, high)",
        "image_urls[]": "file[] (optional) - New images to add (max 5MB each, jpeg,png,jpg,gif,svg)",
        "remove_image_urls": "string[] (optional) - Array of image URLs to remove"
    }
    ```

    **Example using cURL**:

    ```bash
    curl -X POST http://example.com/api/announcements/1 \
      -H "Authorization: Bearer {token}" \
      -H "X-HTTP-Method-Override: PUT" \
      -F "title=Updated Maintenance Schedule" \
      -F "content=Updated maintenance time to 11 PM to 3 AM" \
      -F "remove_image_urls[]=announcements/old-image.jpg" \
      -F "image_urls[]=@/path/to/new-image.jpg"
    ```

-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "title": "Updated Maintenance Schedule",
            "content": "Updated maintenance time to 11 PM to 3 AM.",
            "priority": "high",
            "image_urls": ["announcements/abc123.jpg"],
            "image_full_urls": [
                "http://example.com/storage/announcements/abc123.jpg"
            ],
            "created_at": "2025-08-10 14:30:00",
            "updated_at": "2025-08-10 15:45:00",
            "user": {
                "id": 1,
                "username": "admin",
                "first_name": "Admin",
                "last_name": "User",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            }
        },
        "message": "Announcement updated successfully"
    }
    ```

    **Notes**:

    -   Only include fields that need to be updated
    -   To update images:
        -   Add new images using `image_urls[]`
        -   Remove existing images by providing their URLs in `remove_image_urls`
    -   The `updated_at` timestamp is automatically updated
    -   Only the announcement creator or admin can update it

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to update this announcement
    -   `404 Not Found` - Announcement not found
    -   `413 Payload Too Large` - One or more files exceed the size limit
    -   `415 Unsupported Media Type` - Invalid file type
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error (any newly uploaded files are automatically cleaned up on error)

### Delete Announcement (Admin/Moderator)

-   **URL**: `DELETE /api/announcements/{announcement}`
-   **Description**: Permanently delete an announcement and its associated images (Admin/Moderator only)
-   **Role**: Admin, Moderator (must be the creator or have admin rights)
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
-   **URL Parameters**:
    -   `announcement`: integer (required) - ID of the announcement to delete
-   **Example using cURL**:

    ```bash
    curl -X DELETE http://example.com/api/announcements/1 \
      -H "Authorization: Bearer {token}" \
      -H "Accept: application/json"
    ```

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Announcement deleted successfully"
    }
    ```

    **Notes**:

    -   This action is irreversible
    -   All associated images are automatically deleted from storage
    -   Only the announcement creator or admin can delete it
    -   The announcement is permanently removed from the database

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to delete this announcement
    -   `404 Not Found` - Announcement not found or already deleted
    -   `500 Internal Server Error` - Server error (partial deletion may have occurred)

## Community Posts

### List Community Posts

-   **URL**: `GET /api/community-posts`
-   **Description**: Retrieve a paginated list of community posts with vote counts and user information
-   **Role**: Any User
-   **Query Parameters**:

    -   `page`: integer (optional) - Page number for pagination (default: 1)
    -   `per_page`: integer (optional) - Number of items per page (default: 10, max: 100)
    -   `event_id`: integer (optional) - Filter posts by event ID
    -   `user_id`: integer (optional) - Filter posts by user ID

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "data": [
            {
                "id": 1,
                "content": "This is a community post about our latest event.",
                "image_urls": ["community/posts/abc123.jpg"],
                "image_full_urls": [
                    "http://example.com/storage/community/posts/abc123.jpg"
                ],
                "tags": ["event", "update"],
                "created_at": "2025-08-10 14:30:00",
                "updated_at": "2025-08-10 14:30:00",
                "votes": {
                    "upvotes": 5,
                    "downvotes": 1,
                    "total": 4,
                    "user_vote": "upvote"
                },
                "user": {
                    "id": 1,
                    "username": "johndoe",
                    "first_name": "John",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/1.jpg"
                },
                "event": {
                    "id": 1,
                    "title": "Summer Donation Drive 2025"
                },
                "comments_count": 3
            }
        ],
        "links": {
            "first": "http://example.com/api/community-posts?page=1",
            "last": "http://example.com/api/community-posts?page=5",
            "prev": null,
            "next": "http://example.com/api/community-posts?page=2"
        },
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 5,
            "path": "http://example.com/api/community-posts",
            "per_page": 10,
            "to": 10,
            "total": 50
        },
        "message": "Community posts retrieved successfully"
    }
    ```

    **Notes**:

    -   Posts are sorted by creation date (newest first)
    -   Includes vote counts and user's current vote status
    -   Supports filtering by event_id and user_id
    -   Returns pagination metadata

    **Error Responses**:

    -   `500 Internal Server Error` - Server error

### Create Post

-   **URL**: `POST /api/community-posts`
-   **Description**: Create a new community post with optional images
-   **Role**: Authenticated User (with `create posts` permission)
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: multipart/form-data
    -   `Accept`: application/json
-   **Request Body**:

    ```json
    {
        "content": "string (required, max:5000) - The post content",
        "event_id": "integer (required) - ID of the associated donation event",
        "image_urls[]": "file[] (optional) - Array of images (max 10, 5MB each, jpeg,png,jpg,gif,webp)",
        "tags": "string[] (optional, max:5) - Array of tags (max 50 chars each)"
    }
    ```

    **Example using cURL**:

    ```bash
    curl -X POST http://example.com/api/community-posts \
      -H "Authorization: Bearer {token}" \
      -F "content=Join us for the event this weekend!" \
      -F "event_id=1" \
      -F "tags[]=event" \
      -F "tags[]=volunteer" \
      -F "image_urls[]=@/path/to/event-photo1.jpg"
    ```

-   **Response (201 Created)**:

    ```json
    {
        "success": true,
        "data": {
            "id": 1,
            "content": "Join us for the event this weekend!",
            "image_urls": ["community/posts/abc123.jpg"],
            "image_full_urls": [
                "http://example.com/storage/community/posts/abc123.jpg"
            ],
            "tags": ["event", "volunteer"],
            "created_at": "2025-08-10 14:30:00",
            "updated_at": "2025-08-10 14:30:00",
            "votes": {
                "upvotes": 0,
                "downvotes": 0,
                "total": 0,
                "user_vote": null
            },
            "user": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            },
            "event": {
                "id": 1,
                "title": "Summer Donation Drive 2025"
            }
        },
        "message": "Community post created successfully"
    }
    ```

    **Notes**:

    -   Images are automatically resized to a maximum width of 1200px
    -   Image quality is set to 85% to optimize file size
    -   The authenticated user is automatically set as the post author
    -   Maximum 10 images per post
    -   Maximum 5 tags per post

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to create posts
    -   `404 Not Found` - Specified event does not exist
    -   `413 Payload Too Large` - One or more images exceed the size limit
    -   `415 Unsupported Media Type` - Invalid file type
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error (any uploaded images are automatically cleaned up)

### Get Post

-   **URL**: `GET /api/community-posts/{post}`
-   **Description**: Retrieve detailed information about a specific community post including comments and votes
-   **Role**: Any User
-   **URL Parameters**:

    -   `post`: integer (required) - ID of the post to retrieve

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "data": {
            "id": 1,
            "content": "This is a detailed community post with comments.",
            "image_urls": ["community/posts/abc123.jpg"],
            "image_full_urls": [
                "http://example.com/storage/community/posts/abc123.jpg"
            ],
            "tags": ["event", "update"],
            "created_at": "2025-08-10 14:30:00",
            "updated_at": "2025-08-10 14:30:00",
            "votes": {
                "upvotes": 5,
                "downvotes": 1,
                "total": 4,
                "user_vote": "upvote"
            },
            "user": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            },
            "event": {
                "id": 1,
                "title": "Summer Donation Drive 2025"
            },
            "comments": [
                {
                    "id": 1,
                    "content": "Great post! Looking forward to the event.",
                    "created_at": "2025-08-10 15:30:00",
                    "user": {
                        "id": 2,
                        "username": "janedoe",
                        "first_name": "Jane",
                        "last_name": "Doe",
                        "avatar": "http://example.com/storage/avatars/2.jpg"
                    }
                }
            ]
        },
        "message": "Community post retrieved successfully"
    }
    ```

    **Notes**:

    -   Includes detailed post information with nested user and event data
    -   Shows the current user's vote status (if any)
    -   Includes all comments with commenter information
    -   Returns both relative and absolute URLs for images

    **Error Responses**:

    -   `404 Not Found` - Post not found or deleted
    -   `500 Internal Server Error` - Server error

### Update Post

-   **URL**: `POST /api/community-posts/{post}`
-   **Description**: Update an existing community post (creator or admin only)
-   **Role**: Post Creator, Admin, or Moderator
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: multipart/form-data
    -   `Accept`: application/json
    -   `X-HTTP-Method-Override`: PUT (if needed for some clients)
-   **URL Parameters**:
    -   `post`: integer (required) - ID of the post to update
-   **Request Body**:

    ```json
    {
        "content": "string (optional, max:5000) - Updated post content",
        "image_urls[]": "file[] (optional) - New images to add (max 10 total, 5MB each, jpeg,png,jpg,gif,webp)",
        "remove_image_urls": "string[] (optional) - Array of image paths to remove",
        "tags": "string[] (optional, max:5) - Updated array of tags (max 50 chars each)"
    }
    ```

    **Example using cURL**:

    ```bash
    curl -X POST http://example.com/api/community-posts/1 \
      -H "Authorization: Bearer {token}" \
      -H "X-HTTP-Method-Override: PUT" \
      -F "content=Updated event details and time" \
      -F "tags[]=update" \
      -F "remove_image_urls[]=community/posts/old-image.jpg" \
      -F "image_urls[]=@/path/to/new-image.jpg"
    ```

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "data": {
            "id": 1,
            "content": "Updated event details and time",
            "image_urls": ["community/posts/def456.jpg"],
            "image_full_urls": [
                "http://example.com/storage/community/posts/def456.jpg"
            ],
            "tags": ["update"],
            "created_at": "2025-08-10 14:30:00",
            "updated_at": "2025-08-10 16:45:00",
            "votes": {
                "upvotes": 5,
                "downvotes": 1,
                "total": 4,
                "user_vote": "upvote"
            },
            "user": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            },
            "event": {
                "id": 1,
                "title": "Summer Donation Drive 2025"
            }
        },
        "message": "Community post updated successfully"
    }
    ```

    **Notes**:

    -   Only the post creator or admin can update the post
    -   Images can be added or removed in the same request
    -   Removed images are permanently deleted from storage
    -   The `updated_at` timestamp is automatically updated
    -   All fields are optional - only included fields will be updated

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to update this post
    -   `404 Not Found` - Post not found
    -   `413 Payload Too Large` - One or more images exceed the size limit
    -   `415 Unsupported Media Type` - Invalid file type
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error (any newly uploaded files are automatically cleaned up on error)

-   **Description**: Update a post
-   **Role**: Post Owner or Admin/Moderator
-   **Permissions**:
    -   `edit posts` or `manage posts` (for any post)
    -   `edit own posts` (only for own posts)
-   **Request Body**: Updated post details
-   **Response**: Updated post resource

### Delete Post

-   **URL**: `DELETE /api/community-posts/{post}`
-   **Description**: Permanently delete a community post and all its associated images (creator or admin only)
-   **Role**: Post Creator, Admin, or Moderator
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
-   **URL Parameters**:

    -   `post`: integer (required) - ID of the post to delete

-   **Example using cURL**:

    ```bash
    curl -X DELETE http://example.com/api/community-posts/1 \
      -H "Authorization: Bearer {token}" \
      -H "Accept: application/json"
    ```

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Community post deleted successfully"
    }
    ```

    **Notes**:

    -   This action is irreversible
    -   All associated images are automatically deleted from storage
    -   Only the post creator or admin can delete the post
    -   The post and all its comments are permanently removed from the database

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to delete this post
    -   `404 Not Found` - Post not found or already deleted
    -   `500 Internal Server Error` - Server error (partial deletion may have occurred)

## Comments

### List Comments

-   **URL**: `GET /api/community-posts/{communityPost}/comments`
-   **Description**: Retrieve all comments for a specific community post
-   **Role**: Any User
-   **URL Parameters**:

    -   `communityPost`: integer (required) - ID of the community post

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "data": [
            {
                "id": 1,
                "content": "This is a great post! Thanks for sharing.",
                "created_at": "2025-08-10 15:30:00",
                "updated_at": "2025-08-10 15:30:00",
                "user": {
                    "id": 1,
                    "username": "johndoe",
                    "first_name": "John",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/1.jpg"
                }
            },
            {
                "id": 2,
                "content": "Looking forward to the event!",
                "created_at": "2025-08-10 16:45:00",
                "updated_at": "2025-08-10 16:45:00",
                "user": {
                    "id": 2,
                    "username": "janedoe",
                    "first_name": "Jane",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/2.jpg"
                }
            }
        ],
        "message": "Comments retrieved successfully"
    }
    ```

    **Notes**:

    -   Comments are sorted by creation date (newest first)
    -   Includes user information for each comment
    -   Only shows comments for the specified community post

    **Error Responses**:

    -   `404 Not Found` - Community post not found
    -   `500 Internal Server Error` - Server error

### Create Comment

-   **URL**: `POST /api/community-posts/{communityPost}/comments`
-   **Description**: Add a new comment to a community post
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json
    -   `Accept`: application/json
-   **URL Parameters**:

    -   `communityPost`: integer (required) - ID of the community post to comment on

-   **Request Body**:

    ```json
    {
        "content": "string (required, max:2000) - The comment content"
    }
    ```

    **Example using cURL**:

    ```bash
    curl -X POST http://example.com/api/community-posts/1/comments \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '{"content": "This is my comment on the post!"}'
    ```

-   **Response (201 Created)**:

    ```json
    {
        "success": true,
        "data": {
            "id": 1,
            "content": "This is my comment on the post!",
            "created_at": "2025-08-10 15:30:00",
            "updated_at": "2025-08-10 15:30:00",
            "user": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            }
        },
        "message": "Comment created successfully"
    }
    ```

    **Notes**:

    -   The authenticated user is automatically set as the comment author
    -   Comments cannot be empty or exceed 2000 characters
    -   The `created_at` and `updated_at` timestamps are automatically set

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to comment on this post
    -   `404 Not Found` - Community post not found
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Update Comment

-   **URL**: `PUT /api/community-posts/{communityPost}/comments/{comment}`
-   **Description**: Update an existing comment (owner or admin only)
-   **Role**: Comment Owner, Admin, or Moderator
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json
    -   `Accept`: application/json
-   **URL Parameters**:

    -   `communityPost`: integer (required) - ID of the community post
    -   `comment`: integer (required) - ID of the comment to update

-   **Request Body**:

    ```json
    {
        "content": "string (required, max:2000) - Updated comment content"
    }
    ```

    **Example using cURL**:

    ```bash
    curl -X PUT http://example.com/api/community-posts/1/comments/1 \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '{"content": "Updated comment with more details!"}'
    ```

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "data": {
            "id": 1,
            "content": "Updated comment with more details!",
            "created_at": "2025-08-10 15:30:00",
            "updated_at": "2025-08-10 17:15:00",
            "user": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            }
        },
        "message": "Comment updated successfully"
    }
    ```

    **Notes**:

    -   Only the comment owner or admin can update the comment
    -   The `updated_at` timestamp is automatically updated
    -   The `created_at` timestamp remains unchanged
    -   Comment must belong to the specified community post

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to update this comment
    -   `404 Not Found` - Comment or post not found
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Delete Comment

-   **URL**: `DELETE /api/community-posts/{communityPost}/comments/{comment}`
-   **Description**: Permanently delete a comment (owner or admin only)
-   **Role**: Comment Owner, Admin, or Moderator
-   **Permissions**:
    -   `delete comments` or `moderate content` (for any comment)
    -   `delete own comments` (only for own comments)
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
-   **URL Parameters**:

    -   `communityPost`: integer (required) - ID of the community post
    -   `comment`: integer (required) - ID of the comment to delete

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Comment deleted successfully"
    }
    ```

    **Notes**:

    -   This action is irreversible
    -   Only the comment owner or admin can delete the comment
    -   Comment must belong to the specified community post

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to delete this comment
    -   `404 Not Found` - Comment or post not found
    -   `500 Internal Server Error` - Server error (partial deletion may have occurred)

## Votes

### Vote on Post

-   **URL**: `POST /api/community-posts/{postId}/vote`
-   **Description**: Vote on a community post or update existing vote
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json
    -   `Accept`: application/json
-   **URL Parameters**:

    -   `postId`: integer (required) - ID of the post to vote on

-   **Request Body**:

    ```json
    {
        "type": "string (required) - Type of vote: 'upvote' or 'downvote'"
    }
    ```

    **Example using cURL**:

    ```bash
    curl -X POST http://example.com/api/community-posts/1/vote \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d '{"type": "upvote"}'
    ```

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Vote submitted successfully",
        "data": {
            "upvotes": 5,
            "downvotes": 2,
            "total_votes": 3
        }
    }
    ```

    **Notes**:

    -   If the user has already voted the same way, the vote is removed (toggled off)
    -   If the user has voted the opposite way, the vote is updated
    -   If the user hasn't voted, a new vote is created
    -   `total_votes` is calculated as `upvotes - downvotes`
    -   Each user can only have one active vote per post

    **Error Responses**:

    -   `400 Bad Request` - Invalid vote type
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `404 Not Found` - Post not found
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Get My Vote

-   **URL**: `GET /api/community-posts/{postId}/my-vote`
-   **Description**: Get the authenticated user's current vote on a specific post
-   **Role**: Authenticated User
-   **Headers**:
    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
-   **URL Parameters**:

    -   `postId`: integer (required) - ID of the post to check vote for

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "data": {
            "type": "upvote",
            "created_at": "2025-08-10 15:30:00"
        }
    }
    ```

    **Example Response (No Vote)**:

    ```json
    {
        "success": true,
        "data": null
    }
    ```

    **Notes**:

    -   Returns `null` if the user hasn't voted on the post
    -   The `type` can be either 'upvote' or 'downvote'
    -   `created_at` shows when the vote was cast

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `404 Not Found` - Post not found
    -   `500 Internal Server Error` - Server error

## Donation Events

### List Donation Events

-   **URL**: `GET /api/donation-events`
-   **Description**: List all donation events (both requests and offers)
-   **Role**: Any User
-   **Query Parameters**:
    -   `q`: Search term for title, username, first name, or last name
    -   `type`: Filter by type - 'request' or 'offer'
    -   `status`: Filter by status - 'active', 'completed', 'cancelled', or 'suspended'
    -   `location_id`: Filter by location ID
    -   `per_page`: Number of results per page (default: 15)
-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 1,
                "title": "Food Donation Needed",
                "description": "We need food supplies for local families",
                "goal_amount": 1000,
                "current_amount": 350,
                "possible_amount": 500,
                "type": "request",
                "status": "active",
                "image_urls": ["path/to/image1.jpg", "path/to/image2.jpg"],
                "image_full_urls": [
                    "http://example.com/storage/path/to/image1.jpg",
                    "http://example.com/storage/path/to/image2.jpg"
                ],
                "created_at": "2025-08-10T10:00:00.000000Z",
                "updated_at": "2025-08-10T10:00:00.000000Z",
                "user": {
                    "id": 1,
                    "username": "johndoe",
                    "first_name": "John",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/1.jpg"
                },
                "location": {
                    "id": 1,
                    "governorate": "Beirut",
                    "district": "Achrafieh"
                }
            }
        ],
        "message": "Donation events retrieved successfully."
    }
    ```

    **Notes**:

    -   Results are ordered by creation date (newest first)
    -   Includes user and location details for each event
    -   Image URLs include both storage paths and full URLs
    -   `current_amount` shows confirmed donations
    -   `possible_amount` shows pledged but not yet confirmed donations
    -   `per_page` shows number of results per page

    **Error Responses**:

    -   `500 Internal Server Error` - Server error

### List Donation Requests

-   **URL**: `GET /api/donation-events/requests`
-   **Description**: List all active donation requests
-   **Role**: Any User
-   **Query Parameters**:
    -   `per_page`: Number of results per page (default: 15)
-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 1,
                "title": "Food Donation Needed",
                "description": "We need food supplies for local families",
                "goal_amount": 1000,
                "current_amount": 350,
                "possible_amount": 500,
                "type": "request",
                "status": "active",
                "image_urls": ["path/to/image1.jpg"],
                "image_full_urls": [
                    "http://example.com/storage/path/to/image1.jpg"
                ],
                "created_at": "2025-08-10T10:00:00.000000Z",
                "updated_at": "2025-08-10T10:00:00.000000Z",
                "user": {
                    "id": 1,
                    "username": "johndoe",
                    "first_name": "John",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/1.jpg"
                },
                "location": {
                    "id": 1,
                    "governorate": "Beirut",
                    "district": "Achrafieh"
                }
            }
        ],
        "message": "Donation events retrieved successfully."
    }
    ```

    **Notes**:

    -   Only returns active requests (status = 'active')
    -   Results are ordered by creation date (newest first)
    -   Includes user and location details for each request

    **Error Responses**:

    -   `500 Internal Server Error` - Server error

### List Donation Offers

-   **URL**: `GET /api/donation-events/offers`
-   **Description**: List all active donation offers
-   **Role**: Any User
-   **Query Parameters**:
    -   `per_page`: Number of results per page (default: 15)
-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 2,
                "title": "Clothes Donation Available",
                "description": "Gently used clothes available for those in need",
                "goal_amount": 200,
                "current_amount": 50,
                "possible_amount": 75,
                "type": "offer",
                "status": "active",
                "image_urls": ["path/to/offer-image.jpg"],
                "image_full_urls": [
                    "http://example.com/storage/path/to/offer-image.jpg"
                ],
                "created_at": "2025-08-10T11:30:00.000000Z",
                "updated_at": "2025-08-10T11:30:00.000000Z",
                "user": {
                    "id": 2,
                    "username": "janedoe",
                    "first_name": "Jane",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/2.jpg"
                },
                "location": {
                    "id": 2,
                    "governorate": "Mount Lebanon",
                    "district": "Metn"
                }
            }
        ],
        "message": "Donation events retrieved successfully."
    }
    ```

    **Notes**:

    -   Only returns active offers (status = 'active')
    -   Results are ordered by creation date (newest first)
    -   Includes user and location details for each offer
    -   `current_amount` shows claimed items
    -   `possible_amount` shows items that are available but not yet claimed

    **Error Responses**:

    -   `500 Internal Server Error` - Server error

### List User's Donation Events

-   **URL**: `GET /api/donation-events/user/{user}`
-   **Description**: List all donation events for a specific user
-   **Role**: Any User
-   **URL Parameters**:
    -   `user`: integer (required) - ID of the user whose events to retrieve
-   **Query Parameters**:
    -   `per_page`: Number of results per page (default: 15)
-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 1,
                "title": "Food Donation Needed",
                "description": "We need food supplies for local families",
                "goal_amount": 1000,
                "current_amount": 350,
                "possible_amount": 500,
                "type": "request",
                "status": "active",
                "image_urls": ["path/to/image1.jpg"],
                "image_full_urls": [
                    "http://example.com/storage/path/to/image1.jpg"
                ],
                "created_at": "2025-08-10T10:00:00.000000Z",
                "updated_at": "2025-08-10T10:00:00.000000Z",
                "user": {
                    "id": 1,
                    "username": "johndoe",
                    "first_name": "John",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/1.jpg"
                },
                "location": {
                    "id": 1,
                    "governorate": "Beirut",
                    "district": "Achrafieh"
                }
            }
        ],
        "message": "Donation events retrieved successfully."
    }
    ```

    **Notes**:

    -   Returns all events for the specified user, regardless of status
    -   Results are ordered by creation date (newest first)
    -   Includes user and location details for each event
    -   `per_page` shows number of results per page

    **Error Responses**:

    -   `404 Not Found` - User not found
    -   `500 Internal Server Error` - Server error

### Create Donation Event

-   **URL**: `POST /api/donation-events`
-   **Description**: Create a new donation event (request or offer)
-   **Role**: Authenticated User with verified status
-   **Permissions**: User must have at least one approved verification request
-   **Headers**:

    -   `Accept`: application/json
    -   `Content-Type`: multipart/form-data
    -   `Authorization`: Bearer {token}

-   **Request Body (multipart/form-data)**:

    -   `title`: string (required, max:255) - Title of the donation event
    -   `description`: string (required) - Detailed description
    -   `type`: string (required) - 'request' or 'offer'
    -   `goal_amount`: numeric (required, min:0) - Target amount/quantity
    -   `unit`: string (required, max:50) - Unit of measurement (e.g., 'kg', 'items')
    -   `end_date`: date (required, future date) - When the donation event ends
    -   `location_id`: integer (required) - ID of the location
    -   `image_urls[]`: file[] (optional, max:5) - Images related to the donation event

-   **Example using cURL**:

    ```bash
    curl -X POST http://example.com/api/donation-events \
      -H "Authorization: Bearer {token}" \
      -H "Accept: application/json" \
      -F "title=Food Donation" \
      -F "description=We need food supplies" \
      -F "type=request" \
      -F "goal_amount=1000" \
      -F "unit=kg" \
      -F "end_date=2025-12-31" \
      -F "location_id=1" \
      -F "image_urls[]=@/path/to/image1.jpg"
    ```

-   **Response (201 Created)**:

    ```json
    {
        "data": {
            "id": 1,
            "title": "Food Donation",
            "description": "We need food supplies",
            "goal_amount": 1000,
            "current_amount": 0,
            "possible_amount": 0,
            "type": "request",
            "status": "active",
            "image_urls": ["path/to/image1.jpg"],
            "image_full_urls": [
                "http://example.com/storage/path/to/image1.jpg"
            ],
            "created_at": "2025-08-10T12:00:00.000000Z",
            "updated_at": "2025-08-10T12:00:00.000000Z",
            "user": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            },
            "location": {
                "id": 1,
                "governorate": "Beirut",
                "district": "Achrafieh"
            }
        },
        "message": "Donation event created successfully."
    }
    ```

    **Notes**:

    -   The creating user is automatically set as the event owner
    -   Status is automatically set to 'active'
    -   `current_amount` and `possible_amount` are initialized to 0
    -   Images are optional but limited to 5 per event
    -   Each image is limited to 5MB and must be in jpeg, png, jpg, or gif format
    -   User must have an approved verification request to create events

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User not authorized to create events (no approved verification)
    -   `404 Not Found` - Location not found
    -   `413 Payload Too Large` - Image(s) too large
    -   `415 Unsupported Media Type` - Invalid file type
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error (partial uploads will be cleaned up)

### Get Donation Event

-   **URL**: `GET /api/donation-events/{donationEvent}`
-   **Description**: Get details of a specific donation event
-   **Role**: Any User
-   **URL Parameters**:

    -   `donationEvent`: integer (required) - ID of the donation event to retrieve

-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "title": "Food Donation Needed",
            "description": "We need food supplies for local families",
            "goal_amount": 1000,
            "current_amount": 350,
            "possible_amount": 500,
            "type": "request",
            "status": "active",
            "image_urls": ["path/to/image1.jpg"],
            "image_full_urls": [
                "http://example.com/storage/path/to/image1.jpg"
            ],
            "created_at": "2025-08-10T10:00:00.000000Z",
            "updated_at": "2025-08-10T10:00:00.000000Z",
            "user": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            },
            "location": {
                "id": 1,
                "governorate": "Beirut",
                "district": "Achrafieh"
            }
        },
        "message": "Donation event retrieved successfully."
    }
    ```

    **Notes**:

    -   Includes detailed user and location information
    -   Shows both relative and full image URLs
    -   `current_amount` shows confirmed donations/claims
    -   `possible_amount` shows pending donations/claims
    -   All authenticated users can view any active event
    -   For private events, additional authorization may be required

    **Error Responses**:

    -   `404 Not Found` - Event not found or not accessible
    -   `500 Internal Server Error` - Server error

### Update Donation Event

-   **URL**: `PUT /api/donation-events/{donationEvent}`
-   **Description**: Update an existing donation event
-   **Role**: Event Owner or Admin
-   **Permissions**:
    -   Event owner must have an approved verification request
    -   Admin can update any event
-   **Headers**:

    -   `Accept`: application/json
    -   `Content-Type`: multipart/form-data
    -   `Authorization`: Bearer {token}

-   **URL Parameters**:

    -   `donationEvent`: integer (required) - ID of the donation event to update

-   **Request Body (multipart/form-data)**:

    -   `title`: string (optional, max:255) - Updated title
    -   `description`: string (optional) - Updated description
    -   `goal_amount`: numeric (optional, min:0) - Updated target amount/quantity
    -   `unit`: string (optional, max:50) - Updated unit of measurement
    -   `end_date`: date (optional, future date) - Updated end date
    -   `location_id`: integer (optional) - Updated location ID
    -   `status`: string (optional) - New status ('active', 'completed', 'cancelled', 'suspended')
    -   `image_urls[]`: file[] (optional, max:5) - New images to add
    -   `remove_image_urls[]`: string[] (optional) - Array of image URLs to remove

-   **Example using cURL**:

    ```bash
    curl -X PUT http://example.com/api/donation-events/1 \
      -H "Authorization: Bearer {token}" \
      -H "Accept: application/json" \
      -F "title=Updated Food Donation" \
      -F "description=Updated description" \
      -F "goal_amount=1200" \
      -F "remove_image_urls[]=path/to/old-image.jpg" \
      -F "image_urls[]=@/path/to/new-image.jpg"
    ```

-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "title": "Updated Food Donation",
            "description": "Updated description",
            "goal_amount": 1200,
            "current_amount": 350,
            "possible_amount": 500,
            "type": "request",
            "status": "active",
            "image_urls": ["path/to/kept-image.jpg", "path/to/new-image.jpg"],
            "image_full_urls": [
                "http://example.com/storage/path/to/kept-image.jpg",
                "http://example.com/storage/path/to/new-image.jpg"
            ],
            "created_at": "2025-08-10T10:00:00.000000Z",
            "updated_at": "2025-08-10T15:00:00.000000Z",
            "user": {
                "id": 1,
                "username": "johndoe",
                "first_name": "John",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/1.jpg"
            },
            "location": {
                "id": 1,
                "governorate": "Beirut",
                "district": "Achrafieh"
            }
        },
        "message": "Donation event updated successfully."
    }
    ```

    **Notes**:

    -   Only the event owner or admin can update the event
    -   All fields are optional - only included fields will be updated
    -   Images can be added or removed in the same request
    -   When removing images, specify the full image URL or path in `remove_image_urls`
    -   `current_amount` and `possible_amount` can only be updated through transaction operations
    -   The `type` field cannot be changed after creation

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - Not authorized to update this event
    -   `404 Not Found` - Event or location not found
    -   `413 Payload Too Large` - Image(s) too large
    -   `415 Unsupported Media Type` - Invalid file type
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Delete Donation Event

-   **URL**: `DELETE /api/donation-events/{donationEvent}`
-   **Description**: Permanently delete a donation event and its associated data
-   **Role**: Event Owner or Admin
-   **Permissions**:
    -   Event owner must have an approved verification request
    -   Admin can delete any event
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **URL Parameters**:

    -   `donationEvent`: integer (required) - ID of the donation event to delete

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Donation event deleted successfully."
    }
    ```

    **Notes**:

    -   This action is irreversible
    -   All associated images will be permanently deleted from storage
    -   Any pending transactions will be cancelled
    -   The event is soft-deleted from the database (can be restored by admin if needed)
    -   Users will see a 404 when trying to access the deleted event

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - Not authorized to delete this event
    -   `404 Not Found` - Event not found or already deleted
    -   `409 Conflict` - Cannot delete event with active transactions
    -   `500 Internal Server Error` - Server error (partial deletion may have occurred)

### Activate Donation Event

-   **URL**: `POST /api/donation-events/{donationEvent}/activate`
-   **Description**: Activate a suspended donation event (owner or admin only)
-   **Role**: Event Owner or Admin
-   **Headers**:

    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
    -   `Content-Type`: application/json

-   **URL Parameters**:

    -   `donationEvent`: ID of the donation event

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Donation event activated successfully.",
        "data": {
            "id": 1,
            "status": "active"
        }
    }
    ```

    **Error Responses**:

    -   `400 Bad Request`: If event is not in 'suspended' status
    -   `403 Forbidden`: If user is not authorized
    -   `404 Not Found`: If event doesn't exist

### Suspend Donation Event

-   **URL**: `POST /api/donation-events/{donationEvent}/suspend`
-   **Description**: Suspend an active donation event (owner or admin only)
-   **Role**: Event Owner or Admin
-   **Headers**:

    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
    -   `Content-Type`: application/json

-   **URL Parameters**:

    -   `donationEvent`: ID of the donation event

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Donation event suspended successfully.",
        "data": {
            "id": 1,
            "status": "suspended"
        }
    }
    ```

    **Error Responses**:

    -   `400 Bad Request`: If event is not in 'active' status
    -   `403 Forbidden`: If user is not authorized
    -   `404 Not Found`: If event doesn't exist

### Cancel Donation Event

-   **URL**: `POST /api/donation-events/{donationEvent}/cancel`
-   **Description**: Cancel an active donation event (owner or admin only)
-   **Role**: Event Owner or Admin
-   **Headers**:

    -   `Authorization`: Bearer {token}
    -   `Accept`: application/json
    -   `Content-Type`: application/json

-   **URL Parameters**:

    -   `donationEvent`: ID of the donation event

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "message": "Donation event cancelled successfully.",
        "data": {
            "id": 1,
            "status": "cancelled"
        }
    }
    ```

    **Error Responses**:

    -   `400 Bad Request`: If event is not in 'active' status
    -   `403 Forbidden`: If user is not authorized
    -   `404 Not Found`: If event doesn't exist

## Donation Transactions

### List Transactions

-   **URL**: `GET /api/donation-events/{donationEvent}/transactions`
-   **Description**: List transactions for a specific donation event or all transactions for the authenticated user
-   **Role**: Authenticated User with verified status
-   **Headers**:
    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}
-   **URL Parameters**:
    -   `donationEvent`: integer (optional) - ID of the donation event to filter transactions
-   **Query Parameters**:

    -   `page`: integer (optional) - Page number for pagination
    -   `per_page`: integer (optional, max: 100) - Number of items per page
    -   `status`: string (optional) - Filter by status: 'pending', 'approved', or 'declined'
    -   `type`: string (optional) - Filter by transaction type: 'contribution' or 'claim'

-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 1,
                "transaction_type": "contribution",
                "amount": 100.5,
                "status": "approved",
                "transaction_at": "2025-08-10T12:00:00.000000Z",
                "created_at": "2025-08-10T12:00:00.000000Z",
                "updated_at": "2025-08-10T12:00:00.000000Z",
                "user": {
                    "id": 1,
                    "username": "johndoe",
                    "first_name": "John",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/1.jpg"
                },
                "event": {
                    "id": 1,
                    "title": "Food Donation Needed",
                    "type": "request"
                }
            }
        ],
        "links": {
            "first": "http://example.com/api/donation-events/1/transactions?page=1",
            "last": "http://example.com/api/donation-events/1/transactions?page=1",
            "prev": null,
            "next": null
        },
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 1,
            "path": "http://example.com/api/donation-events/1/transactions",
            "per_page": 10,
            "to": 1,
            "total": 1
        },
        "message": "Donation transactions retrieved successfully."
    }
    ```

    **Notes**:

    -   If no event ID is provided, returns all transactions where the user is either the transaction creator or the event owner
    -   Results are paginated with 10 items per page by default
    -   Transactions are ordered by creation date (newest first)
    -   Includes user and event relationships when available

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User doesn't have permission to view these transactions
    -   `404 Not Found` - Event not found (when filtering by event)
    -   `422 Unprocessable Entity` - Invalid query parameters
    -   `500 Internal Server Error` - Server error

### Create Transaction

-   **URL**: `POST /api/donation-events/{donationEvent}/transactions`
-   **Description**: Create a new donation transaction (contribution or claim)
-   **Role**: Authenticated User with verified status
-   **Permissions**:
    -   User must have an approved verification request
    -   User cannot create transactions for their own events
    -   Event must be active
-   **Headers**:

    -   `Accept`: application/json
    -   `Content-Type`: application/json
    -   `Authorization`: Bearer {token}

-   **URL Parameters**:
    -   `donationEvent`: integer (required) - ID of the donation event
-   **Request Body**:

    ```json
    {
        "amount": 100.5
    }
    ```

    **Fields**:

    -   `amount`: numeric (required, min: 0.01) - The amount being contributed or claimed

    **Notes**:

    -   The transaction type is automatically determined by the event type:
        -   For 'request' events: transaction type is 'contribution'
        -   For 'offer' events: transaction type is 'claim'
    -   The initial status is set to 'pending'
    -   For 'claim' transactions, the amount cannot exceed the available amount

-   **Response (201 Created)**:

    ```json
    {
        "data": {
            "id": 1,
            "transaction_type": "contribution",
            "amount": 100.5,
            "status": "pending",
            "transaction_at": "2025-08-10T12:00:00.000000Z",
            "created_at": "2025-08-10T12:00:00.000000Z",
            "updated_at": "2025-08-10T12:00:00.000000Z",
            "user": {
                "id": 2,
                "username": "janedoe",
                "first_name": "Jane",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/2.jpg"
            },
            "event": {
                "id": 1,
                "title": "Food Donation Needed",
                "type": "request"
            }
        },
        "message": "Donation transaction created successfully."
    }
    ```

    **Error Responses**:

    -   `400 Bad Request` - Invalid input data
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User not authorized to create this transaction
    -   `404 Not Found` - Event not found or not active
    -   `409 Conflict` - Claim amount exceeds available amount
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

### Get Transaction

-   **URL**: `GET /api/donation-transactions/{transaction}`
-   **Description**: Get details of a specific transaction
-   **Role**: Authenticated User
-   **Permissions**:
    -   User must be the transaction creator, event owner, or admin
    -   User must have an approved verification request
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **URL Parameters**:

    -   `transaction`: integer (required) - ID of the transaction to retrieve

-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "transaction_type": "contribution",
            "amount": 100.5,
            "status": "approved",
            "transaction_at": "2025-08-10T12:00:00.000000Z",
            "created_at": "2025-08-10T12:00:00.000000Z",
            "updated_at": "2025-08-10T12:00:00.000000Z",
            "user": {
                "id": 2,
                "username": "janedoe",
                "first_name": "Jane",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/2.jpg"
            },
            "event": {
                "id": 1,
                "title": "Food Donation Needed",
                "type": "request"
            }
        },
        "message": "Donation transaction retrieved successfully."
    }
    ```

    **Notes**:

    -   Transaction details include user and event information
    -   Only the transaction creator, event owner, or admin can view the transaction
    -   The `transaction_type` can be 'contribution' or 'claim'
    -   The `status` can be 'pending', 'approved', or 'declined'

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - Not authorized to view this transaction
    -   `404 Not Found` - Transaction not found or not accessible
    -   `500 Internal Server Error` - Server error

### Update Transaction Status

-   **URL**: `PUT /api/donation-transactions/{transaction}/status`
-   **Description**: Update the status of a transaction (approve or decline)
-   **Role**: Event Owner or Admin
-   **Permissions**:
    -   Only the event owner can update the status of a transaction
    -   User must have an approved verification request
-   **Headers**:

    -   `Accept`: application/json
    -   `Content-Type`: application/json
    -   `Authorization`: Bearer {token}

-   **URL Parameters**:

    -   `transaction`: integer (required) - ID of the transaction to update

-   **Request Body**:

    ```json
    {
        "status": "approved|rejeceted|pending",
        "reason": "string|nullable"
    }
    ```

    **Fields**:

    -   `status`: string (required) - New status: 'approved', 'declined', or 'pending'
    -   `reason`: string (optional) - Reason for the status change

    **Notes**:

    -   Only the event owner can update the status
    -   Status can be toggled between 'approved', 'declined', and 'pending'
    -   Updating status may affect the event's current_amount and possible_amount
    -   For 'claim' transactions, the amount is deducted from the event's current_amount when approved

-   **Response (200 OK)**:

    ```json
    {
        "data": {
            "id": 1,
            "transaction_type": "contribution",
            "amount": 100.5,
            "status": "approved",
            "transaction_at": "2025-08-10T12:00:00.000000Z",
            "created_at": "2025-08-10T12:00:00.000000Z",
            "updated_at": "2025-08-10T15:30:00.000000Z",
            "user": {
                "id": 2,
                "username": "janedoe",
                "first_name": "Jane",
                "last_name": "Doe",
                "avatar": "http://example.com/storage/avatars/2.jpg"
            },
            "event": {
                "id": 1,
                "title": "Food Donation Needed",
                "type": "request"
            }
        },
        "message": "Transaction status updated successfully."
    }
    ```

    **Notes**:

    -   The response includes the updated transaction with the new status
    -   The `updated_at` field reflects when the status was changed
    -   The event's current_amount and possible_amount are automatically updated based on the new status
    -   The notification service is triggered based on the new status

    **Error Responses**:

    -   `400 Bad Request` - Invalid status value
    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - Not authorized to update this transaction
    -   `404 Not Found` - Transaction not found or not accessible
    -   `409 Conflict` - Cannot approve claim that exceeds available amount
    -   `422 Unprocessable Entity` - Validation errors
    -   `500 Internal Server Error` - Server error

## Notifications

### List Notifications

-   **URL**: `GET /api/notifications`
-   **Description**: Get a paginated list of notifications for the authenticated user
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **Query Parameters**:

    -   `type`: string (optional) - Filter by notification type. Possible values:
        -   Donation related: `donation_goal_reached`, `transaction_contribution`, `transaction_claim`, `transaction_approved`, `transaction_rejected`
        -   Post related: `new_post`, `post_deleted`
        -   Comment related: `new_comment`
        -   Vote/Reaction: `post_upvoted`, `post_downvoted`
        -   Verification: `verification_request_sent`, `verification_approved`, `verification_rejected`
        -   Event: `event_created_success`, `event_created_failed`
        -   Announcement: `new_announcement`, `announcement_updated`
    -   `unread_only`: boolean (optional) - If true, returns only unread notifications
    -   `per_page`: integer (optional, default: 15, max: 100) - Number of items per page

-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 1,
                "title": "New Donation Received",
                "message": "John Doe contributed $50 to your request",
                "data": {
                    "amount": 50,
                    "currency": "USD",
                    "user_id": 2
                },
                "is_read": false,
                "read_at": null,
                "created_at": "2025-08-10T10:00:00Z",
                "updated_at": "2025-08-10T10:00:00Z",
                "type": {
                    "id": 1,
                    "name": "transaction_contribution",
                    "description": "Notification for new donation contributions"
                },
                "user": {
                    "id": 1,
                    "username": "recipient",
                    "first_name": "Recipient",
                    "last_name": "User",
                    "avatar": "http://example.com/storage/avatars/1.jpg"
                },
                "related_user": {
                    "id": 2,
                    "username": "donor",
                    "first_name": "John",
                    "last_name": "Doe",
                    "avatar": "http://example.com/storage/avatars/2.jpg"
                }
            }
        ],
        "links": {
            "first": "http://example.com/api/notifications?page=1",
            "last": "http://example.com/api/notifications?page=5",
            "prev": null,
            "next": "http://example.com/api/notifications?page=2"
        },
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 5,
            "path": "http://example.com/api/notifications",
            "per_page": 15,
            "to": 15,
            "total": 73
        }
    }
    ```

    **Notes**:

    -   Notifications are ordered by creation date (newest first)
    -   The `data` field contains additional context specific to the notification type
    -   `related_user` is included when the notification involves another user's action
    -   Pagination is enabled by default with 15 items per page

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `422 Unprocessable Entity` - Invalid query parameters
    -   `500 Internal Server Error` - Server error

### Get Unread Notifications Count

-   **URL**: `GET /api/notifications/unread-count`
-   **Description**: Get the count of unread notifications for the authenticated user
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **Response (200 OK)**:

    ```json
    {
        "unread_count": 5
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Get Notification Types

-   **URL**: `GET /api/notifications/types`
-   **Description**: Get available notification types
-   **Role**: Authenticated User
-   **Response (200 OK)**:

    ```json
    {
        "data": [
            {
                "id": 1,
                "name": "transaction_contribution",
                "description": "Notification for new donation contributions"
            },
            {
                "id": 2,
                "name": "transaction_claim",
                "description": "Notification for new donation claims"
            },
            {
                "id": 3,
                "name": "new_post",
                "description": "Notification for new posts"
            },
            {
                "id": 4,
                "name": "post_deleted",
                "description": "Notification for deleted posts"
            },
            {
                "id": 5,
                "name": "new_comment",
                "description": "Notification for new comments"
            },
            {
                "id": 6,
                "name": "post_upvoted",
                "description": "Notification for upvoted posts"
            },
            {
                "id": 7,
                "name": "post_downvoted",
                "description": "Notification for downvoted posts"
            },
            {
                "id": 8,
                "name": "verification_request_sent",
                "description": "Notification for sent verification requests"
            },
            {
                "id": 9,
                "name": "verification_approved",
                "description": "Notification for approved verification requests"
            },
            {
                "id": 10,
                "name": "verification_rejected",
                "description": "Notification for rejected verification requests"
            },
            {
                "id": 11,
                "name": "event_created_success",
                "description": "Notification for successful event creation"
            },
            {
                "id": 12,
                "name": "event_created_failed",
                "description": "Notification for failed event creation"
            },
            {
                "id": 13,
                "name": "new_announcement",
                "description": "Notification for new announcements"
            },
            {
                "id": 14,
                "name": "announcement_updated",
                "description": "Notification for updated announcements"
            }
        ]
    }
    ```

    **Notes**:

    -   The list of notification types is exhaustive and includes all possible types

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Get Unread Count

-   **URL**: `GET /api/notifications/unread-count`
-   **Description**: Get count of unread notifications for the authenticated user
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **Response (200 OK)**:

    ```json
    {
        "unread_count": 5
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Mark Notification as Read

-   **URL**: `PUT /api/notifications/{notification}/read`
-   **Description**: Mark a specific notification as read
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json

-   **URL Parameters**:

    -   `notification`: integer (required) - ID of the notification to mark as read

-   **Response (200 OK)**:

    ```json
    {
        "message": "Notification marked as read",
        "data": {
            "id": 1,
            "title": "New Donation Received",
            "message": "John Doe contributed $50 to your request",
            "is_read": true,
            "read_at": "2025-08-10T11:30:00Z",
            "created_at": "2025-08-10T10:00:00Z",
            "type": {
                "id": 1,
                "name": "transaction_contribution",
                "description": "Notification for new donation contributions"
            }
        }
    }
    ```

    **Notes**:

    -   If the notification is already marked as read, the endpoint will return a success response with the current state
    -   Only the notification owner can mark it as read

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - Not authorized to update this notification
    -   `404 Not Found` - Notification not found or not accessible
    -   `500 Internal Server Error` - Server error

### Mark All Notifications as Read

-   **URL**: `PUT /api/notifications/mark-all-read`
-   **Description**: Mark all unread notifications as read for the authenticated user
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}
    -   `Content-Type`: application/json

-   **Response (200 OK)**:

    ```json
    {
        "message": "5 notifications marked as read"
    }
    ```

    **Notes**:

    -   Returns the count of notifications that were marked as read
    -   Only affects notifications that were previously unread

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Delete Notification

-   **URL**: `DELETE /api/notifications/{notification}`
-   **Description**: Delete a specific notification
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **URL Parameters**:

    -   `notification`: integer (required) - ID of the notification to delete

-   **Response (200 OK)**:

    ```json
    {
        "message": "Notification deleted successfully"
    }
    ```

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - Not authorized to delete this notification
    -   `404 Not Found` - Notification not found or not accessible
    -   `500 Internal Server Error` - Server error

### Delete All Notifications

-   **URL**: `DELETE /api/notifications`
-   **Description**: Delete all notifications for the authenticated user
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **Response (200 OK)**:

    ```json
    {
        "message": "10 notifications deleted successfully"
    }
    ```

    **Notes**:

    -   Returns the count of notifications that were deleted
    -   This action cannot be undone

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Delete Read Notifications

-   **URL**: `DELETE /api/notifications/read`
-   **Description**: Delete all read notifications for the authenticated user
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **Response (200 OK)**:

    ```json
    {
        "message": "7 read notifications deleted successfully"
    }
    ```

    **Notes**:

    -   Only deletes notifications that have been marked as read
    -   This action cannot be undone

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

### Delete Unread Notifications

-   **URL**: `DELETE /api/notifications/unread`
-   **Description**: Delete all unread notifications for the authenticated user
-   **Role**: Authenticated User
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **Response (200 OK)**:

    ```json
    {
        "message": "3 unread notifications deleted successfully"
    }
    ```

    **Notes**:

    -   Only deletes notifications that are unread
    -   This action cannot be undone

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `500 Internal Server Error` - Server error

## Statistics

### Get Platform Statistics

-   **URL**: `GET /api/statistics`
-   **Description**: Get comprehensive platform statistics (Admin only)
-   **Role**: Admin
-   **Headers**:

    -   `Accept`: application/json
    -   `Authorization`: Bearer {token}

-   **Response (200 OK)**:

    ```json
    {
        "success": true,
        "data": {
            "total_users": 150,
            "total_donation_events": 45,
            "total_donation_requests": 30,
            "total_donation_offers": 15,
            "total_transactions": 120,
            "total_transaction_contributions": 80,
            "total_transaction_claims": 40,
            "total_amount_donated": 12500.75,
            "active_donation_events": 20,
            "recent_transactions": [
                {
                    "id": 1,
                    "amount": 100.5,
                    "user": "John Doe",
                    "event": "Help for Earthquake Victims",
                    "transaction_type": "contribution",
                    "status": "approved",
                    "created_at": "2025-08-10T14:30:00"
                },
                {
                    "id": 2,
                    "amount": 50.0,
                    "user": "Jane Smith",
                    "event": "School Supplies Donation",
                    "transaction_type": "claim",
                    "status": "pending",
                    "created_at": "2025-08-10T13:15:00"
                }
            ]
        }
    }
    ```

    **Response Fields**:

    -   `total_users`: Total number of registered users
    -   `total_donation_events`: Total number of donation events (both requests and offers)
    -   `total_donation_requests`: Number of donation requests
    -   `total_donation_offers`: Number of donation offers
    -   `total_transactions`: Total number of transactions (both contributions and claims)
    -   `total_transaction_contributions`: Number of contribution transactions
    -   `total_transaction_claims`: Number of claim transactions
    -   `total_amount_donated`: Total amount donated in the platform's currency
    -   `active_donation_events`: Number of currently active donation events
    -   `recent_transactions`: Array of the 5 most recent transactions with details

    **Error Responses**:

    -   `401 Unauthorized` - Missing or invalid authentication token
    -   `403 Forbidden` - User is not authorized to view statistics
    -   `500 Internal Server Error` - Server error

## Response Structures

### User Resource

```json
{
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "email_verified_at": "2025-01-01T00:00:00.000000Z",
    "role": "user",
    "avatar": "http://example.com/storage/avatars/1.jpg",
    "is_verified": true,
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

### Donation Event Resource

```json
{
    "id": 1,
    "user_id": 1,
    "title": "Help for Earthquake Victims",
    "description": "Urgent need for food and supplies",
    "type": "request",
    "status": "active",
    "location_id": 1,
    "target_amount": 10000.0,
    "current_amount": 3500.5,
    "end_date": "2025-12-31T23:59:59.000000Z",
    "images": [
        {
            "id": 1,
            "url": "http://example.com/storage/events/1/image1.jpg",
            "is_primary": true
        }
    ],
    "location": {
        "id": 1,
        "name": "Downtown Shelter",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "postal_code": "10001",
        "latitude": 40.7128,
        "longitude": -74.006
    },
    "created_at": "2025-08-01T10:00:00.000000Z",
    "updated_at": "2025-08-10T15:30:00.000000Z"
}
```

### Transaction Resource

```json
{
    "id": 1,
    "donation_event_id": 1,
    "user_id": 2,
    "amount": 100.5,
    "transaction_type": "contribution",
    "status": "approved",
    "message": "Happy to help!",
    "transaction_at": "2025-08-10T14:30:00.000000Z",
    "created_at": "2025-08-10T14:30:00.000000Z",
    "updated_at": "2025-08-10T14:30:00.000000Z",
    "user": {
        "id": 2,
        "username": "janedoe",
        "first_name": "Jane",
        "last_name": "Doe",
        "avatar": "http://example.com/storage/avatars/2.jpg"
    },
    "event": {
        "id": 1,
        "title": "Help for Earthquake Victims",
        "type": "request"
    }
}
```

### Notification Resource

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "New Donation Received",
    "message": "John Doe contributed $100.50 to your request",
    "data": {
        "amount": 100.5,
        "currency": "USD",
        "user_id": 2,
        "event_id": 1
    },
    "is_read": false,
    "read_at": null,
    "created_at": "2025-08-10T14:30:00.000000Z",
    "updated_at": "2025-08-10T14:30:00.000000Z",
    "type": {
        "id": 1,
        "name": "transaction_contribution",
        "description": "Notification for new donation contributions"
    },
    "user": {
        "id": 1,
        "username": "recipient",
        "first_name": "Recipient",
        "last_name": "User",
        "avatar": "http://example.com/storage/avatars/1.jpg"
    },
    "related_user": {
        "id": 2,
        "username": "donor",
        "first_name": "John",
        "last_name": "Doe",
        "avatar": "http://example.com/storage/avatars/2.jpg"
    }
}
```

### Comment Resource

```json
{
    "id": 1,
    "content": "This is a sample comment",
    "user_id": 1,
    "post_id": 1,
    "created_at": "2025-08-10T12:00:00.000000Z",
    "updated_at": "2025-08-10T12:00:00.000000Z",
    "user": {
        "id": 1,
        "username": "johndoe",
        "first_name": "John",
        "last_name": "Doe",
        "avatar": "http://example.com/storage/avatars/1.jpg"
    },
    "reactions": {
        "upvotes": 5,
        "downvotes": 1,
        "user_vote": "up"
    }
}
```

### Community Post Resource

```json
{
    "id": 1,
    "user_id": 1,
    "title": "Welcome to our community!",
    "content": "This is the first post in our community.",
    "status": "published",
    "created_at": "2025-08-01T10:00:00.000000Z",
    "updated_at": "2025-08-01T10:00:00.000000Z",
    "user": {
        "id": 1,
        "username": "johndoe",
        "first_name": "John",
        "last_name": "Doe",
        "avatar": "http://example.com/storage/avatars/1.jpg"
    },
    "comments_count": 5,
    "reactions": {
        "upvotes": 10,
        "downvotes": 2,
        "user_vote": "up"
    }
}
```

### Verification Request Resource

```json
{
    "id": 1,
    "user_id": 1,
    "document_type": "national_id",
    "document_number": "A12345678",
    "status": "pending",
    "rejection_reason": null,
    "verified_by": null,
    "verified_at": null,
    "created_at": "2025-08-01T10:00:00.000000Z",
    "updated_at": "2025-08-01T10:00:00.000000Z",
    "document_url": "http://example.com/storage/verifications/1/document.jpg",
    "user": {
        "id": 1,
        "username": "johndoe",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
    },
    "verifier": null
}
```

### Location Resource

```json
{
    "id": 1,
    "name": "Community Center",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postal_code": "10001",
    "latitude": 40.7128,
    "longitude": -74.006,
    "is_active": true,
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

### Announcement Resource

```json
{
    "id": 1,
    "title": "System Maintenance",
    "content": "Scheduled maintenance on August 15th from 2:00 AM to 4:00 AM UTC.",
    "is_pinned": true,
    "starts_at": "2025-08-15T02:00:00.000000Z",
    "ends_at": "2025-08-15T04:00:00.000000Z",
    "created_by": 1,
    "created_at": "2025-08-10T10:00:00.000000Z",
    "updated_at": "2025-08-10T10:00:00.000000Z",
    "author": {
        "id": 1,
        "username": "admin",
        "first_name": "Admin",
        "last_name": "User"
    }
}
```

## Error Responses

### 401 Unauthorized

```json
{
    "message": "Unauthenticated."
}
```

### 403 Forbidden

```json
{
    "message": "This action is unauthorized."
}
```

### 404 Not Found

```json
{
    "message": "The requested resource was not found."
}
```

### 422 Unprocessable Entity

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "field_name": ["The validation error message."]
    }
}
```

### 500 Server Error

```json
{
    "message": "Server Error"
}
```
