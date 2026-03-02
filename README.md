# User Authentication System

A Node.js-based REST API for user authentication and management with role-based access control (RBAC). This system provides secure user registration, login with JWT tokens, and admin-only endpoints for user management.

## Features

- **User Registration** - Create new user accounts with password hashing using bcrypt
- **User Login** - Authenticate users and issue JWT tokens
- **JWT Authentication** - Secure token-based authentication with 1-hour expiration
- **Role-Based Access Control** - Admin and regular user roles with permission enforcement
- **Password Security** - Bcrypt hashing with salt rounds for secure password storage
- **MySQL Database** - Persistent storage for user data
- **Comprehensive Testing** - Mocha + Chai test suite

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MySQL2
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Testing**: Mocha + Chai
- **Environment Variables**: dotenv

## Project Structure

```
.
├── index.js              # Express app setup and entry point
├── users.js              # User routes and authentication logic
├── db.connect.js         # MySQL database connection
├── package.json          # Project dependencies and metadata
├── test/
│   └── users.test.js     # Test suite for user endpoints
└── SCREENSHOT/           # Documentation screenshots
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/blank999-web/user-auth-system.git
   cd user-auth-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=4000
   ```

4. **Set up the database**
   Create a MySQL database and table:
   ```sql
   CREATE DATABASE registration;
   USE registration;
   
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(50) DEFAULT 'user',
     department VARCHAR(100)
   );
   ```

5. **Update database connection**
   Modify `db.connect.js` with your MySQL credentials:
   ```javascript
   const db = mysql.createConnection({
     host: "localhost",
     user: "your_user",
     password: "your_password",
     database: "registration"
   });
   ```

## Usage

### Start the Server

```bash
node index.js
```

The server will run on `http://localhost:4000` (or the port specified in `.env`)

### API Endpoints

#### 1. Register User
**POST** `/api/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123",
  "role": "user",
  "department": "Engineering"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `409`: Username already exists
- `500`: Database or server error

---

#### 2. Login User
**POST** `/api/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Invalid credentials
- `500`: Database error

---

#### 3. Get All Users (Admin Only)
**GET** `/api/users`

Retrieve list of all users. Requires admin role and valid JWT token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "role": "user",
      "department": "Engineering"
    },
    {
      "id": 2,
      "username": "admin_user",
      "role": "admin",
      "department": "Management"
    }
  ]
}
```

**Error Responses:**
- `401`: No token provided
- `403`: Invalid token or insufficient permissions (Admin role required)
- `500`: Database error

---

## Authentication

### JWT Token

Tokens are issued upon successful registration or login:
- **Expiry**: 1 hour
- **Format**: `Bearer <token>`
- **Usage**: Include in Authorization header: `Authorization: Bearer <token>`

### Token Payload

Registered tokens contain:
```json
{
  "username": "john_doe",
  "role": "user",
  "department": "Engineering",
  "id": 1,
  "iat": 1234567890,
  "exp": 1234571490
}
```

## Middleware

### `authenticateToken`
Validates JWT token from Authorization header. Returns 401 if missing, 403 if invalid.

### `adminOnly`
Restricts access to users with admin role. Returns 403 if not admin.

## Testing

Run the test suite using Mocha:

```bash
npm test
```

### Test Coverage

The test suite includes:
- Missing credentials validation
- Invalid credentials handling
- Response format validation
- JWT token generation
- Admin access control

### Running Specific Tests

```bash
npx mocha test/users.test.js --grep "POST /api/login"
```

## Security Considerations

⚠️ **Important**: This code has security considerations for production:

1. **JWT Secret**: Currently hardcoded as `my_super_secret_key`. Move to environment variable:
   ```javascript
   const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
   ```

2. **Database Credentials**: Use `.env` file for all database credentials

3. **CORS**: Add CORS middleware for production:
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

4. **Input Validation**: Add schema validation for request bodies

5. **HTTPS**: Use HTTPS in production environments

6. **Rate Limiting**: Implement rate limiting to prevent brute force attacks

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=registration
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description"
}
```

Common status codes:
- `200`: Success
- `201`: Created (successful registration)
- `400`: Bad Request
- `401`: Unauthorized (missing/invalid credentials)
- `403`: Forbidden (insufficient permissions)
- `409`: Conflict (duplicate username)
- `500`: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json file for details.

## Author

**blank999-web**

## Support

For issues, questions, or suggestions, please create an issue on the GitHub repository.

---

**Last Updated**: March 2, 2026
