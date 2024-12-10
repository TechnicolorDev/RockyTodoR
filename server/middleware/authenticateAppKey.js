require('dotenv').config();

const authenticateAppKey = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token !== process.env.APP_KEY) {
        return res.status(401).json({ error: 'Invalid or missing Bearer token.' });
    }

    next();
};

module.exports = authenticateAppKey;
