# Finance-Backend
This project contains backend code for Finance Dashboard which supports financial records mangement, user mangement and financial-analatics overview. Built with Next.js APIs and GraphQL and contains paginated and filtered view.

## Vercel Link
Use this for Admin access
```
email : hello@gmail.com
password asdfghjk
```

## Tech Stack
- **Framework:** Next.js 16.2.2
- **Language:** TypeScript 5
- **Runtime:** Node.js 20+
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **API:** REST (Next.js API Routes) + GraphQL (Apollo Server 5)
- **Authentication:** JWT (HTTP-only cookies)
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **Rate Limiting:** In-memory (Map-based middleware)
- **Testing:** Jest

## System Architecture

![System Architecture](./img/Finance.drawio.png)

## Project Stucture
```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   │       └── route.ts
│   │   │   ├── record/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── user/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── graphql/
│   │   │       └── route.ts
│   │   ├── lib/
│   │   │   ├── guards/
│   │   │   ├── validations/
│   │   │   └── queries/
│   │   └── utils/
│   │       ├── prisma.ts
│   │       ├── errorHandler.ts
│   │       ├── request.ts
│   │       ├── setup.ts
│   │       └── verify.ts
│   └── middleware.ts
├── prisma/
│   └── schema.prisma
├── .env
└── .env.test
```

## Getting Started

### Prerequisites
- Node.js 20
- PostgreSQL
- npm

### Installation
```bash
git clone https://github.com/DeepakSutradhar26/Finance-Backend.git

npm install

npx prisma generate

npm run dev
```

### Environment Variables
Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance"
JWT_SECRET="Your-Jwt-Secret"
```
Create a `.env.test` file in the root:
```env.test
DATABASE_URL="postgresql://user:password@localhost:5432/testing"
JWT_SECRET="Your-Testing-Jwt-Secret"
```

## Authentication
Authentication is done via JWT token stored in HTTP-only cookies. On login a signed token is assigned which contains user id and role. All routes use this token for authorization.

## Access Control

| Role    | Permissions                              |
|---------|------------------------------------------|
| Viewer  | View dashboard summary only              |
| Analyst | View records and access GraphQL insights |
| Admin   | Full access — manage users and records   |

Attempting to access a restricted route returns `403 Forbidden`.

## API Documentation
Full API documentation is available here:
[View API Docs](https://documenter.getpostman.com/view/34898486/2sBXiqF9D9)

## Data Models

**User**
| Field     | Type     | Description            |
|-----------|----------|------------------------|
| id        | String   | Unique identifier      |
| name      | String   | Full name              |
| email     | String   | Unique email address   |
| password  | String   | Hashed with bcryptjs   |
| role      | Enum     | Viewer, Analyst, Admin |
| isActive  | Boolean  | Account status         |
| createdAt | DateTime | Account creation date  |

**Record**
| Field       | Type     | Description           |
|-------------|----------|-----------------------|
| id          | String   | Unique identifier     |
| amount      | Int      | Transaction amount    |
| type        | Enum     | Income or Expense     |
| category    | String   | e.g. Food, Salary     |
| description | String   | Optional notes        |
| createdAt   | DateTime | Creation date         |
| updatedAt   | DateTime | Last updated date     |
| deletedAt   | DateTime | Soft delete timestamp |
| userId      | String   | Owner reference       |

## Dashboard Summary
Handled by graphql query `summary` present `in src/lib/queries`.

## Post, Update and Delete
Handled by Next.js APIs routes for simplicity.

## Assumptions
- A newly created user has `isActive` set to `false` by default and must be activated manually by an Admin.
- Soft delete is used for records. Deleted records are filtered out from all queries but remain in the database for audit purposes.
- Viewers can only access the dashboard summary and cannot view raw records or user data.
- JWT expiry is set to 1 days.

## Tradeoffs
- **In-memory rate limiting vs Redis:** In-memory makes the server statefull, but can be made stateless with using Redis.
- **GraphQL and REST coexist:** REST handles authentication and straightforward CRUD. GraphQL handles complex queries and dashboard aggregations.
- **Soft deletes over hard deletes:** Preserves data history which is important for financial records and auditing.
- **HTTP-only cookies over Authorization headers:** Prevents XSS attacks from accessing the token via JavaScript.