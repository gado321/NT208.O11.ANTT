import React from "react";
import "./Dashboard.css";
import favourite from "../Icon/favourite.png"
import home from "../Icon/home.png"
import profile from "../Icon/profile.png"
import search from "../Icon/search.png"
import setting from "../Icon/setting.png"
import ring from "../Icon/ring.png"
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg"
import { useState, useEffect } from "react";

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

function Dashboard() {
    
    const addHeaderContent = () => {
        const headerContent = document.querySelector('.header-content');
        const heading = document.createElement('h2');
        heading.textContent = 'Hey !';
        const image = document.createElement('img');
        image.src = ring;
        image.alt = 'Music4Life';

        headerContent.appendChild(heading);
        headerContent.appendChild(image);

    };
    addHeaderContent();

    return (
        <div class="container">
            <div class="nav-bar">
                <div class="space">

                </div>
                <div class="list-nav">
                    <ul id="home">
                        <img src={home} alt="Music4Life" />
                        <a href="#">Home</a>
                    </ul>
                    <ul id="search">
                        <img src={search} alt="Music4Life" />
                        <a href="#">Search</a>
                    </ul>
                    <ul id="favourite">
                        <img src={favourite} alt="Music4Life" />
                        <a href="#">Favourites</a>
                    </ul>
                    <ul id="profile">
                        <img src={profile} alt="Music4Life" />
                        <a href="#">Profile</a>
                    </ul>
                    <ul id="setting">
                        <img src={setting} alt="Music4Life" />
                        <a href="#">Setting</a>
                    </ul>
                </div>
            </div>

        <div class="content">

        </div>
    </div>

    );
}

// ====================================================================================================

function DashboardPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = setTimeout(() => {
            setIsLoaded(true);
        }, 5000);
        return () => clearTimeout(fetchData);
    }, []);

    return (
    <React.StrictMode>
            {isLoaded ? <Dashboard /> : <Loading />}
    </React.StrictMode>
    );
}

export default DashboardPage;