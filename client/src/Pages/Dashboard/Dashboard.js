import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg";
import favourite from "../Icon/favourite.png";
import home from "../Icon/home.png";
import profile from "../Icon/profile.png";
import search from "../Icon/search.png";
import setting from "../Icon/setting.png";
import ring from "../Icon/ring.png";
import like from "../Icon/like.png";
import shuffle from "../Icon/shuffle.png";
import skipForward from "../Icon/skip-forward.png";
import play from "../Icon/play.png";
import skipNext from "../Icon/skip-next.png";
import repeat from "../Icon/repeat.png";
import queue from "../Icon/queue.png";
import loudspeaker from "../Icon/loudspeaker.png";
import LoadingHome from "./LoadHome";
import Dashboard from './Dashboard'
import api from "../../api";
// import Setting from "../Setting/setting";

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
  const [isHeaderAdded, setIsHeaderAdded] = useState(false);
  const headerAddedRef = useRef(false);

  const fetchDisplay = async () =>{
    try{
      //Get user data
      const response = await api.get(`/api/users/${id}`);
      const userData = await response.json();
      setDataUser(userData);

      // Add header content
      addHeaderContent(userData);
      // Add footer content
      addFooterContent();
    }
    catch(error){
      console.log(error);
    }
  }

  // Function to add header content
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
      homeIcon.addEventListener('click', function() {
        window.location.href = '/dashboard';
      });
      listNav.appendChild(homeIcon);

      const searchIcon = createNavItem('search', search, 'Search');
      listNav.appendChild(searchIcon);

      const favouriteIcon = createNavItem('favourite', favourite, 'Favourites');
      listNav.appendChild(favouriteIcon);

      const profileIcon = createNavItem('profile', profile, 'Profile');
      listNav.appendChild(profileIcon);

      const settingIcon = createNavItem('setting', setting, 'Setting');
      settingIcon.addEventListener('click', function() {
        // <Setting />
      });
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

  // Function to add footer content
  const addFooterContent = () => {
    const div = document.querySelector('.footer');

    const playlistContainerDiv = document.createElement('div');
    playlistContainerDiv.className = 'playlist-container';
    
    const playingSongContainerDiv = document.createElement('div');
    playingSongContainerDiv.className = 'playing-song-container';
    
    const logoPlayingSongImg = document.createElement('img');
    logoPlayingSongImg.className = 'logo-playing-song';
    logoPlayingSongImg.src = 'images/default-song.jpg';
    
    const playingSongInfoDiv = document.createElement('div');
    playingSongInfoDiv.className = 'playing-song-info';
    
    const playingSongTitleP = document.createElement('p');
    playingSongTitleP.className = 'playing-song-title';
    playingSongTitleP.textContent = 'Chưa Biết';
    
    const playingSongAuthorP = document.createElement('p');
    playingSongAuthorP.className = 'playing-song-author';
    playingSongAuthorP.textContent = 'Đạt G';
    
    const likeSongDiv = document.createElement('div');
    likeSongDiv.className = 'like-song';
    
    const likeSongImg = document.createElement('img');
    likeSongImg.className = 'icon-like-song';
    likeSongImg.src = like;
    likeSongImg.setAttribute('onClick', 'likeSong');
    likeSongDiv.appendChild(likeSongImg);
    
    const managePlaylistContainerDiv = document.createElement('div');
    managePlaylistContainerDiv.className = 'manage-playlist-container';
    
    const btnPlaylistContainerDiv = document.createElement('div');
    btnPlaylistContainerDiv.className = 'btn-playlist-container';
    
    const iconMixSongImg = document.createElement('img');
    iconMixSongImg.className = 'icon-mix-song';
    iconMixSongImg.src = shuffle;
    iconMixSongImg.setAttribute('onClick', 'mixSong');
    
    const iconPreviousSongImg = document.createElement('img');
    iconPreviousSongImg.className = 'icon-previous-song';
    iconPreviousSongImg.src = skipForward;
    iconPreviousSongImg.setAttribute('onClick', 'previousSong');
    
    const iconPlaySongImg = document.createElement('img');
    iconPlaySongImg.className = 'icon-play-song';
    iconPlaySongImg.src = play;
    iconPlaySongImg.setAttribute('onClick', 'playSong');
    
    const iconNextSongImg = document.createElement('img');
    iconNextSongImg.className = 'icon-next-song';
    iconNextSongImg.src = skipNext;
    iconNextSongImg.setAttribute('onClick', 'nextSong');
    
    const iconRepeatSongImg = document.createElement('img');
    iconRepeatSongImg.className = 'icon-repeat-song';
    iconRepeatSongImg.src = repeat;
    iconRepeatSongImg.setAttribute('onClick', 'repeatSong');
    
    const iconListSongImg = document.createElement('img');
    iconListSongImg.className = 'icon-list-song';
    iconListSongImg.src = queue;
    iconListSongImg.setAttribute('onClick', 'listSong');
    
    const timestampSongContainerDiv = document.createElement('div');
    timestampSongContainerDiv.className = 'timestamp-song-container';
    
    const timestampSongStartP = document.createElement('p');
    timestampSongStartP.className = 'timestamp-song';
    timestampSongStartP.textContent = '0:00';
    
    const songTimelineInput = document.createElement('input');
    songTimelineInput.className = 'song-timeline';
    songTimelineInput.type = 'range';
    songTimelineInput.min = '0';
    songTimelineInput.max = '100';
    songTimelineInput.value = '0';
    
    const timestampSongEndP = document.createElement('p');
    timestampSongEndP.className = 'timestamp-song';
    timestampSongEndP.textContent = '0:00';
    
    const mutePlaySongContainerDiv = document.createElement('div');
    mutePlaySongContainerDiv.className = 'mute-play-song-container';
    
    const iconMuteSongImg = document.createElement('img');
    iconMuteSongImg.className = 'icon-mute-song';
    iconMuteSongImg.src = loudspeaker;
    iconMuteSongImg.setAttribute('onClick', 'muteSong');
    
    const volumeSongInput = document.createElement('input');
    volumeSongInput.className = 'volume-song';
    volumeSongInput.type = 'range';
    volumeSongInput.min = '0';
    volumeSongInput.max = '100';
    volumeSongInput.value = '100';
    
    // Gắn các phần tử vào cấu trúc cây DOM
    
    // Gắn logoPlayingSongImg vào playingSongContainerDiv
    playingSongContainerDiv.appendChild(logoPlayingSongImg);
    
    // Gắn playingSongTitleP và playingSongAuthorP vào playingSongInfoDiv
    playingSongInfoDiv.appendChild(playingSongTitleP);
    playingSongInfoDiv.appendChild(playingSongAuthorP);
    
    // Gắn playingSongInfoDiv và likeSongImg vào playingSongContainerDiv
    playingSongContainerDiv.appendChild(playingSongInfoDiv);
    playingSongContainerDiv.appendChild(likeSongDiv);

    // Gắn cácnút và biểu tượng vào timestampSongContainerDiv
    timestampSongContainerDiv.appendChild(timestampSongStartP);
    timestampSongContainerDiv.appendChild(songTimelineInput);
    timestampSongContainerDiv.appendChild(timestampSongEndP);
    
    // Gắn các nút và biểu tượng vào btnPlaylistContainerDiv
    btnPlaylistContainerDiv.appendChild(iconMixSongImg);
    btnPlaylistContainerDiv.appendChild(iconPreviousSongImg);
    btnPlaylistContainerDiv.appendChild(iconPlaySongImg);
    btnPlaylistContainerDiv.appendChild(iconNextSongImg);
    btnPlaylistContainerDiv.appendChild(iconRepeatSongImg);
    btnPlaylistContainerDiv.appendChild(iconListSongImg);
    managePlaylistContainerDiv.appendChild(btnPlaylistContainerDiv);
    managePlaylistContainerDiv.appendChild(timestampSongContainerDiv);
    
    // Gắn iconMuteSongImg và volumeSongInput vào mutePlaySongContainerDiv
    mutePlaySongContainerDiv.appendChild(iconMuteSongImg);
    mutePlaySongContainerDiv.appendChild(volumeSongInput);
    
    // Gắn playingSongContainerDiv, managePlaylistContainerDiv, và mutePlaySongContainerDiv vào playlistContainerDiv
    playlistContainerDiv.appendChild(playingSongContainerDiv);
    playlistContainerDiv.appendChild(managePlaylistContainerDiv);
    playlistContainerDiv.appendChild(mutePlaySongContainerDiv);
    
    // Gắn playlistContainerDiv vào div.footer
    div.appendChild(playlistContainerDiv);
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