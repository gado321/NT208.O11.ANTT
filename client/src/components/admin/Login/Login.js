import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import './Login.css';
import {Form, Button} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { login } from '../Auth';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.is_admin) {
                    navigate('/admin/dashboard');
                } else {
                    setIsChecking(false);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsChecking(false);
            }
        } else {
            setIsChecking(false);
        }
    }, [navigate]);

    if (window.location.pathname === '/admin/login') { 
        require('bootstrap/dist/css/bootstrap.min.css');
    }

    const { register, handleSubmit, reset, formState:{errors}} = useForm();

    const loginAdmin = (data) => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch('/auth/login', requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.is_admin) {
                    login(data); // Assuming login function takes the whole data object
                    // Retrieve the data from the "REACT_TOKEN_AUTH_KEY" field in JSON format from localStorage
                    const tokenData = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

                    // Extract the "access_token" and "refresh_token" components from the tokenData
                    const { access_token, refresh_token, is_admin } = tokenData;

                    // Store the "access_token" and "refresh_token" back in the localStorage with corresponding names
                    localStorage.setItem("access_token", access_token);
                    localStorage.setItem("refresh_token", refresh_token);
                    localStorage.setItem("is_admin", is_admin);
                    navigate('/admin/dashboard', {replace: true});
                } else {
                    // This else part will handle the situation when the login is successful but the user is not an admin
                    alert('Invalid username or password');
                }
            })
            .catch(error => {
                // This catch will handle network errors and also if the server sends an error status code
                console.error("There was an error!", error);
                alert('Invalid username or password');
            });
        
        

        // Reset the form after submission
        reset();
    }

    if (isChecking) {
        // While checking the token, render nothing or some loading indicator
        return null; // or <LoadingIndicator />
    }

    return (
        <div className="container">
            <div className="form">
                <h3>Admin Login</h3>
                <Form onSubmit={handleSubmit(loginAdmin)}>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" 
                            placeholder="Your admin email" 
                            {...register('email', {required: true, maxLength: 50, pattern: /^\S+@\S+$/i})}
                        />
                        {errors.email && <p style={{color:'red'}}>Please enter a valid email.</p>}
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" 
                            placeholder="Your password" 
                            {...register('password', {required: true, minLength: 8})}
                        />
                        {errors.password && <p style={{color:'red'}}>Password must have at least 8 characters.</p>}
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Button variant="primary" type="submit">Login</Button>
                    </Form.Group>
                </Form>                    
                <p className="text-center">
                    <Link to="/forgot/password">Forgot Password</Link>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;