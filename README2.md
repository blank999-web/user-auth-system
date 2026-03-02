User Authentication System

A simple REST API built with Node.js for user authentication and role-based access control (RBAC). Users can register, log in, and access protected routes using JWT tokens. Admins have extra permissions.

What It Does

Register users (passwords hashed with bcrypt)

Login users and generate JWT tokens

Protect routes using token authentication

Support user and admin roles

Allow only admins to view all users

Store data in MySQL

Includes Mocha + Chai tests

Tech Stack

Node.js + Express

MySQL2

JWT

bcrypt

Mocha + Chai

dotenv

Setup
1. Install dependencies
npm install
2. Create .env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=registration
JWT_SECRET=your_secret_key
3. Create Database
CREATE DATABASE registration;
USE registration;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  department VARCHAR(100)
);
4. Start Server
node index.js

Runs on: http://localhost:4000

API Endpoints
Register

POST /api/register

Returns a JWT token after successful registration.

Login

POST /api/login

Returns a JWT token if credentials are valid.

Get All Users (Admin Only)

GET /api/users
Header required:

Authorization: Bearer <token>
Authentication

JWT expires in 1 hour

Must be sent as:

Authorization: Bearer <token>
Run Tests
npm test
Production Notes

Before deploying:

Move secrets to .env

Use HTTPS

Add input validation

Add CORS

Add rate limiting
