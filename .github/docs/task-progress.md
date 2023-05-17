# Assignment Progress

This file tracks the progress of the assignment tasks.

## Backend Tasks

### API Design and Documentation

- [ ] Design the API and document it
  - [x] Create REST API
    - [x] Define API endpoints
    - [x] Document API using Swagger
    - [x] Generate Swagger documentation
  - [ ] ~~Create GraphQL API~~ tRPC 🥰
    - [ ] ~~Define GraphQL schema~~
    - [ ] ~~Add documentation comments to the schema~~
    - [ ] ~~Expose GraphiQL or GraphQL Playground~~

### Dockerization

- [x] Dockerize the app
  - [x] Create Dockerfile (There are things to improve)
  - [x] Create docker-compose file

### Authentication and User Management

- [x] Implement login `// NextAuth.js`
  - [x] Enable password-based login `CredentialsProvider`
- [x] Seed the database with user data `/prisma/seed.ts`

### Blog Post Management

- [x] Create CRUD functionality for blog posts (articles)
  - [x] Implement creation of articles
  - [x] Implement retrieval of articles
  - [x] Implement updating of articles
  - [x] Implement deletion of articles

### Comment Management

- [?] Add the possibility to add comments to articles
  - [x] Implement comment creation
  - [x] Implement comment retrieval
  - [?] Implement comment updating
  - [?] Implement comment deletion
  - [x] Add author, content, timestamp to comments
  - [x] Seed comments

### Comment Voting

- [ ] Add the possibility to vote on comments
  - [ ] Implement comment voting (+/-)
  - [ ] Identify votes by IP address

### Real-Time Functionality

- [x] Make commenting and voting real-time
  - [x] Implement ~~GraphQL~~ tRPC Subscriptions or WebSockets

### Testing

- [x] Test the code
  - [x] Write unit tests
  - [x] Optionally write integration and end-to-end tests (discussable 😂)

## Frontend Tasks

### Exercise Implementation

- [x] Check out the API documentation [here](link-to-api-docs)
- [x] Check out the WebSocket API [here](link-to-ws-api)
- [x] Implement wireframes:
  - [x] User Perspective:
    - [x] Article List
    - [x] Article View
    - [x] New Article View
    - [x] Add Comment functionality
    - [ ] Add Comment voting functionality
  - [x] Admin Perspective:
    - [x] Login Screen
    - [x] My Article List
    - [x] Article Detail View
