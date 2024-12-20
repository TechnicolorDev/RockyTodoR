const nodemailer = require('nodemailer');
const jobQueue = require('../queue/exports/queue'); // Import the job queue
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error(chalk.red('Error setting up email transporter:', error));
    } else {
        console.log(chalk.green('Email transporter is ready!'));
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"No-Reply" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(chalk.green(`✔️ Email sent to ${to}: ${info.messageId}`));
    } catch (error) {
        console.error(chalk.red(`❌ Failed to send email to ${to}: ${error.message}`));
        throw error;
    }
};

jobQueue.process('sendEmail', async (job) => {
    const { to, subject, resetLink } = job.data;

    const templatePath = path.resolve(__dirname, '../Templates/email-template.html');

    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    htmlContent = htmlContent.replace('{{resetLink}}', resetLink);

    const textContent = `You requested a password reset. Please click the following link to reset your password: ${resetLink}`;

    await sendEmail(to, subject, textContent, htmlContent);
});

module.exports = { sendEmail, transporter };
