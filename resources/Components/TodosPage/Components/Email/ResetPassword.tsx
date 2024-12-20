import React, { useState } from 'react';
import { sendForgotPasswordEmailRequest } from '../../../../api/api';
import { toast } from 'react-toastify'; // Import your API call
import DOMPurify from 'dompurify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const sanitizeInput = (input: string): string => {
        return DOMPurify.sanitize(input);
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');
        setMessage('');

        const sanitizedEmail = sanitizeInput(email);

        if (!isValidEmail(sanitizedEmail)) {
            setError('Invalid email address.');
            toast.error('Invalid email address.');
            return;
        }

        try {
            const response = await sendForgotPasswordEmailRequest(sanitizedEmail);
            toast.success('If this email exists, a password reset link has been sent.');
            setMessage('Check your inbox for further instructions.');
        } catch (err) {
            toast.error('There was an error sending the password reset email.');
            setError('Failed to send the reset email. Please try again later.');
        }
    };

    return (
        <div className="forgot-password-div">
            <h2 className="forgot-password-h1">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="forgot-password-email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="forgot-password-email-input"
                    />
                </div>
                <button type="submit" className="forgot-password-submit">Send Password Reset Email</button>
            </form>

            {message && <p style={{ color: 'green' }}>{DOMPurify.sanitize(message)}</p>}
            {error && <p style={{ color: 'red' }}>{DOMPurify.sanitize(error)}</p>}
        </div>
    );
};

export default ForgotPassword;