import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './index.css';
import musical_sound_music_logo from "./Pages/Icon/musical-sound-music-logo.svg"
import HomePage from './Pages/Home/Home';
import LoginPage from './Pages/Login/Login';
import RegisterPage from './Pages/Register/Register';
import Dashboard from './Pages/Dashboard/Dashboard'
import AdminDashboard from './components/admin/Dashboard/Dashboard';
import AdminSong from './components/admin/Song/Song';
import AdminArtist from './components/admin/Artist/Artist';
import AdminAlbum from './components/admin/Album/Album';
import AdminGenre from './components/admin/Genre/Genre';

const checkIsAdmin = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.is_admin === true; // Assuming is_admin is a boolean
  } catch (error) {
    return false;
  }
};

const checkTokenExpiration = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentDate = new Date();
    return decodedToken.exp * 1000 < currentDate.getTime();
  } catch (error) {
    return true;
  }
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token');
  const isTokenExpired = token ? checkTokenExpiration(token) : true;
  const isAdmin = token ? checkIsAdmin(token) : false;

  if (!token || isTokenExpired) {
    if (location.pathname.includes('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  } else if (!isAdmin) {
    // If the token is valid but the user is not an admin, redirect to the regular login page
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <div className="container-page">
          <div className='nav-bar'>
            <a href="/">
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
          <div className='content'> </div>
          <div className='footer'> </div>
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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="song" element={<AdminSong />} />
                    <Route path="artist" element={<AdminArtist />} />
                    <Route path="album" element={<AdminAlbum />} />
                    <Route path="genre" element={<AdminGenre />} />
                    <Route path="/" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MainApp />
);