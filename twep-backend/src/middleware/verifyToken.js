// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    // Check if a token is provided
    if (!authHeader) {
        // If no token is provided, return Unauthorized response
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    // Check if a token is present after extraction
    if (!token) {
        // If no token is provided, return Unauthorized response
        return res.status(401).json({ message: 'Unauthorized - Invalid token format' });
    }

    // Verify the token using the provided secret
    jwt.verify(token, 'your-jwt-secret', (err, user) => {
        // Check for errors during token verification
        if (err) {
            // If the token is invalid, return Forbidden response
            return res.status(403).json({ message: 'Forbidden - Invalid token' });
        }

        // Attach the user information to the request object for future use
        req.user = user;

        // Call the next middleware function in the stack
        next();
    });
};

// Export the middleware function for use in other files
module.exports = verifyToken;
