import './SettingContent.css';
import { Navigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";


export function EditProfile () {
    // const initUserName = {
    //     email: "",
    //     password: "",
    //     confirmpassword: "",
    //     username: "",
    //     birthday: "",
    //     gender: "",
    // };
    // const [editprofileMessage, seteditprofileMessage] = useState("");
    // const [UserName, setUserName] = useState(initUserName);
    // const [formError, setFormError] = useState({});
    
    // // Kiểm tra giá trị rỗng
    // const isEmptyValue = (value) => {
    //     return !value || value.trim().length < 1;
    // }
    // // Kiểm tra email hợp lệ
    // const isEmailValid = (value) => {
    //     return !/\S+@\S+\.\S+/.test(value);
    // }
    // // Xử lý thay đổi giá trị của form
    // function handleChangeUser(event) {
    //     selectedGender = event.target.value;
    //     console.log(selectedGender);
    // }

    // // Kiểm tra giá trị của form có hợp lệ hay không
    // const validateForm = () => {
    //     const error = {};
    //     // Kiểm tra email
    //     if (isEmptyValue(UserName.email)) {
    //         error.email = "Please enter your email";
    //     }
    //     else if (isEmailValid(UserName.email)) {
    //         error.email = "Please enter a valid email address";
    //     }
    //     //Kiểm tra mật khẩu
    //     if (isEmptyValue(UserName.password)) {
    //         error.password = "Please enter your password";
    //     }
    //     else if ((UserName.password.length < 8) || (UserName.password.length > 20)) {
    //         error.password = "Password must be at least 8 and less than 20.";
    //     }
    //     else if ((!/\d/.test(UserName.password)) || (!/[!@#$%^&*]/.test(UserName.password))) {
    //         error.password = "Password must contain numbers and symbols";
    //     }
    //     // Kiểm tra mật khẩu nhập lại
    //     if (isEmptyValue(UserName.confirmpassword)) {
    //         error.confirmpassword = "Please enter confirm password";
    //     }
    //     else if (UserName.confirmpassword !== UserName.password) {
    //         error.confirmpassword = "Confirm password does not match";
    //     }
    //     // Kiểm tra tên người dùng
    //     if (isEmptyValue(UserName.username)) {
    //         error.username = "Please enter your username";
    //     }
    //     //Kiẻm tra ngày sinh
    //     if (isEmptyValue(UserName.birthday)) {
    //         error.birthday = "Please enter your birthday";
    //     }
    //     else if (new Date(UserName.birthday) > new Date()) {
    //         error.birthday = "Birthday must be less than today";
    //     }
    //     // Kiểm tra giới tính
    //     if (isEmptyValue(UserName.gender)) {
    //         error.gender = "Please choose your gender";
    //     }
    //     // Trả về lỗi
    //     setFormError(error);
    //     return Object.keys(error).length === 0;
    // }
    // const handleChangeProfile = () => {
    //     const isValid = validateForm();
    //     if (isValid) {
    //         seteditprofileMessage("Edit profile successfully");
    //         console.log(UserName);
    //     }
    //     else {
    //         seteditprofileMessage("Edit profile failed");
    //     }
    // }
    // Xác nhận dữ liệu khi đăng nhập và in ra console
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const editProfileContent= document.createElement('div');
    editProfileContent.className = 'edit-profile-container';
    const form = document.createElement('form');
    form.className = 'form-edit-profile';
    const handleChangeProfile = () => {
        console.log('Change profile');
        Navigate('/dashboard');
    }
    const editcontainer = document.createElement('div');
    editcontainer.className = 'editprofile-container';
    editcontainer.innerHTML = `
        <div className="editprofile-form-container">
            <div className="editprofile-form-left">
                <div>
                    
                    <label htmlFor="editprofile-email" className="editprofile-form-label">
                        Enter your e-mail address
                    </label>
                    <input
                        type="text"
                        id="editprofile-email"
                        className="editprofile-form-control"
                        placeholder="   example@gmail.com"
                        name="email"
                    />
                </div>
                <div>
                    <label htmlFor="editprofile-password" className="editprofile-form-label">
                    Password
                    </label>
                    <input
                        type="password"
                        id="editprofile-password"
                        className="editprofile-form-control"
                        placeholder="   *********"
                        name="password"
                    />
                </div>
                <div>
                    <label htmlFor="editprofile-confirm-password" className="editprofile-form-label">
                    Confirm password
                    </label>
                    <input
                        type="password"
                        id="editprofile-confirm-password"
                        className="editprofile-form-control"
                        placeholder="   *********"
                        name="confirmpassword"
                    />
                </div>
            </div>
            <div className="editprofile-form-right">
                <div>
                    <label htmlFor="editprofile-username" className="editprofile-form-label">
                        Drop us your preferred name
                    </label>
                    <input
                        type="text"
                        id="editprofile-username"
                        className="editprofile-form-control"
                        placeholder="   Username"
                        name="username"
                    />
                </div>
                <div>
                    <label htmlFor="editprofile-birthday" className="editprofile-form-label">
                        Enter your birthday
                    </label>
                    <input
                        type="date"
                        id="editprofile-birthday"
                        className="editprofile-form-control"
                        placeholder="   dd/mm/yyyy"
                        name="birthday"
                    />
                </div>
                <div>
                    <label htmlFor="editprofile-gender" className="editprofile-form-label">
                        What’s your gender?
                    </label>
                    <div className="editprofile-gender-form-container">
                            <input
                                type="radio" 
                                id="editprofile-gender"
                                name="gender"
                                className="editprofile-gender-form-control"
                                value="female"
                            />Female
                        <input
                            type="radio" 
                            id="editprofile-gender"
                            name="gender"
                            className="editprofile-gender-form-control"
                            value="male"
                        />Male
                        <input
                            type="radio" 
                            id="editprofile-gender"
                            className="editprofile-gender-form-control"
                            name="gender"
                            value="other"
                        />Other
                    </div>
                </div>
            </div>
            <div className="editprofile-form-button-container">
                <button type="submit" className="editprofile-form-button" onclick={handleChangeProfile}>
                    Save
                </button>
            </div>
        </div>`;
    form.appendChild(editcontainer);
    editProfileContent.appendChild(form);
    content.appendChild(editProfileContent);
};

export function addSettingContent () {

    const logOut = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('data');
        window.location.reload();
    };
    const handleButtonClick = (name) => () => {
        switch (name) {
            case 'View Profile':
                console.log('Change E-mail');
                break;
            case 'Edit Profile':
                EditProfile();
                break;
            case 'Change E-mail':
                console.log('Change E-mail');
                break;
            case 'Change Password':
                console.log('Change Password');
                break;
            case 'Go Premium':
                console.log('Go Premium');
                break;
            case 'Log out':
                logOut();
                break;
            case 'Privacy Policy':
                console.log('Privacy Policy');
                break;
            case 'Share this app':
                console.log('Share this app');
                break;
            case 'Rate this app':
                console.log('Rate this app');
                break;
            case 'Help':
                console.log('Help');
                break;
            case 'Sleep Timer':
                console.log('Sleep Timer');
                break;
            case 'Set Favorite Genres':
                console.log('Set Favorite Genres');
                break;
            default:
                break;
        }
    }

    const dictSettingName = {
      ACCOUNT: ['View Profile', 'Edit Profile', 'Change E-mail', 'Change Password', 'Go Premium', 'Log out'],
      APP:['Privacy Policy', 'Share this app', 'Rate this app', 'Help', 'Sleep Timer', 'Set Favorite Genres']
    };
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const settingContent= document.createElement('div');
    settingContent.className = 'setting-container';

    const listSettingContent= document.createElement('div');
    listSettingContent.className = 'list-setting-container';
    const listKeySettingName = Object.keys(dictSettingName);
    for(let j=0; j<listKeySettingName.length; j++){
        const div = document.createElement('div');
        div.className = 'list-SettingUser';
        
        const heading = document.createElement('h2');
        heading.textContent = listKeySettingName[j];    
        div.appendChild(heading);

        const ul = document.createElement('ul');
        ul.className = 'Setting-list';

        const listSettingName = dictSettingName[listKeySettingName[j]];
        for (let i = 0; i < listSettingName.length; i++) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.className = 'setting-button-item';
            button.onclick = handleButtonClick(listSettingName[i]);
            const text = document.createElement('p');
            text.textContent = listSettingName[i];
            button.appendChild(text);
            li.appendChild(button);
            ul.appendChild(li);
        }
        div.appendChild(ul);
        listSettingContent.appendChild(div);   
    }
    settingContent.appendChild(listSettingContent);
    const deleteAccount = document.createElement('div');
    deleteAccount.className = 'delete-account-container';
    const button = document.createElement('button');
    button.className = 'delete-account-button';
    button.textContent = 'Delete Account';
    deleteAccount.appendChild(button);
    settingContent.appendChild(deleteAccount);
    content.appendChild(settingContent);
  };

// ////////////////////////////////////////////////////////////////////////////////////////////////////////
export function addProfileContent(){
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const profileContent= document.createElement('div');
    profileContent.className = 'profile-container';

    const avtContainer = document.createElement('div');
    avtContainer.className = 'avt-container';
    const avt = document.createElement('img');
    avt.src='https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/394536727_1698264187323635_8948875996727481682_n.jpg?stp=dst-jpg_p160x160&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeEsng1tyBeMl_596rxxLBg4UiLf-EWAGL9SIt_4RYAYv2SYVdaOddu6LI_PU_sgh5b3V2BDGcFROkhDZ2kDV8vn&_nc_ohc=AcZ6rybe-HAAX9T3Kj3&_nc_ht=scontent.fhan2-4.fna&oh=00_AfAsTmCuPDYO16EgZy3n660REnO_iJj-LhzxhwmcnCwePg&oe=65875909';
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
        profileName.textContent = 'Cong Thanh fixed';
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
}