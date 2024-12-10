import axios from 'axios';

// Ensure CSRF token is sent with every request
axios.defaults.withCredentials = true; // Ensures cookies are sent
axios.defaults.baseURL = process.env.APP_URL; // Assuming the backend runs on localhost:3000

const APP_URL = process.env.APP_URL || "https://your-production-url.com";
const API_BASE = "api";
const API_KEY = process.env.APP_KEY;

const dev_url = "http://localhost"


const getCSRFToken = () => localStorage.getItem('csrfToken');  // Retrieve token from localStorage

// Add CSRF token to every outgoing request using Axios interceptors
axios.interceptors.request.use(
    (config) => {
        const csrfToken = getCSRFToken();
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken; // Attach CSRF token to request header
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const addCSRFTokenHeader = (config: any) => {
    const csrfToken = getCSRFToken(); // Get CSRF token from localStorage or cookies
    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken; // Attach CSRF token for protection
    }
    config.headers['Authorization'] = `Bearer ${API_KEY}`; // Add Authorization token
    return config;
};


axios.interceptors.request.use(addCSRFTokenHeader, (error) => Promise.reject(error));

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


// Login function (store CSRF token after login)
export const login = async (credentials: LoginCredentials) => {
    try {
        const response = await axios.post("/api/login", credentials); // The base URL is already set
        if (response.data.csrfToken) {
            localStorage.setItem('csrfToken', response.data.csrfToken); // Store CSRF token
        }
        return response.data;
    } catch (error) {
        console.error("Error logging in", error);
        throw error;
    }
};

export const fetchTodos = async (): Promise<any[]> => {
    try {
        const response = await axios.get('/api/todos');
        // Check if the response is an array
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.error("Response is not an array:", response.data);
            return [];  // Return empty array if the response is not an array
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
        return []; // Return empty array in case of error
    }
};

// Create a new todo
export const createTodo = async (data: Todo): Promise<Todo> => {
    try {
        const response = await axios.post(`${API_BASE}/todos`, data); // Post data for new todo
        return response.data;
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
};
export const editTodo = async (todoId: string, data: Todo): Promise<void> => {
    try {
        // Assuming CSRF token is used (you can remove this if not needed)
        const csrfToken = localStorage.getItem('csrfToken');  // Get the CSRF token from localStorage (or cookies)

        // Send the PATCH request to the API with the provided data
        const response = await axios.patch(
            `${API_BASE}/todos/${todoId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',  // Ensure the content type is set to JSON
                    'X-CSRF-Token': csrfToken,
                    Authorization: `Bearer ${API_KEY}`,// Add the CSRF token in the header (if used)
                },
            }
        );

        // Log the response to check if the request is successful
        console.log('Response:', response.data);
    } catch (error) {
        // Handle errors
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
        const response = await axios.delete(`${API_BASE}/todos/${todoId}`);
        console.log('Response from delete:', response);
        return response.data;
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};
export const sendForgotPasswordEmailRequest = async (email: string): Promise<void> => {
    try {
        const response = await axios.post('/api/emails/forgot-password', { email });

        // Log the response data for debugging
        console.log("Response Data:", response.data);

        const csrfToken = response.data.token || response.data.toke;

        if (csrfToken) {
            const expirationTime = Date.now() + 3600 * 1000;
            const csrfData = { token: csrfToken, expiration: expirationTime };

            localStorage.setItem('csrfToken', JSON.stringify(csrfData));
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

        const csrfData = JSON.parse(localStorage.getItem('csrfToken') || '{}');

        if (!csrfData.token) {
            throw new Error('CSRF token is missing');
        }

        const currentTime = Date.now();
        if (currentTime > csrfData.expiration) {
            localStorage.removeItem('csrfToken');
            throw new Error('CSRF token has expired');
        }

        const csrfToken = csrfData.token;
        console.log('Sending request with CSRF Token:', csrfToken);

        const response = await axios.post(
            '/api/emails/reset-password',
            { token, newPassword },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
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
