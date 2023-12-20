import React, { useState, useEffect, useRef } from "react";
import musical_sound_music_logo from "../Icon/musical-sound-music-logo.svg";
import api from '../../api';
import sharedVariables from './shareVariable';

// Kiểm tra URL hiện tại và tải tệp CSS khi URL khớp với /dashboard
if (window.location.pathname === '/dashboard') {
    require('./Dashboard.css'); // Import tệp CSS
}


function LoadingDashboard() {
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
    const initialFormStateAlbum = {
      id: '',
      artist_id: '',
      name: '',
      release_date: '',
    }
    
    const [dataUser, setDataUser] = useState(initialFormState);
    const [dataSong, setDataSong] = useState(initialFormStateSong);
    const [dataArtist, setDataArtist] = useState(initialFormStateArtist);
    const [dataAlbum, setDataAlbum] = useState(initialFormStateAlbum);
    const contentAddedRef = useRef(false);
    const [isContentAdded, setIsContentAdded] = useState(false);

    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        //Get user data
        const response = await api.get(`/api/users/${id}`);
        const userData = await response.json();
        setDataUser(userData);

        // Add content
        const listHeadingName = ["Mood Boosters", "Made for " + userData.name, "Recently played", "Best artists"];

        // Get mood boosters
        const moodBoosters = [];
        for (let i = 0; i < 2; i++) {
          const responseSong = await api.get(`/api/songs/random_with_genre/1`);
          const songJSON = await responseSong.json();
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
          const responseArtist = await api.get(`/api/artists/${idArtistLikes[i].id}`);
          const artistJSON = await responseArtist.json();
          setDataArtist(artistJSON);
          bestArtists.push(artistJSON);
        }

        //Get Made for user
        const token = localStorage.getItem('access_token');
        const headers = {
          Authorization: `Bearer ${token}`
        };
        const artistMadeForUser = await api.get(`/api/users/${id}/like_artists`, { headers });
        const artistMadeForUserJSON = await artistMadeForUser.json();
        const artistMadeForUserList = [];
        setDataArtist(...artistMadeForUserJSON);
        artistMadeForUserList.push(...artistMadeForUserJSON);

        const albumForUserList = [];
        for(let i=0; i<artistMadeForUserList.length; i++){
          const responseAlbum = await api.get(`/api/albums/artist/${artistMadeForUserList[i].id}/random`);
          const albumJSON = await responseAlbum.json();
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
        const response = await api.get(`/api/songs/${idSong}/artists`);
        const artistJSON = await response.json();
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
        const response = await api.get(`/api/artists`);
        const artistJSON = await response.json();
        const cntArtist = artistJSON.length;
        const id_likes = [];
        for(let i=0; i<cntArtist; i++){
          try{
            const response = await api.get(`/api/artists/${i+1}/likes`);
            const artistLikeJSON = await response.json();
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

    // Function to add content
    const addContent = (listHeadingName, moodBoosters, bestArtists, artistMadeForUserList, albumForUserList) => {
      const content = document.querySelector('.content');
      const seeMoreFunctions = [
        function() {
          // Thực hiện hàm cho button "See More" đầu tiên
          console.log("See More button 1 clicked");
          // Thực hiện các hành động khác tại đây
          
        },
        function() {
          // Thực hiện hàm cho button "See More" thứ hai
          console.log("See More button 2 clicked");
          // Thực hiện các hành động khác tại đây
        },
        function() {
          // Thực hiện hàm cho button "See More" thứ ba
          console.log("See More button 3 clicked");
          // Thực hiện các hành động khác tại đây
        },    
        function() {
          // Thực hiện hàm cho button "See More" thứ tư
          console.log("See More button 4 clicked");
          // Thực hiện các hành động khác tại đây
        }
      ];
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
        seeMoreButton.addEventListener('click', seeMoreFunctions[j]);

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
      if (!isContentAdded && !contentAddedRef.current) {
        fetchUserData();
        setIsContentAdded(true);
        contentAddedRef.current = true;
      }
    }, []);

}

export default LoadingDashboard;