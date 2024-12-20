const csrf = require('csrf');
const csrfInstance = new csrf();

// Session-based CSRF Token generation
const sessionCSRFToken = async (req, res, next) => {
    try {
        let secret = req.session.csrfSecret;
        if (!secret) {
            // Generate a new CSRF secret for the session if one doesn't exist
            secret = await csrfInstance.secret();
            req.session.csrfSecret = secret;
        }

        // Generate CSRF Token
        const csrfToken = csrfInstance.create(secret);
        res.locals.csrfToken = csrfToken;

        // Log the CSRF token to the console only in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Generated Session CSRF Token:', csrfToken);
        }

        // Set the CSRF token in the response headers (not in cookies)
        res.setHeader('X-CSRF-Token', csrfToken);

        next();
    } catch (error) {
        console.error('Error generating session CSRF token:', error);
        res.status(500).json({ error: 'Failed to generate session CSRF token' });
    }
};

// Non-session-based CSRF Token generation
const nonSessionCSRFToken = async (req, res, next) => {
    try {
        // Generate a random CSRF secret that isn't stored in the session
        const secret = await csrfInstance.secret();

        // Generate CSRF Token
        const csrfToken = csrfInstance.create(secret);
        res.locals.csrfToken = csrfToken;

        // Log the CSRF token to the console only in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Generated Non-Session CSRF Token:', csrfToken);
        }

        // Set the CSRF token in the response headers (not in cookies)
        res.setHeader('X-CSRF-Token', csrfToken);

        next();
    } catch (error) {
        console.error('Error generating non-session CSRF token:', error);
        res.status(500).json({ error: 'Failed to generate non-session CSRF token' });
    }
};

// CSRF token verification (common for both session and non-session CSRF tokens)
const verifyCSRFToken = (req, res, next) => {
    try {
        // 1. Get the CSRF token from the request headers (can also use cookies or body if necessary)
        const csrfToken = req.header('X-CSRF-Token');  // Look for CSRF token in headers

        // 2. If no CSRF token is found in the request, reject the request
        if (!csrfToken) {
            return res.status(403).json({ error: 'CSRF token is missing' });  // Fail if CSRF token is missing
        }

        // 3. Get the CSRF secret (this could be stored in session or memory, depending on your setup)
        const secret = req.session.csrfSecret;  // Session-based CSRF secret

        // 4. If secret exists and CSRF token is provided, verify it
        if (secret && csrfInstance.verify(secret, csrfToken)) {
            return next();  // CSRF token verification passed (session-based)
        }

        // 5. If no session secret (non-session route), verify CSRF token directly
        if (!secret && csrfInstance.verify(secret, csrfToken)) {
            return next();  // CSRF token verification passed (non-session route)
        }

        // 6. If CSRF token verification fails, respond with an error
        return res.status(403).json({ error: 'Invalid CSRF token' });

    } catch (error) {
        console.error('Error verifying CSRF token:', error);
        return res.status(500).json({ error: 'Internal Server Error while verifying CSRF token' });
    }
};

module.exports = { sessionCSRFToken, nonSessionCSRFToken, verifyCSRFToken, csrfInstance };
