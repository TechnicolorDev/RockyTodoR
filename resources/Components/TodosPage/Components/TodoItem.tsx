import React from 'react';
import { useNavigate } from 'react-router-dom';

const TodoItem: React.FC<{ todo: any }> = ({ todo }) => {
    const navigate = useNavigate();

    const formattedDueDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(todo.dueDate));

    return (
        <div className="todo-item">
            <h3 className="todo-item-h3">{todo.name}</h3>
            <p className="todo-item-p1">{todo.description}</p>
            <p className="todo-item-p2">Due: {formattedDueDate}</p>
            <a href={todo.repoUrl} target="_blank" rel="noopener noreferrer" className="todo-item-p3">Repo</a>
            <button onClick={() => navigate(`/todos/edit/${todo.todoId}`)} className="todo-item-btn">Edit</button>
        </div>
    );
};

export default TodoItem;
