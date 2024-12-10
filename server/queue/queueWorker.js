const jobQueue = require('./exports/queue'); // Import the queue
const { AdminController } = require('../controllers/AdminController'); // Import the controller

// Process the job
jobQueue.process(async (job) => {
    try {
        const { controllerMethod, payload } = job.data;

        // Dynamically call the appropriate method from the AdminController
        if (controllerMethod && typeof controllerMethod === 'function') {
            await controllerMethod(payload);
        } else {
            console.error('Invalid controllerMethod');
        }
    } catch (error) {
        console.error('Error processing job:', error);
    }
});

module.exports = jobQueue;
