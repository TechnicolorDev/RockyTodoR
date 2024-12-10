const express = require('express');
const session = require('express-session');
const crypto = require('crypto');  // Import the crypto module
const { initDB } = require('./database/database');
const todoRoutes = require('./routers/todoRoutes');
const installRoutes = require('./routers/todoRoutes');
const loginRoutes = require('./routers/todoRoutes');
const cors = require("cors");
const chalk = require('chalk');


const app = express();
const PORT = 3000;

const generateSessionSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

const sessionSecret = generateSessionSecret();

app.use(express.json());
const corsOptions = {
    origin: process.env.APP_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

app.use(installRoutes);
app.use(loginRoutes);
app.use(todoRoutes);

console.log()

console.log(chalk.bold.gray(""));
console.log(chalk.bold.green("                         Simple daemon"));
console.log(chalk.gray("                          By Tomaxkz"));
console.log(chalk.bold.gray(""));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
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
                    console.log("")
                    console.log(chalk.green( '      Rocky is ready for tasking!'));
                }, 0);
            }

            i++;
        }, 0);
    }, 2000);
};

wingedMessage();
