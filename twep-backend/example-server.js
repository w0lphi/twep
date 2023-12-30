const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./api-example.spec.json");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let port = 3000;
app.listen(port);
console.log("Server running at: http://localhost:" + port);
