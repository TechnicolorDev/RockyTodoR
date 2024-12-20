import Install from '../../../Components/Installer/Install';
import Login from '../../../Components/Login/Login';
import Todos from '../../../Components/TodosPage/Todos';
import TodoCreate from '../../../Components/TodosPage/Components/TodoCreate';
import EditTodo from '../../../Components/TodosPage/Components/EditTodo';
import ForgotPassword from '../../../Components/TodosPage/Components/Email/ResetPassword';
import ResetPassword from '../../../Components/TodosPage/Components/Email/UpdatePassword';
import ColorSettings from '../../../Components/TodosPage/Components/Admin/Colors/changeColors';
import { Roles } from '../../../api/Providers/interfaces/interfaces';
import React from "react";
import { ForbiddenPage } from "../../../errorpages/forbidden";

interface RouteDefinition {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
    protected?: boolean;
    requiredRole?: Roles;
    globalToastMessages?: boolean;  // New property to control toasts for specific routes
}
const defaultRequiredRole: Roles = Roles.USER;
interface todoRoutes {
    [key: string]: RouteDefinition[];
}

export const todoRoutes: todoRoutes = {
    main: [
        {
            path: "/",
            component: Todos,
            protected: true,
            requiredRole: Roles.USER,
            globalToastMessages: true,
            exact: true,
        },
        {
            path: "/forbidden",
            component: ForbiddenPage,
            protected: true,
            globalToastMessages: true, // This will show the toast message on this route
            exact: true,
        },
        {
            path: '/todos/create',
            component: TodoCreate,
            globalToastMessages: true,
            protected: true,
        },
        {
            path: '/login',
            component: Login,
            protected: false,
            globalToastMessages: true,
        },
        {
            path: '/install',
            component: Install,
            protected: false,
            globalToastMessages: true,
        },
        {
            path: '/todos/edit/:id',
            component: EditTodo,
            protected: true,
            globalToastMessages: true,
        },
        {
            path: '/forgot-password',
            component: ForgotPassword,
            protected: false,
            globalToastMessages: true
        },
        {
            path: '/reset-password',
            component: ResetPassword,
            protected: false,
            globalToastMessages: true
        },
    ].map(route => ({
        ...route,
        requiredRole: route.requiredRole || defaultRequiredRole,
    })),
};
