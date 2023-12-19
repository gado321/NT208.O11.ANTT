import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import musical_sound_music_logo from "./Pages/Icon/musical-sound-music-logo.svg"
import HomePage from './Pages/Home/Home';
import LoginPage from './Pages/Login/Login';
import RegisterPage from './Pages/Register/Register';
import AdminLogin from './components/admin/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard'
import AdminDashboard from './components/admin/Dashboard/Dashboard';
import AdminSong from './components/admin/Song/Song';
import AdminArtist from './components/admin/Artist/Artist';
import AdminAlbum from './components/admin/Album/Album';
import AdminGenre from './components/admin/Genre/Genre';

function App() {
  return (
    <>
      <div className="container">
          <div className='nav-bar'>
            <a href="/">
              <img className="music-logo" src={musical_sound_music_logo} alt="logo"/>
            </a>
          </div>
          <div className='header'>
            <div className="header-content">
              <div className='button-mode'>
                <label className="mode-switch" onClick="">
                    <input type="checkbox"/>
                    <span className="mode-switch-slider"></span>
                </label>
              </div>
            </div>  
          </div>
      </div>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            {/* User route */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            
            {/* Admin route */}
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/song' element={<AdminSong />} />
            <Route path='/admin/artist' element={<AdminArtist />} />
            <Route path='/admin/album' element={<AdminAlbum />} />
            <Route path='/admin/genre' element={<AdminGenre />} />
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