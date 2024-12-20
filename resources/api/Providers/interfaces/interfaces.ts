export interface User {
    userId: string;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    message: string;
    userId: string;
    role: string;
    csrfToken?: string;
    token?: string;
    status?: string;
    isLoggedIn?: boolean;
    isLoggedOutOrNeverLoggedIn: boolean;
}

export interface Response {
    message: string;
    userId: string;
    role: string;
    status?: number;
}

export const Roles = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

export type Role = typeof Roles[keyof typeof Roles];
export type Roles = "admin" | "user";