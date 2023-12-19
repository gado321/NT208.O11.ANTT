// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth ,logout, authFetch} from '../Auth'

// const Artist = ({ artistId }) => {
//   const [artist, gsetArtist] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
   
//   }, []);

//   const handleNameChange = (event) => {
//     setName(event.target.value);
//   };

//   const handlePicturePathChange = (event) => {
//     setPicturePath(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setLoading(true);
    
//     const artistData = {
//       name: name,
//       picture_path: picturePath
//     };

//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         // Add your auth token here if needed
//         // 'Authorization': 'Bearer ' + token
//       }
//     };

//     if (artistId) {
//       // Update existing artist
//       axios.put(`/artists/${artistId}`, artistData, config)
//         .then(response => {
//           // Handle the response appropriately
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('There was an error updating the artist', error);
//           setLoading(false);
//         });
//     } else {
//       // Create new artist
//       axios.post('/artists', artistData, config)
//         .then(response => {
//           // Handle the response appropriately
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('There was an error creating the artist', error);
//           setLoading(false);
//         });
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="name">Name:</label>
//         <input
//           id="name"
//           type="text"
//           value={name}
//           onChange={handleNameChange}
//         />
//       </div>
//       <div>
//         <label htmlFor="picturePath">Picture Path:</label>
//         <input
//           id="picturePath"
//           type="text"
//           value={picturePath}
//           onChange={handlePicturePathChange}
//         />
//       </div>
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default Artist;