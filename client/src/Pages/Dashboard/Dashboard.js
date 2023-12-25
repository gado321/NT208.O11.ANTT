import React, { useState, useEffect, useRef } from "react";
import {Howl, Howler} from 'howler';
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
import pause from "../Icon/pause.svg";
import skipNext from "../Icon/skip-next.png";
import repeat from "../Icon/repeat.png";
import queue from "../Icon/queue.png";
import loudspeaker from "../Icon/loudspeaker.png";
import mute from "../Icon/mute.png";
import api from "../../api";
import LoadingHome from "./LoadHome";
import {addSettingContent, addProfileContent} from "./SettingContent"

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
  var sound = new Howl({
    src: './song/thang-nam.mp3', // URL của file nhạc
    format: 'mp3', // Định dạng file nhạc
    autoplay: false, // Tắt chế độ tự động phát
    html5: true, // Sử dụng HTML5 Audio để phát nhạc nếu có thể
    onplay: function() {
      // Bắt đầu cập nhật thời gian bài hát khi bắt đầu phát
      setInterval(updateTimestamp, 1000);
    },
    onend: function() {
      // Khi bài hát kết thúc, dừng cập nhật thời gian
      clearInterval(timestampInterval);
    },
  });
  // Thêm thuộc tính tùy chỉnh cho đối tượng sound
  sound.title = 'Tháng Năm';
  sound.artist = 'Soobin Hoàng Sơn';
  sound.imagePath = 'images/anh-chua-thuong-em-den-vay-dau.jpg';

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
      searchIcon.addEventListener('click', function() {
        window.location.href = '/search';
      });
      listNav.appendChild(searchIcon);

      const favouriteIcon = createNavItem('favourite', favourite, 'Favourites');
      listNav.appendChild(favouriteIcon);

      const profileIcon = createNavItem('profile', profile, 'Profile');
      listNav.appendChild(profileIcon);

      const settingIcon = createNavItem('setting', setting, 'Setting');
      settingIcon.addEventListener('click', function() {
        addSettingContent();
      });
      listNav.appendChild(settingIcon);

      navBar.appendChild(listNav);

      return navBar;
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

  function volumeControl(value) {
    sound.volume(value);
  }
  function timeLineControl(value) {
    var seekTime = sound.duration() * value;
    sound.seek(seekTime);
  }
  let timestampInterval; // Biến lưu trữ ID của interval

  function updateTimestamp() {
      const currentPosition = sound.seek(); // Lấy vị trí hiện tại của bài hát (thời gian tính bằng giây)
      const formattedTime = formatTime(currentPosition); // Định dạng thời gian hiện tại
      document.querySelector('#timestamp-song-start').textContent = formattedTime;
      document.querySelector('#timestamp-song-end').textContent = formatTime(sound.duration());
  }

  function formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function nextSong() {
    sound.stop();
  }
  function previousSong() {
    sound.stop();
  }

  // Function to add footer content
  const addFooterContent = () => {

    // Tạo cấu trúc cây DOM cho footer
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
    playingSongTitleP.textContent = 'NaN';
    
    const playingSongAuthorP = document.createElement('p');
    playingSongAuthorP.className = 'playing-song-author';
    playingSongAuthorP.textContent = 'NaN';
    
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
    iconPreviousSongImg.addEventListener('click', function() {
      previousSong();
    });
    
    const iconPlaySongImg = document.createElement('img');
    iconPlaySongImg.className = 'icon-play-song';
    iconPlaySongImg.src = play;
    let isPlaying = false; // Biến trạng thái, ban đầu là không phát
    // Thêm sự kiện click cho nút play
    iconPlaySongImg.addEventListener('click', function() {
      if (isPlaying) {
        // Nếu đang phát, chuyển sang trạng thái tạm dừng
        iconPlaySongImg.src = pause;
        sound.play();
        document.querySelector('.playing-song-title').textContent = sound.title;
        document.querySelector('.playing-song-author').textContent = sound.artist;
        document.querySelector('.logo-playing-song').src = sound.imagePath;
      } else {
        // Nếu đang tạm dừng, chuyển sang trạng thái phát
        iconPlaySongImg.src = play;
        sound.pause();
      }
      isPlaying = !isPlaying; // Đảo ngược trạng thái
      // Thực hiện các hành động khác tại đây
    });
    
    const iconNextSongImg = document.createElement('img');
    iconNextSongImg.className = 'icon-next-song';
    iconNextSongImg.src = skipNext;
    iconNextSongImg.addEventListener('click', function() {
      nextSong();
    });
    
    const iconRepeatSongImg = document.createElement('img');
    iconRepeatSongImg.className = 'icon-repeat-song';
    iconRepeatSongImg.src = repeat;
    iconRepeatSongImg.setAttribute('click', 'repeatSong');
    
    const iconListSongImg = document.createElement('img');
    iconListSongImg.className = 'icon-list-song';
    iconListSongImg.src = queue;
    iconListSongImg.setAttribute('click', 'listSong');
    
    const timestampSongContainerDiv = document.createElement('div');
    timestampSongContainerDiv.className = 'timestamp-song-container';
    
    const timestampSongStartP = document.createElement('p');
    timestampSongStartP.className = 'timestamp-song';
    timestampSongStartP.id = 'timestamp-song-start';
    timestampSongStartP.textContent = '0:00';
    
    const songTimelineInput = document.createElement('input');
    songTimelineInput.className = 'song-timeline';
    songTimelineInput.type = 'range';
    songTimelineInput.min = '0';
    songTimelineInput.max = '100';
    songTimelineInput.step = '1';
    songTimelineInput.value = '0';
    // Bắt sự kiện thay đổi tua bài hát từ slider
    songTimelineInput.addEventListener('change', function(e) {
      timeLineControl(e.target.value / 100);
    });
    
    const timestampSongEndP = document.createElement('p');
    timestampSongEndP.className = 'timestamp-song';
    timestampSongEndP.id = 'timestamp-song-end';
    timestampSongEndP.textContent = '0:00';
    
    const mutePlaySongContainerDiv = document.createElement('div');
    mutePlaySongContainerDiv.className = 'mute-play-song-container';
    
    const iconMuteSongImg = document.createElement('img');
    iconMuteSongImg.className = 'icon-mute-song';
    iconMuteSongImg.src = loudspeaker;
    let isMute = false; // Biến trạng thái, ban đầu là không phát
    iconMuteSongImg.addEventListener('click', function() {
      if(isMute) {
        iconMuteSongImg.src = mute;
        volumeControl(0);
      }
      else if(!isMute) {
        iconMuteSongImg.src = loudspeaker;
        volumeControl(1);
      }
      isMute = !isMute;
    });
    
    const volumeSongInput = document.createElement('input');
    volumeSongInput.className = 'volume-song';
    volumeSongInput.type = 'range';
    volumeSongInput.min = '0';
    volumeSongInput.max = '1';
    volumeSongInput.step = '0.1';
    volumeSongInput.value = '1';

    volumeSongInput.addEventListener('change', function(e) {
      volumeControl(e.target.value);
    });
    
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



  useEffect(() => {
    if(!localStorage.getItem('access_token')) {
      window.location.href = '/'; // Điều hướng về trang ban đầu của bạn
    }
    else {
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
    }

  }, []);

  return (
    <>
    <React.StrictMode>
      <link rel="stylesheet" type="text/css" href="./Dashboard.css" />
      {isLoaded ? (
        isFirstLoad ? <LoadingHome /> : null
      ) : (
        <LoadingHome />
      )}
    </React.StrictMode>
    </>
  );
}

export default DashboardPage;