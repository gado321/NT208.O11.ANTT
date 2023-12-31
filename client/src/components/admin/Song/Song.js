import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import api from '../../../api'
import { slugifyVietnamese, getExtension } from '../Utils';


const MultiSelectDropdown = ({ items, title, selectedItemIds, setSelectedItemIds }) => {
    const [searchValue, setSearchValue] = useState('');
  
    const handleSelectItem = (itemId) => {
      if (!selectedItemIds.includes(itemId)) {
        setSelectedItemIds([...selectedItemIds, itemId]);
      }
    };
  
    const handleRemoveItem = (itemId) => {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
    };
  
    return (
      <>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {title}
          </Dropdown.Toggle>
  
          {/* Apply inline style for fixed height and scroll */}
          <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <div style={{ padding: '10px' }}>
              <input
                autoFocus
                className="form-control"
                placeholder="Type to search..."
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
              />
            </div>
            {items
              .filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((item) => (
                <Dropdown.Item
                    key={item.id}
                    onClick={() => handleSelectItem(item.id)}
                    active={selectedItemIds.includes(item.id)}
                >
                    {item.name} {selectedItemIds.includes(item.id) ? "✓" : ""}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className="selected-items">
          {items
            .filter((item) => selectedItemIds.includes(item.id))
            .map((item) => (
              <Badge pill bg="secondary" key={item.id} className="m-1">
                {item.name}
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  &times;
                </Button>
              </Badge>
            ))}
        </div>
      </>
    );
};
  
const Song = () => {
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSong, setSelectedSong] = useState(null);
    const [selectedArtistIds, setSelectedArtistIds] = useState([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState([]);
    const [selectedSongFile, setSelectedSongFile] = useState(null);
    const [selectedPictureFile, setSelectedPictureFile] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    if (window.location.pathname === '/admin/song') {
        require('bootstrap/dist/css/bootstrap.min.css');
        require('./Song.css');
    }
    useEffect(() => {
        const linkDashboard = document.querySelector('.link-home');
        linkDashboard.href = "/admin/dashboard";
    });
    // Initialize new song form data
    const initialFormState = {
        name: '',
        path: '',
        picture_path: '',
        release_date: '',
        artist: '',
        genre: ''
    };
    const [newSong, setNewSong] = useState(initialFormState);

    useEffect(() => {
        // Fetch artists and genres when the component mounts
        const fetchArtistsAndGenres = async () => {
            const artistsResponse = await api.get('/api/artists');
            const genresResponse = await api.get('/api/genres');
            const artistsData = await artistsResponse.json();
            const genresData = await genresResponse.json();
            setArtists(artistsData);
            setGenres(genresData);
        };

        fetchArtistsAndGenres();
    }, []);

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

    const handleSearch = () => {
        searchSongs(searchTerm);
    };

    const handleEdit = async (song) => {
        setSelectedSong(song);
        setIsCreating(false);
    
        try {
            // Fetch the artists for the selected song
            const artistResponse = await api.get(`/api/songs/${song.id}/artists`);
            const artistsData = await artistResponse.json();
            const artistIds = artistsData.map(artist => artist.id);
            setSelectedArtistIds(artistIds);
    
            // Fetch the genres for the selected song
            const genreResponse = await api.get(`/api/songs/${song.id}/genres`);
            const genresData = await genreResponse.json();
            const genreIds = genresData.map(genre => genre.id);
            setSelectedGenreIds(genreIds);

            console.log(artistsData);
            console.log(genresData);
        } catch (error) {
            console.error('Error fetching related artists and genres:', error);
        }
    };

    const handleDelete = async (songId) => {
        try {
            const response = await api.delete(`/api/songs/${songId}`);
    
            if (response.ok) {
                // Remove the song from the songs list in the state
                setSongs(songs.filter((song) => song.id !== songId));
                console.log(`Song with ID: ${songId} deleted successfully.`);
            } else {
                console.error('Failed to delete the song.');
            }
        } catch (error) {
            console.error('Error deleting the song: ', error);
        }
    };    
    
    const handleChange = (event, setFunction) => {
        const { name, value } = event.target;
        setFunction(prevState => ({ ...prevState, [name]: value }));
    };

    // Helper function to associate artists and genres with a song
    const associateArtistsAndGenres = async (songId, artistIds, genreIds) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
    
        // Create an array of promises for the artist POST requests
        const artistPromises = artistIds.map(artistId => 
            api.post(`/api/songs/${songId}/artists/${artistId}`)
        );
    
        // Create an array of promises for the genre POST requests
        const genrePromises = genreIds.map(genreId => 
            api.post(`/api/songs/${songId}/genres/${genreId}`)
        );
    
        // Combine the two arrays of promises
        const allPromises = [...artistPromises, ...genrePromises];
    
        // Use Promise.all to wait for all POST requests to complete
        await Promise.all(allPromises);
    };

    const handleCreateNewSong = () => {
        setSelectedSong(null);
        setNewSong(initialFormState);
        setSelectedArtistIds([]);
        setSelectedGenreIds([]);
        setIsCreating(true);
    };

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        if (!selectedSongFile || !selectedPictureFile) {
            console.error('Please select both a song and an image to upload.');
            return;
        }
      
        const sanitizedSongName = slugifyVietnamese(newSong.name);
        const getLastIdResponse = await api.get('/api/songs/last_id');
        const data = await getLastIdResponse.json();
        const newSongId = data.lastId + 1;
        try {
            const data = JSON.stringify(
                {
                    name: newSong.name,
                    path: './songs/' + sanitizedSongName + '-' + newSongId + '.' + getExtension(selectedSongFile.name),
                    picture_path: './images/song/' + sanitizedSongName + '-' + newSongId + '.' + getExtension(selectedPictureFile.name),
                    release_date: newSong.release_date
                }
            )
            const response = await api.post('/api/songs', data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });

            if (response.status === 201) {
                const data = await response.json(); // Parse the response body as JSON
                const newSongId = data.id; // Access the song ID from the parsed data
                await associateArtistsAndGenres(newSongId, selectedArtistIds, selectedGenreIds);
                
                // Upload the song and image files
                const formData = new FormData();
                formData.append('name', sanitizedSongName);
                formData.append('file', selectedSongFile);
                formData.append('image', selectedPictureFile);
                formData.append('songId', newSongId)
                try {
                    const response = await api.post('/api/songs/upload', formData);
              
                    if (response.ok) {
                      console.log('Song and image uploaded successfully!');
                    } else {
                      console.error('Failed to upload song and image.');
                    }
                } catch (error) {
                console.error('Error uploading files:', error);
                }

                setIsCreating(false);
                // Reset the form
                setNewSong(initialFormState);
                setSelectedArtistIds([]);
                setSelectedGenreIds([]);
            }
        } catch (error) {
            console.error('Error creating new song: ', error);
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        const sanitizedSongName = slugifyVietnamese(selectedSong.name);
        if (selectedSongFile || selectedPictureFile) {
            // Upload the song and image files if they have been selected
            const formData = new FormData();
            if (selectedSongFile) {
                formData.append('file', selectedSongFile);
            }
            if (selectedPictureFile) {
                formData.append('image', selectedPictureFile);
            }
            if (selectedSongFile.name) {
                formData.append('name', sanitizedSongName);
            }
            formData.append('songId', selectedSong.id);

            const uploadResponse = await api.post('/api/songs/upload', formData);

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload new song or image files.');
            }
        }

        try {
            var filePath = '';
            if (selectedSongFile) {
                filePath = './songs/' + sanitizedSongName + '-' + selectedSong.id + '.' + getExtension(selectedSongFile.name);
            } else {
                filePath = selectedSong.path;
            }

            var picturePath = '';
            if (selectedPictureFile) {
                picturePath = './images/song/' + sanitizedSongName + '-' + selectedSong.id + '.' + getExtension(selectedPictureFile.name);
            } else {
                picturePath = selectedSong.picture_path;
            }
            const putData = JSON.stringify(
                {
                    name: selectedSong.name,
                    path: filePath,
                    picture_path: picturePath,
                    release_date: selectedSong.release_date
                }
            );
            const response = await api.put(`/api/songs/${selectedSong.id}`, putData, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            if (response.status === 201) {
                // Fetch current artists and genres associated with the song
                const existingArtistsResponse = await api.get(`/api/songs/${selectedSong.id}/artists`);
                const existingGenresResponse = await api.get(`/api/songs/${selectedSong.id}/genres`);
    
                if (!existingArtistsResponse.ok || !existingGenresResponse.ok) {
                    throw new Error('Failed to fetch existing artists or genres.');
                }
    
                // Convert existing artists and genres to JSON
                const existingArtists = await existingArtistsResponse.json();
                const existingGenres = await existingGenresResponse.json();
    
                // Find and remove unselected artists
                const artistsToRemove = existingArtists.filter(artist => !selectedArtistIds.includes(artist.id));
                for (const artist of artistsToRemove) {
                    await api.delete(`/api/songs/${selectedSong.id}/artists/${artist.id}`);
                }
    
                // Find and remove unselected genres
                const genresToRemove = existingGenres.filter(genre => !selectedGenreIds.includes(genre.id));
                for (const genre of genresToRemove) {
                    await api.delete(`/api/songs/${selectedSong.id}/genres/${genre.id}`);
                }
    
                // Add new artist and genre associations
                await associateArtistsAndGenres(selectedSong.id, selectedArtistIds, selectedGenreIds);
    
                setSelectedSong(null); // Reset selected song
            }
        } catch (error) {
            console.error('Error updating song: ', error);
        }
    };

    const handleSongFileChange = (e) => {
        setSelectedSongFile(e.target.files[0]);
      };
    
      const handlePictureFileChange = (e) => {
        setSelectedPictureFile(e.target.files[0]);
      };

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
    setDropdownOpen(!dropdownOpen);
    }, [dropdownOpen]);

    return (
        <div className="container">
            {/* Search Ground */}
            <div className="search-area">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search for a song..."
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Songs Dropdown Button */}
            <button onClick={toggleDropdown}>Songs List</button>

            {/* Songs List Dropdown Menu */}
            {dropdownOpen && (
                <div className="song-list-dropdown">
                    {songs.map((song) => (
                        <div key={song.id} className="song-item">
                            <span className="song-name">{song.name}</span>
                            <div>
                                <button onClick={() => handleEdit(song)}>Edit</button>
                                <button onClick={() => handleDelete(song.id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Ground */}
            {selectedSong && (
                <form onSubmit={handleEditSubmit}>
                    <input type="text" name="name" value={selectedSong.name} onChange={(e) => handleChange(e, setSelectedSong)} placeholder="Song name" />
                    <input type="file" onChange={handleSongFileChange} accept="audio/*" />
                    <input type="file" onChange={handlePictureFileChange} accept="image/*" />
                    <input type="date" name="release_date" value={selectedSong.release_date} onChange={(e) => handleChange(e, setSelectedSong)} placeholder="Release date" />
                    {/* Artist multi-select dropdown */}
                    <MultiSelectDropdown
                        items={artists}
                        title="Select Artists"
                        selectedItemIds={selectedArtistIds}
                        setSelectedItemIds={setSelectedArtistIds}
                    />

                    {/* Genre multi-select dropdown */}
                    <MultiSelectDropdown
                        items={genres}
                        title="Select Genres"
                        selectedItemIds={selectedGenreIds}
                        setSelectedItemIds={setSelectedGenreIds}
                    />

                    <button type="submit" className="update-btn">Update Song</button>
                </form>
            )}

            {/* Create Ground */}
            <div>
                <button onClick={handleCreateNewSong} className="create-btn">Create New Song</button>
                {isCreating && (
                    <form onSubmit={handleCreateSubmit}>
                        <input type="text" name="name" value={newSong.name} onChange={(e) => handleChange(e, setNewSong)} placeholder="Song name" />
                        <input type="file" onChange={handleSongFileChange} accept="audio/*" />
                        <input type="file" onChange={handlePictureFileChange} accept="image/*" />
                        <input type="date" name="release_date" value={newSong.release_date} onChange={(e) => handleChange(e, setNewSong)} placeholder="Release date" />
                        {/* Artist multi-select dropdown for new song */}
                        <MultiSelectDropdown
                            items={artists}
                            title="Select Artists"
                            selectedItemIds={selectedArtistIds}
                            setSelectedItemIds={setSelectedArtistIds}
                        />

                        {/* Genre multi-select dropdown for new song */}
                        <MultiSelectDropdown
                            items={genres}
                            title="Select Genres"
                            selectedItemIds={selectedGenreIds}
                            setSelectedItemIds={setSelectedGenreIds}
                        />
                        <button type="submit" className="create-btn">Create Song</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Song;