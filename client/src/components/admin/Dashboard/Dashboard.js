import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Dashboard.css'
const LoggedInLinks = () => {
    
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('is_admin');
        localStorage.removeItem('REACT_TOKEN_AUTH_KEY');
    }

    return (
        <>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/song">Song</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/artist">Artist</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/genre">Genre</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/album">Album</Link>
            </li>
            <li className="nav-item">
                <a className="nav-link active" href="/admin/login" onClick={()=>{logout()}}>Log Out</a>
            </li>
        </>
    )
}

const AdminDashboard = () => {
    if (window.location.pathname === '/admin/dashboard') {
        require('bootstrap/dist/css/bootstrap.min.css');
    }    
    useEffect(() => {
        const linkDashboard = document.querySelector('.link-home');
        linkDashboard.href = "/admin/dashboard";
    });
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <LoggedInLinks/>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default AdminDashboard