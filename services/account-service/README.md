# Account Service

A NodeBoot microservice for account management operations, providing CRUD functionality for account entities with validation, error handling, and OpenAPI documentation.

> The Account Service is part of the sample microservices monorepo demonstrating NodeBoot framework capabilities.

## Features

- **Account Management**: Complete CRUD operations for account entities
- **Slug-based Identification**: Uses unique slugs for account identification
- **User Validation**: Ensures referenced users exist via User Service integration
- **Statistics Integration**: Records account events to Statistics Service
- **Score-based Ranking**: Support for account scoring and ranking
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

### Account Operations

| Method   | Endpoint                  | Description                   | Request Body                                               | Response          |
|----------|---------------------------|-------------------------------|------------------------------------------------------------|-------------------|
| `GET`    | `/accounts`               | Get all accounts with pagination | Query params: `page`, `pageSize`, `sortOrder`, `sortField` | `AccountPage`     |
| `GET`    | `/accounts/:slug`         | Get account by slug           | -                                                          | `Account`         |
| `POST`   | `/accounts`               | Create a new account          | `CreateAccountRequest`                                     | `Account`         |
| `PUT`    | `/accounts`               | Update an existing account    | `Partial<Account>`                                         | `Account`         |
| `DELETE` | `/accounts/:slug`         | Delete an account             | -                                                          | Success message   |

### Request/Response Models

#### CreateAccountRequest
```typescript
{
  slug: string;           // Unique identifier of the account (required)
  userId: string;         // Unique identifier of the user (required)
  name: string;           // Human readable name of the account (required)
  description?: string;   // Optional description of the account
  score: number;          // Account score for ranking purposes (must be positive)
}
```

#### Account Entity
```typescript
{
  id: string;            // MongoDB ObjectId
  slug: string;          // Unique account identifier/slug
  userId: string;        // Associated user ID
  name: string;          // Account name
  description: string;   // Account description
  score: number;         // Account score for ranking
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last update timestamp
}
```

#### AccountPage (Paginated Response)
```typescript
{
  content: Account[];    // Array of accounts
  totalElements: number; // Total number of accounts
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

The service will start on `http://localhost:40000` by default.

### Configuration

Configuration is managed through `app-config.yaml`.

## Usage Examples

### Create a New Account

```bash
curl -X POST http://localhost:40000/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "john-doe-account",
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe Personal Account",
    "description": "Personal account for John Doe",
    "score": 95
  }'
```

### Get All Accounts (with pagination)

```bash
curl "http://localhost:40000/accounts?page=0&pageSize=10&sortField=createdAt&sortOrder=DESC"
```

### Get Account by Slug

```bash
curl http://localhost:40000/accounts/john-doe-account
```

### Update Account

```bash
curl -X PUT http://localhost:40000/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "john-doe-account",
    "name": "John Doe Updated Account",
    "description": "Updated description for John Doe account",
    "score": 100
  }'
```

### Delete Account

```bash
curl -X DELETE http://localhost:40000/accounts/john-doe-account
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
├── client/             # Service clients for external APIs
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

- **400 Bad Request**: Invalid input data, business rule violations, or duplicate slugs
- **404 Not Found**: Account not found
- **500 Internal Server Error**: Unexpected server errors

All errors include meaningful messages and error codes for easy debugging.

### Integration Features

The Account Service integrates with other microservices:

1. **User Service**: Validates that referenced users exist before creating accounts
2. **Statistics Service**: Records account lifecycle events (created, updated, deleted) for analytics

### Business Rules

- Account slugs must be unique across the system
- Each account must be associated with a valid user ID
- Account scores must be positive numbers
- Account ID and user ID cannot be modified after creation
- Account slug is required for update operations

## API Documentation

When the service is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:40000/api-docs/`
- **OpenAPI Spec**: `http://localhost:40000/api-docs/swagger.json`

## Architecture

The Account Service follows NodeBoot's layered architecture:

1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic, validation, and external service integration
3. **Repository Layer**: Manages data access operations
4. **Entity Layer**: Defines data models and database schema

The service uses dependency injection for loose coupling and testability, and integrates with external services through dedicated client components.

## License

This project is licensed under the MIT License.
