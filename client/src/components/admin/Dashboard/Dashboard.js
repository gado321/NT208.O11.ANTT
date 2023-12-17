import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth ,logout} from '../Auth'
import './Dashboard.css'
import AdminLoginPage from '../../admin/Login/Login'

const LoggedInLinks = () => {
    return (
        <>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/user">User</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/genre">Song</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/genre">Genre</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/genre">Album</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link active" to="/admin/genre">Genre</Link>
            </li>
            <li className="nav-item">
                <a className="nav-link active" href="#" onClick={()=>{logout()}}>Log Out</a>
            </li>
        </>
    )
}

const AdminDashboard = () => {
    const [logged] = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {logged?<LoggedInLinks/>:<AdminLoginPage/>}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default AdminDashboard