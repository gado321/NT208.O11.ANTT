import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { Icon } from '@iconify/react';

export default function RegisterPage() {
    const initUserName = {
        email: "",
        password: "",
        confirmpassword: "",
        username: "",
        birthday: "",
        gender: "",
    };
    const [registerMessage, setRegisterMessage] = useState("");
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng trang
    const [UserName, setUserName] = useState(initUserName);
    const [formError, setFormError] = useState({});
    
    // Kiểm tra giá trị rỗng
    const isEmptyValue = (value) => {
        return !value || value.trim().length < 1;
    }
    // Kiểm tra email hợp lệ
    const isEmailValid = (value) => {
        return !/\S+@\S+\.\S+/.test(value);
    }
    // Xử lý thay đổi giá trị của form
    const handleChangeUser = (event) => {
        const {value, name} = event.target;
        setUserName({
            ...UserName,
            [name]: value,
        });
    };
    // Kiểm tra giá trị của form có hợp lệ hay không
    const validateForm = () => {
        const error = {};
        // Kiểm tra email
        if (isEmptyValue(UserName.email)) {
            error.email = "Please enter your email";
        }
        else if (isEmailValid(UserName.email)) {
            error.email = "Please enter a valid email address";
        }
        //Kiểm tra mật khẩu
        if (isEmptyValue(UserName.password)) {
            error.password = "Please enter your password";
        }
        else if ((UserName.password.length < 8) || (UserName.password.length > 20)) {
            error.password = "Password must be at least 8 and less than 20.";
        }
        else if ((!/\d/.test(UserName.password)) || (!/[!@#$%^&*]/.test(UserName.password))) {
            error.password = "Password must contain numbers and symbols";
        }
        // Kiểm tra mật khẩu nhập lại
        if (isEmptyValue(UserName.confirmpassword)) {
            error.confirmpassword = "Please enter confirm password";
        }
        else if (UserName.confirmpassword !== UserName.password) {
            error.confirmpassword = "Confirm password does not match";
        }
        // Kiểm tra tên người dùng
        if (isEmptyValue(UserName.username)) {
            error.username = "Please enter your username";
        }
        //Kiẻm tra ngày sinh
        if (isEmptyValue(UserName.birthday)) {
            error.birthday = "Please enter your birthday";
        }
        else if (new Date(UserName.birthday) > new Date()) {
            error.birthday = "Birthday must be less than today";
        }
        // Kiểm tra giới tính
        if (isEmptyValue(UserName.gender)) {
            error.gender = "Please choose your gender";
        }
        // Trả về lỗi
        setFormError(error);
        return Object.keys(error).length === 0;
    }
    // Xác nhận dữ liệu khi đăng nhập và in ra console
    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (validateForm()) {
            // Gửi yêu cầu POST đến API Python
            fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: UserName.username,
                    email: UserName.email,
                    password: UserName.password,
                    gender: UserName.gender,
                    date_of_birth: UserName.birthday
                })
            })
            .then(response => {
                if (response.ok) {
                    setRegisterMessage("Registration successful!");
                    navigate("/login");
                } else {
                    setRegisterMessage("Registration failed! Please try again.");
                    
                }
            })
            .catch(error => {
                setRegisterMessage("Registration failed! Please try again.");
            });
        }
        else {
            setRegisterMessage("Registration failed! Please try again.");
        }
    };
    // Trả về html
    return (
        <div className="register-page">
            <div className="register-mode-switch-container">
            <a href="/home">
                    <Icon className="register-icon" icon="bx:arrow-back" />
                </a>
                <label class="mode-switch">
                    <input type="checkbox" onclick="toggleDarkMode()"/>
                    <span class="mode-switch-slider"></span>
                </label>
            </div>
            <h1 className="register-title">Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="register-form-container">
                    <div className="register-form-left">
                        <div>
                            <label htmlFor="register-email" className="register-form-label">
                                Enter your e-mail address
                            </label>
                            <input
                                type="text"
                                id="register-email"
                                className="register-form-control"
                                placeholder="   example@gmail.com"
                                name="email"
                                onChange={handleChangeUser}
                            />
                            {formError.email && (
                                <p className="login-error-feedback">{formError.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="register-password" className="register-form-label">
                            Create a password
                            </label>
                            <input
                                type="password"
                                id="register-password"
                                className="register-form-control"
                                placeholder="   *********"
                                name="password"
                                onChange={handleChangeUser}
                            />
                            {formError.password && (
                                <p className="login-error-feedback">{formError.password}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="register-confirm-password" className="register-form-label">
                            Confirm password
                            </label>
                            <input
                                type="password"
                                id="register-confirm-password"
                                className="register-form-control"
                                placeholder="   *********"
                                name="confirmpassword"
                                onChange={handleChangeUser}
                            />
                            {formError.confirmpassword && (
                                <p className="login-error-feedback">{formError.confirmpassword}</p>
                            )}
                        </div>
                    </div>
                    <div className="register-form-right">
                        <div>
                            <label htmlFor="register-username" className="register-form-label">
                                Drop us your preferred name
                            </label>
                            <input
                                type="text"
                                id="register-username"
                                className="register-form-control"
                                placeholder="   Username"
                                name="username"
                                onChange={handleChangeUser}
                            />
                            {formError.username && (
                                <p className="login-error-feedback">{formError.username}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="register-birthday" className="register-form-label">
                                Enter your birthday
                            </label>
                            <input
                                type="date"
                                id="register-birthday"
                                className="register-form-control"
                                placeholder="   dd/mm/yyyy"
                                name="birthday"
                                onChange={handleChangeUser}
                            />
                            {formError.birthday && (
                                <p className="login-error-feedback">{formError.birthday}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="register-gender" className="register-form-label">
                                What’s your gender?
                            </label>
                            <div className="register-gender-form-container">
                                <input
                                    type="radio" 
                                    id="register-gender"
                                    name="gender"
                                    className="register-gender-form-control"
                                    value="female"
                                    onChange={handleChangeUser}
                                />Female
                                <input
                                    type="radio" 
                                    id="register-gender"
                                    name="gender"
                                    className="register-gender-form-control"
                                    value="male"
                                    onChange={handleChangeUser}
                                />Male
                                <input
                                    type="radio" 
                                    id="register-gender"
                                    className="register-gender-form-control"
                                    name="gender"
                                    value="other"
                                    onChange={handleChangeUser}
                                />Other
                            </div>
                            {formError.registergender && (
                                <p className="login-error-feedback">{formError.registergender}</p>
                            )}
                        </div>
                        {registerMessage && <p>{registerMessage}</p>}
                    </div>
                </div>
                <div className="btnRegister-container">
                    <button type="submit" className="btnRegister">
                        SIGN UP
                    </button>
                </div>
                
            </form>
        </div>
    );
}
