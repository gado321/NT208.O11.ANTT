import React, { useState, useEffect, useRef } from "react";
import favourite from "../Icon/favourite.png";
import home from "../Icon/home.png";
import profile from "../Icon/profile.png";
import search from "../Icon/search.png";
import setting from "../Icon/setting.png";
import ring from "../Icon/ring.png";
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg";
import axios from 'axios';
import './SettingContent.css'; // Import tệp CSS
// const dictSettingName = {
//   APP:['Privacy Policy', 'Share this app', 'Rate this app', 'Help', 'Sleep Timer', 'Set Favorite Genres']
// };

const ListTabSetting = ['Overview', 'View-Profile', 'Edit-Profile', 'Change-E-mail', 'Change-Username', 'Go-Premium', 'Log-Out'];

export default function SettingContent() {
  const [TabSetting, ListTabSetting] = useState(false);
  const [content, setContent] = useState();
  useEffect(() => {
    content = <></>;
  });
  
  return (
    <>
    <div className="setting-content">
      <div className="setting-list-container">
        <p className="seting-list-title">ACCOUNT</p>
        <ul className="setting-list">
          <li className="setting-item">
            <button className="View-Profile" onClick={() => setContent(View-Profile)}>View Profile</button>
          </li>
          <li className="setting-item">
            <button className="Edit-Profile">Edit Profile</button>
          </li>
          <li className="setting-item">
            <button className="Change-E-mail">Change E-mail</button>
          </li>
          <li className="setting-item">
            <button className="Change-Password">Change Username</button>
          </li>
          <li className="setting-item">
            <button className="Go-Premium">Go Premium</button>
          </li>
          <li className="setting-item">
            <button className="Log-Out">Log Out</button>
          </li>
        </ul>
      </div>
    </div>
    </>
  );
}