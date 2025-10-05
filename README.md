# Sample Microservices Monorepo

A comprehensive Node-Boot microservices monorepo sample project demonstrating modern microservices architecture, inter-service communication, and monorepo management using Turborepo.

## 🏗️ Architecture Overview

This project showcases a microservices architecture with three interconnected services that demonstrate real-world patterns of service communication, data consistency, and event tracking.

```
                             ┌─────────────────────┐
                             │   Account Service   │
                             │     Port: 40000     │
                             └─────────┬───────────┘
                                       │
                 ┌─────────────────────┼──────────────────────────┐
                 │                     │                          │
                 ▼                     ▼                          ▼
    ┌─────────────────┐        ┌─────────────────┐     ┌────────────────────┐
    │   User Service  │        │   Account DB    │     │ Statistics Service │
    │   Port: 42000   │        │   (MongoDB)     │     │    Port: 41000     │
    └─────────┬───────┘        └─────────────────┘     └─────────┬──────────┘
              │                                                  │
              ▼                                                  ▼
    ┌─────────────────┐                                 ┌──────────────────┐
    │   Users DB      │                                 │  Statistics DB   │
    │   (MongoDB)     │                                 │   (MongoDB)      │
    └─────────────────┘                                 └──────────────────┘
```

### Service Interactions

- **Account Service** → **User Service**: Validates user existence during account creation
- **Account Service** → **Statistics Service**: Records account events (creation, updates, deletions)
- Each service maintains its own dedicated MongoDB database for data isolation
- All services use HTTP-based communication with NodeBoot's built-in HTTP client framework

## 🚀 Services

### [Account Service](./services/account-service/README.md)
- **Port**: 40000
- **Purpose**: Account management with CRUD operations
- **Features**: Slug-based identification, user validation, score-based ranking
- **Dependencies**: User Service (validation), Statistics Service (event recording)

### [User Service](./services/user-service/README.md)
- **Port**: 42000
- **Purpose**: User management and authentication
- **Features**: Email validation, user status management, CRUD operations
- **Dependencies**: None (foundational service)

### [Statistics Service](./services/statistics-service/README.md)
- **Port**: 41000
- **Purpose**: Event tracking and analytics
- **Features**: Event recording, aggregation, filtering by type and user
- **Dependencies**: None (receives events from other services)

## 🛠️ Technology Stack

### Core Framework
- **[NodeBoot](https://github.com/nodeboot/nodeboot)**: Modern Node.js framework with dependency injection, decorators, and enterprise-grade features
- **Node.js**: 18+ runtime environment
- **TypeScript**: Type-safe development with full ES2022+ support

### Monorepo Management
- **[Turborepo](https://turbo.build/)**: High-performance build system for JavaScript and TypeScript monorepos
- **[pnpm](https://pnpm.io/)**: Fast, disk space efficient package manager with workspace support
- **Workspaces**: Organized service isolation with shared dependencies

### Database & Persistence
- **MongoDB**: Document database with cloud Atlas integration
- **TypeORM**: Object-relational mapping with MongoDB support

### Development & Quality
- **Jest**: Testing framework with SWC transpilation
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting with import organization
- **Husky**: Git hooks for pre-commit quality checks
- **Lint-staged**: Run linters on staged files

### API & Documentation
- **OpenAPI/Swagger**: Auto-generated API documentation
- **class-validator**: Request validation with decorators
- **CORS**: Cross-origin resource sharing configuration

### DevOps & Tooling
- **Docker**: Containerization support for each service
- **GitHub Actions**: CI-CD
- **Nodemon**: Development server with hot reloading
- **Winston**: Structured logging
- **Changesets**: Version management and changelog generation

## 📁 Project Structure

```
sample-microservices-monorepo/
├── services/                    # Microservices directory
│   ├── account-service/         # Account management service
│   │   ├── src/
│   │   │   ├── api/            # Controllers and models
│   │   │   ├── client/         # HTTP clients for other services
│   │   │   ├── config/         # Service configuration
│   │   │   ├── middlewares/    # Custom middleware
│   │   │   ├── persistence/    # Database entities and repositories
│   │   │   └── services/       # Business logic
│   │   ├── app-config.yaml     # Service configuration
│   │   └── Dockerfile          # Container configuration
│   ├── user-service/           # User management service
│   └── statistics-service/     # Event tracking service
├── shared/                     # Shared libraries (future)
├── package.json               # Root package configuration
├── pnpm-workspace.yaml        # Workspace configuration
├── turbo.json                 # Turborepo configuration
├── tsconfig.base.json         # Base TypeScript configuration
└── README.md                  # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 7.5.1+
- MongoDB Atlas account or local MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nodejs-boot/sample-microservices-monorepo.git
   cd sample-microservices-monorepo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build all services**
   ```bash
   pnpm build
   ```

4. **Start development servers**
   ```bash
   pnpm dev
   ```

### Service URLs
- Account Service: http://localhost:40000/v1
- User Service: http://localhost:42000/v1
- Statistics Service: http://localhost:41000/v1

## 📋 Available Scripts

### Development
- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all services
- `pnpm test` - Run tests across all services
- `pnpm tsc` - Type check all services

### Code Quality
- `pnpm lint` - Lint all code
- `pnpm lint:fix` - Fix linting issues
- `pnpm format:check` - Check code formatting
- `pnpm format:fix` - Fix formatting issues

### Utilities
- `pnpm nodeboot:update` - Update NodeBoot dependencies
- `pnpm nodeboot:check:type-deps` - Verify type dependencies
- `pnpm changeset:create` - Create a new changeset

## 🎯 NodeBoot Framework Features Demonstrated

This monorepo showcases key NodeBoot capabilities:

### Dependency Injection
- Service dependency injection
- HTTP client injection with configuration
- Repository pattern with automatic injection

### Configuration Management
- YAML-based configuration with environment variable interpolation
- Service-specific configuration with shared patterns
- Integration configuration for service communication

### HTTP Client Framework
- Declarative HTTP clients with `@HttpClient` decorator
- Automatic service discovery and configuration
- Built-in timeout and logging support

### Data Persistence
- MongoDB integration with TypeORM
- Repository pattern with pagination support
- Entity validation and transformation

### API Development
- Controller-based routing with decorators
- Automatic OpenAPI documentation generation
- Request validation with class-validator
- Structured error handling

### Middleware Support
- Custom error handling middleware
- Logging middleware with Winston integration
- CORS configuration

## 🔄 Inter-Service Communication Flow

1. **Account Creation Flow**:
   ```
   Client → Account Service → User Service (validation) → Statistics Service (event recording)
   ```

2. **User Validation**: Account Service validates users exist before account creation
3. **Event Tracking**: All account operations are recorded in Statistics Service
4. **Error Propagation**: Service errors are properly handled and propagated

## 🧪 Testing Strategy

- **Unit Tests**: Jest with SWC for fast transpilation
- **Integration Tests**: Service-to-service communication testing
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Mocking**: HTTP client stubbing for isolated testing

## 📖 Documentation

Each service includes comprehensive documentation:
- API endpoints and request/response models
- Configuration options
- Development setup instructions
- Docker containerization

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Add tests for new functionality
3. Update documentation as needed
4. Use changesets for version management

## 📄 License

This project is licensed under the MIT License - see individual service LICENSE files for details.

---

> This sample demonstrates production-ready microservices architecture using NodeBoot framework, showcasing modern development practices, proper service separation, and effective monorepo management.
