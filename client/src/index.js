import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import musical_sound_music_logo from "./Pages/Icon/musical-sound-music-logo.svg"
import HomePage from './Pages/Home/Home';
import LoginPage from './Pages/Login/Login';
import RegisterPage from './Pages/Register/Register';
import AdminLogin from './components/admin/Login/Login';


function App() {
  return (
    <>
      <div className="mode-switch-container">
          <a href="/">
              <img className="music-logo" src={musical_sound_music_logo} alt="logo"/>
          </a>
          <label className="mode-switch" onClick="">
              <input type="checkbox"/>
              <span className="mode-switch-slider"></span>
          </label>
      </div>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path='/admin/login' element={<AdminLogin />} />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App />
);
