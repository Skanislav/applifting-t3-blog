import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from './api/root';

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'Applifting Blog CRUD API',
    description: '☺️',
    version: '1.0.0',
    baseUrl: 'http://localhost:3000/api/rest',
    docsUrl: 'https://github.com/jlalmes/trpc-openapi',
    tags: ['auth', 'users', 'posts'],
});