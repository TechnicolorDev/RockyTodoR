import axios, { AxiosError, AxiosResponse } from 'axios';
import {LoginResponse} from "./Providers/interfaces/interfaces";


// Ensure CSRF token is sent with every request
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.APP_URL; // Assuming the backend runs on localhost:3000
const APP_NAME = process.env.APP_NAME;

const APP_URL = process.env.APP_URL || "https://your-production-url.com";
const API_BASE = "api";
const API_KEY = process.env.APP_KEY;

const dev_url = "http://localhot"


const getCSRFToken = () => localStorage.getItem(`${APP_NAME}-session-csrfToken`);  // Retrieve token from localStorage

// Add CSRF token to every outgoing request using Axios interceptors

const addCSRFTokenHeader = (config: any) => {
    const csrfToken = getCSRFToken(); // Get CSRF token from localStorage or cookies
    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken; // Attach CSRF token for protection
    }
    config.headers['Authorization'] = `Bearer ${API_KEY}`; // Add Authorization token
    return config;
};


// Define types for data structures used
interface Todo {
    todoId?: string;  // Make todoId optional for creation
    name: string;
    description: string;
    dueDate: string;
    repoUrl: string;
    creationDate?: string;  // Optional for existing todos
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface InstallAdminData {
    name: string;
    email: string;
    password: string;
}

export const installAdmin = (data: InstallAdminData) => {
    const csrfToken = getCSRFToken();
    const authorizationToken = `Bearer ${API_KEY}`;

    // Log to see the token and request details
    console.log('Making POST request to install admin');
    console.log('CSRF Token:', csrfToken);
    console.log('Authorization Token:', authorizationToken);
    console.log('Request Data:', data);

    // Ensure API_KEY is set before making the request
    if (!API_KEY) {
        console.error('Authorization token is missing!');
        return Promise.reject(new Error('Authorization token is missing!'));
    }

    return axios.post(
        `${API_BASE}/install`,  // Make sure this is the correct URL
        data,
        {
            headers: {// Include Bearer token in headers
                'X-CSRF-Token': csrfToken,             // Optional CSRF token header
                'Content-Type': 'application/json',
            }
        }
    )
        .then(response => {
            console.log('Response:', response);  // Log response if successful
            return response;
        })
        .catch(error => {
            // Log error to debug
            console.error('Error occurred during installation:', error);

            // Check if error response exists to log details
            if (error.response) {
                console.error('Error Response:', error.response);
                console.error('Error Status:', error.response.status);
                console.error('Error Headers:', error.response.headers);
                console.error('Error Data:', error.response.data);
            } else {
                console.error('Error without response:', error);
            }
        });
};


export const login = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    try {
        if (credentials && credentials.email && credentials.password) {
            console.log("Login request data:", credentials);

            const response = await axios.post<LoginResponse>('/api/login', credentials, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            console.log('Response Headers:', response.headers);

            const csrfToken = response.headers['x-csrf-token'] || response.headers['X-CSRF-Token'];

            console.log('Extracted CSRF Token:', csrfToken);

            if (!csrfToken) {
                throw new Error('CSRF token missing in response');
            }

            sessionStorage.setItem(`${APP_NAME}-csrfToken`, csrfToken);
            console.log('CSRF token saved in sessionStorage:', csrfToken);

            console.log('Login successful:', response.data);

            return response.data;
        }

        // Explicitly throw an error if the credentials are invalid
        throw new Error('Invalid credentials');
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.log('Login failed: Unauthorized access');
                return { message: 'Login failed: Invalid credentials' } as LoginResponse;
            }
        }
        console.error('Error during login:', error);
        throw new Error('Login failed');
    }
};

export const fetchTodos = async (): Promise<any[]> => {
    try {
        const response = await axios.get('/api/todos', {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.error("Response is not an array:", response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
};

const csrfToken = sessionStorage.getItem(`${APP_NAME}-csrfToken`);
export const createTodo = async (data: Todo): Promise<Todo> => {
    try {
        const response = await axios.post(`${API_BASE}/todos`, data, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'X-CSRF-Token': csrfToken
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
};
export const editTodo = async (todoId: string, data: Todo): Promise<void> => {
    try {

        const csrfToken = localStorage.getItem(`${APP_NAME}-session-csrfToken`);

        const response = await axios.patch(
            `${API_BASE}/todos/${todoId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        console.log('Response:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('AxiosError:', error);
            console.error('Error response:', error.response);
            console.error('Error request:', error.request);
            console.error('Error message:', error.message);
            console.error('Error config:', error.config);
        } else {
            console.error('Unknown error:', error);
        }
    }
};
export const deleteTodo = async (todoId: string): Promise<{ message: string }> => {
    try {
        const response = await axios.delete(`${API_BASE}/todos/${todoId}`, {
            withCredentials: true,  // Include cookies (JWT or other auth tokens)
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'X-CSRF-Token': csrfToken
            }
        });
        console.log('Response from delete:', response);
        return response.data;
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};
export const sendForgotPasswordEmailRequest = async (email: string): Promise<void> => {
    try {
        const response = await axios.post('/api/emails/forgot-password', { email }, {
            withCredentials: true,  // Include cookies (JWT or other auth tokens)
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            }
        });

        // Log the response data for debugging
        console.log("Response Data:", response.data);

        const csrfToken = response.headers['x-csrf-token'] || response.headers['X-CSRF-Token'];

        if (csrfToken) {
            const expirationTime = Date.now() + 3600 * 1000;
            const csrfData = { token: csrfToken, expiration: expirationTime };

            localStorage.setItem(`${APP_NAME}-password-csrfToken`, JSON.stringify(csrfData));
            console.log("CSRF Token stored in localStorage:", csrfData);
        } else {
            console.error('No CSRF token received in response data');
        }

        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};
export const resetPassword = async (token: string, newPassword: string): Promise<any> => {
    try {

        const csrfData = JSON.parse(localStorage.getItem(`${APP_NAME}-password-csrfToken`) || '{}');

        if (!csrfData.token) {
            throw new Error('CSRF token is missing');
        }

        const currentTime = Date.now();
        if (currentTime > csrfData.expiration) {
            localStorage.removeItem(`${APP_NAME}-password-csrfToken`);
            throw new Error('CSRF token has expired');
        }

        const csrfToken = csrfData.token;
        console.log('Sending request with CSRF Token:', csrfToken);

        const response = await axios.post(
            '/api/emails/reset-password',
            { token, newPassword },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'X-CSRF-Token': csrfToken,             // Optional CSRF token header
                    'Content-Type': 'application/json'
                },
            }
        );

        console.log("Response Data:", response.data);
        console.log("Response Headers:", response.headers);

        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

export const updateTodoColor = async (todoId: string, color: string): Promise<Todo> => {
    try {
        const csrfToken = getCSRFToken();
        const response = await axios.patch(
            `${API_BASE}/todos/${todoId}/color`,
            { color },
            {
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating todo color:', error);
        throw error;
    }
};
export interface Color {
    primary: string;
    secondary: string;
    secondaryBg: string;
    background: string;
    inputBg: string;
    buttonHover: string;
    invisibleText: string;
    gradientBg: string;
}

// Function to get colors from the API
export const getColors = async (): Promise<Color> => {
    try {
        const response = await axios.get('/api/admin/colors', {
            withCredentials: true,  // Include cookies (JWT or other auth tokens)
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'X-CSRF-Token': csrfToken
            }
        });
        console.log('Response from getColors:', response);
        // Return the response data typed as Color
        return response.data as Color;
    } catch (error) {
        console.error('Error fetching colors:', error);
        throw error;
    }
};

// Function to update a specific color in the database
export const updateColor = async (name: string, value: string): Promise<{ message: string }> => {
    try {
        const response = await axios.post('/api/admin/colors', { name, value }, {
            withCredentials: true,  // Include cookies (JWT or other auth tokens)
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'X-CSRF-Token': csrfToken
            }
        });
        console.log('Response from updateColor:', response);
        return response.data;
    } catch (error) {
        console.error('Error updating color:', error);
        throw error;
    }
};
// Reset colors to default
export const resetColors = async (): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`/api/admin/colors/reset`, {
            withCredentials: true,  // Include cookies (JWT or other auth tokens)
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'X-CSRF-Token': csrfToken
            }
        });
        console.log('Response from resetColors:', response);
        return response.data;
    } catch (error) {
        console.error('Error resetting colors:', error);
        throw error;
    }
};
