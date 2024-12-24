const jwt = require('jsonwebtoken');
const User = require("../models/user.js");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, "your_jwt_secret");

        const user = await User.findByPk(decoded.userId); // Adjust this for your ORM (e.g., Sequelize)

        if (!user) {
            // Block access if user doesn't exist
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = authMiddleware;
