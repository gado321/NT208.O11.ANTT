import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import musical_sound_music_logo from "./Pages/Icon/musical-sound-music-logo.svg"
import HomePage from './Pages/Home/Home';
import LoginPage from './Pages/Login/Login';
import RegisterPage from './Pages/Register/Register';
import Dashboard from './Pages/Dashboard/Dashboard'
// import AdminLogin from './components/admin/Login/Login';
// import AdminDashboard from './components/admin/Dashboard/Dashboard';
// import AdminSong from './components/admin/Song/Song';
import Setting from './Pages/Setting/setting';

function App() {
  return (
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* User route */}
        <Route path="" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        
        {/* Admin route */}
        {/* <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/song' element={<AdminSong />} /> */}
        <Route path='/setting' element={<Setting />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  );
}
function MainApp() {
  return (
    <div className="container-page">
        <div className='nav-bar'>
            <a className="mucsic-logo-link" href="/">
              <img className="music-logo" src={musical_sound_music_logo} alt="logo"/>
            </a>
      </div>
      <div className='header'>
        <div className="header-content">
          <div className='hello'></div>
            <div className='button-mode'>
              <label className="mode-switch" onClick="">
                  <input type="checkbox"/>
                  <span className="mode-switch-slider"></span>
              </label>
            </div>
            <div className='avt'></div>
          </div>  
        </div>
      <div className='content'>
            <App/>
          </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MainApp />
);