import React, {useState} from "react";
import { Link } from "react-router-dom";
import './Login.css';
import {Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { login } from '../Auth';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const { register, handleSubmit, reset, formState:{errors}} = useForm();
    const navigate = useNavigate();

    const loginAdmin = (data) => {
        console.log(data);

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