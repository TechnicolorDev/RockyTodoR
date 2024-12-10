import React from 'react';
import '../../../scss/App.scss';

interface Todo {
    id: number;
    name: string;
    dueDate: string;
    githubRepo: string;
    description: string;
    creationDate: string;
    priority: string;
}

interface TodoCardProps {
    todo: Todo;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
    return (
        <div className="todo-card">
            <h3>{todo.name}</h3>
            <p>Priority: {todo.priority}</p>
            <p>Due Date: {todo.dueDate}</p>
            <p>
                GitHub Repo:{' '}
                <a href={todo.githubRepo} target="_blank" rel="noopener noreferrer">
                    {todo.githubRepo}
                </a>
            </p>
            <p>{todo.description}</p>
            <p>Created on: {todo.creationDate}</p>
        </div>
    );
};

export default TodoCard;
