# SecureMyVoice API Documentation

## Introduction

Welcome to the SecureMyVoice API! This document provides a detailed guide on how to use the API for authentication and user management.

## Base URL

All API endpoints are prefixed with the following base URL:

`/api/auth`

## Authentication

The SecureMyVoice API uses JSON Web Tokens (JWTs) for authentication. To access protected endpoints, you need to include an `accessToken` in the `Authorization` header of your requests.

### Authentication Flow

1.  **Sign up or log in:** When a user signs up or logs in, the API returns an `accessToken`, a `refreshToken`, and a `sessionId`.
2.  **Store tokens:** The `accessToken` should be stored in memory, while the `refreshToken` and `sessionId` should be stored securely (e.g., in an `HttpOnly` cookie or `localStorage`).
3.  **Send `accessToken`:** For each request to a protected endpoint, include the `accessToken` in the `Authorization` header with the "Bearer" scheme:
    `Authorization: Bearer <accessToken>`
4.  **Refresh `accessToken`:** `accessTokens` are short-lived. When an `accessToken` expires, you will receive a 401 Unauthorized error. Use the `refreshToken` and `sessionId` to obtain a new `accessToken` by calling the `/refresh-token` endpoint.

---

## Endpoints

### Authentication

#### 1. Sign Up

*   **Endpoint:** `POST /signup`
*   **Description:** Registers a new user. Even if the verification email fails to send, the user will be created and tokens will be returned.
*   **Request Body:**
    *   `email` (string, required): The user's email address.
    *   `password` (string, required): The user's password.
    *   `username` (string, required): The user's username.
*   **Success Response (201 Created):**
    *   **If email sends successfully:**
        ```json
        {
            "message": "Sign up successful",
            "success": true,
            "accessToken": "...",
            "refreshToken": "...",
            "unique_link": "...",
            "sessionId": "...",
            "email": "user@example.com",
            "verificationToken": "..."
        }
        ```
    *   **If email fails to send:**
        ```json
        {
            "message": "Sign up successful, but failed to send verification email. Please request a new one.",
            "success": true,
            "accessToken": "...",
            "refreshToken": "...",
            "unique_link": "...",
            "sessionId": "...",
            "email": "user@example.com",
            "verificationToken": "..."
        }
        ```
*   **Error Response (400 Bad Request):**
    ```json
    {
        "message": "Email already exists"
    }
    ```

#### 2. Log In

*   **Endpoint:** `POST /login`
*   **Description:** Logs in an existing user.
*   **Request Body:**
    *   `email` (string, required): The user's email address.
    *   `password` (string, required): The user's password.
*   **Success Response (201 Created):**
    ```json
    {
        "message": "User logged in successfuly",
        "success": true,
        "accessToken": "...",
        "refreshToken": "...",
        "user": { ... },
        "sessionId": "..."
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
        "message": "Invalid credentials"
    }
    ```

#### 3. Verify Email

*   **Endpoint:** `POST /verify-email`
*   **Description:** Verifies a user's email address. The process will succeed even if the subsequent welcome email fails to send.
*   **Request Body:**
    *   `email` (string, required): The user's email address.
    *   `verificationToken` (string, required): The verification token sent to the user's email.
*   **Success Response (200 OK):**
    *   **If welcome email sends successfully:**
        ```json
        {
            "success": true,
            "message": "Email verification successful !"
        }
        ```
    *   **If welcome email fails to send:**
        ```json
        {
            "success": true,
            "message": "Email verification successful ! However, we failed to send a welcome email. Please contact support if you have any issues."
        }
        ```

#### 4. Resend Verification Email

*   **Endpoint:** `POST /resend-verification-email`
*   **Description:** Resends the verification email.
*   **Request Body:**
    *   `email` (string, required): The user's email address.
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "message": "Verification email sent",
        "verificationToken": "..."
    }
    ```

#### 5. Forgot Password

*   **Endpoint:** `POST /forgot-password`
*   **Description:** Sends a password reset link to the user's email.
*   **Request Body:**
    *   `email` (string, required): The user's email address.
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "message": "Password reset email sent",
        "resetLink": "..."
    }
    ```

#### 6. Reset Password with Token

*   **Endpoint:** `POST /reset-password-with-token`
*   **Description:** Resets the user's password using a reset token.
*   **Request Body:**
    *   `newPassword` (string, required): The user's new password.
*   **Query Parameters:**
    *   `token` (string, required): The password reset token from the email link.
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "message": "Password has been reset successfully"
    }
    ```

#### 7. Reset Password (Authenticated)

*   **Endpoint:** `POST /reset-password`
*   **Authentication:** Required
*   **Description:** Changes the password of the currently authenticated user.
*   **Request Body:**
    *   `currentPassword` (string, required): The user's current password.
    *   `newPassword` (string, required): The user's new password.
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "message": "Password changed successfully"
    }
    ```

#### 8. Refresh Token

*   **Endpoint:** `POST /refresh-token`
*   **Description:** Refreshes an expired `accessToken`.
*   **Request Body:**
    *   `refreshToken` (string, required): The user's refresh token.
    *   `sessionId` (string, required): The user's session ID.
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "accessToken": "...",
        "refreshToken": "..."
    }
    ```

#### 9. Log Out

*   **Endpoint:** `DELETE /logout`
*   **Authentication:** Required
*   **Description:** Logs out the user by revoking the current session.
*   **Success Response (200 OK):**
    ```json
    {
        "message": "User logged out successfuly"
    }
    ```

#### 10. Revoke Access

*   **Endpoint:** `DELETE /revoke-token`
*   **Authentication:** Required
*   **Description:** Revokes a specific session.
*   **Request Body:**
    *   `sessionId` (string, required): The ID of the session to revoke.
*   **Success Response (200 OK):**
    ```json
    {
        "message": "Access for the specific session revoked successfully",
        "success": true
    }
    ```

### User Profile

#### 1. Get Profile

*   **Endpoint:** `GET /profile`
*   **Authentication:** Required
*   **Description:** Retrieves the profile of the authenticated user.
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "user": { ... }
    }
    ```

#### 2. Update Profile

*   **Endpoint:** `PUT /profile`
*   **Authentication:** Required
*   **Description:** Updates the profile of the authenticated user.
*   **Request Body:**
    *   Any user profile fields to update (e.g., `username`, `email`).
*   **Success Response (200 OK):**
    ```json
    {
        "message": "Updated profile successfully.",
        "success": true,
        "user": { ... }
    }
    ```

### Account Activity

#### 1. Get Login History

*   **Endpoint:** `GET /history`
*   **Authentication:** Required
*   **Description:** Retrieves the login history of the authenticated user.
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "history": [ ... ]
    }
    ```

#### 2. Get Active Sessions

*   **Endpoint:** `GET /sessions`
*   **Authentication:** Required
*   **Description:** Retrieves the active sessions of the authenticated user.
*   **Success Response (200 OK):**
    ```json
    {
        "success": true,
        "activeSessions": [ ... ]
    }
    ```

---

## Error Codes

*   **400 Bad Request:** The request was invalid (e.g., missing parameters, invalid data).
*   **401 Unauthorized:** The request requires authentication, or the provided `accessToken` is invalid or expired.
*   **404 Not Found:** The requested resource was not found.
*   **500 Internal Server Error:** An unexpected error occurred on the server.