import React, { useState, useEffect, useRef } from "react";
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg";
import favourite from "../Icon/favourite.png";
import home from "../Icon/home.png";
import profile from "../Icon/profile.png";
import search from "../Icon/search.png";
import setting from "../Icon/setting.png";
import ring from "../Icon/ring.png";
import axios from 'axios';
import LoadingHome from "./LoadHome";

// Loading page
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

function DashboardPage() {
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchDisplay = async () =>{
    try{
      //Get user data
      const response = await axios.get(`/api/users/${id}`);
      const userData = response.data;
      setDataUser(userData);

      // Add header content
      addHeaderContent(userData);
    }
    catch(error){
      console.log(error);
    }
  }

  // Function to add header content
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
        avt.src = "images/default-avatar.jpg";
      }
      avt.alt = 'Music4Life';

      hello.appendChild(heading);
      hello.appendChild(ringImg);
      avtDiv.appendChild(avt);

      const modeSwitchContainer = document.querySelector('.nav-bar');
      modeSwitchContainer.appendChild(createNavBar());
  };
  // Function to create nav bar
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

      const clearContentButton = document.createElement('button');
      clearContentButton.id = 'clear-content-button';
      clearContentButton.textContent = 'Clear Content';
      // Lắng nghe sự kiện click vào nút "Clear Content"
      clearContentButton.addEventListener('click', function() {
        clearContent();
      });
      
      listNav.appendChild(clearContentButton);

      navBar.appendChild(listNav);

      return navBar;
  };

  // Hàm clearContent để xóa nội dung trong .content
  const clearContent = () => {
    const content = document.querySelector('.content');
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }
  };

  // Function to create nav item
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
  function hideContentAndShowDiv(divToShow) {
    const content = document.querySelector('.content');
    const divsToHide = content.querySelectorAll('div');
    
    // Ẩn đi các div trong .content
    for (let i = 0; i < divsToHide.length; i++) {
      divsToHide[i].style.display = 'none';
    }
  
    // Hiển thị div được chỉ định
    const divToDisplay = document.querySelector(divToShow);
    if (divToDisplay) {
      divToDisplay.style.display = 'block';
    }
  }
  // 
  function showDivAndRemoveCurrentDiv(divToShow, divToRemove) {
    const divToDisplay = document.querySelector(divToShow);
    const divToRemove = document.querySelector(divToRemove);
  
    if (divToDisplay && divToRemove) {
      divToDisplay.style.display = 'block';
      divToRemove.parentNode.removeChild(divToRemove);
    }
  }
  

  useEffect(() => {
    if (!isHeaderAdded && !headerAddedRef.current) {
      fetchDisplay();
      setIsHeaderAdded(true);
      headerAddedRef.current = true;
    }
    const fetchData = setTimeout(() => {
      setIsLoaded(true);
      setIsFirstLoad(false); // Đánh dấu là không phải lần đầu tiên mở dashboard
    }, 1000);
    return () => clearTimeout(fetchData);
  }, []);

  return (
    <React.StrictMode>
        <link rel="stylesheet" type="text/css" href="./Pages/Dashboard/Dashboard.css" />
        {isLoaded ? (
          isFirstLoad ? <LoadingHome /> : null
        ) : (
          <LoadingHome />
        )}
    </React.StrictMode>
  );
}

export default DashboardPage;