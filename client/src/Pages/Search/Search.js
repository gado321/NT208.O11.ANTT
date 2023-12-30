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


// Kiểm tra URL hiện tại và tải tệp CSS khi URL khớp với /dashboard
if (window.location.pathname === '/search') {
    require('../Dashboard/Dashboard.css'); // Import tệp CSS
}


function SearchPage() {
  var id = localStorage.getItem('data');
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      addContent();
    }
    catch(error){
      console.log(error);
    }
  }
    const addContent = async () => {
        const content = document.querySelector('.content');
        while (content.firstChild) {
          content.removeChild(content.firstChild);
        }

        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.onChange = {handleSearchChange}
        searchInput.placeholder = 'Search for songs...';

        const searchButton = document.createElement('button');
        searchButton.textContent = 'Search';

        if(document.querySelector('.Album') != null){
            document.querySelector('.Album').removeChild(document.querySelector('.Album'));
        }
        var albumDiv = document.createElement('div');
        if(document.querySelector('.Album') != null){
            albumDiv = document.querySelector('.Album');
        }
        else{
            albumDiv = document.createElement('div');
            albumDiv.className = 'Album';
        }

    
        var rowData = [];

        searchButton.addEventListener('click', async function() {
            const response = await api.get(`/api/songs/search/${encodeURIComponent(searchInput.value)}`);
            const data = await response.json();
            setSongs(data);
            rowData.push(...data);

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

            const headerCol5 = document.createElement('div');
            headerCol5.className = 'col col-5';
            headerCol5.textContent = 'play';
        
            tableHeaderLi.appendChild(headerCol1);
            tableHeaderLi.appendChild(headerCol2);
            tableHeaderLi.appendChild(headerCol4);
            tableHeaderLi.appendChild(headerCol5);
        
            tableUl.appendChild(tableHeaderLi);
        
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

            const rowCol5 = document.createElement('div');
            rowCol5.className = 'col col-5';
            const playButton = document.createElement('button');

            playButton.className = 'button-49';
            playButton.setAttribute('role', 'button');
            playButton.textContent = 'Play';
            
            rowCol5.appendChild(playButton);
        
            tableRowLi.appendChild(rowCol1);
            tableRowLi.appendChild(rowCol2);
            tableRowLi.appendChild(rowCol4);
            tableRowLi.appendChild(rowCol5);
        
            tableUl.appendChild(tableRowLi);
            }
        
            albumDetailDiv.appendChild(tableUl);
        
            albumDiv.innerHTML = '';
            albumDiv.appendChild(albumDetailDiv);
        
            content.appendChild(albumDiv);
        });
        

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);

        content.appendChild(searchContainer);
        
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const searchSongs = async (searchTerm) => {
        if (searchTerm.trim() === '') {
            setSongs([]);
            return;
        }
        try {
            const response = await api.get(`/api/songs/search/${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setSongs(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
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
    <>

    </>
  );
}

export default SearchPage;