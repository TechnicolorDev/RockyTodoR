// EditTodo.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editTodo, fetchTodos, deleteTodo } from '../../../api/api';
import {toast} from "react-toastify";
import ConfirmationModal from '../Modals/ConfirmationModal';

interface Todo {
    name: string;
    description: string;
    dueDate: string;
    repoUrl: string;
}

const EditTodoForm = () => {
    const [todo, setTodo] = useState<Todo>({
        name: '',
        description: '',
        dueDate: '',
        repoUrl: '',
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchTodoDetails = async () => {
            if (!id) {
                console.error('Todo ID is missing');
                return;
            }

            try {
                const todos = await fetchTodos();
                const currentTodo = todos.find((todo) => todo.todoId === id);

                if (currentTodo) {
                    setTodo({
                        name: currentTodo.name,
                        description: currentTodo.description,
                        dueDate: new Date(currentTodo.dueDate).toISOString().slice(0, 10),
                        repoUrl: currentTodo.repoUrl,
                    });
                } else {
                    console.error('Todo not found');
                    toast.error("Todo not found!")
                }
            } catch (error) {
                console.error('Error fetching todo details:', error);
                toast.error("Error fetching todoId! Check console for more details")
            }
        };

        fetchTodoDetails();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTodo((prevTodo) => ({
            ...prevTodo,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        if (!id) {
            toast.error("Todo ID is missing.");
            return;
        }

        try {
            await deleteTodo(id);
            toast.success("Todo deleted successfully!");
            setIsModalOpen(false);
            navigate('/');
        } catch (error) {
            console.error("Error deleting todo:", error);
            toast.error("Failed to delete the todo.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id || !todo.name || !todo.description || !todo.dueDate || !todo.repoUrl) {
            console.error("Todo ID or data is missing.");
            toast.warning("Please fill out all fields.");
            return;
        }

        try {
            await editTodo(id, todo);
            toast.success("Todo updated successfully!")
            navigate('/');
        } catch (error) {
            console.error("Error editing todo:", error);
            toast.error("Failed to update the todo.");
        }
    };

    const openDeleteModal = () => {
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
        <form onSubmit={handleSubmit} className="edit-todo">
            <div>
                <h1 className="edit-todo-h1">Edit Todo</h1>
                <label className="edit-todo-label">Name</label>
                <input
                    type="text"
                    name="name"
                    value={todo.name}
                    onChange={handleInputChange}
                    className="edit-todo-input"
                />
            </div>
            <div>
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={todo.description}
                    onChange={handleInputChange}
                    className="edit-todo-input"
                />
            </div>
            <div>
                <label>Due Date</label>
                <input
                    type="date"
                    name="dueDate"
                    value={todo.dueDate}
                    onChange={handleInputChange}
                    className="edit-todo-input"
                />
            </div>
            <div>
                <label>Repo URL</label>
                <input
                    type="text"
                    name="repoUrl"
                    value={todo.repoUrl}
                    onChange={handleInputChange}
                    className="edit-todo-input"
                />
            </div>

            {error && <div className="error">{error}</div>}
            <button type="submit" className="edit-todo-btn">Update Todo</button>
            <button type="button" onClick={handleDelete}
                    className="edit-todo-delete">
                Delete Todo
            </button>
        </form>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this Todo?"
            />
            </>
    );
};

export default EditTodoForm;
