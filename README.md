# SecureMyVoice Authentication Server

This project is a robust and secure authentication server built with Node.js, Express.js, and MongoDB. It provides a comprehensive set of authentication and user management functionalities, designed to be decoupled from any frontend application.

## Features

*   User Registration (Signup)
*   User Login
*   Email Verification
*   Password Reset (via email)
*   JWT-based Authentication (Access and Refresh Tokens)
*   Session Management (Login History, Active Sessions, Session Revocation)
*   User Profile Management
*   Input Validation for all API endpoints
*   Centralized Error Handling
*   Dockerized for consistent development and deployment environments

## Technologies Used

*   **Node.js:** JavaScript runtime
*   **Express.js:** Web application framework
*   **MongoDB:** NoSQL database
*   **Mongoose:** MongoDB object modeling for Node.js
*   **bcryptjs:** For password hashing
*   **jsonwebtoken:** For JWT creation and verification
*   **Mailtrap:** For email sending (verification, password reset, welcome emails)
*   **Docker & Docker Compose:** For containerization and orchestration
*   **Jest & Supertest:** For API testing
*   **express-validator:** For request input validation

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS recommended)
*   npm (Node Package Manager)
*   Docker & Docker Compose
*   MongoDB instance (local or cloud-based, e.g., MongoDB Atlas)
*   Mailtrap account (for email functionalities)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd SecureMyVoiceAuth
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project and add the following variables. Replace the placeholder values with your actual credentials and configurations.

    ```
    MONGO_URL=your_mongodb_connection_string
    AUTH_PORT=4001
    JWT_SECRET=your_jwt_secret_key
    JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
    MAILTRAP_TOKEN=your_mailtrap_api_token
    SENDER_NAME="Secure My Voice Team"
    SENDER_EMAIL=hello@demomailtrap.com # Use your verified sender email for production
    ORG_NAME="Secure My Voice"
    AUTH_BASE_URL=http://localhost:4001/api/auth # Adjust for your frontend's base URL
    ```
    *   `MONGO_URL`: Your MongoDB connection string (e.g., from MongoDB Atlas).
    *   `AUTH_PORT`: The port your authentication server will run on.
    *   `JWT_SECRET` & `JWT_REFRESH_SECRET`: Strong, random strings for signing your JWTs.
    *   `MAILTRAP_TOKEN`, `SENDER_NAME`, `SENDER_EMAIL`: Your Mailtrap credentials. For production, ensure `SENDER_EMAIL` is a verified domain in Mailtrap.
    *   `ORG_NAME`: Your organization's name.
    *   `AUTH_BASE_URL`: The base URL for your authentication API. This is used for constructing password reset links.

### Running the Application

#### Development Mode

To run the server in development mode with `nodemon` (which automatically restarts the server on file changes):

```bash
npm run dev
```

The server will be accessible at `http://localhost:4001` (or your configured `AUTH_PORT`).

#### Production Mode

To run the server in production mode:

```bash
npm start
```

#### Using Docker Compose

For a containerized setup (recommended for consistent environments):

```bash
docker-compose up --build
```

This will build the Docker images (if not already built) and start both the Node.js application and a MongoDB container.

## API Documentation

For detailed information on all available API endpoints, request/response formats, and authentication requirements, please refer to:

[API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Running Tests

To run the automated test suite:

```bash
npm test
```

This will execute all tests using Jest and an in-memory MongoDB database, ensuring a clean test environment without affecting your development database.

## Project Structure

```
.
├── src/
│   ├── controllers/       # Handles request logic and interacts with services
│   ├── mailtrap/          # Email service integration (Mailtrap)
│   ├── middlewares/       # Express middleware (auth, validation, error handling)
│   ├── models/            # Mongoose schemas for MongoDB
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic and data manipulation
│   ├── utils/             # Utility functions (JWT, device info)
│   └── server.js          # Main Express application entry point
├── database/              # Database initialization scripts
├── .env.example           # Example environment variables
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Dockerfile for the Node.js application
├── package.json           # Node.js project metadata and dependencies
├── README.md              # This file
├── API_DOCUMENTATION.md   # Detailed API endpoint documentation
└── jest.config.js         # Jest test runner configuration
└── jest.setup.js          # Jest setup for in-memory database and mocks
```