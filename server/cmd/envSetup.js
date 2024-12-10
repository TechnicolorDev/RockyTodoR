/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                     !CAUTION WARNING!                                           //
//                   This script is responsible for setting up environment variables for           //
//                Pterodactyl setup including App URL, Timezone, Database, and other variables.    //
//                         Writing values to .env as appropriate                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const prompts = require('prompts');
const momentTimezone = require('moment-timezone');

const envPath = path.join(__dirname, '../../.env');

function readEnvFile() {
    if (!fs.existsSync(envPath)) {
        return {};
    }
    const content = fs.readFileSync(envPath, 'utf-8');
    const envObject = {};
    content.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
            envObject[key.trim()] = value.trim();
        }
    });
    return envObject;
}

function writeEnvFile(envObject) {
    const content = Object.entries(envObject)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    fs.writeFileSync(envPath, content, "utf-8");
}

async function setupPterodactylEnv() {
    const timezones = momentTimezone.tz.names().map((zone) => ({ title: zone, value: zone }));
    const response = await prompts([
        {
            type: 'text',
            name: 'appUrl',
            message: 'Enter your App URL:',
            initial: 'http://localhost',
        },
        {
            type: 'select',
            name: 'timezone',
            message: 'Choose your timezone:',
            choices: timezones,
            initial: 0,
        },
        {
            type: 'select',
            name: 'dbType',
            message: 'Choose your database type (currently only SQLite supported):',
            choices: [
                { title: 'SQLite', value: 'sqlite' },
            ],
            initial: 0,
        },
        {
            type: 'text',
            name: 'RedisHost',
            message: 'Enter the Redis Host for QueueWorker:',
            initial: 'localhost',
        },
        {
            type: 'text',
            name: 'RedisPort',
            message: 'Enter the Redis Port for QueueWorker:',
            initial: '6379',
        },
        {
            type: 'text',
            name: 'RedisPassword',
            message: 'Enter the Redis Password for QueueWorker:',
            initial: '',
        },
        {
            type: 'confirm',
            name: 'soon4',
            message: 'Do you want to enable Soon-4 feature?',
            initial: false,
        },
        {
            type: 'confirm',
            name: 'soon5',
            message: 'Do you want to enable Soon-5 feature?',
            initial: false,
        }
    ]);

    const env = readEnvFile();

    env.APP_URL = response.appUrl;
    env.TIMEZONE = response.timezone;
    env.DATABASE_TYPE = response.dbType;

    env.REDIS_HOST = response.RedisHost;
    env.REDIS_PORT = response.RedisPort;
    env.REDIS_PASSWORD = response.RedisPassword;

    env['soon-4'] = response.soon4 ? 'true' : 'false';
    env['soon-5'] = response.soon5 ? 'true' : 'false';

    writeEnvFile(env);

    console.log(chalk.green('The .env file has been updated with the new settings!'));
}

setupPterodactylEnv().catch((error) => {
    console.error(chalk.red('Error during environment setup:'), error);
});
