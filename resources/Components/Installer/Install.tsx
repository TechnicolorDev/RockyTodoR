import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { installAdmin } from '../../api/api';
import '../../scss/App.scss';
import DOMPurify from "dompurify";
import {toast} from "react-toastify";

const Install: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const sanitizeInput = (input: string): string => {
        return DOMPurify.sanitize(input);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setForm({ ...form, [e.target.name]: sanitizedValue });
    };

    const validatePassword = (password: string): boolean => {
        const commonPasswords = [
            '123456', 'password', '123456789', '12345', '1234', 'qwerty', 'abc123',
            'password1', 'letmein', 'monkey', '123123'
        ];
        if (password.length < 5) {
            toast.error('Password must be at least 5 characters long.');
            return false;
        }
        if (commonPasswords.includes(password)) {
            toast.error('Password is too common. Please choose a stronger password.');
            return false;
        }
        return true;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.error(null);

        const sanitizedName = sanitizeInput(form.name);
        const sanitizedEmail = sanitizeInput(form.email);
        const sanitizedPassword = sanitizeInput(form.password);

        if (!validatePassword(sanitizedPassword)) {
            return;
        }

        try {
            await installAdmin({ name: sanitizedName, email: sanitizedEmail, password: sanitizedPassword });
            toast.success('You are all set! Get to work.');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to create admin: ' + error);
        }
    };

    return (
        <div className="install">
            <h1>Admin Setup</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Setup Admin</button>
            </form>
        </div>
    );
};

export default Install;
