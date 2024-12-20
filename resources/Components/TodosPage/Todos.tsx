import React, { useEffect, useState } from 'react';
import { fetchTodos } from '../../api/api';
import TodoItem from './Components/TodoItem';
import { useNavigate } from 'react-router-dom';
import '../../scss/App.scss';
import LoadedAnimation from "../../Loader/Animations/LoadedAnimation";
import LogoutButton from "./buttons/LogoutButton";
import {ToastContainer} from "react-toastify";

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
        <>
            <ToastContainer ></ToastContainer>
        <div className="todos">
            <LogoutButton></LogoutButton>
            <LoadedAnimation>
            <h1 className="todo-list-h1">Todo List</h1>
            </LoadedAnimation >
            {todos.length === 0 && <p className="todo-list-p1">No todos found, please add some!</p>}
            <button onClick={() => navigate('/todos/create')} className="todo-list-btn">Create Todo</button>
            <LoadedAnimation>
            <div className="todo-list">
                {todos.map((todo) => (
                    <TodoItem key={todo.todoId} todo={todo} />
                ))}
            </div>
            </LoadedAnimation>
        </div>
        </>
    );
};

export default Todos;
