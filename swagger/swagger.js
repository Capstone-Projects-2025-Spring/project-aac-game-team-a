const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WebSocket API",
      version: "1.0.0",
      description: "WebSocket API documentation for the ACC drawing game \"Scribblers\"",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        DrawEvent: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
            color: { type: "string" },
          },
        },
        GuessEvent: {
          type: "object",
          properties: {
            playerId: { type: "string" },
            word: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./swagger.yaml"], // Adjust this path to match your project structure
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
