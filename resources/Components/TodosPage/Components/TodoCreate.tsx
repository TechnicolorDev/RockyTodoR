import React, { useState } from 'react';
import { createTodo } from '../../../api/api'; // Assuming the createTodo function is correctly handling the API call
import DOMPurify from 'dompurify';
import {useNavigate} from "react-router-dom";
import "../../../scss/create.scss";
import {ToastContainer} from "react-toastify";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TodoCreate: React.FC = () => {
    const navigate = useNavigate();
    const [todo, setTodo] = useState({
        name: '',
        description: '',
        dueDate: '',
        repoUrl: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodo({ ...todo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Sanitize the input before submitting
        const sanitizedTodo = {
            name: DOMPurify.sanitize(todo.name),
            description: DOMPurify.sanitize(todo.description),
            dueDate: DOMPurify.sanitize(todo.dueDate),
            repoUrl: DOMPurify.sanitize(todo.repoUrl),
        };

        try {
            const response = await createTodo(sanitizedTodo); // Call the API without todoId
            console.log('Todo created:', response);
            navigate('/');
            toast.success("Todo successfully created!")
        } catch (error) {
            toast.error('Failed to create todo, all fields are required');
            console.error('Failed to create todo:', error);
        }
    };

    return (
        <div className="todo-create">
            <h1 className="create-h1">Create Todo</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={todo.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={todo.description}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="dueDate"
                    value={todo.dueDate}
                    onChange={handleChange}
                />
                <input
                    type="url"
                    name="repoUrl"
                    placeholder="Repo URL"
                    value={todo.repoUrl}
                    onChange={handleChange}
                />
                <button type="submit" className="create-btn">Create Todo</button>
            </form>
        </div>
    );
};

export default TodoCreate;
