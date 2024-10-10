const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const serverUrl = process.env.NODE_ENV === 'production' ? 'my-website-url.com' : "http://localhost:5001"

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Platform API',
      version: '1.0.0',
      description: 'API for managing events',
    },
    servers: [
      {
        url: serverUrl
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http', // Specifies that the authentication scheme is HTTP-based
            scheme: 'bearer', // Specifies that bearer tokens will be used
            bearerFormat: 'JWT', // Specifies that the tokens will be in JWT (JSON Web Token) format
          },
        },
      },
      security: [
        {
          bearerAuth: [], // Applies bearer token authentication to all routes by default
        },
      ],
  },
  apis: ['./routes/*.js', './models/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };
