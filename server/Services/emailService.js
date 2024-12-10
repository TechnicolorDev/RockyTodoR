const nodemailer = require('nodemailer');
const jobQueue = require('../queue/exports/queue'); // Import the job queue
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Set up the email transporter with environment variables
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify the transporter setup
transporter.verify((error, success) => {
    if (error) {
        console.error(chalk.red('Error setting up email transporter:', error));
    } else {
        console.log(chalk.green('Email transporter is ready!'));
    }
});

// Function to send email directly via the transporter
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"No-Reply" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // subject line
            text, // plain text body
            html, // html body
        });

        console.log(chalk.green(`✔️ Email sent to ${to}: ${info.messageId}`));
    } catch (error) {
        console.error(chalk.red(`❌ Failed to send email to ${to}: ${error.message}`));
        throw error;
    }
};

// Queue processing for sending emails
jobQueue.process('sendEmail', async (job) => {
    const { to, subject, resetLink } = job.data;

    // Read the HTML template from the file
    const templatePath = path.resolve(__dirname, '../Templates/email-template.html');

    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Replace the placeholder with the actual reset link
    htmlContent = htmlContent.replace('{{resetLink}}', resetLink);

    // Define the plain-text version of the email
    const textContent = `You requested a password reset. Please click the following link to reset your password: ${resetLink}`;

    // Send the email with the HTML and plain text content
    await sendEmail(to, subject, textContent, htmlContent);
});

module.exports = { sendEmail, transporter };
