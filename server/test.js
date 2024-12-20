const axios = require('axios');

// Define the credentials object
const credentials = {
    email: "johnd2of2e343f@example.com",
    password: "password123"
};

// Define the Bearer token
const bearerToken = "fACEbLcmw9RV7sn4xkjC4oPc";

// Define the login function to handle the request
const login = async (credentials) => {
    try {
        // Step 1: Send the login request with credentials and Bearer token in headers
        const response = await axios.post('http://localhost:3000/api/login', credentials, {
            withCredentials: true,  // Include cookies (JWT or other auth tokens)
            headers: {
                'Authorization': `Bearer ${bearerToken}`  // Add Bearer token in the Authorization header
            }
        });

        // Step 2: Return the login response if login is successful
        if (response.data && response.data.message === 'Login successful') {
            return response.data;
        } else {
            throw new Error('Invalid login response');
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized, which means login failed
            console.log('Login failed: Unauthorized access');
            return { message: 'Login failed: Unauthorized' };
        }
        console.error('Error during login:', error);
        throw new Error('Login failed');
    }
};

// Function to make the login request and handle the response
const performLogin = async () => {
    try {
        // Call the login function and pass the credentials
        const response = await login(credentials);

        // Handle the response
        if (response.message === 'Login successful') {
            console.log('Login successful!');
        } else {
            console.log('Login failed:', response.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};

// Call the performLogin function to trigger the login process
performLogin();
