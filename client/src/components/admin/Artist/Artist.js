import React, { useState } from 'react';
import api from '../../../api'
import { slugifyVietnamese, getExtension } from '../Utils';

const Artist = () => {
    if (window.location.pathname === '/admin/artist') {
        require('bootstrap/dist/css/bootstrap.min.css');
    }

    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArtistImage, setSelectedArtistImage] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // Initialize new artist form data
    const initialFormState = {
        name: '',
        picture_path: '',
    }
    const [newArtist, setNewArtist] = useState(initialFormState);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const searchArtists = async (searchTerm) => {
        if (searchTerm.trim() === '') {
            setArtists([]);
            return;
        }
        try {
            const response = await api.get(`/api/artists/search/${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setArtists(data);
        } catch (error) {
            console.log('Error fetching data: ', error);
        }
    };

    const handleSearch = () => {
        searchArtists(searchTerm);
    };

    const handleEdit = async (artist) => {
        setSelectedArtist(artist);
        setIsCreating(false);
    };

    const handleDelete = async (artistId) => {
        try {
            const response = await api.delete(`/api/artists/${artistId}`);
            if (response.ok) {
                setArtists(artists.filter((artist) => artist.id !== artistId));
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting artist: ', error);
        }
    };

    const handleChange = (event, setFunction) => {
        const { name, value } = event.target;
        setFunction(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateNewArtist = async () => {
        setSelectedArtist(null);
        setNewArtist(initialFormState);
        setIsCreating(true);
    };

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        if (!selectedArtistImage) {
            console.log('No image selected');
            return;
        }

        const sanitizedName = slugifyVietnamese(newArtist.name);
        const getLastIdResponse = await api.get('/api/artists/last_id');
        const data = await getLastIdResponse.json();
        const newArtistId = data.lastId + 1;
        try {
            const data = JSON.stringify({ 
                name: newArtist.name,
                picture_path: '../data/images/artist/' + sanitizedName + '-' + newArtistId + '.' + getExtension(selectedArtistImage.name),
            });

            const response = await api.post('/api/artists', data, { 
                headers: {
                    'Content-Type': 'application/json' 
                }
            });

            if (response.status === 201) {
                const data = await response.json(); // Parse the response body as JSON
                const newArtistId = data.id; // Access the artist ID from the parsed data

                const formData = new FormData();
                formData.append('name', sanitizedName);
                formData.append('image', selectedArtistImage);
                formData.append('artistId', newArtistId);
                try {
                    const response = await api.post('/api/artists/upload', formData);
                    if (response.ok) {
                        console.log('Artist image uploaded successfully!');
                    } else {
                        console.error('Failed to upload artist image.');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
                setIsCreating(false);
                setNewArtist(initialFormState);

            }
        } catch (error) {
            console.error('Error creating new artist: ', error);
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        const sanitizedName = slugifyVietnamese(selectedArtist.name);
        if (selectedArtistImage) {
            const formData = new FormData();
            if (selectedArtistImage) {
                formData.append('image', selectedArtistImage);
            }
            if (selectedArtistImage.name) {
                formData.append('name', sanitizedName);
            }
            formData.append('artistId', selectedArtist.id);

            const uploadResponse = await api.post('/api/artists/upload', formData);

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload artist image');
            }
        }

        try {
            const putData = JSON.stringify({ 
                name: selectedArtist.name,
                picture_path: '../data/images/artist/' + sanitizedName + '-' + selectedArtist.id + '.' + getExtension(selectedArtistImage.name),
            });
            
            const response = await api.put(`/api/artists/${selectedArtist.id}`, putData, {
                headers: {
                    'Content-Type': 'application/json' 
                }
            });
            if (response.status === 201) {
                console.log('Artist updated successfully!');
                setSelectedArtist(null); // Reset selected song
            }

        } catch (error) {
            console.error('Error updating artist: ', error);
        }
    };

    const handleArtistImageChange = (event) => {
        setSelectedArtistImage(event.target.files[0]);
    };

    return (
        <div>
            {/* Search Ground */}
            <div>
                <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search for an artist..." />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Artist List */}
            <div>
                {artists.map((artist) => (
                    <div key={artist.id}>
                        {artist.name}
                        <button onClick={() => handleEdit(artist)}>Edit</button>
                        <button onClick={() => handleDelete(artist.id)}>Delete</button>
                    </div>
                ))}
            </div>

            {/* Edit Ground */}
            {selectedArtist && (
                <form onSubmit={handleEditSubmit}>
                    <input type="text" name="name" value={selectedArtist.name} onChange={(e) => handleChange(e, setSelectedArtist)} placeholder="Artist name" />
                    <input type="file" onChange={handleArtistImageChange} accept="image/*" />
                    <button type="submit">Update Artist</button>
                </form>
            )}

            {/* Create Ground */}
            <div>
                <button onClick={handleCreateNewArtist}>Create New Artist</button>
                {isCreating && (
                    <form onSubmit={handleCreateSubmit}>
                        <input type="text" name="name" value={newArtist.name} onChange={(e) => handleChange(e, setNewArtist)} placeholder="Artist name" />
                        <input type="file" onChange={handleArtistImageChange} accept="image/*" />
                        {/* Artist multi-select dropdown for new song */}
                        <button type="submit">Create Artist</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Artist;