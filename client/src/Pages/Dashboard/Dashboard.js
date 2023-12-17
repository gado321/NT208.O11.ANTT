import React from "react";
import favouriteIcon from "../Icon/favourite.png"
import homeIcon from "../Icon/home.png"
import profileIcon from "../Icon/profile.png"
import searchIcon from "../Icon/search.png"
import settingIcon from "../Icon/setting.png"
import ringIcon from "../Icon/ring.png"
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
    const [headerAdded, setHeaderAdded] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  
    useEffect(() => {
      if (!headerAdded) {
        addHeaderContent();
        setHeaderAdded(true);
      }
    }, [headerAdded]);
  
    useEffect(() => {
      setIsDashboardOpen(true);
      return () => {
        setIsDashboardOpen(false);
      };
    }, []);
  
    const addHeaderContent = () => {
      const headerContent = document.querySelector('.header-content');
      const heading = document.createElement('h2');
      heading.textContent = 'Hey !';
      const image = document.createElement('img');
      image.src = ringIcon;
      image.alt = 'Music4Life';
  
      headerContent.appendChild(heading);
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
  
      const home = createNavItem('home', homeIcon, 'Home');
      listNav.appendChild(home);
  
      const search = createNavItem('search', searchIcon, 'Search');
      listNav.appendChild(search);
  
      const favourite = createNavItem('favourite', favouriteIcon, 'Favourites');
      listNav.appendChild(favourite);
  
      const profile = createNavItem('profile', profileIcon, 'Profile');
      listNav.appendChild(profile);
  
      const setting = createNavItem('setting', settingIcon, 'Setting');
      listNav.appendChild(setting);
  
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

    return (
        <div>

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