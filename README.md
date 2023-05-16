# AppLifting Full-Stack Test Assignment

[![🚀 Feature PR and Main Checks](https://github.com/Skanislav/applifting-t3-blog/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/Skanislav/applifting-t3-blog/actions/workflows/pr-checks.yml)

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Context

- https://github.com/Applifting/fullstack-exercise

## Used Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)
- [Jest](https://jestjs.io)
- [Zod](https://zod.dev)

# Useful

## How to run

- `yarn install`
- `yarn start`
- `yarn test`

## Migrations

### Create migration

- `yarn prisma migrate dev --name <migration-name>`

### Run migrations

- `yarn prisma migrate dev`

### Pre-Commit Hook

- `yarn husky install`

### Generate Prisma Client

- `yarn prisma generate`

### Database Management

- `yarn prisma studio`

# Application Structure

- `/pages` - Next.js pages
- `/components` - Reusable components
- `/lib` - Business logic
- `/prisma` - Prisma schema and migrations
- `/src/pages/api` - Next API Router endpoints
- `/src/server/api` - API endpoints
- `/src/server/repository` - Repository layer
- `/src/server/context` - Context layer used by tRPC and across the App

# Links

- [DevServer](http://localhost:3000)
- [Dashboard](http://localhost:3000/dashboard)
- [Prisma Studio](http://localhost:5555)
