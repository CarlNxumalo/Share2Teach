// src/routes/api-docs/+server.js

import swaggerJsDoc from 'swagger-jsdoc';
import { json } from '@sveltejs/kit';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Share2Teach API',
            version: '1.0.0',
            description: 'API documentation for managing Share2Teach functionalities',
        },
        servers: [
            {
                url: process.env.API_BASE_URL || 'http://localhost:5173',
            },
        ],
    },
    apis: ['./src/routes/API/**/*.js'], // Adjust the path to your actual API files
};

// Generate Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// GET endpoint for serving Swagger JSON
export const GET = () => {
    return json(swaggerDocs); // Return the Swagger docs as JSON
};
