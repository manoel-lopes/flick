# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flick - a NestJS API built with NestJS v11 (Fastify), TypeScript, PostgreSQL (TypeORM), and Redis. Follows Clean Architecture, Domain-Driven Design, and SOLID principles.

## Quick Reference

### Essential Commands
```bash
pnpm install                    # Install dependencies
pnpm run start:dev              # Development mode with hot reload
pnpm run build                  # Compile TypeScript
pnpm run check-types            # Type check without emitting
pnpm run lint                   # ESLint with auto-fix
```

### Testing
```bash
pnpm test                       # Run all tests
pnpm test:unit                  # Unit tests only
pnpm test:e2e                   # E2E tests
pnpm test:coverage              # With coverage report
```

### Database (TypeORM)
```bash
pnpm run db:up:dev              # Start PostgreSQL and Redis containers
pnpm run migrate:dev            # Run migrations
pnpm run migrate:revert         # Revert last migration
pnpm run migrate:generate       # Generate migration from entity changes
pnpm run migrate:create         # Create empty migration
```

### Environment Setup
```bash
cp .env.example .env.development
cp .env.example .env.test
```

## Architecture

### Layer Structure
```
src/
├── core/                    # Base abstractions (Entity, UseCase)
├── domain/                  # Business logic (framework-independent)
│   ├── application/
│   │   ├── repositories/    # Repository interfaces
│   │   └── usecases/        # Use cases
│   └── enterprise/
│       └── entities/        # TypeORM entities with decorators
│           ├── base/        # BaseEntity with common columns
│           └── index.ts     # Entity exports for TypeORM config
├── infra/                   # External dependencies
│   ├── adapters/            # Security adapters
│   ├── auth/                # JWT authentication
│   ├── cache/               # Redis caching
│   ├── env/                 # Environment configuration
│   ├── persistence/
│   │   └── repositories/
│   │       └── typeorm/     # TypeORM repository implementations
│   │           └── base/    # BaseTypeOrmRepository
│   └── http/
│       └── presentation/
│           ├── controllers/ # HTTP controllers
│           ├── pipes/       # Validation pipes
│           └── decorators/  # Custom decorators
├── shared/                  # Shared types and errors
└── main.ts                  # Entry point
```

### Key Patterns

**TypeORM Entity Pattern**:
```typescript
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from './base/base.entity'

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string

  @Column({ unique: true })
  email: string
}
```

**Base Repository Pattern**:
```typescript
export class TypeOrmUsersRepository extends BaseTypeOrmRepository<User> {
  constructor (@InjectRepository(User) repository: Repository<User>) {
    super(repository)
  }
}
```

**Global Modules**: `RepositoriesModule`, `UseCasesModule`, `EnvModule`, `SecurityModule`, `CacheModule`

## Code Style Rules

- `no-explicit-any`: ERROR
- `no-console`: ERROR
- `max-len`: 120 characters
- **NO nested ternaries** - use registry pattern
- **ONE class per file**

## Adding New Features

1. **Entity**: `src/domain/enterprise/entities/` with TypeORM decorators
2. **Add to entities index**: `src/domain/enterprise/entities/index.ts`
3. **Repository Interface**: `src/domain/application/repositories/`
4. **TypeORM Repository**: `src/infra/persistence/repositories/typeorm/`
5. **Register in RepositoriesModule**
6. **Use Case**: `src/domain/application/usecases/`
7. **Register in UseCasesModule**
8. **Controller**: `src/infra/http/presentation/controllers/`
9. **Register in ControllersModule**
10. **Generate Migration**: `pnpm run migrate:generate migrations/YourMigrationName`
