import React, { useState, useEffect, useRef } from "react";
import favourite from "../Icon/favourite.png";
import home from "../Icon/home.png";
import profile from "../Icon/profile.png";
import search from "../Icon/search.png";
import setting from "../Icon/setting.png";
import ring from "../Icon/ring.png";
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg";

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

// Kiểm tra URL hiện tại và tải tệp CSS khi URL khớp với /dashboard
if (window.location.pathname === '/dashboard') {
    require('./Dashboard.css'); // Import tệp CSS
}

function Dashboard() {
    const [isHeaderAdded, setIsHeaderAdded] = useState(false);
    const headerAddedRef = useRef(false);
    const addHeaderContent = () => {
        const headerContent = document.querySelector('.header-content');
        const heading = document.createElement('h2');
        heading.textContent = 'Hey !';
        const image = document.createElement('img');
        image.src = ring;
        image.alt = 'Music4Life';

        headerContent.append(heading);
        headerContent.appendChild(image);

        const modeSwitchContainer = document.querySelector('.nav-bar');
        modeSwitchContainer.appendChild(createNavBar());
    };

    const createNavBar = () => {
        const navBar = document.createElement('div');
        navBar.className = 'nav-bar';

        const space = document.createElement('div');
        space.className = 'space';
        navBar.appendChild(space);

        const listNav = document.createElement('div');
        listNav.className = 'list-nav';

        const homeIcon = createNavItem('home', home, 'Home');
        listNav.appendChild(homeIcon);

        const searchIcon = createNavItem('search', search, 'Search');
        listNav.appendChild(searchIcon);

        const favouriteIcon = createNavItem('favourite', favourite, 'Favourites');
        listNav.appendChild(favouriteIcon);

        const profileIcon = createNavItem('profile', profile, 'Profile');
        listNav.appendChild(profileIcon);

        const settingIcon = createNavItem('setting', setting, 'Setting');
        listNav.appendChild(settingIcon);

        navBar.appendChild(listNav);

        return navBar;
    };

    const createNavItem = (id, iconSrc, label) => {
        const ul = document.createElement('ul');
        ul.id = id;

        const img = document.createElement('img');
        img.src = iconSrc;
        img.alt = 'Music4Life';

        const a = document.createElement('a');
        a.href = '#';
        a.textContent = label;

        ul.appendChild(img);
        ul.appendChild(a);

        return ul;
    };

    useEffect(() => {
        if (!isHeaderAdded && !headerAddedRef.current) {
            addHeaderContent();
            setIsHeaderAdded(true);
            headerAddedRef.current = true;
        }
    }, []);

    return (
        <div >
            <div className="content">
                <div className="header-content"></div>
            </div>
        </div>
    );
}

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
        <link rel="stylesheet" type="text/css" href="./Pages/Dashboard/Dashboard.css" />
        {isLoaded ? <Dashboard /> : <Loading />}
    </React.StrictMode>
  );
}

export default DashboardPage;