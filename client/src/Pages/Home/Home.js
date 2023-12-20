import React from "react";
import "./Home.css";
import laptop_20_regular from "../Icon/laptop-20-regular.svg"
import file_earmark_music_fill from "../Icon/file-earmark-music-fill.svg"
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg"
import icon_google from "../Icon/icon-google.svg"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Loading() {
    return (
        <div className="loading-container">
            <div>
                <img className="home-logo" src={musical_sound_music_logo} alt="loading" />
                <p className="loading-title">Music4Life</p>
            </div>
        </div>
    );
}

function Home() {
    return (
        <div className="home-page">
            <div className="home-laptop-img-container">
                <img className="laptop-20-regular" src={laptop_20_regular} alt="Music4Life" />
                <img className="file-earmark-music-fill" src={file_earmark_music_fill} alt="Music4Life" />
            </div>
            <p className="home-content">
                Unlimited streaming of songs in one app?
                Nothing could be better than this!</p>
            <div className="home-btn-register-container">
                <Link to="/register">
                    <button className="home-btn-register" type="submit">SIGN ME UP FOR FREE</button>
                </Link>
            </div>
            <p className="home-content">Or continue with</p>
            <div className="home-btn-login-with-google">
                <img className="icon-google" src={icon_google} alt="Log in with google account"></img>
            </div>
            <div className="home-btn-login-container">
                <Link to="/login">
                    <button className="home-btn-login" type="submit">LOG IN</button>
                </Link>
            </div>
        </div>
    );
}

// ====================================================================================================

function HomePage() {
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng trang
    // const condition = localStorage.getItem('access_token')// Kiểm tra access_token có tồn tại hay không
    // useEffect(() => {
    //   if (condition) {
    //     navigate('/dashboard'); // Điều hướng về trang ban đầu của bạn
    //   }
    // }, [condition, navigate]);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = setTimeout(() => {
            setIsLoaded(true);
        },);
        return () => clearTimeout(fetchData);
    }, []);

    return (
    <React.StrictMode>
            {isLoaded ? <Home /> : <Loading />}
    </React.StrictMode>
    );
}

export default HomePage;