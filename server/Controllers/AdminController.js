const jobQueue = require('../queue/exports/queue');
const bcrypt = require('bcrypt');
const { User } = require('./admin/user');  // Ensure Role is correctly imported
const { Role } = require('./admin/roles');  // Ensure Role is correctly imported
const chalk = require('chalk');
const jwt = require('jsonwebtoken');

class AdminController {
    static async install(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: "All fields are required." });
            }

            const existingAdmin = await User.findOne({ where: { email } });
            if (existingAdmin) {
                return res.status(400).json({ error: "Admin already exists" });
            }

            const job = await jobQueue.add('createAdminJob', {
                name, adminEmail: email, adminPassword: password
            });

            console.log(chalk.yellow(`Job #${job.id} started for creating admin with email: ${email}`));

            job.finished().then(() => {
                console.log(chalk.green(`✔️ Job #${job.id} completed successfully! Admin created for email: ${email}`));
            }).catch((err) => {
                console.error(chalk.red(`❌ Job #${job.id} failed: ${err.message}`));
            });

            res.status(202).json({ message: "Admin account creation is in progress." });

        } catch (error) {
            console.error("Error setting up admin:", error);
            res.status(500).json({ error: "Failed to setup admin." });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Check if email and password are provided
            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required!" });
            }

            // Add login job to queue
            const job = await jobQueue.add('processLoginJob', { email });

            console.log(chalk.yellow(`Job #${job.id} started for login for email: ${email}`));

            // Find user and include the associated role
            const user = await User.findOne({
                where: { email: email.trim() },
                include: {
                    model: Role,
                    as: 'Role',
                },
            });

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials!" });
            }

            // Compare entered password with stored hash
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: "Invalid credentials!" });
            }

            // Create a JWT token
            const payload = {
                userId: user.userId,
                role: user.Role.name,  // Assuming `role` is a field from the Role model
            };

            // Generate the token with an expiry of 24 hours
            const token = jwt.sign(payload, process.env.APP_KEY, { expiresIn: '24h' });

            // Set the token in an HttpOnly cookie for security (it can't be accessed via JavaScript)
            res.cookie('token', token, {
                httpOnly: true,  // Cannot be accessed by JavaScript
                secure: false,   // Only for HTTPS; set to `false` for local development
                sameSite: 'Lax', // Works with most same-origin use cases
            });

            // Finish the login job after creating the token
            job.finished().then(() => {
                console.log(chalk.green(`✔️ Job #${job.id} completed successfully! Login for email: ${email}`));
            }).catch((err) => {
                console.error(chalk.red(`❌ Job #${job.id} failed: ${err.message}`));
            });

            return res.status(200).json({
                message: "Login successful",
                userId: user.userId,
                role: user.Role.name,
            });

        } catch (error) {
            console.error(chalk.red("Error during login", error));
            return res.status(500).json({ error: "Login failed" });
        }
    }

    static async checkLogin(req, res) {
        try {
            const token = req.cookies?.token;

            if (!token) {
                return res.status(202).json({
                    status: 401,
                    message: "No valid session, please log in.",
                    isLoggedOutOrNeverLoggedIn: true,
                });
            }

            // Token exists, verify it
            const decoded = await jwt.verify(token, process.env.APP_KEY);

            // Add checkLogin job to the queue
            const job = await jobQueue.add('checkLoginJob', { userId: decoded.userId });

            console.log(chalk.yellow(`Job #${job.id} started to verify login for userId: ${decoded.userId}`));

            // Return a success response with the decoded user information
            job.finished().then(() => {
                console.log(chalk.green(`✔️ Job #${job.id} completed successfully! User logged in: ${decoded.userId}`));
            }).catch((err) => {
                console.error(chalk.red(`❌ Job #${job.id} failed: ${err.message}`));
            });

            return res.status(200).json({
                status: 200,
                message: "User is logged in",
                userId: decoded.userId,
                role: decoded.role,
                isLoggedIn: true,
            });
        } catch (error) {
            // Centralized 401 error response for invalid/expired tokens
            const handle401Error = (message) => {
                return res.status(401).json({
                    status: 401,
                    message,
                    isLoggedIn: false,
                });
            };

            // Handle specific JWT errors
            if (error.name === "JsonWebTokenError") {
                return handle401Error("Invalid token. Please log in again.");
            }
            if (error.name === "TokenExpiredError") {
                return handle401Error("Token expired. Please log in again.");
            }

            // Handle unexpected errors
            console.error(chalk.red("Unexpected error in checkLogin:", error));
            return res.status(500).json({
                status: 500,
                message: "An error occurred while checking login status. Please try again later.",
            });
        }
    }

    static async logOut(req, res) {
        try {
            // Clear the HTTP-only cookie for the token
            res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            // Set a logout timestamp cookie that the backend can check
            res.cookie('loggedOutAt', new Date().toISOString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            // Add logout job to the queue
            const job = await jobQueue.add('logoutJob', { userId: req.userId });

            console.log(chalk.yellow(`Job #${job.id} started for logout for userId: ${req.userId}`));

            // Send a response indicating that logout was successful
            res.json({ message: 'Logged out successfully' });

            job.finished().then(() => {
                console.log(chalk.green(`✔️ Job #${job.id} completed successfully! Logout for userId: ${req.userId}`));
            }).catch((err) => {
                console.error(chalk.red(`❌ Job #${job.id} failed: ${err.message}`));
            });

        } catch (error) {
            console.error(chalk.red("Error during logout", error));
            res.status(500).json({ message: 'Logout failed' });
        }
    }

}

jobQueue.process('createAdminJob', async (job) => {
    const { name, adminEmail, adminPassword } = job.data;
    try {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = await User.create({ name, email: adminEmail, password: hashedPassword });
        console.log(chalk.green(`✔️ Admin created with ID: ${admin.id}`));
    } catch (err) {
        console.error(chalk.red(`❌ Failed to create admin: ${err.message}`));
        throw err;
    }
});

jobQueue.process('processLoginJob', async (job) => {
    const { email } = job.data;

    try {
        console.log(chalk.green(`✔️ Processing login for email: ${email}`));
        // Additional login logic (e.g., logging user activities)
    } catch (err) {
        console.error(chalk.red(`❌ Failed to process login for ${email}: ${err.message}`));
        throw err;
    }
});

let processingJobs = {};

jobQueue.process('checkLoginJob', async (job) => {
    const { userId } = job.data;

    // Prevent adding duplicate jobs for the same user
    if (processingJobs[userId]) {
        console.log(chalk.yellow(`Job already in progress for userId: ${userId}`));
        return;
    }

    try {
        processingJobs[userId] = true;  // Mark the job as processing

        console.log(chalk.green(`✔️ Checking login status for userId: ${userId}`));

        // Logic to check if the user is still logged in
        // For example, check session status in the database

    } catch (err) {
        console.error(chalk.red(`❌ Failed to check login for userId: ${userId}: ${err.message}`));
        throw err;
    } finally {
        processingJobs[userId] = false;  // Mark job as finished
    }
});
jobQueue.process('logoutJob', async (job) => {
    const { userId } = job.data;

    try {
        console.log(chalk.green(`✔️ Logging out userId: ${userId}`));
        // Logic to log out the user, e.g., clearing sessions or logging activity
    } catch (err) {
        console.error(chalk.red(`❌ Failed to log out userId: ${userId}: ${err.message}`));
        throw err;
    }
});
module.exports = AdminController;
