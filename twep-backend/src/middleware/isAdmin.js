const isAdmin = (req, res, next) => {
    // Check if the user has the admin role
    if (req.user && req.user.role === 'admin') {
        // If the user has the admin role, proceed to the next middleware
        return next();
    } else {
        // If the user does not have the admin role, return Forbidden response
        return res.status(403).json({ message: 'Forbidden - Insufficient privileges' });
    }
};
module.exports = isAdmin;
