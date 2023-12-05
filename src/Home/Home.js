import React from "react";
import "./Home.css";
import { Icon } from '@iconify/react';

export default function HomePage() {
    return (
        <div className="home-page">
            <div className="home-mode-switch-container">
                <div className="home-logo">
                    <img src="D:\Hoc_tap\Ki_5\WebAppProgramming\Project\Sign-in\Sign_in\app_login\src\Image\image_2.jpg"/>
                </div>
                <label class="mode-switch">
                    <input type="checkbox" onclick="toggleDarkMode()"/>
                    <span class="mode-switch-slider"></span>
                </label>
            </div>
            <h1 className="home-title">Log In</h1>
        </div>
    );
}