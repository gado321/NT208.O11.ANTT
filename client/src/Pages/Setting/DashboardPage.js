import React, { useState, useEffect, useRef } from "react";
import api from '../../api';
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
import { Howl, Howler } from 'howler';

// Kiểm tra URL hiện tại và tải tệp CSS khi URL khớp với /dashboard
if (window.location.pathname === '/dashboard') {
    require('./Dashboard.css'); // Import tệp CSS
}
function PlayMusic(musicPath) {

}

function artistsDisplay(artistsID) {
  
}

function DashboardPage() {
  var sound = new Howl({});
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
      for (let i = 0; i < 3; i++) {
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

  const addContent = (listHeadingName, moodBoosters, bestArtists, artistMadeForUserList, albumForUserList) => {
    // Get content
    const content = document.querySelector('.content');
    content.innerHTML = '';
    // Add event listener for see more button
    const seeMoreFunctions = [
      function() {
        // Thực hiện hàm cho button "See More" đầu tiên
        console.log("See More button 1 clicked");
        // Thực hiện các hành động khác tại đây
        const div = document.createElement('div');
        div.className = 'music-dashboard-detail';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'music-dashboard-list-header';
        const heading = document.createElement('h2');
        heading.textContent = listHeadingName[0];
        // Tạo phần tử div cho See More button
        const closeDiv = document.createElement('div');
        closeDiv.className = 'close-button';
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeDiv.appendChild(closeButton);

        // Thêm sự kiện click cho nút See More
        closeButton.addEventListener('click', function() {
          // Xử lý sự kiện khi nút See More được nhấp
          console.log('See More button clicked');
          // Thực hiện các hành động khác tại đây
          showDivAndRemoveCurrentDiv('.music-dashboard', '.music-dashboard-detail');
        });

        headerDiv.appendChild(heading);
        headerDiv.appendChild(closeDiv);
        div.appendChild(headerDiv);

        const ul = document.createElement('ul');
        ul.className = 'music-dashboard-list';
        ul.style.flexWrap = 'wrap';
        for (let i = 0; i < moodBoosters.length; i++) {
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

          // Thêm thuộc tính data-music-path vào phần tử li
          li.dataset.musicPath = moodBoosters[i].path;

          // Thêm sự kiện click cho li
          li.addEventListener('click', () => {
              sound = new Howl({
              src: './song/music.mp3', // URL của file nhạc
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
            sound.title = moodBoosters[i].name;
            sound.artist = artistText;
            sound.imagePath = 'images/song/Havana.jpg';

            let timestampInterval; // Biến lưu trữ ID của interval

            function updateTimestamp() {
                const currentPosition = sound.seek(); // Lấy vị trí hiện tại của bài hát (thời gian tính bằng giây)
                const formattedTime = formatTime(currentPosition); // Định dạng thời gian hiện tại
                if(document.querySelector('.timestamp-song-start') != null && document.querySelector('.timestamp-song-end') != null){
                  document.querySelector('.timestamp-song-start').textContent = formattedTime;
                  document.querySelector('.timestamp-song-end').textContent = formatTime(sound.duration());
                }
            }
          
            function formatTime(time) {
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
          
          
            resetFooter(sound);
          });
        
            li.appendChild(imgDiv);
            li.appendChild(infoDiv);
        
            ul.appendChild(li);            
        }
        div.appendChild(ul);
        content.appendChild(div);
        hideContentAndShowDiv('.music-dashboard-detail', '.music-dashboard');
      },
      function() {
        // Thực hiện hàm cho button "See More" thứ hai
        console.log("See More button 2 clicked");
        // Thực hiện các hành động khác tại đây
        const div = document.createElement('div');
        div.className = 'music-dashboard-detail';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'music-dashboard-list-header';
        const heading = document.createElement('h2');
        heading.textContent = listHeadingName[1];

        // Tạo phần tử div cho See More button
        const closeDiv = document.createElement('div');
        closeDiv.className = 'close-button';
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeDiv.appendChild(closeButton);

        // Thêm sự kiện click cho nút See More
        closeButton.addEventListener('click', function() {
          // Xử lý sự kiện khi nút See More được nhấp
          console.log('See More button clicked');
          // Thực hiện các hành động khác tại đây
          showDivAndRemoveCurrentDiv('.music-dashboard', '.music-dashboard-detail');
        });

        headerDiv.appendChild(heading);
        headerDiv.appendChild(closeDiv);
        div.appendChild(headerDiv);

        const ul = document.createElement('ul');
        ul.className = 'music-dashboard-list';
        ul.style.flexWrap = 'wrap';
        for (let i = 0; i < albumForUserList.length; i++) {
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

            // Thêm thuộc tính data-music-path vào phần tử li
            li.dataset.albumID = albumForUserList[i].id;

            // Thêm sự kiện click cho li
            li.addEventListener('click', (event) => {
              const albumID = event.currentTarget.dataset.albumID;
              console.log(albumID); // Thực hiện xử lý với đường dẫn âm nhạc tương ứng
              //link đến trang album
              addContentAlbum(albumForUserList[i], artistMadeForUserList[i]);
            });
        
            ul.appendChild(li);            
        }
        div.appendChild(ul);
        content.appendChild(div);
        hideContentAndShowDiv('.music-dashboard-detail', '.music-dashboard');
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
        const div = document.createElement('div');
        div.className = 'music-dashboard-detail';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'music-dashboard-list-header';
        const heading = document.createElement('h2');
        heading.textContent = listHeadingName[3];

        // Tạo phần tử div cho See More button
        const closeDiv = document.createElement('div');
        closeDiv.className = 'close-button';
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeDiv.appendChild(closeButton);

        // Thêm sự kiện click cho nút See More
        closeButton.addEventListener('click', function() {
          // Xử lý sự kiện khi nút See More được nhấp
          console.log('See More button clicked');
          // Thực hiện các hành động khác tại đây
          showDivAndRemoveCurrentDiv('.music-dashboard', '.music-dashboard-detail');
        });

        headerDiv.appendChild(heading);
        headerDiv.appendChild(closeDiv);
        div.appendChild(headerDiv);

        const ul = document.createElement('ul');
        ul.className = 'music-dashboard-list';
        ul.style.flexWrap = 'wrap';
        for (let i = 0; i < bestArtists.length; i++) {
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

            // Thêm thuộc tính data-music-path vào phần tử li
            li.dataset.artistsID = bestArtists[i].name;

            // Thêm sự kiện click cho li
            li.addEventListener('click', (event) => {
              const artistsID = event.currentTarget.dataset.artistsID;
              console.log(artistsID); // Thực hiện xử lý với đường dẫn âm nhạc tương ứng
              artistsDisplay(artistsID); // Gọi hàm PlayMusic và truyền đường dẫn âm nhạc
            });
        
            ul.appendChild(li);            
        }
        div.appendChild(ul);
        content.appendChild(div);
        hideContentAndShowDiv('.music-dashboard-detail', '.music-dashboard');
      }
    ];

    // Add content
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
        if(listHeadingName[j] === "Mood Boosters" ){
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

          // Thêm thuộc tính data-music-path vào phần tử li
          li.dataset.musicPath = moodBoosters[i].path;

          // Thêm sự kiện click cho li
          li.addEventListener('click', () => {
              sound = new Howl({
              src: './song/music.mp3', // URL của file nhạc
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
            sound.title = moodBoosters[i].name;
            sound.artist = artistText;
            sound.imagePath = 'images/song/Havana.jpg';

            let timestampInterval; // Biến lưu trữ ID của interval

            function updateTimestamp() {
                const currentPosition = sound.seek(); // Lấy vị trí hiện tại của bài hát (thời gian tính bằng giây)
                const formattedTime = formatTime(currentPosition); // Định dạng thời gian hiện tại
                if(document.querySelector('.timestamp-song-start') != null && document.querySelector('.timestamp-song-end') != null){
                  document.querySelector('.timestamp-song-start').textContent = formattedTime;
                  document.querySelector('.timestamp-song-end').textContent = formatTime(sound.duration());
                }
            }
          
            function formatTime(time) {
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
          
            resetFooter(sound);
          });
      
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

          // Thêm thuộc tính data-music-path vào phần tử li
          li.dataset.artistsID = bestArtists[i].id;

          // Thêm sự kiện click cho li
          li.addEventListener('click', (event) => {
            const artistsID = event.currentTarget.dataset.artistsID;
            console.log(artistsID); // Thực hiện xử lý với đường dẫn âm nhạc tương ứng
            artistsDisplay(artistsID); // Gọi hàm PlayMusic và truyền đường dẫn âm nhạc
          });
      
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

          // Thêm thuộc tính data-music-path vào phần tử li
          li.dataset.albumID = albumForUserList[i].id;

          // Thêm sự kiện click cho li
          li.addEventListener('click', (event) => {
            const albumID = event.currentTarget.dataset.albumID;
            console.log(albumID); // Thực hiện xử lý với đường dẫn âm nhạc tương ứng
            addContentAlbum(albumForUserList[i], artistMadeForUserList[i]); // Gọi hàm PlayMusic và truyền đường dẫn âm nhạc
          });
      
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
          title.textContent = 'Anh Chưa Thương Em Đến Vậy Đâu';
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

  // Function to hide content and show div
  function hideContentAndShowDiv(divToShow, divsToHide) {
    const content = document.querySelector('.content');
  
    // Ẩn các phần tử có className được chỉ định trong content
    const divsToHideElements = content.querySelectorAll(divsToHide);
    divsToHideElements.forEach(divToHide => {
      divToHide.style.display = 'none';
    });
  
    // Hiển thị phần tử được chỉ định
    const divToDisplay = document.querySelector(divToShow);
    if (divToDisplay) {
      divToDisplay.style.display = 'block';
    }
  }
  // Function to show div and remove current div
  function showDivAndRemoveCurrentDiv(divToShow, divToMove) {
    const content = document.querySelector('.content');
  
    // Ẩn các phần tử có className được chỉ định trong content
    const divToShowElements = content.querySelectorAll(divToShow);
    divToShowElements.forEach(divToShow => {
      divToShow.style.display = 'block';
    });

    // Xóa phần tử hiện tại
    const divToRemove = document.querySelector(divToMove);
    divToRemove.parentNode.removeChild(divToRemove);
  }

  // Function reset footer
  function clearFooter() {
    const footer = document.querySelector('.footer');
    footer.innerHTML = '';
  }
  function volumeControl(value) {
    sound.volume(value);
  }
  function timeLineControl(value) {
    var seekTime = sound.duration() * value;
    sound.seek(seekTime);
  }


  // Function to add footer content
  const addFooterContent = (sound) => {

    // Tạo cấu trúc cây DOM cho footer
    const div = document.querySelector('.footer');

    const playlistContainerDiv = document.createElement('div');
    playlistContainerDiv.className = 'playlist-container';
    
    const playingSongContainerDiv = document.createElement('div');
    playingSongContainerDiv.className = 'playing-song-container';
    
    const logoPlayingSongImg = document.createElement('img');
    logoPlayingSongImg.className = 'logo-playing-song';
    logoPlayingSongImg.src = sound.imagePath;
    
    const playingSongInfoDiv = document.createElement('div');
    playingSongInfoDiv.className = 'playing-song-info';
    
    const playingSongTitleP = document.createElement('p');
    playingSongTitleP.className = 'playing-song-title';
    playingSongTitleP.textContent = sound.title;
    
    const playingSongAuthorP = document.createElement('p');
    playingSongAuthorP.className = 'playing-song-author';
    playingSongAuthorP.textContent = sound.artist;
    
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
    
    const iconPlaySongImg = document.createElement('img');
    iconPlaySongImg.className = 'icon-play-song';
    iconPlaySongImg.src = play;
    let isPlaying = true; // Biến trạng thái, ban đầu là không phát
    // Thêm sự kiện click cho nút play

    btnPlaylistContainerDiv.appendChild(iconPlaySongImg);

    function playSongReset() {
      if (isPlaying) {
        // Nếu đang phát, chuyển sang trạng thái tạm dừng
        iconPlaySongImg.src = pause;
        sound.play();
        playingSongTitleP.textContent = sound.title;
        playingSongAuthorP.textContent = sound.artist;
        logoPlayingSongImg.src = sound.imagePath;
      } else {
        // Nếu đang tạm dừng, chuyển sang trạng thái phát
        iconPlaySongImg.src = play;
        sound.pause();
      }
      isPlaying = !isPlaying; // Đảo ngược trạng thái
      // Thực hiện các hành động khác tại đây
    }

    iconPlaySongImg.addEventListener('click', playSongReset());
    
    const iconNextSongImg = document.createElement('img');
    iconNextSongImg.className = 'icon-next-song';
    iconNextSongImg.src = skipNext;
    
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
  // Function to reset footer
  function resetFooter(sound) {
    clearFooter();
    addFooterContent(sound);
  }

  // Function to add content album
  async function addContentAlbum(album, artist) {
    const content = document.querySelector('.content');
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }
    const albumDiv = document.createElement('div');
    albumDiv.className = 'Album';

    const albumInfoDiv = document.createElement('div');
    albumInfoDiv.className = 'Album-Info';

    const img = document.createElement('img');
    img.src = "images/default-artist.jpg";
    img.alt = 'default-artists';
    albumInfoDiv.appendChild(img);

    const albumInfoTextDiv = document.createElement('div');
    albumInfoTextDiv.className = 'Album-Info-Text';

    const albumTitle = document.createElement('h1');
    albumTitle.textContent = album.name;

    const albumBy = document.createElement('h2');
    albumBy.textContent = 'By: ' + artist.name;

    const albumType = document.createElement('h3');
    albumType.textContent = 'Album';

    const albumYear = document.createElement('h4');
    albumYear.textContent = 'Released: ' + album.release_date;

    const albumInfoButtonDiv = document.createElement('div');
    albumInfoButtonDiv.className = 'Album-Info-Button';

    const playButton = document.createElement('button');
    playButton.className = 'button-49';
    playButton.setAttribute('role', 'button');
    playButton.textContent = 'Play';


    const likeButton = document.createElement('button');
    likeButton.className = 'button-49';
    likeButton.setAttribute('role', 'button');
    likeButton.textContent = 'Like';



    albumInfoTextDiv.appendChild(albumTitle);
    albumInfoTextDiv.appendChild(albumBy);
    albumInfoTextDiv.appendChild(albumType);
    albumInfoTextDiv.appendChild(albumYear);
    albumInfoTextDiv.appendChild(albumInfoButtonDiv);

    albumInfoDiv.appendChild(albumInfoTextDiv);

    const albumDetailDiv = document.createElement('div');
    albumDetailDiv.className = 'Album-Detail';

    const tableUl = document.createElement('ul');
    tableUl.className = 'responsive-table';

    const tableHeaderLi = document.createElement('li');
    tableHeaderLi.className = 'table-header';

    const headerCol1 = document.createElement('div');
    headerCol1.className = 'col col-1';
    headerCol1.textContent = 'ID';

    const headerCol2 = document.createElement('div');
    headerCol2.className = 'col col-2';
    headerCol2.textContent = 'Title';

    const headerCol4 = document.createElement('div');
    headerCol4.className = 'col col-4';
    headerCol4.textContent = 'Released';

    tableHeaderLi.appendChild(headerCol1);
    tableHeaderLi.appendChild(headerCol2);
    tableHeaderLi.appendChild(headerCol4);

    tableUl.appendChild(tableHeaderLi);
    var playlist = []
    const rowData = await api.get(`/api/albums/${album.id}/songs`).then(response => response.json());
    setDataSong(...rowData);
    rowData.forEach(element => {
      playlist.push({title: element.name, path: element.path});
    });
    playButton.addEventListener('click', function() {
      // Initialize variables
      var currentTrack = 0;
      var player = new Howl({
        src: [playlist[currentTrack].file],
        onend: function() {
          nextTrack(); // Play the next song automatically when one ends
        }
      });
      // Function to play a song
      function playTrack(index) {
        if (player.playing()) {
          player.stop();
        }
        player = new Howl({
          src: [playlist[index].path],
          html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
          onend: function() {
            nextTrack(); // Play the next song automatically when one ends
          }
        });
        // Update the title display
        document.querySelector('.playing-song-title').textContent = playlist[index].title;
        player.play();
      }
      function nextTrack() {
        currentTrack = (currentTrack + 1) % playlist.length; // Loop back to the first song if at the end
        playTrack(currentTrack);
      }
      // Function to go to the previous song in the playlist
      function prevTrack() {
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length; // Loop back to the last song if at the beginning
        playTrack(currentTrack);
      }

      // Start playing the first track
      playTrack(currentTrack);

      // Event listeners for the buttons
      document.querySelector('.icon-next-song').addEventListener('click', nextTrack);
      document.querySelector('.icon-previous-song').addEventListener('click', prevTrack);

      function shufflePlaylist() {
        for (let i = playlist.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
        currentTrack = 0; // Reset to the first song in the shuffled playlist
        playTrack(currentTrack);
      }
      function togglePlayPause() {
        if (player.playing()) {
          player.pause();
        } else {
          player.play();
        }
      }
      document.querySelector('.icon-play-song').remove();

      const iconPlaySongImg = document.createElement('img');
      iconPlaySongImg.className = 'icon-play-song';
      iconPlaySongImg.src = play;
      // Thêm sự kiện click cho nút play
  
      iconPlaySongImg.addEventListener('click', togglePlayPause());
      var btnPlaylistContainerDiv = document.querySelector('.btn-playlist-container');
      btnPlaylistContainerDiv.appendChild(iconPlaySongImg);
      
      // Event listener for the shuffle button
      document.querySelector('.icon-mix-song').addEventListener('click', shufflePlaylist());
    });
    albumInfoButtonDiv.appendChild(playButton);
    albumInfoButtonDiv.appendChild(likeButton);

    for (let i = 0; i < rowData.length; i++) {
    const tableRowLi = document.createElement('li');
    tableRowLi.className = 'table-row';

    const rowCol1 = document.createElement('div');
    rowCol1.className = 'col col-1';
    rowCol1.textContent = rowData[i].id;

    const rowCol2 = document.createElement('div');
    rowCol2.className = 'col col-2';
    rowCol2.textContent = rowData[i].name;

    const rowCol4 = document.createElement('div');
    rowCol4.className = 'col col-4';
    rowCol4.textContent = rowData[i].release_date;

    tableRowLi.appendChild(rowCol1);
    tableRowLi.appendChild(rowCol2);
    tableRowLi.appendChild(rowCol4);

    tableUl.appendChild(tableRowLi);
    }

    albumDetailDiv.appendChild(tableUl);

    albumDiv.appendChild(albumInfoDiv);
    albumDiv.appendChild(albumDetailDiv);

    content.appendChild(albumDiv);
  }
  


  // Function useEffect
  useEffect(() => {
    if (!isContentAdded && !contentAddedRef.current) {
      fetchUserData();
      setIsContentAdded(true);
      contentAddedRef.current = true;
    }
  }, []);

}

export default DashboardPage;