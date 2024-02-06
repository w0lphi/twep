const jwt = require('jsonwebtoken');
const pool = require('../db');

const verifyToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    // Check if a token is provided
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    // Check if a token is present after extraction
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
    }

    // Verify the token using the provided secret
    jwt.verify(token, 'your-jwt-secret', async (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden - Invalid token' });
        }

        // Extract user ID from the decoded token
        const userId = decodedToken.userId;

        // Fetch additional user data (including roles) from the database
        try {
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

            if (user.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Attach user information (including roles) to the request object
            req.user = {
                userId: user.rows[0].id,
                email: user.rows[0].email,
                role: user.rows[0].role
                // Add other user properties as needed
            };

            // Call the next middleware function in the stack
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};

// Export the middleware function for use in other files
module.exports = verifyToken;
