import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../../api/api'; // Use the login function from your API
import DOMPurify from 'dompurify'; // For sanitizing inputs
import '../../scss/App.scss';
import {ToastContainer} from "react-toastify";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {showToast} from "../../api/showToast";

// Define the form state type
interface LoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const navigate = useNavigate();

    // Sanitize inputs to prevent XSS
    const sanitizeInput = (input: string): string => {
        return DOMPurify.sanitize(input.trim());
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: sanitizeInput(e.target.value) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await login(form);

            // Save tokens
            if (result.csrfToken) {
                sessionStorage.setItem('csrfToken', result.csrfToken);
            }
            sessionStorage.setItem('adminId', result.adminId.toString());

            showToast('success', result.message || 'Login successful.');

            // Delay navigation to let the toast fully render
            setTimeout(() => {
                navigate('/');
            }, 100);
        } catch (error: any) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred.');
            }
        }
    };


    return (
        <>
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Log In</button>
            </form>
        </div>
        </>
    );
};

export default Login;
