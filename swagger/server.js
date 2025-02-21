const express = require("express");
const app = express();
const swaggerDocs = require("./swagger");

swaggerDocs(app); // Load Swagger documentation

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));