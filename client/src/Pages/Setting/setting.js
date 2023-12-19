import React, { useState, useEffect, useRef } from "react";
import favourite from "../Icon/favourite.png";
import home from "../Icon/home.png";
import profile from "../Icon/profile.png";
import search from "../Icon/search.png";
import setting from "../Icon/setting.png";
import ring from "../Icon/ring.png";
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg";
import axios from 'axios';
import './SettingPage.css';
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
function SettingPage() {
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

    const dictSettingName = {
        ACCOUNT: ['View Profile', 'Edit Profile', 'Change E-mail', 'Change Password', 'Go Premium', 'Log out'],
        APP:['Privacy Policy', 'Share this app', 'Rate this app', 'Help', 'Sleep Timer', 'Set Favorite Genres']
      };
    const addContent = () => {
        const content = document.querySelector('.content-page');
        // content.className = 'content-page-setting';
        const listKeySettingName = Object.keys(dictSettingName);
        for(let j=0; j<listKeySettingName.length; j++){
            const div = document.createElement('div');
            div.className = 'list-SettingUser';
            
            const heading = document.createElement('h2');
            heading.textContent = listKeySettingName[j];
            div.appendChild(heading);

            const ul = document.createElement('ul');
            ul.className = 'Setting-list';

            const listSettingName = dictSettingName[listKeySettingName[j]];
            for (let i = 0; i < listSettingName.length; i++) {
                const li = document.createElement('li');
                const button = document.createElement('button');
                button.textContent = listSettingName[i];
                li.appendChild(button);
                ul.appendChild(li);
            }
            div.appendChild(ul);
            content.appendChild(div);   
        }
      const deleteAccount = document.createElement('div');
      deleteAccount.className = 'delete-account-container';
      const button = document.createElement('button');
      button.className = 'delete-account-button';
      button.textContent = 'Delete Account';
      deleteAccount.appendChild(button);
      content.appendChild(deleteAccount);
    };
    useEffect(() => {
        if (!isHeaderAdded && !headerAddedRef.current) {
            
            fetchUserData();
            setIsHeaderAdded(true);
            headerAddedRef.current = true;
        }
    }, []);

    return (
      <div>{}</div>
    );
}

function SettingPagePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(fetchData);
  }, []);

  return (
    <React.StrictMode>
        {isLoaded ? 
        <><SettingPage /> </>: <Loading />}
    </React.StrictMode>
  );
}

export default SettingPagePage;