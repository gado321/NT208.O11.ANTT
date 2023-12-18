import React, { useState, useEffect, useRef } from "react";
import favourite from "../Icon/favourite.png";
import home from "../Icon/home.png";
import profile from "../Icon/profile.png";
import search from "../Icon/search.png";
import setting from "../Icon/setting.png";
import ring from "../Icon/ring.png";
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg";
import axios from 'axios';

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
    var id = localStorage.getItem('data');
    const initialFormState = {
      id: '',
      name: '',
      email: '',
      password: '',
      is_admin: '',
      last_login: '',
      is_premium: '',
      picture_path: '',
      gender: '',
      date_of_birth: ''
    };
    
    const [dataUser, setDataUser] = useState(initialFormState);
    
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        const userData = response.data;
        setDataUser(userData);
        addHeaderContent(userData);
        addContent();
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
      }
    };

    const [isHeaderAdded, setIsHeaderAdded] = useState(false);
    const headerAddedRef = useRef(false);
    const addHeaderContent = (userData) => {
        const hello = document.querySelector('.hello');
        const avtDiv = document.querySelector('.avt');
        const heading = document.createElement('h2');
        heading.textContent = 'Hey ' + userData.name +'!';
        const ringImg = document.createElement('img');
        ringImg.src = ring;
        ringImg.alt = 'Music4Life';
        const avt = document.createElement('img');
        if(userData.picture_path != null){
          avt.src = userData.picture_path;
        }
        else{
          avt.src = profile;
        }
        avt.alt = 'Music4Life';

        hello.appendChild(heading);
        hello.appendChild(ringImg);
        avtDiv.appendChild(avt);

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

    const listHeadingName = ["Mood Boosters", "Made for Huu Hiep", "Recently played", "Best artists"];

    const addContent = () => {
      const content = document.querySelector('.content');
      for(let j=0; j<2; j++){
        const div = document.createElement('div');
        div.className = 'music-dashboard';
        const heading = document.createElement('h2');
        heading.textContent = listHeadingName[j];
        div.appendChild(heading);

        const ul = document.createElement('ul');
        ul.className = 'music-dashboard-list';
      
        for (let i = 0; i < 4; i++) {

          const li = document.createElement('li');
          li.className = 'music-dashboard-item';
      
          const imgDiv = document.createElement('div');
          imgDiv.className = 'music-dashboard-item-img';
          const img = document.createElement('img');
          img.src = '../../data/images/anh-chua-thuong-em-den-vay-dau.jpg';
          img.alt = 'anh-chua-thuong-em-den-vay-dau';
          imgDiv.appendChild(img);
      
          const infoDiv = document.createElement('div');
          infoDiv.className = 'music-dashboard-item-info';
          const title = document.createElement('h3');
          title.textContent = 'Chưa Thương Em Đến Vậy Đâu';
          const author = document.createElement('p');
          author.textContent = 'Lady Mây';
          infoDiv.appendChild(title);
          infoDiv.appendChild(author);
      
          li.appendChild(imgDiv);
          li.appendChild(infoDiv);
      
          ul.appendChild(li);
        }
        div.appendChild(ul);
        content.appendChild(div);
      }
    };
    useEffect(() => {
        if (!isHeaderAdded && !headerAddedRef.current) {
            fetchUserData();
            setIsHeaderAdded(true);
            headerAddedRef.current = true;
        }
    }, []);

    return (
      <div></div>
    );
}

function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
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