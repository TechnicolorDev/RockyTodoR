require('dotenv').config(); // Load environment variables

const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const { initDB } = require('./database/database');
const todoRoutes = require('./routers/todoRoutes');
const cors = require("cors");
const chalk = require('chalk');
const path = require('path');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 6583;
const APP_URL = process.env.APP_URL;
const CORS_URL_1 = process.env.CORS_URL_1;

// Session secret generator
const generateSessionSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

const sessionSecret = generateSessionSecret();

// Middleware
app.use(express.json());
const corsOptions = {
    origin: (origin, callback) => {
        // Allow both APP_URL and CORS_URL_1 as valid origins
        if (origin === APP_URL || origin === CORS_URL_1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials to be sent
};
app.use(cors(corsOptions));

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` if using HTTPS in production
}));

// Serve static files from the React frontend
app.use(express.static(path.join(__dirname, '../public/assets')));

// API routes
app.use('/api', todoRoutes);

// Fallback route to serve the React app's `index.html` for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/assets', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on ${APP_URL}:${PORT}`);
    initDB();
});

// Winged message (custom message)
const wingedMessage = () => {
    const rocky = [
        '__________               __           ',
        '\\______   \\ ____   ____ |  | _____.__.',
        ' |       _//  _ \\_/ ___\\|  |/ <   |  |',
        ' |    |   (  <_> )  \\___|    < \\___  |',
        ' |____|_  /\\____/ \\___  >__|_ \\/ ____|',
        '        \\/            \\/     \\/\\/     '
    ];

    process.stdout.write('\x1B[2J\x1B[0f');

    setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
            console.log(chalk.green(rocky[i % rocky.length]));

            if (i === rocky.length - 1) {
                clearInterval(interval);
                setTimeout(() => {
                    console.log("");
                    console.log(chalk.green('      Rocky is ready for tasking!'));
                }, 0);
            }

            i++;
        }, 0);
    }, 2000);
};

wingedMessage();
