import {React, useEffect, useState } from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
export default function ForgotPasswordPage() {

    // const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng trang
    // const condition = localStorage.getItem('access_token')// Kiểm tra access_token có tồn tại hay không
    // useEffect(() => {
    //   if (condition) {
    //     navigate('/dashboard'); // Điều hướng về trang ban đầu của bạn
    //   }
    // }, [condition, navigate]);
    const initUserName = {
        email: "",
        newpass: "",
        confirmnewpass: "",
    };

    const [UserName, setUserName] = useState(initUserName);
    const [formError, setFormError] = useState({});
    
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
    // Kiểm tra giá trị rỗng
    const isEmptyValue = (value) => {
        return !value || value.trim().length < 1;
    }
    // Kiểm tra email hợp lệ
    const isEmailValid = (value) => {
        return !/\S+@\S+\.\S+/.test(value);
    }
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
        setFormError(error);
        return Object.keys(error).length === 0;
    }
    // Xác nhận dữ liệu khi đăng nhập và in ra console
    const handleSubmit = (event) => {
        // event.preventDefault();
        // if (validateForm()) {
        //     // Gửi yêu cầu POST đến API Python
        //     fetch('http://localhost:5000/auth/signup', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             name: UserName.username,
        //             email: UserName.email,
        //             password: UserName.password,
        //             gender: UserName.gender,
        //             date_of_birth: UserName.birthday
        //         })
        //     })
        //     .then(response => {
        //         if (response.ok) {
        //             setRegisterMessage("Registration successful!");
        // history.push('/dashboard');
        //             navigate("/login");
        //         } else {
        //             setRegisterMessage("Registration failed! Please try again.");
                    
        //         }
        //     })
        //     .catch(error => {
        //         setRegisterMessage("Registration failed! Please try again.");
        //     });
        // }
        // else {
        //     setRegisterMessage("Registration failed! Please try again.");
        // }
        event.preventDefault();
        const forgotpasswordData = {
            email: UserName.email,
            new: UserName.newpass,
            confirmpassword: UserName.confirmnewpass,
          };
        if (!validateForm()) {
            console.log("Invalid");
            console.log(forgotpasswordData);
        }
    };
    // Trả về html
    return (
        <div className="forgotpassword-page">
            <h1 className="forgotpassword-title">Forgot Password</h1>
            <div className="forgotpassword-form-container">
                <form >
                    <div>
                        <label htmlFor="forgotpassword-newpass" className="forgotpassword-form-label">
                            Enter your e-mail address
                        </label>
                        <input
                            type="text"
                            id="forgotpassword-email"
                            className="forgotpassword-form-control"
                            placeholder="   example@gmail.com"
                            name="email"
                            onChange={handleChangeUser}
                        />
                        <p className="forgotpassword-error-feedback">
                            {formError.email}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="forgotpassword-newpass" className="forgotpassword-form-label">
                            New Password
                        </label>
                        <input
                            type="passqword"
                            id="forgotpassword-newpass"
                            className="forgotpassword-form-control"
                            name="newpass"
                            placeholder="New Password"
                            onChange={handleChangeUser}
                        />
                        <p className="forgotpassword-error-feedback">
                            {formError.email}
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="forgotpassword-confirmnewpass"className="forgotpassword-form-label">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="forgotpassword-confirmnewpass"
                            className="forgotpassword-form-control"
                            name="confirmnewpass"
                            placeholder="Confirm New Password"
                            onChange={handleChangeUser}
                        />
                        <p className="forgotpassword-error-feedback">
                            {formError.password}
                        </p>
                    </div>
                    <div className="btnforgotpassword-container">
                        <button type="submit" className="btnforgotpassword" onClick={handleSubmit}>
                            Forgot Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
