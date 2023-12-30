const express = require('express');
const app = express();
const pool = require('./src/db');

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello, this is your backend!');
});

const stationsRoutes = require('./src/routes/stations');

app.use('/stations', stationsRoutes);


// Database Connection
pool.connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Unable to connect to the database', err);
    });

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
