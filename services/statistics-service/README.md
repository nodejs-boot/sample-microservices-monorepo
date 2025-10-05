# Statistics Service

A NodeBoot microservice for recording and retrieving statistical data about system events, providing comprehensive event tracking, aggregation, and reporting functionality with pagination support.

> The Statistics Service is part of the sample microservices monorepo demonstrating NodeBoot framework capabilities for event tracking and analytics.

## Features

- **Event Recording**: Record statistical events for various system activities
- **Event Retrieval**: Get statistics with flexible filtering options
- **Event Type Filtering**: Filter statistics by specific event types
- **User Activity Tracking**: Track statistics by user ID
- **Event Aggregation**: Get aggregated counts by event type
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
- **Database**: MongoDB
- **ORM**: TypeORM
- **Validation**: class-validator
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest
- **Package Manager**: pnpm

## API Endpoints

### Statistics Operations

| Method   | Endpoint                        | Description                        | Request Body               | Response               |
|----------|---------------------------------|------------------------------------|----------------------------|------------------------|
| `GET`    | `/statistics`                   | Get all statistics with pagination | Query params: `page`, `pageSize`, `sortOrder`, `sortField` | `StatisticsPage`       |
| `GET`    | `/statistics/event-type/:type`  | Get statistics by event type       | -                          | `StatisticsPage`       |
| `GET`    | `/statistics/user/:userId`      | Get statistics by user ID          | -                          | `StatisticsPage`       |
| `GET`    | `/statistics/counts`            | Get event counts by type           | -                          | Event counts object    |
| `POST`   | `/statistics`                   | Record a new statistics event      | `RecordStatisticsRequest`  | `Statistics`           |

### Request/Response Models

#### RecordStatisticsRequest
```typescript
{
  eventType: string;      // Type of event (required, e.g., "account_created", "account_updated")
  entityId: string;       // ID of the entity that triggered the event (required)
  entitySlug: string;     // Slug of the entity that triggered the event (required)
  userId: string;         // User ID associated with the event (required)
  metadata?: any;         // Optional additional metadata about the event
}
```

#### Statistics Entity
```typescript
{
  id: string;            // MongoDB ObjectId
  eventType: string;     // Type of event (e.g., account_created, account_updated, account_deleted)
  entityId: string;      // ID of the entity that triggered the event
  entitySlug: string;    // Slug of the entity that triggered the event
  userId: string;        // User ID associated with the event
  metadata: any;         // Additional metadata about the event
  createdAt: Date;       // Event timestamp
}
```

#### StatisticsPage (Paginated Response)
```typescript
{
  content: Statistics[]; // Array of statistics
  totalElements: number; // Total number of statistics
  totalPages: number;    // Total number of pages
  size: number;          // Page size
  number: number;        // Current page number (0-based)
}
```

#### Event Counts Response
```typescript
{
  [eventType: string]: number;  // Event type as key, count as value
}
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm 7.5.1 or higher
- MongoDB (configured via connection string)

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

The service will start on `http://localhost:41000` by default.

### Configuration

Configuration is managed through `app-config.yaml`. Key configurations include:

- **Port**: Service runs on port 41000
- **API Route Prefix**: `/v1`
- **Database**: MongoDB connection via `TECH_INSIGHTS_DATABASE_TOKEN` environment variable
- **CORS**: Configured for cross-origin requests

## Usage Examples

### Record a New Statistics Event

```bash
curl -X POST http://localhost:41000/v1/statistics \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "account_created",
    "entityId": "507f1f77bcf86cd799439011",
    "entitySlug": "john-doe-account",
    "userId": "507f1f77bcf86cd799439012",
    "metadata": {
      "source": "registration_form",
      "campaign": "spring_promotion"
    }
  }'
```

### Get All Statistics (with pagination)

```bash
curl "http://localhost:41000/v1/statistics?page=0&pageSize=10&sortField=createdAt&sortOrder=DESC"
```

### Get Statistics by Event Type

```bash
curl "http://localhost:41000/v1/statistics/event-type/account_created?page=0&pageSize=10"
```

### Get Statistics by User ID

```bash
curl "http://localhost:41000/v1/statistics/user/507f1f77bcf86cd799439012?page=0&pageSize=10"
```

### Get Event Counts by Type

```bash
curl http://localhost:41000/v1/statistics/counts
```

Example response:
```json
{
  "account_created": 150,
  "account_updated": 89,
  "account_deleted": 12,
  "login_attempt": 2340
}
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
├── app.ts             # Application configuration
└── server.ts          # Application entry point
```

### Error Handling

The service provides comprehensive error handling:

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Statistics not found
- **500 Internal Server Error**: Unexpected server errors

All errors include meaningful messages and error codes for easy debugging.

## Environment Variables

- `TECH_INSIGHTS_DATABASE_TOKEN` - MongoDB connection credentials (required)
- `NODE_ENV` - Environment mode (development/production)

## Integration

This service is designed to work with other services in the microservices ecosystem:

- Records events from **Account Service** (account creation, updates, deletions)
- Tracks user activities from **User Service**
- Provides analytics data for reporting dashboards
- Supports real-time event streaming and batch processing

## License

See `LICENSE` for details.
