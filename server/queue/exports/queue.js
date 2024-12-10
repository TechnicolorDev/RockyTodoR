const Bull = require('bull');
require('dotenv').config();
const chalk = require('chalk');
const moment = require('moment-timezone');

// Retrieve the timezone from .env
const timezone = process.env.TIMEZONE || 'UTC';  // Default to UTC if no timezone is set

// Define whether TLS is required based on Redis host configuration
const isSSL = process.env.REDIS_PORT === '6379' && process.env.REDIS_HOST.includes('upstash.io');

// Set up Redis connection options
const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: isSSL ? { rejectUnauthorized: false } : undefined,
};

const jobQueue = new Bull('jobQueue', { redis: redisOptions });

// Log connection status with checkmark on successful initialization
const logConnectionStatus = (message, success) => {
    const color = success ? chalk.green : chalk.red;
    const checkmark = success ? '✔️' : '❌';
    console.log(`${color(checkmark)} ${message}`);
};

// Listen for the 'open' event which indicates that the connection is established
jobQueue.client.on('connect', () => {
    logConnectionStatus('Successfully connected to Redis! 🎉', true);
    console.log(chalk.green('Job queue is now processing jobs...'));
});

// Monitor Redis connection
jobQueue.on('ready', () => {
    // You can keep the "ready" event to indicate that the queue is ready
    console.log(chalk.green('Redis connection is ready.'));
});

// Monitor errors
jobQueue.on('error', (error) => {
    logConnectionStatus('Failed to connect to Redis. Please check your configuration.', false);
    console.error(chalk.red(`Error: ${error.message}`));
});

// Monitor job events
jobQueue.on('active', (job) => {
    // Use the timezone to adjust job timestamps
    const currentTimeInZone = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.yellow(`Processing job ${job.id}: ${job.name}... Current time in ${timezone}: ${currentTimeInZone}`));
});

jobQueue.on('completed', (job) => {
    // Use the timezone to adjust job completion timestamps
    const currentTimeInZone = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.green(`Job ${job.id} completed successfully at ${currentTimeInZone}!`));
});

jobQueue.on('failed', (job, err) => {
    // Use the timezone to adjust failure timestamps
    const currentTimeInZone = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.red(`Job ${job.id} failed: ${err.message}. Failure time in ${timezone}: ${currentTimeInZone}`));
});

// Log queue error (No need to duplicate error handler)
jobQueue.on('error', (error) => {
    console.error(chalk.red('Queue error:', error));
});

module.exports = jobQueue;
