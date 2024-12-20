import ColorSettings from '../../../Components/TodosPage/Components/Admin/Colors/changeColors';
import AdminPage from '../../../Components/TodosPage/Components/Admin';
import React from 'react';
import { Roles } from '../../../api/Providers/interfaces/interfaces';
import TodoItem from "../../../Components/TodosPage/Components/TodoItem";
import {MapTodos} from "../../../Components/TodosPage/Components/Admin/Todos/mapTodos";
interface RouteDefinition {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
    protected?: boolean;
    protectedRole?: Roles;
    children?: RouteDefinition[];
    globalToastMessages?: boolean;
}

interface adminRoutes {
    [key: string]: RouteDefinition[];
}

const defaultRequiredRole: Roles = Roles.ADMIN;

export const adminRoutes: adminRoutes = {
    main: [
        {
            path: '/admin',
            component: AdminPage,
            protected: true,
            exact: true,
            protectedRole: Roles.ADMIN,
            children: [
                {
                    path: 'colors',
                    component: ColorSettings,
                    protected: true,
                    protectedRole: Roles.ADMIN,
                },
                {
                    path: 'users',
                    component: ColorSettings,
                    protected: true,
                    protectedRole: Roles.ADMIN,
                },
                {
                    path: 'todos',
                    component: MapTodos,
                    protected: true,
                    protectedRole: Roles.ADMIN,
                },
            ],
        },
    ].map(route => ({
        ...route,
        requiredRole: route.protectedRole || defaultRequiredRole,
    })),
};
