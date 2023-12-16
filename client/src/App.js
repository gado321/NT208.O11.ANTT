import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactDOM from "react-dom/client";

import './App.css';
import HomePage from './Home/Home';
import LoginPage from './Login/Login';
import RegisterPage from './Register/Register';
import AdminLogin from './components/admin/Login/Login';

function App() {
  return (
    <div className='App'>
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path='/admin/login' element={<AdminLogin />} />
            {/* Add more routes as needed */}
            {/* Redirect all unknown routes to home */}
            {/* <Route path='*' element={<Navigate replace to="/" />} /> */}
        </Routes>
    </div>
  );
}

export default App;
