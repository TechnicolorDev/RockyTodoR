const Queue = require('bull');
const milliseconds = require('milliseconds');
require('dotenv').config();

const redisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_HOST && process.env.REDIS_HOST.startsWith('https://') ? { rejectUnauthorized: false } : undefined,
};

const scheduler = new Queue('schedulerQueue', {
    redis: redisOptions,
    defaultJobOptions: { repeat: { every: milliseconds.minutes(5) } },
});

const main = async () => {
    await scheduler.add({});
};

scheduler.process((_, done) => {
    console.log('Scheduled job executed');
    done();
});

main().catch((err) => console.error('Error initializing scheduler:', err));
