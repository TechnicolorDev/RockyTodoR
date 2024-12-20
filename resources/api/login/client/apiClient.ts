import axios, { AxiosError } from 'axios';

// Set the base URL globally
axios.defaults.baseURL = process.env.APP_URL;

const apiClient = axios.create({
    withCredentials: true, // Include cookies
});

// Add an interceptor
apiClient.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error: AxiosError) => {
        // Override console.error temporarily for 401 errors to suppress logs
        if (error.response?.status === 401) {
            const originalConsoleError = console.error;
            console.error = () => {}; // Suppress logging

            // Handle 401 error as needed (without logging it)
            const resolvedResponse = {
                data: { message: 'Unauthorized. Please log in again.' },
                status: 401,
                statusText: 'Unauthorized',
                headers: error.response.headers,
                config: error.config,
            };

            // Restore console.error after handling
            console.error = originalConsoleError;

            return Promise.resolve(resolvedResponse);
        }

        if (error.response?.status === 404) {
            console.error('API endpoint not found:', error.response.config.url);
            return Promise.reject({
                message: `The requested resource was not found: ${error.response.config.url}`,
                status: 404,
            });
        }

        return Promise.reject(error); // Pass other errors
    }
);

export default apiClient;
