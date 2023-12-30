

import React from 'react';
if (window.location.pathname === '/dashboard') {
  require('./ProfilePage.css'); // Import tệp CSS
}

function addProfileContent({setActivePage}){
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const profileContent= document.createElement('div');
    profileContent.className = 'profile-container';

    const avtContainer = document.createElement('div');
    avtContainer.className = 'avt-container';
    const avt = document.createElement('img');
    avt.src='./images/default-avatar.jpg';
    avt.alt = 'avt';
    avtContainer.appendChild(avt);

    profileContent.appendChild(avtContainer);

    const profileInfoContainer = document.createElement('div');
    profileInfoContainer.className = 'profile-info-container';
    const profileInfo = document.createElement('div');
    profileInfo.className = 'profile-info';
    const profileName = document.createElement('div');
    profileName.className = 'profile-name';
    profileName.textContent = 'Cong Thanh';
    const editProfileButton = document.createElement('button');
    editProfileButton.className = 'edit-profile-button';
    editProfileButton.textContent = 'Edit Profile';
    editProfileButton.onclick = function() {
      setActivePage('setting');
    };
    profileInfo.appendChild(profileName);
    profileInfo.appendChild(editProfileButton);
    profileContent.appendChild(profileInfo);


    const listInfo = {
      Playlist: 15,
      Follower: 99,
      Following: 34
    }

    const profileListInfoContainer = document.createElement('div');
    profileListInfoContainer.className = 'profile-list-info-container';
    for (const [key, value] of Object.entries(listInfo)) {
      const profileInfoContainer = document.createElement('div');
      profileInfoContainer.className = 'profile-info-container';

      const profileInfoNumber = document.createElement('p');
      profileInfoNumber.className = 'profile-info-number';
      profileInfoNumber.textContent = value;
      const profileInfoName = document.createElement('p');
      profileInfoName.className = 'profile-list-info-name';
      profileInfoName.textContent = key;
      profileInfoContainer.appendChild(profileInfoNumber);
      profileInfoContainer.appendChild(profileInfoName);
      profileListInfoContainer.appendChild(profileInfoContainer);
    }
    profileContent.appendChild(profileListInfoContainer);

    content.appendChild(profileContent);
};
export default addProfileContent;