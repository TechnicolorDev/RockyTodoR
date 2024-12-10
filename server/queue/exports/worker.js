const jobQueue = require('./queue');

jobQueue.process('createAdmin', async (job) => {
    const { name, email, password } = job.data;
    console.log(`Creating admin with name: ${name}, email: ${email}`);
    return `Admin ${name} created!`;
});

jobQueue.process('postLogin', async (job) => {
    const { email } = job.data;
    console.log(`Processing post-login tasks for email: ${email}`);
    return `Post-login processing complete for ${email}`;
});
