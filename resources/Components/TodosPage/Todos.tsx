import React, { useEffect, useState } from 'react';
import { fetchTodos } from '../../api/api';
import TodoItem from './Components/TodoItem';
import { useNavigate } from 'react-router-dom';
import '../../scss/App.scss';

const Todos: React.FC = () => {
    const [todos, setTodos] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTodos = async () => {
            const fetchedTodos = await fetchTodos();
            setTodos(fetchedTodos);
        };
        loadTodos();
    }, []);

    return (
        <div className="todos">
            <h1 className="todo-list-h1">Todo List</h1>
            {todos.length === 0 && <p className="todo-list-p1">No todos found, please add some!</p>}
            <button onClick={() => navigate('/todos/create')} className="todo-list-btn">Create Todo</button>
            <div className="todo-list">
                {todos.map((todo) => (
                    <TodoItem key={todo.todoId} todo={todo} />
                ))}
            </div>
        </div>
    );
};

export default Todos;
