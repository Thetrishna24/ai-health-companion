import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

const Signin = () => {
    // State to hold form data (only email and password needed for login)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify(formData);

            // Make the POST request to your backend login endpoint
            const res = await axios.post(
                'http://localhost:3000/api/auth/login', // <-- Make sure this matches your backend URL
                body,
                config
            );
            
            // On success, the backend returns a JWT token
            console.log('Login Successful! Token:', res.data.token);
            
            // ⭐️ Store the token
            localStorage.setItem('token', res.data.token);
            
            alert('Login Successful! Welcome back.');
            // Implement redirect/state change here

        } catch (err) {
            // Log the detailed error (e.g., "Invalid Credentials")
            console.error(err.response ? err.response.data : err.message);
            alert(`Login Failed: ${err.response?.data?.msg || 'Server Error'}`);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                {/* Input fields for email and password... */}
                {/* (Keep the input fields as defined in the previous response) */}
            </form>
        </div>
    );
};

export default Signin;