/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                 !DEPRECATION WARNING!                                           //
//              This was just used to test endpoints when postman didnt work                       //
//                                                                                                 //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////

const axios = require('axios');

// Define the Todo ID and the updated data
const todoId = '6a2d02d1';  // The Todo ID you want to update
const data = {
    name: 'Updated Todo Name',        // New name for the Todo
    description: 'Updated description for the Todo',
    dueDate: '2024-12-31',            // Example due date
    repoUrl: 'https://github.com/updated-repo-url', // Example repo URL
};

// CSRF token (if applicable, replace with actual token if needed)
const csrfToken = 'your-csrf-token-here';  // Replace with the actual CSRF token if required

// Send the PATCH request
axios.patch(`http://localhost:3000/api/todos/${todoId}`, data, {
    headers: {
        'Content-Type': 'application/json',  // Ensure the content type is set to JSON
        'X-CSRF-Token': csrfToken,          // Add CSRF token if necessary (remove if not using)
    },
})
    .then(response => {
        console.log('Todo updated successfully:', response.data);
    })
    .catch(error => {
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    });
