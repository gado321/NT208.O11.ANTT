import React, {useState} from "react";
import { Link } from "react-router-dom";
import './Login.css';
import {Form, Button} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { login } from '../auth';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const { register, handleSubmit, watch, reset, formState:{errors}} = useForm();

    const navigate = useNavigate();

    const loginAdmin = (data) => {
        console.log(data);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch('/auth/login', requestOptions)
        .then(res=>res.json())
        .then(data=>{
            console.log(data.access_token)
            
            if (data){
                login(data.access_token)
                navigate('/admin/dashboard', {replace: true})
            }
            else{
                alert('Invalid username or password')
            }


        })
        reset();
    }

    return (
        <div className="container">
            <div className="form">
                <h3>Admin Login</h3>
                <form>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" 
                            placeholder="Your admin email" 
                            {...register('email', {required: true, maxLength: 50, pattern: /^\S+@\S+$/i})}
                        />
                    </Form.Group>
                    {errors.email && errors.email.type === "required" && <p style={{color:'red'}}>Email is required</p>}
                    {errors.email && errors.email.type === "pattern" && <p style={{color:'red'}}>Email is not valid</p>}
                    <br/>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" 
                            placeholder="Your password" 
                            {...register('password', {required: true, minLength: 8, maxLength: 50})}
                        />
                    </Form.Group>
                    {errors.password && errors.password.type === "required" && <p style={{color:'red'}}>Password is required</p>}
                    {errors.password && errors.password.type === "minLength" && <p style={{color:'red'}}>Password must have at least 8 characters</p>}
                    <br/>
                    <Form.Group>
                        <Button as="sub" variant="primary" onClick={handleSubmit(loginAdmin)}>Login</Button>
                    </Form.Group>
                </form>                    
                <p className="text-center">
                    <Link to="/forgot/password">Forgot Password</Link>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;