# Backend Development Instructions (KLMS)

Build production-grade APIs using **Hono + PostgreSQL + Drizzle ORM and PNPM**.

## Core Principles

* Keep architecture simple, modular, and scalable.
* Optimize for **O(1)** lookups and avoid unnecessary **O(n)** operations.
* Minimize memory allocations and database round trips.
* Write clean, maintainable, strongly typed TypeScript.
* Prefer composition over abstraction.

## Project Structure

* Feature-based modules.
* Separate: routes, controllers, services, repositories, validation, middleware, db.
* Business logic never belongs in routes.
* Database access only through repositories.

## Database

* Use Drizzle ORM with migrations.
* Normalize schema unless denormalization has measurable benefits.
* Create indexes for frequently filtered, sorted and joined columns.
* Never use `SELECT *`.
* Fetch only required columns.
* Use transactions for multi-step writes.
* Prevent N+1 queries.
* Prefer cursor pagination over offset pagination.

## API Design

* RESTful endpoints.
* Consistent response format.
* Proper HTTP status codes.
* Validate every request using Zod.
* Never trust client input.
* Return meaningful error messages.

## Performance

* Batch queries whenever possible.
* Avoid duplicate database calls.
* Use Promise.all only for independent operations.
* Cache expensive reads when appropriate.
* Stream large responses instead of loading everything into memory.
* Handle uploads efficiently without buffering entire files.

## Security

* JWT authentication.
* Role-based authorization.
* Passwords hashed with Argon2.
* Rate limiting.
* CORS configured correctly.
* Parameterized queries only.
* Environment variables for secrets.

## Code Quality

* Follow SOLID where it improves clarity.
* Small reusable functions.
* Avoid code duplication.
* No magic strings or numbers.
* Strict TypeScript.
* Consistent naming.

## Logging & Monitoring

* Structured logging.
* Global error handler.
* Request IDs for tracing.
* Never expose internal errors to clients.

## Scalability

* Stateless API.
* Ready for horizontal scaling.
* Background jobs for long-running tasks.
* Design APIs to support millions of requests.
* Keep services independently testable.

## Every Feature Must Include

* Route
* Controller
* Service
* Repository
* Validation
* Migration (if required)
* Error handling
* Unit-testable business logic

Always choose the solution with the best balance of readability, maintainability, time complexity, space complexity, and scalability. Do not over-engineer.
