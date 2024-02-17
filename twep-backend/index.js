// index.js
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const cors = require('cors');


const app = express();
const pool = require('./src/db');

// Middleware
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true in production with HTTPS
}));
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Hello, this is your backend!');
});

// External Routes
const stationsRoutes = require('./src/routes/stationsRouter');
const usersRouter = require('./src/routes/usersRouter');

app.use('/management', stationsRoutes);
app.use('/users', usersRouter);

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
const { startScheduler } = require('./src/utility/scheduler');
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    startScheduler(1);
});

