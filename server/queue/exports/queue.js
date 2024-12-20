const Bull = require('bull');
require('dotenv').config();
const chalk = require('chalk');
const moment = require('moment-timezone');

const timezone = process.env.TIMEZONE || 'UTC';

const isSSL = process.env.REDIS_PORT === '6379' && process.env.REDIS_HOST.includes('upstash.io');

const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: isSSL ? { rejectUnauthorized: false } : undefined,
};

const jobQueue = new Bull('jobQueue', { redis: redisOptions });

const logConnectionStatus = (message, success) => {
    const color = success ? chalk.green : chalk.red;
    const checkmark = success ? '✔️' : '❌';
    console.log(`${color(checkmark)} ${message}`);
};

jobQueue.client.on('connect', () => {
    logConnectionStatus('Successfully connected to Redis! 🎉', true);
    console.log(chalk.green('Job queue is now processing jobs...'));
});

jobQueue.on('ready', () => {
    console.log(chalk.green('Redis connection is ready.'));
});

jobQueue.on('error', (error) => {
    logConnectionStatus('Failed to connect to Redis. Please check your configuration.', false);
    console.error(chalk.red(`Error: ${error.message}`));
});

jobQueue.on('active', (job) => {
    const currentTimeInZone = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.yellow(`Processing job ${job.id}: ${job.name}... Current time in ${timezone}: ${currentTimeInZone}`));
});

jobQueue.on('completed', (job) => {
    const currentTimeInZone = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.green(`Job ${job.id} completed successfully at ${currentTimeInZone}!`));
});

jobQueue.on('failed', (job, err) => {
    const currentTimeInZone = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.red(`Job ${job.id} failed: ${err.message}. Failure time in ${timezone}: ${currentTimeInZone}`));
});

jobQueue.on('error', (error) => {
    console.error(chalk.red('Queue error:', error));
});

module.exports = jobQueue;
