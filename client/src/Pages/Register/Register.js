import {React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import api from "../../api";
export default function RegisterPage() {
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng trang
    const condition = localStorage.getItem('access_token')// Kiểm tra access_token có tồn tại hay không
    useEffect(() => {
      if (condition) {
        window.location.href = '/dashboard'; // Điều hướng về trang ban đầu của bạn
      }
    });
    
    const initUserName = {
        email: "",
        password: "",
        confirmpassword: "",
        username: "",
        birthday: "",
        gender: "",
    };
    const [registerMessage, setRegisterMessage] = useState("");
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
    ///////////////////////////////
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Kiểm tra lỗi
        if (validateForm()) {
            const data = JSON.stringify(
                {
                    name: UserName.username,
                    email: UserName.email,
                    password: UserName.password,
                    gender: UserName.gender,
                    date_of_birth: UserName.birthday
                }
            )
            try {
                const response = await api.post(`/auth/signup`, data, {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                if (response.ok) {
                    setRegisterMessage("Registration successful!");
                    navigate("/login");
                } else {
                    throw new Error('Something went wrong');
                    
                }
            }
            catch (error) {
                setRegisterMessage("Registration failed! Please try again.");
            }
        }
    };
    // Trả về html
    return (
        <div className="register-page">
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
                            <p className="register-error-feedback">
                                {formError.email}
                            </p>
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
                            <p className="register-error-feedback">
                                {formError.password}
                            </p>
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
                            <p className="register-error-feedback">
                                {formError.confirmpassword}
                            </p>
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
                            <p className="register-error-feedback">
                                {formError.username}
                            </p>
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
                            <p className="register-error-feedback">
                                {formError.birthday}
                            </p>
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
                            <p className="register-error-feedback">
                                {formError.gender}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="btnRegister-container">
                    <p className="register-error-feedback">
                        {registerMessage}
                    </p>
                    <button type="submit" className="btnRegister">
                        REGISTER
                    </button>
                </div>
            </form>
        </div>
    );
}
