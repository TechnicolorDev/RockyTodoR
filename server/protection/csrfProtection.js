const csrf = require('csrf');
const csrfInstance = new csrf(); // Properly instantiate the csrf object

// Middleware to generate CSRF token
const generateCSRFToken = async (req, res, next) => {
    try {
        // Check if the session contains a valid csrfSecret, otherwise generate one
        let secret = req.session.csrfSecret;
        if (!secret) {
            secret = await csrfInstance.secret(); // Generate a new CSRF secret if not available
            req.session.csrfSecret = secret; // Store the secret in the session
        }

        // Create a CSRF token using the secret
        const csrfToken = csrfInstance.create(secret);
        res.locals.csrfToken = csrfToken; // Save the token for use in templates or response

        // Send the CSRF token in the response header
        res.setHeader('X-CSRF-Token', csrfToken);

        // Continue processing the request
        next();
    } catch (error) {
        console.error('Error generating CSRF token:', error);
        res.status(500).json({ error: 'Failed to generate CSRF token' });
    }
};

// Middleware to verify CSRF token
const verifyCSRFToken = (req, res, next) => {
    try {
        const csrfToken = req.header('X-CSRF-Token'); // Retrieve the CSRF token from the request header
        const secret = req.session.csrfSecret; // Retrieve the CSRF secret from the session

        if (!csrfToken || !secret || !csrfInstance.verify(secret, csrfToken)) {
            return res.status(403).json({ error: 'Invalid or missing CSRF token' });
        }

        // Continue processing the request if the token is valid
        next();
    } catch (error) {
        console.error('Error verifying CSRF token:', error);
        res.status(403).json({ error: 'Invalid CSRF token' });
    }
};

// Export the csrfInstance properly
module.exports = { generateCSRFToken, verifyCSRFToken, csrfInstance };
