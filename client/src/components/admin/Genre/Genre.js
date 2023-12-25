import React, { useState } from 'react';
import api from '../../../api'


const Genre = () => {
    if (window.location.pathname === '/admin/genre') {
        require('bootstrap/dist/css/bootstrap.min.css');
        require('./Genre.css');
    }

    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Initialize new genre form data
    const initialFormState = {
        name: '',
    }

    const [newGenre, setNewGenre] = useState(initialFormState);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const searchGenres = async (searchTerm) => {
        if (searchTerm.trim() === '') {
            setGenres([]);
            return;
        }
        try {
            const response = await api.get(`/api/genres/search/${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setGenres(data);
        } catch (error) {
            console.log('Error fetching data: ', error);
        }
    };

    const handleSearch = () => {
        searchGenres(searchTerm);
    };

    const handleEdit = async (genre) => {
        setSelectedGenre(genre);
    };

    const handleDelete = async (genreId) => {
        try {
            const response = await api.delete(`/api/genres/${genreId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            searchGenres(searchTerm);
        } catch (error) {
            console.log('Error fetching data: ', error);
        }
    };

    const handleChange = (event, setFunction) => {
        const { name, value } = event.target;
        setFunction(prevState => ({ ...prevState, [name]: value }));
    };
    
    const handleCreateNewGenre = async () => {
        setSelectedGenre(null);
        setIsCreating(true);
    };

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/api/genres', newGenre);
            if (response.status === 201) {
                setIsCreating(false);
                setNewGenre(initialFormState);
            }
        } catch (error) {
            console.log('Error creating new genre: ', error);
        }
    }

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.put(`/api/genres/${selectedGenre.id}`, selectedGenre);
            if (response.status === 201) {
                console.log('Genre updated successfully!');
                setSelectedGenre(null);
            }
        } catch (error) {
            console.log('Error updating genre: ', error);
        }
    }

    return (
        <div className="genre-container">
            {/* Search Ground */}
            <div className="search-ground">
                <input
                    type="text"
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search for a genre..."
                />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
    
            {/* Dropdown for Genre List */}
            <div className="dropdown">
                <button className="search-button">Genres</button>
                <div className="dropdown-content">
                    {genres.map((genre) => (
                        <div key={genre.id} className="genre-item">
                            {genre.name}
                            <button className="genre-action-button" onClick={() => handleEdit(genre)}>Edit</button>
                            <button className="genre-action-button delete-button" onClick={() => handleDelete(genre.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
    
            {/* Edit Ground */}
            {selectedGenre && (
                <form onSubmit={handleEditSubmit} className="edit-ground">
                    <input
                        type="text"
                        name="name"
                        className="search-input"
                        value={selectedGenre.name}
                        onChange={(e) => handleChange(e, setSelectedGenre)}
                        placeholder="Genre name"
                    />
                    <button type="submit" className="submit-button">Update Genre</button>
                </form>
            )}
    
            {/* Create Ground */}
            <div className="create-ground">
                <button className="create-button" onClick={handleCreateNewGenre}>Create New Genre</button>
                {isCreating && (
                    <form onSubmit={handleCreateSubmit}>
                        <input
                            type="text"
                            name="name"
                            className="search-input"
                            value={newGenre.name}
                            onChange={(e) => handleChange(e, setNewGenre)}
                            placeholder="Genre name"
                        />
                        <button type="submit" className="submit-button">Create Genre</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Genre;