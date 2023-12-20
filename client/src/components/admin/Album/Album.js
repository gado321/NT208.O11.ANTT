import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import api from '../../../api'
import { slugifyVietnamese, getExtension } from '../Utils';

const MultiSelectDropdown = ({ items, title, selectedItemIds, setSelectedItemIds, singleSelection = false }) => {
    const [searchValue, setSearchValue] = useState('');
  
    const handleSelectItem = (itemId) => {
        if (singleSelection) {
            setSelectedItemIds([itemId]);
        } else {
            if (!selectedItemIds.includes(itemId)) {
                setSelectedItemIds([...selectedItemIds, itemId]);
            }
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
  
          <Dropdown.Menu>
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

const Album = () => {
    if (window.location.pathname === '/admin/album') {
        require('bootstrap/dist/css/bootstrap.min.css');
    }

    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedArtistIds, setSelectedArtistIds] = useState([]);
    const [selectedSongIds, setSelectedSongIds] = useState([]);
    const [selectedAlbumImage, setSelectedAlbumImage] = useState(null);
    const [albumImageUpdated, setAlbumImageUpdated] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Initialize new album form data
    const initialFormState = {
        name: '',
        artist_id: '',
        picture_path: '',
        release_date: '',
    };

    const [newAlbum, setNewAlbum] = useState(initialFormState);

    useEffect(() => {
        if (selectedAlbum) {
            setSelectedArtistIds([selectedAlbum.artist_id]);
        }
        // Fetch artists and songs when the component mounts
        const fetchArtistsAndSongs = async () => {
            const artistsResponse = await api.get('/api/artists');
            const songsResponse = await api.get('/api/songs');
            const artistsData = await artistsResponse.json();
            const songsData = await songsResponse.json();
            setArtists(artistsData);
            setSongs(songsData);
        };

        fetchArtistsAndSongs();
    }, []);

    const handleArtistSelect = (artistId) => {
        // Set the selected artist ID
        setSelectedArtistIds([artistId]);

        // Filter the songs to include only those that belong to the selected artist
        const filteredSongs = songs.filter(song => song.artist_id === artistId);
        setSongs(filteredSongs);

        // Clear the selected songs as the artist has changed
        setSelectedSongIds([]);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const searchAlbums = async (searchTerm) => {
        if (searchTerm.trim() === '') {
            setAlbums([]);
            return;
        }
        try {
            const response = await api.get(`/api/albums/search/${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAlbums(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleSearch = () => {
        searchAlbums(searchTerm);
    };

    const handleEdit = async (album) => {
        setSelectedAlbum(album);
        setIsCreating(false);
    
        try {
            // Fetch the artists for the selected album
            const artistIds = artists.map(artist => artist.id === album.artist_id ? artist.id : null).filter(artistId => artistId !== null);
            setSelectedArtistIds(artistIds);
    
            // Fetch the songs for the selected album
            const songResponse = await api.get(`/api/albums/${album.id}/songs`);
            const songsData = await songResponse.json();
            const songIds = songsData.map(song => song.id);
            setSelectedSongIds(songIds);

        } catch (error) {
            console.error('Error fetching related artists and songs:', error);
        }
    };

    const handleDelete = async (albumId) => {
        try {
            const response = await api.delete(`/api/albums/${albumId}`);
    
            if (response.ok) {
                // Remove the album from the albums list in the state
                setAlbums(albums.filter((album) => album.id !== albumId));
                console.log(`Album with ID: ${albumId} deleted successfully.`);
            } else {
                console.error('Failed to delete the album.');
            }
        } catch (error) {
            console.error('Error deleting the album: ', error);
        }
    };

    const handleChange = (event, setFunction) => {
        const { name, value } = event.target;
        setFunction(prevState => ({ ...prevState, [name]: value }));
    };

    const associateSongs = async (albumId, songIds) => {
        // Create an array of promises for the song POST requests
        const songPromises = songIds.map(songId => 
            api.post(`/api/albums/${albumId}/songs/${songId}`)
        );
        const allPromises = [...songPromises];
    
        // Use Promise.all to wait for all POST requests to complete
        await Promise.all(allPromises);
    };

    const handleCreateNewAlbum = () => {
        setSelectedAlbum(null);
        setNewAlbum(initialFormState);
        setSelectedArtistIds([]);
        setSelectedSongIds([]);
        setIsCreating(true);
    };

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        if (!selectedAlbumImage) {
            console.error('Please select album image to upload.');
            return;
        }
      
        const sanitizedAlbumName = slugifyVietnamese(newAlbum.name);
        const getLastIdResponse = await api.get('/api/albums/last_id');
        const data = await getLastIdResponse.json();
        const newAlbumId = data.lastId + 1;
        try {
            const data = JSON.stringify(
                {
                    name: newAlbum.name,
                    artist_id: selectedArtistIds[0],
                    picture_path: '../data/images/album/' + sanitizedAlbumName + '-' + newAlbumId + '.' + getExtension(selectedAlbumImage.name),
                    release_date: newAlbum.release_date
                }
            )
            const response = await api.post('/api/albums', data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });

            if (response.status === 201) {
                const data = await response.json(); // Parse the response body as JSON
                const newAlbumId = data.id; // Access the song ID from the parsed data
                await associateSongs(newAlbumId, selectedSongIds);
                
                // Upload the album image
                const formData = new FormData();
                formData.append('name', sanitizedAlbumName);
                formData.append('image', selectedAlbumImage);
                formData.append('albumId', newAlbumId)
                try {
                    const response = await api.post('/api/albums/upload', formData);
              
                    if (response.ok) {
                        console.log('Album image successfully!');
                    } else {
                        console.error('Failed to upload album image.');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                }

                setIsCreating(false);
                // Reset the form
                setNewAlbum(initialFormState);
                setSelectedSongIds([]);
                setSelectedArtistIds([]);
            }
        } catch (error) {
            console.error('Error creating new album: ', error);
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        const sanitizedAlbumName = slugifyVietnamese(selectedAlbum.name);

        if (albumImageUpdated && !selectedAlbumImage) {
            console.error('Please select an album image to upload.');
            return;
        }

        if (selectedAlbumImage) {
            // Upload the album image if it has been selected
            const formData = new FormData();
            if (selectedAlbumImage) {
                formData.append('image', selectedAlbumImage);
            }
            if (selectedAlbumImage.name) {
                formData.append('name', sanitizedAlbumName);
            }
            formData.append('albumId', selectedAlbum.id);

            const uploadResponse = await api.post('/api/albums/upload', formData);

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload album image.');
            }
        }

        try {
            
            var picPath = '';
            if (selectedAlbumImage) {
                picPath = '../data/images/album/' + sanitizedAlbumName + '-' + selectedAlbum.id + '.' + getExtension(selectedAlbumImage.name);
            } else {
                picPath = selectedAlbum.picture_path;
            }
            const putData = JSON.stringify(
                {
                    name: selectedAlbum.name,
                    artist_id: selectedArtistIds[0],
                    picture_path: picPath,
                    release_date: selectedAlbum.release_date
                }
            );
            const response = await api.put(`/api/albums/${selectedAlbum.id}`, putData, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            if (response.status === 201) {
                // Fetch current songs associated with the album
                const existingSongsResponse = await api.get(`/api/albums/${selectedAlbum.id}/songs`);
    
                if (!existingSongsResponse.ok) {
                    throw new Error('Failed to fetch existing songs.');
                }
    
                // Convert existing songs to JSON
                const existingSongs = await existingSongsResponse.json();
    
                // Find and remove unselected songs
                const songsToRemove = existingSongs.filter(song => !selectedSongIds.includes(song.id));
                for (const song of songsToRemove) {
                    await api.delete(`/api/albums/${selectedAlbum.id}/songs/${song.id}`);
                }
    
                // Add new song associations
                await associateSongs(selectedAlbum.id, selectedSongIds);
                setSelectedAlbum(null); // Reset selected album
            }
        } catch (error) {
            console.error('Error updating album: ', error);
        }
    };
    
    const handleAlbumImageChange = (event) => {
        setSelectedAlbumImage(event.target.files[0]);
        setAlbumImageUpdated(true); // Set this to true when a new image is selected
    };
    return (
        <div>
            {/* Search Ground */}
            <div>
                <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search for a album..." />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Albums List */}
            <div>
                {albums.map((album) => (
                    <div key={album.id}>
                        {album.name}
                        <button onClick={() => handleEdit(album)}>Edit</button>
                        <button onClick={() => handleDelete(album.id)}>Delete</button>
                    </div>
                ))}
            </div>

            {/* Edit Ground */}
            {selectedAlbum && (
                <form onSubmit={handleEditSubmit}>
                    <input type="text" name="name" value={selectedAlbum.name} onChange={(e) => handleChange(e, setSelectedAlbum)} placeholder="Album name" />
                    <input type="file" onChange={handleAlbumImageChange} accept="image/*" />
                    <input type="date" name="release_date" value={selectedAlbum.release_date} onChange={(e) => handleChange(e, setSelectedAlbum)} placeholder="Release date" />
                    {/* Artist multi-select dropdown */}
                    <MultiSelectDropdown
                        items={artists}
                        title="Select Artists"
                        selectedItemIds={selectedArtistIds}
                        setSelectedItemIds={setSelectedArtistIds}
                    />

                    {/* Song multi-select dropdown */}
                    <MultiSelectDropdown
                        items={songs}
                        title="Select Songs"
                        selectedItemIds={selectedSongIds}
                        setSelectedItemIds={setSelectedSongIds}
                    />

                    <button type="submit">Update Album</button>
                </form>
            )}

            {/* Create Ground */}
            <div>
                <button onClick={handleCreateNewAlbum}>Create New Album</button>
                {isCreating && (
                    <form onSubmit={handleCreateSubmit}>
                        <input type="text" name="name" value={newAlbum.name} onChange={(e) => handleChange(e, setNewAlbum)} placeholder="Album name" />
                        <input type="file" onChange={handleAlbumImageChange} accept="image/*" />
                        <input type="date" name="release_date" value={newAlbum.release_date} onChange={(e) => handleChange(e, setNewAlbum)} placeholder="Release date" />
                        {/* Artist multi-select dropdown for new artist */}
                        <MultiSelectDropdown
                            items={artists}
                            title="Select Artist"
                            selectedItemIds={selectedArtistIds}
                            setSelectedItemIds={handleArtistSelect} // Pass the new function to handle artist selection
                            singleSelection={true} // Set single selection to true for artists
                        />

                        {/* Song multi-select dropdown for new song */}
                        <MultiSelectDropdown
                            items={songs.filter(song => selectedArtistIds.includes(song.artist_id))}
                            title="Select Songs"
                            selectedItemIds={selectedSongIds}
                            setSelectedItemIds={setSelectedSongIds}
                            singleSelection={false}
                        />
                        <button type="submit">Create Album</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Album;