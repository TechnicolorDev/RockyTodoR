const bcrypt = require('bcrypt');
const { Admin } = require('../database/database');
const jobQueue = require('../queue/exports/queue');
const chalk = require('chalk');

// this is old implementation of queue worker on routes check docs for better instructions

class AdminController {
    static async install(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: "All fields are required." });
            }

            const existingAdmin = await Admin.findOne({ where: { email } });
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

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required!" });
            }

            const admin = await Admin.findOne({ where: { email } });
            if (!admin) {
                return res.status(401).json({ error: "Invalid credentials!" });
            }

            const match = await bcrypt.compare(password, admin.password);
            if (!match) {
                return res.status(401).json({ error: "Invalid credentials!" });
            }

            req.session.adminId = admin.id;

            const loginJob = await jobQueue.add('processLoginJob', {
                email, adminId: admin.id
            });

            console.log(chalk.yellow(`Job #${loginJob.id} started for processing login for admin: ${email}`));

            loginJob.finished().then(() => {
                console.log(chalk.green(`✔️ Job #${loginJob.id} completed successfully! Login processed for: ${email}`));
            }).catch((err) => {
                console.error(chalk.red(`❌ Job #${loginJob.id} failed: ${err.message}`));
            });

            res.status(200).json({
                message: "Login successful",
                adminId: admin.id,
            });

        } catch (error) {
            console.error("Error while logging in", error);
            res.status(500).json({ error: "Login failed" });
        }
    }
}

jobQueue.process('createAdminJob', async (job) => {
    const { name, adminEmail, adminPassword } = job.data;
    try {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = await Admin.create({ name, email: adminEmail, password: hashedPassword });
        console.log(chalk.green(`✔️ Admin created with ID: ${admin.id}`));
    } catch (err) {
        console.error(chalk.red(`❌ Failed to create admin: ${err.message}`));
        throw err;
    }
});

jobQueue.process('processLoginJob', async (job) => {
    const { email, adminId } = job.data;
    try {
        console.log(chalk.green(`✔️ Processing login for ${email} (Admin ID: ${adminId})`));
    } catch (err) {
        console.error(chalk.red(`❌ Failed to process login for ${email}: ${err.message}`));
        throw err;
    }
});

module.exports = AdminController;
