const Bull = require('bull');
const chalk = require('chalk');
const { program } = require('commander');
require('dotenv').config();

const Redis = require('ioredis');
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: 10000,
    keepAlive: 10000,
});


async function clearAllJobsDirectly() {
    try {
        console.log(chalk.blue('Cleaning up all jobs from Redis directly...'));

        const jobKeys = await redis.keys('bull:jobQueue:*');
        if (jobKeys.length > 0) {
            await redis.del(jobKeys);
            console.log(chalk.green(`${jobKeys.length} jobs have been removed directly from Redis.`));
        } else {
            console.log(chalk.yellow('No jobs found to delete.'));
        }

        console.log(chalk.green('Job cleanup complete.'));
    } catch (error) {
        console.error(chalk.red('Error during cleanup:'), error);
    }
}

program
    .command('redis:clear:cache')
    .description('Clear all jobs from Redis (regardless of status)')
    .action(clearAllJobsDirectly);

program.parse(process.argv);
