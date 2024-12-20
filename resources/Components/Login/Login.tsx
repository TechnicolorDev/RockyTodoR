import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from "../../api/api";
import { LoginResponse } from "../../api/Providers/interfaces/interfaces";
import DOMPurify from 'dompurify';
import '../../scss/App.scss';
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadedAnimation from "../../Loader/Animations/LoadedAnimation";
import JumpIn from "../../Loader/Animations/JumpIn";
import LoadFromSideR from "../../Loader/Animations/LoadFromSideR";

const APP_NAME = process.env.APP_NAME;

interface LoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [loading, setLoading] = useState(false); // Track loading state
    const navigate = useNavigate();

    const sanitizeInput = (input: string): string => {
        return DOMPurify.sanitize(input.trim());
    };

    const validateForm = (form: LoginForm): boolean => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(form.email)) {
            toast.error('Invalid email format.');
            return false;
        }

        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return false;
        }

        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: sanitizeInput(e.target.value) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm(form)) {
            setLoading(false);
            return;
        }

        try {
            console.log('Attempting to log in with sanitized inputs:', form.email);

            const response = await login(form); // This is the async call

            console.log('Login response:', response);

            // Check if the status is 200 and response has the 'message' you expect
            if (response.message === "Login successful") {
                const toastId = "login-success-toast";

                // First, navigate
                setTimeout(() => {
                    navigate('/');
                    // After navigation, show the success toast
                    toast.success("Logged in successfully!", {
                        toastId,
                    });
                }, 100);  // Short delay to allow navigation before showing the toast
            } else {
                toast.error(response?.message || 'Invalid credentials.');
            }
        } catch (error: any) {
            console.error("Error logging in:", error);
            toast.error('Login failed. Ensure CSRF token is received.');
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };
    return (
        <>
            <div className="login-wrapper">
                <LoadedAnimation>
                    <div className="login">
                        <form onSubmit={handleSubmit}>
                            <JumpIn delay={200}>
                                <h1 className="text-login">Login | {APP_NAME}</h1>
                            </JumpIn>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="login-input"
                            />
                            <LoadFromSideR delay={550}>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="login-input"
                                />
                            </LoadFromSideR>
                            <JumpIn delay={700}>
                                <button type="submit" className="loginb-btn" disabled={loading}>Log In</button>
                            </JumpIn>
                        </form>
                    </div>
                </LoadedAnimation>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;
