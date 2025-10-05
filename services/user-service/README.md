# User Service

A NodeBoot microservice for user management operations, providing CRUD functionality for user entities with validation, error handling, and OpenAPI documentation.

> The User Service is part of the sample microservices monorepo demonstrating NodeBoot framework capabilities.

## Features

- **User Management**: Complete CRUD operations for user entities
- **Email Validation**: Ensures email uniqueness across the system
- **User Status Management**: Activate/deactivate user accounts
- **Pagination Support**: Paginated API responses for large datasets
- **Input Validation**: Request validation using class-validator
- **Error Handling**: Comprehensive error handling with meaningful messages
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **MongoDB Integration**: Uses MongoDB with TypeORM for data persistence
- **Dependency Injection**: Leverages NodeBoot's DI container
- **Logging**: Structured logging with Winston

## Technology Stack

- **Framework**: NodeBoot
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Database**: MongoDB (in-memory for development)
- **ORM**: TypeORM
- **Validation**: class-validator
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest
- **Package Manager**: pnpm

## API Endpoints

### User Operations

| Method   | Endpoint                  | Description                   | Request Body                                               | Response          |
|----------|---------------------------|-------------------------------|------------------------------------------------------------|-------------------|
| `GET`    | `/users`                  | Get all users with pagination | Query params: `page`, `pageSize`, `sortOrder`, `sortField` | `UserPage`        |
| `GET`    | `/users/:id`              | Get user by ID                | -                                                          | `User`            |
| `POST`   | `/users`                  | Register a new user           | `CreateUserRequest`                                        | `User`            |
| `PUT`    | `/users`                  | Update an existing user       | `Partial<User>`                                            | `User`            |
| `DELETE` | `/users/:id`              | Delete a user                 | -                                                          | Success message   |
| `PUT`    | `/users/:id/deactivate`   | Deactivate a user account     | -                                                          | `User`            |
| `PUT`    | `/users/:id/activate`     | Activate a user account       | -                                                          | `User`            |

### Request/Response Models

#### CreateUserRequest
```typescript
{
  email: string;          // Valid email address (required)
  firstName: string;      // 1-50 characters (required)
  lastName: string;       // 1-50 characters (required)
  phoneNumber?: string;   // Optional phone number
}
```

#### User Entity
```typescript
{
  id: string;            // MongoDB ObjectId
  email: string;         // Unique email address
  firstName: string;     // User's first name
  lastName: string;      // User's last name
  phoneNumber?: string;  // Optional phone number
  isActive: boolean;     // Account status
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last update timestamp
}
```

#### UserPage (Paginated Response)
```typescript
{
  content: User[];       // Array of users
  totalElements: number; // Total number of users
  totalPages: number;    // Total number of pages
  size: number;          // Page size
  number: number;        // Current page number (0-based)
}
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm 7.5.1 or higher
- MongoDB (optional - uses in-memory database by default)

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build the service:**
   ```bash
   pnpm run build
   ```

3. **Start the service:**
   ```bash
   # Development mode with hot reload
   pnpm run dev
   
   # Production mode
   pnpm run start:prod
   ```

The service will start on `http://localhost:42000` by default.

### Configuration

Configuration is managed through `app-config.yaml`.

## Usage Examples

### Create a New User

```bash
curl -X POST http://localhost:42000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'
```

### Get All Users (with pagination)

```bash
curl "http://localhost:42000/users?page=0&pageSize=10&sortField=createdAt&sortOrder=DESC"
```

### Get User by ID

```bash
curl http://localhost:42000/users/507f1f77bcf86cd799439011
```

### Update User

```bash
curl -X PUT http://localhost:42000/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Jane",
    "phoneNumber": "+0987654321"
  }'
```

### Deactivate User

```bash
curl -X PUT http://localhost:42000/users/507f1f77bcf86cd799439011/deactivate
```

## Development

### Available Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build the TypeScript code
- `pnpm run start` - Start the production server
- `pnpm run test` - Run tests
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier

### Project Structure

```
src/
├── api/
│   ├── controllers/     # REST API controllers
│   └── models/         # API request/response models
├── persistence/
│   ├── entities/       # Database entities
│   └── repositories/   # Data access layer
├── services/           # Business logic layer
├── config/            # Configuration classes
├── middlewares/       # Custom middleware
├── app.ts             # Application configuration
└── server.ts          # Application entry point
```

### Error Handling

The service provides comprehensive error handling:

- **400 Bad Request**: Invalid input data or business rule violations
- **404 Not Found**: User not found
- **409 Conflict**: Email already exists
- **500 Internal Server Error**: Unexpected server errors

All errors include meaningful messages and error codes for easy debugging.

## API Documentation

When the service is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:42000/api-docs/`
- **OpenAPI Spec**: `http://localhost:42000/api-docs/swagger.json`

## Architecture

The User Service follows NodeBoot's layered architecture:

1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic and validation
3. **Repository Layer**: Manages data access operations
4. **Entity Layer**: Defines data models and database schema

The service uses dependency injection for loose coupling and testability.

## License

This project is licensed under the MIT License.
