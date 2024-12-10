import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Install from './Components/Installer/Install';
import Login from './Components/Login/Login';
import Todos from './Components/TodosPage/Todos';
import ProtectedRoute from './Protector/ProtectRoute';  // Import ProtectedRoute component
import './scss/Edit.scss';
import TodoCreate from "./Components/TodosPage/Components/TodoCreate";
import EditTodo from "./Components/TodosPage/Components/EditTodo";
import ForgotPassword from './Components/TodosPage/Components/Email/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from "./Components/TodosPage/Components/Email/UpdatePassword";

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <ToastContainer
                    autoClose={5000}
                    position="top-right"
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Routes>
                    <Route path="/" element={<ProtectedRoute element={<Todos />} path="/" />} />
                    <Route path="/todos/create" element={<ProtectedRoute element={<TodoCreate />} path="/todos/create" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/install" element={<Install />} />
                    <Route path="/todos/edit/:id" element={<EditTodo />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* ProtectedRoute for /todos */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
