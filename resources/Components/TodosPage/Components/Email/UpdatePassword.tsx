import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../../../api/api';
import {toast} from "react-toastify";
import zxcvbn from 'zxcvbn';
import DOMPurify from "dompurify";
import * as stream from "node:stream";

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {
        if (!token) {
            toast.error('Invalid or missing token');
        }
    }, [token]);

    const isPasswordStrong = (password: string): boolean => {
        const result = zxcvbn(password)
        return result.score >= 3;
    };

    const sanitizeInput = (password: string): string => {
        return DOMPurify.sanitize(password) ;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');
        setMessage('');

        const sanitizedNewPassword = sanitizeInput(newPassword);
        const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

        if (sanitizedNewPassword.length < 5) {
            toast.error('Password must be at least 5 characters long.');
            setError('Password must be at least 5 characters long.');
            return;
        }

        if (!isPasswordStrong(sanitizedNewPassword)) {
            toast.error('Password is too weak. Please choose a stronger password.');
            setError('Password is too weak. Please choose a stronger password.');
            return;
        }

        if (sanitizedNewPassword !== sanitizedConfirmPassword) {
            toast.error('Passwords do not match.');
            setError('Passwords do not match.');
            return;
        }

        if (!token) {
            setError('Invalid token, please try again.');
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword(token, sanitizedNewPassword);
            toast.success(response.message || 'Password reset successfully!');
            navigate('/login');
        } catch (err: any) {
            console.error('Error details:', err);
            toast.error(err.response?.data?.error || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <h2 className="reset-password-h1">Reset Your Passwor</h2>
            {error && <p style={{ color: 'red' }}>{DOMPurify.sanitize(error)}</p>}
            {message && <p style={{ color: 'green' }}>{DOMPurify.sanitize(message)}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="reset-password-input"
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="reset-password-input"
                    />
                </div>
                <button type="submit" disabled={loading} className="reset-password-btn">
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;

