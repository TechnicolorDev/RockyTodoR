require('dotenv').config(); // Load environment variables

const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const { initDB } = require('./database/database');
const todoRoutes = require('./routers/todoRoutes');
const cors = require("cors");
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL;
const CORS_URL_1 = process.env.CORS_URL_1;

dotenv.config();

app.use(cookieParser());
const generateSessionSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

const sessionSecret = generateSessionSecret();
app.use(cookieParser());

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3001',  // Allow the specific frontend origin
    credentials: true,  // Allow cookies and authentication headers
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['X-CSRF-Token', 'Access-Token', 'Uid'],
};

app.use(cors(corsOptions));



const isSecure = APP_URL.startsWith('https');

app.use(session({
    secret: sessionSecret,       // Session secret for signing the session ID cookie
    resave: false,               // Don't save the session if it wasn't modified
    saveUninitialized: true,     // Save a session that is new but not modified
    cookie: {
        secure: isSecure,        // Only use secure cookies if using https (production)
        httpOnly: true,          // Prevent JavaScript access to cookies
        maxAge: 1000 * 60 * 60,  // Set session cookie expiration to 1 hour
    },
}));
app.use(express.static(path.join(__dirname, '../public/assets')));

app.use('/api', todoRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/assets', 'index.html'));
});

console.log(`Session cookies 'secure' flag is set to: ${isSecure ? 'true (HTTPS)' : 'false (HTTP)'}`);


app.listen(PORT, () => {
    console.log(`Server running on ${APP_URL}:${PORT}`);
    initDB();
});

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
