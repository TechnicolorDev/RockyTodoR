const Bull = require('bull');
const chalk = require('chalk');
const { program } = require('commander');
require('dotenv').config();

// Set up Redis connection options
const Redis = require('ioredis');
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: 10000,  // 10 seconds timeout for the connection
    keepAlive: 10000,       // Keep the connection alive for 10 seconds
});


async function clearAllJobsDirectly() {
    try {
        console.log(chalk.blue('Cleaning up all jobs from Redis directly...'));

        // Delete job keys directly from Redis
        const jobKeys = await redis.keys('bull:jobQueue:*');
        if (jobKeys.length > 0) {
            await redis.del(jobKeys);  // Deleting job keys directly
            console.log(chalk.green(`${jobKeys.length} jobs have been removed directly from Redis.`));
        } else {
            console.log(chalk.yellow('No jobs found to delete.'));
        }

        console.log(chalk.green('Job cleanup complete.'));
    } catch (error) {
        console.error(chalk.red('Error during cleanup:'), error);
    }
}

// Define the command using commander
program
    .command('redis:clear:cache')
    .description('Clear all jobs from Redis (regardless of status)')
    .action(clearAllJobsDirectly); // Reference the correct function here

// Parse command line arguments
program.parse(process.argv);
