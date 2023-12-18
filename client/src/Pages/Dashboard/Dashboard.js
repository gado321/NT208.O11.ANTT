import React, { useState, useEffect, useRef } from "react";
import favourite from "../Icon/favourite.png";
import home from "../Icon/home.png";
import profile from "../Icon/profile.png";
import search from "../Icon/search.png";
import setting from "../Icon/setting.png";
import ring from "../Icon/ring.png";
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg";
import axios from 'axios';
import { Alert } from "bootstrap";
import { set } from "react-hook-form";


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
    const initialFormStateSong = {
      id: '',
      name: '',
      like: '',
      play_count: '',
      path: '',
      picture_path: '',
      release_date: '',
      artist_name: [],
    }
    const initialFormStateArtist = {
      id: '',
      name: '',
      picture_path: '',
    }
    const initialFormStateArtistLike = {
      likes: '',
    }
    const initialFormStateAlbum = {
      id: '',
      artist_id: '',
      name: '',
      release_date: '',
    }
    
    const [dataUser, setDataUser] = useState(initialFormState);
    const [dataSong, setDataSong] = useState(initialFormStateSong);
    const [dataArtist, setDataArtist] = useState(initialFormStateArtist);
    const [dataArtistLike, setDataArtistLike] = useState(initialFormStateArtistLike);
    const [dataAlbum, setDataAlbum] = useState(initialFormStateAlbum);

    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        //Get user data
        transSongToArtist(62);
        const response = await axios.get(`/api/users/${id}`);
        const userData = response.data;
        setDataUser(userData);

        // Add header content
        addHeaderContent(userData);

        // Add content
        const listHeadingName = ["Mood Boosters", "Made for " + userData.name, "Recently played", "Best artists"];

        // Get mood boosters
        const moodBoosters = [];
        for (let i = 0; i < 2; i++) {
          const responseSong = await axios.get(`/api/songs/random_with_genre/1`);
          const songJSON = responseSong.data;
          const song = [];
          song.push(...songJSON);
          setDataSong(...song);
          for(let j=0; j<song.length; j++){
            song[j].artist_name = await transSongToArtist(song[j].id);
          }
          moodBoosters.push(...song);
        }

        // Get best artists
        const idArtistLikes = await sortArtistByLike();
        const bestArtists = [];
        for (let i = 0; i < 7; i++) {
          const responseArtist = await axios.get(`/api/artists/${idArtistLikes[i].id}`);
          const artistJSON = responseArtist.data;
          setDataArtist(artistJSON);
          bestArtists.push(artistJSON);
        }

        //Get Made for user
        const token = localStorage.getItem('access_token');
        const headers = {
          Authorization: `Bearer ${token}`
        };
        const artistMadeForUser = await axios.get(`/api/users/${id}/like_artists`, { headers });
        const artistMadeForUserJSON = artistMadeForUser.data;
        const artistMadeForUserList = [];
        setDataArtist(...artistMadeForUserJSON);
        artistMadeForUserList.push(...artistMadeForUserJSON);

        const albumForUserList = [];
        for(let i=0; i<artistMadeForUserList.length; i++){
          const responseAlbum = await axios.get(`/api/albums/artist/${artistMadeForUserList[i].id}/random`);
          const albumJSON = responseAlbum.data;
          setDataAlbum(albumJSON);
          albumForUserList.push(albumJSON);
        }

        addContent(listHeadingName, moodBoosters, bestArtists, artistMadeForUserList, albumForUserList);

      } catch (error) {
        // Xử lý lỗi nếu có
        alert("Error: " + error.message);
        console.error(error);
      }
    };

    // Function to fetch Artist data from Song
    const transSongToArtist = async (idSong) => {
      try {
        const response = await axios.get(`/api/songs/${idSong}/artists`);
        const artistJSON = response.data;
        const artistList = [];
        artistList.push(...artistJSON);
        return artistList;
      }
      catch (error) {
        alert("Error: " + error.message);
        console.error(error);
      }
    }

    // Function to sort Artist by like
    const sortArtistByLike = async () => {
      try {
        const response = await axios.get(`/api/artists`);
        const artistJSON = response.data;
        const cntArtist = artistJSON.length;
        const id_likes = [];
        for(let i=0; i<cntArtist; i++){
          try{
            const response = await axios.get(`/api/artists/${i+1}/likes`);
            const artistLikeJSON = response.data;
            id_likes.push({ id: i+1, likes: artistLikeJSON.likes });
          }
          catch (error) {
            id_likes.push({ id: i+1, likes: -1 });
          }
        }
        id_likes.sort((a, b) => b.likes - a.likes);

        return id_likes.slice(0, 7);
      }
      catch (error) {
        alert("Error: " + error.message);
        console.error(error);
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

    // Function to add content
    const addContent = (listHeadingName, moodBoosters, bestArtists, artistMadeForUserList, albumForUserList) => {
      const content = document.querySelector('.content');
      for(let j=0; j<4; j++){
        const div = document.createElement('div');
        div.className = 'music-dashboard';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'music-dashboard-list-header';
        const heading = document.createElement('h2');
        heading.textContent = listHeadingName[j];
        // Tạo phần tử div cho See More button
        const seeMoreDiv = document.createElement('div');
        seeMoreDiv.className = 'see-more-button';
        const seeMoreButton = document.createElement('button');
        seeMoreButton.textContent = 'See More';
        seeMoreDiv.appendChild(seeMoreButton);

        // Thêm sự kiện click cho nút See More
        seeMoreButton.addEventListener('click', function() {
          // Xử lý sự kiện khi nút See More được nhấp
          console.log('See More button clicked');
          // Thực hiện các hành động khác tại đây
        });
        headerDiv.appendChild(heading);
        headerDiv.appendChild(seeMoreDiv);
        div.appendChild(headerDiv);

        const ul = document.createElement('ul');
        ul.className = 'music-dashboard-list';
        for (let i = 0; i < 4; i++) {
          if(listHeadingName[j] === "Mood Boosters" ){//|| listHeadingName[j] !== "Recently played"){
            const li = document.createElement('li');
            li.className = 'music-dashboard-item';
        
            const imgDiv = document.createElement('div');
            imgDiv.className = 'music-dashboard-item-img';
            const img = document.createElement('img');
            img.src = "images/default-song.jpg";
            img.alt = 'default-song';
            imgDiv.appendChild(img);
        
            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-dashboard-item-info';
            const title = document.createElement('h3');
            title.textContent = moodBoosters[i].name;
            const artist = document.createElement('p');
            const artistNames = moodBoosters[i].artist_name.map(artist => artist.name);
            const artistText =
                        artistNames.length === 1
                        ? artistNames[0]
                        : artistNames.length === 2
                        ? artistNames.join(', ')
                        : artistNames.slice(0, 2).join(', ') + '...';
            artist.textContent = artistText;
            infoDiv.appendChild(title);
            infoDiv.appendChild(artist);
        
            li.appendChild(imgDiv);
            li.appendChild(infoDiv);
        
            ul.appendChild(li);            
          }
          else if(listHeadingName[j] === "Best artists"){
            const li = document.createElement('li');
            li.className = 'music-dashboard-item';
          
            const imgDiv = document.createElement('div');
            imgDiv.className = 'music-dashboard-item-img';
            const img = document.createElement('img');
            img.src = "images/default-artist.jpg";
            img.alt = 'default-artist';
            imgDiv.appendChild(img);
        
            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-dashboard-item-info';
            const title = document.createElement('h3');
            title.textContent = bestArtists[i].name;
            infoDiv.appendChild(title);
        
            li.appendChild(imgDiv);
            li.appendChild(infoDiv);
        
            ul.appendChild(li);
          }
          else if(listHeadingName[j].includes('Made for ')){
            const li = document.createElement('li');
            li.className = 'music-dashboard-item';
          
            const imgDiv = document.createElement('div');
            imgDiv.className = 'music-dashboard-item-img';
            const img = document.createElement('img');
            img.src = "images/default-artist.jpg";
            img.alt = 'default-artist';
            imgDiv.appendChild(img);
        
            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-dashboard-item-info';
            const title = document.createElement('h3');
            title.textContent = albumForUserList[i].name;
            const artist = document.createElement('p');
            artist.textContent = artistMadeForUserList[i].name;
            infoDiv.appendChild(title);
            infoDiv.appendChild(artist);
        
            li.appendChild(imgDiv);
            li.appendChild(infoDiv);
        
            ul.appendChild(li);
          }
          else{
            const li = document.createElement('li');
            li.className = 'music-dashboard-item';
        
            const imgDiv = document.createElement('div');
            imgDiv.className = 'music-dashboard-item-img';
            const img = document.createElement('img');
            img.src = "images/anh-chua-thuong-em-den-vay-dau.jpg";
            img.alt = 'anh-chua-thuong-em-den-vay-dau';
            imgDiv.appendChild(img);
        
            const infoDiv = document.createElement('div');
            infoDiv.className = 'music-dashboard-item-info';
            const title = document.createElement('h3');
            title.textContent = 'Chưa Thương Em Đến Vậy Đâu';
            const artist = document.createElement('p');
            artist.textContent = 'Lady Mây';
            infoDiv.appendChild(title);
            infoDiv.appendChild(artist);
        
            li.appendChild(imgDiv);
            li.appendChild(infoDiv);
        
            ul.appendChild(li);            
          }
        }
        div.appendChild(ul);
        content.appendChild(div);
      }
    };

    // Function useEffect
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