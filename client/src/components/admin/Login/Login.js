import React, {useState} from "react";
import { Link } from "react-router-dom";
import './Login.css';
import {Form, Button} from 'react-bootstrap';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const loginAdmin = () => {
        console.log("Login form submitted");
        console.log("Email: ", email);
        console.log("Password: ", password);

        setEmail('');
        setPassword('');
    }

    return (
        <div className="container">
            <div className="form">
                <h3>Admin Login</h3>
                <form>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Your admin email" value={email} name="email" onChange={(e)=>{setEmail(e.target.value)}}/>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Your password" value={password} name="password" onChange={(e)=>{setPassword(e.target.password)}}/>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Button as="sub" variant="primary" onClick={loginAdmin}>Login</Button>
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