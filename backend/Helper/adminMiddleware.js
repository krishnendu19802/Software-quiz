const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const adminMiddleware = (req, res, next) => {
    const hd = req.headers['authorization'];

    if (!hd) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const token=hd.split(' ')[1]
        // Verify the token using the secret from the .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is an admin
        if (decoded.admin !== 1) {
            return res.status(401).json({ error: 'Access denied. Admin privileges required.' });
        }

        // Attach user details to req.user
        req.user = decoded;
        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please login again.' });
        }
        return res.status(401).json({ error: 'Invalid token.' });
    }
}

module.exports = adminMiddleware;
