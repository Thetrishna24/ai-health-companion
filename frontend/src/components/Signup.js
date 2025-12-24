import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

const Signup = () => {
    // State to hold form data (username, email, password)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const { username, email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Configuration for the request (specifying JSON content)
            const config = { headers: { 'Content-Type': 'application/json' } };
            
            // Create the request body string
            const body = JSON.stringify(formData);

            // Make the POST request to your backend register endpoint
            const res = await axios.post(
                'http://localhost:3000/api/auth/register', // <-- Make sure this matches your backend URL
                body,
                config
            );
            
            // On success, the backend returns a JWT token in res.data.token
            console.log('Registration Successful! Token:', res.data.token);
            
            // ⭐️ Store the token for future authenticated requests
            localStorage.setItem('token', res.data.token);
            
            alert('Registration Successful! You are now logged in.');
            // Implement redirect/state change here (e.g., set user context)

        } catch (err) {
            // Log the detailed error from the backend (e.g., "User already exists")
            console.error(err.response ? err.response.data : err.message);
            alert(`Registration Failed: ${err.response?.data?.msg || 'Server Error'}`);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                {/* Input fields for username, email, and password... */}
                {/* (Keep the input fields as defined in the previous response) */}
            </form>
        </div>
    );
};

export default Signup;