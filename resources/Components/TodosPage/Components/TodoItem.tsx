import React from 'react';
import { useNavigate } from 'react-router-dom';
import JumpIn from "../../../Loader/Animations/JumpIn";
import SlideInL from "../../../Loader/Animations/LoadFromSideL";
import LoadedAnimation from "../../../Loader/Animations/LoadedAnimation";

const TodoItem: React.FC<{ todo: any }> = ({ todo }) => {
    const navigate = useNavigate();

    const formattedDueDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(todo.dueDate));

    return (
        <div className="todo-item">
            <JumpIn delay={100}>
            <h3 className="todo-item-h3">{todo.name}</h3>
            </JumpIn>
            <SlideInL delay={200}>
            <p className="todo-item-p1">{todo.description}</p>
            </SlideInL>
            <SlideInL delay={300}>
            <p className="todo-item-p2">Due: {formattedDueDate}</p>
            </SlideInL>
            <LoadedAnimation flexDirection="column" displayOpt="flex">
            <a href={todo.repoUrl} target="_blank" rel="noopener noreferrer" className="todo-item-p3">Repo</a>
            <button onClick={() => navigate(`/todos/edit/${todo.todoId}`)} className="todo-item-btn">Edit</button>
            </LoadedAnimation>
        </div>
    );
};

export default TodoItem;
