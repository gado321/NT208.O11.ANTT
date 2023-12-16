import React, {useState} from "react";
import { Link } from "react-router-dom";
import './Login.css';
import {Form, FormGroup} from 'react-bootstrap';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="container">
            <div className="form">
                <div className="col-md-6 offset-md-3 p-5">
                    <h3>Admin Login</h3>
                    <form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Your admin email" value={email} name="email"/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Your password" value={password} name="password"/>
                        </Form.Group>
                        <Form.Group>
                            <Button as="sub" variant="primary">Login</Button>
                        </Form.Group>
                    </form>                    
                    <p className="text-center">
                        <Link to="/forgot/password">Forgot Password</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;