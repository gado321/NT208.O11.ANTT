import {React, useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
export default function LoginPage() {
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng trang
    const condition = localStorage.getItem('access_token')// Kiểm tra access_token có tồn tại hay không
    useEffect(() => {
      if (condition) {
        navigate('/dashboard'); // Điều hướng về trang ban đầu của bạn
      }
    });
    
    const initUserName = {
        email: "",
        password: "",
    };
    const [loginMessage, setLoginMessage] = useState("");
    const [UserName, setUserName] = useState(initUserName);
    const [formError, setFormError] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    
    // Kiểm tra giá trị rỗng
    const isEmptyvalue = (value) => {
        return !value || value.trim().length < 1;
    }
    const isEmailValid = (value) => {
        return !/\S+@\S+\.\S+/.test(value);
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
            error.email = "Please enter your email address or username";
        }
        else if (isEmailValid(UserName.email)) {
            error.email = "Please enter a valid email address";
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
        if (validateForm()) {
          fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          })
            .then((response) => {
                if (response.status === 200) {
                    return response.json(); // Chuyển đổi phản hồi thành đối tượng JSON
                } else {
                    throw new Error('Account does not exist.');
                }
            })

            
            .then((data) => {
              // Xử lý phản hồi từ API
              console.log(data);
              // Lưu access_token và refresh_token vào Session Storage
              localStorage.setItem('access_token', data.access_token);
              localStorage.setItem('refresh_token', data.refresh_token);
              localStorage.setItem('data', data.id);
              setLoginMessage("Login successful!");
              navigate("/dashboard");
            })
            .catch(error => {
                setLoginMessage("Loggin failed! Please try again.");
            });
        }
    };
    // Trả về html
    return (
        <div className="login-page">
            <h1 className="login-title">Log In</h1>
            <div className="login-form-container">
                <form >
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
                        <Link to="/forgotpassword">
                            Forgot Password?
                        </Link>
                        <Link to="/register">
                            Do not have account?
                        </Link>
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
                        <button type="submit" className="btnLogin" onClick={handleSubmit}>
                            LOG IN
                        </button>
                        <p className="login-error-feedback">
                            {loginMessage}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
