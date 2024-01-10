const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const pool = require('../db.js'); // Import the database connection pool

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.use(verifyToken); // Apply the middleware to all routes below this line

router.get('/profile', async (req, res) => {
    try {
        // Access user details from req.user (set in verifyToken middleware)
        const userId = req.user.userId;

        // Retrieve user details from the database using userId
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
