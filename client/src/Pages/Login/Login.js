import React, { useState } from "react";
import "./Login.css";
import { Icon } from '@iconify/react';

export default function LoginPage() {

    const initUserName = {
        email: "",
        password: "",
    };

    const [UserName, setUserName] = useState(initUserName);
    const [formError, setFormError] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    
    // Kiểm tra giá trị rỗng
    const isEmptyvalue = (value) => {
        return !value || value.trim().length < 1;
    }

    const handleChangeUser = (event) => {
        const {value, name} = event.target;
        setUserName({
            ...UserName,
            [name]: value,
        });
    };

    const handleChangeCheckbox = () => {
        setRememberMe(!rememberMe);
      };
    // Kiểm tra giá trị của form có hợp lệ hay không
    const validateForm = () => {
        const error = {};
        if (isEmptyvalue(UserName.email)) {
            error.username = "Please enter your email address or username";
        }
        if (isEmptyvalue(UserName.password)) {
            error.password = "Please enter your password";
        }
        setFormError(error);
        return Object.keys(error).length === 0;
    }
    // Xác nhận dữ liệu khi đăng nhập và in ra console
    const handleSubmit = (event) => {
        event.preventDefault();
        const loginData = {
            email: UserName.email,
            password: UserName.password,
          };
      
          fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          })
            .then((response) => response.json())
            .then((data) => {
              // Xử lý phản hồi từ API
              console.log(data);
              // Lưu access_token và refresh_token vào Session Storage
              localStorage.setItem('access_token', data.access_token);
              localStorage.setItem('refresh_token', data.refresh_token);
              localStorage.setItem('data', data.id)
            })
            .catch((error) => {
              // Xử lý lỗi
              console.error(error);
            });
    };
    // Trả về html
    return (
        <div className="login-page">
            {/* <div className="login-mode-switch-container">
                <a href="./Register/register">
                    <Icon className="login-icon" icon="bx:arrow-back" />
                </a>
                <label class="mode-switch">
                    <input type="checkbox" onclick="toggleDarkMode()"/>
                    <span class="mode-switch-slider"></span>
                </label>
            </div> */}
            <h1 className="login-title">Log In</h1>
            <div className="login-form-container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login-username" className="login-form-label">
                            E-mail address or Username
                        </label>
                        <input
                            type="text"
                            id="login-username"
                            className="login-form-control"
                            name="email"
                            placeholder="   Email address or Username"
                            value={UserName.email}
                            onChange={handleChangeUser}
                        />
                        <p className="login-error-feedback">
                            {formError.email}
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="login-password"className="login-form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="login-password"
                            className="login-form-control"
                            name="password"
                            placeholder="   Password"
                            value={UserName.password}
                            onChange={handleChangeUser}
                        />
                        <p className="login-error-feedback">
                            {formError.password}
                        </p>
                    </div>
                    <div className="forgot-password">
                        <a href="./ForgotPassword/forgotpassword">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="remember-me">
                        <label> Always Remember Me </label>
                        <input
                                type="checkbox"
                                check={rememberMe}
                                onChange={handleChangeCheckbox}
                            />
                    </div>
                    <div className="btnLogin-container">
                        <button type="submit" className="btnLogin">
                            LOG IN
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
