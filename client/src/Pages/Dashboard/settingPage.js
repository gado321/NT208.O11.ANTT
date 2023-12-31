import React, { useState, useEffect, useRef } from "react";
import api from "../../api";

if (window.location.pathname === '/dashboard') {
    require('./SettingPage.css'); // Import tệp CSS
}

function EditProfile({setActiveTab}) {
    const initProfile = {
      name: "",
      email: "",
      birthday: "",
      gender: "",
    };
    const [ProfileUser, setProfileUser] = useState(initProfile);
    const [formError, setFormError] = useState({});
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await api.get(`/api/users/${localStorage.getItem('data')}`);
            const userData = await response.json;
            setProfileUser({
              name: userData.name,
              email: userData.email,
              birthday: userData.date_of_birth,
              gender: userData.gender
            });
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }
        };
        fetchUserData();
      }, []);
    // Kiểm tra giá trị rỗng
    const isEmptyValue = (value) => {
        return !value || value.trim().length < 1;
    }
    // Kiểm tra email hợp lệ
    const isEmailValid = (value) => {
        return !/\S+@\S+\.\S+/.test(value);
    }
    // Xử lý thay đổi giá trị của form
    const handleChangeProfile = (event) => {
      const { value, name } = event.target;
      setProfileUser({
        ...ProfileUser,
        [name]: value,
      });
    };
    const validateForm = () => {
        const error = {};
        // Kiểm tra email
        if (isEmptyValue(ProfileUser.email)) {
            error.email = "Please enter your email";
        }
        else if (isEmailValid(ProfileUser.email)) {
            error.email = "Please enter a valid email address";
        }
        // Kiểm tra tên người dùng
        if (isEmptyValue(ProfileUser.name)) {
            error.name = "Please enter your ProfileUser";
        }
        //Kiẻm tra ngày sinh
        if (isEmptyValue(ProfileUser.birthday)) {
            error.birthday = "Please enter your birthday";
        }
        else if (new Date(ProfileUser.birthday) > new Date()) {
            error.birthday = "Birthday must be less than today";
        }
        // Kiểm tra giới tính
        if (isEmptyValue(ProfileUser.gender)) {
            error.gender = "Please choose your gender";
        }
        // Trả về lỗi
        setFormError(error);
        return Object.keys(error).length === 0;
    }

    // gửi giá trị cập nhật lên server
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Kiểm tra lỗi
        if (validateForm()) {
            const data = JSON.stringify(
                {
                    name: ProfileUser.name,
                    email: ProfileUser.email,
                    gender: ProfileUser.gender,
                    date_of_birth: ProfileUser.birthday
                }
            )
            const response = await api.put(`/api/users/${localStorage.getItem('data')}`, data, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            console.log("Dữ liệu hồ sơ đã chỉnh sửa:", response);
            // Quay về setting...
            setActiveTab('setting');
        }
    };
  
    const content = document.querySelector('.content');
    content.innerHTML = '';
  
    const editProfileContent = document.createElement('div');
    editProfileContent.className = 'edit-profile-container';
  
    const form = document.createElement('form');
    form.className = 'form-edit-profile';
  
    const title = document.createElement('h1');
    title.className = 'edit-profile-title';
    title.textContent = 'Edit Profile';
    // Tạo các input và append vào form

    // Tạo input name
    const nameInputContainer = document.createElement('div');
    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'edit-name';
    nameLabel.className = 'edit-profile-label';
    nameLabel.textContent = 'name:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'edit-name';
    nameInput.className = 'edit-profile-input';
    nameInput.name = 'name';
    nameInput.placeholder = 'Enter your name';
    nameInput.value = ProfileUser.name;
    nameInput.addEventListener('change', handleChangeProfile);
    const nameError = document.createElement('p');
    nameError.className = 'edit-profile-error';
    nameError.textContent= formError.name;
    
    nameInputContainer.appendChild(nameLabel);
    nameInputContainer.appendChild(nameInput);
    nameInputContainer.appendChild(nameError);

    // Tạo input email
    const emailInputContainer = document.createElement('div');
    const emailLabel = document.createElement('label');
    emailLabel.htmlFor = 'edit-email';
    emailLabel.className = 'edit-profile-label';
    emailLabel.textContent = 'Email:';
    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.id = 'edit-email';
    emailInput.className = 'edit-profile-input';
    emailInput.name = 'email';
    emailInput.placeholder = 'Enter your email';
    emailInput.value = ProfileUser.email;
    emailInput.addEventListener('change', handleChangeProfile);
    const emailError = document.createElement('p');
    emailError.className = 'edit-profile-error';
    emailError.textContent= formError.email;

    emailInputContainer.appendChild(emailLabel);
    emailInputContainer.appendChild(emailInput);
    emailInputContainer.appendChild(emailError);

    // Tạo input birthday
    const birthdayInputContainer = document.createElement('div');
    const birthdayLabel = document.createElement('label');
    birthdayLabel.htmlFor = 'edit-birthday';
    birthdayLabel.className = 'edit-profile-label';
    birthdayLabel.textContent = 'Birthday:';
    const birthdayInput = document.createElement('input');
    birthdayInput.type = 'date';
    birthdayInput.id = 'edit-birthday';
    birthdayInput.className = 'edit-profile-input';
    birthdayInput.name = 'birthday';
    birthdayInput.placeholder = 'Enter your birthday';
    birthdayInput.value = ProfileUser.birthday;
    birthdayInput.addEventListener('change', handleChangeProfile);
    const birthdayError = document.createElement('p');
    birthdayError.className = 'edit-profile-error';
    birthdayError.textContent= formError.birthday;

    birthdayInputContainer.appendChild(birthdayLabel);
    birthdayInputContainer.appendChild(birthdayInput);
    birthdayInputContainer.appendChild(birthdayError);
  
    //Tạo input gender
    const genderInputContainer = document.createElement('div');
    const genderLabel = document.createElement('label');
    genderLabel.htmlFor = 'edit-gender';
    genderLabel.className = 'edit-profile-label';
    genderLabel.textContent = 'Gender:';
    const genderInput = document.createElement('select');
    genderInput.id = 'edit-gender';
    genderInput.className = 'edit-profile-input';
    genderInput.name = 'gender';
    genderInput.addEventListener('change', handleChangeProfile);
    
    const genderOption1 = document.createElement('option');
    genderOption1.value = 'male';
    genderOption1.textContent = 'Male';

    const genderOption2 = document.createElement('option');
    genderOption2.value = 'female';
    genderOption2.textContent = 'Female';

    const genderOption3 = document.createElement('option');
    genderOption3.value = 'other';
    genderOption3.textContent = 'Other';

    if (ProfileUser.gender === 'male') {
        genderOption1.selected = true;
    } else if (ProfileUser.gender === 'female') {
    genderOption2.selected = true;
    } else if (ProfileUser.gender === 'other') {
    genderOption3.selected = true;
    }

    genderInput.appendChild(genderOption1);
    genderInput.appendChild(genderOption2);
    genderInput.appendChild(genderOption3);
    const genderError = document.createElement('p');
    genderError.className = 'edit-profile-error';
    genderError.textContent= formError.gender;
  
    genderInputContainer.appendChild(genderLabel);
    genderInputContainer.appendChild(genderInput);
    genderInputContainer.appendChild(genderError);
  
    //Tạo button cancel
    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-edit-profile-container';
    const btnCancel = document.createElement('button');
    btnCancel.type = 'submit';
    btnCancel.className = 'btn-cancel';
    btnCancel.textContent = 'Cancel';
    btnCancel.onclick = function() {
        setActiveTab('setting');
    };
    btnContainer.appendChild(btnCancel);

    // Tạo button update
    const updateErrorFeedback = document.createElement('p');
    updateErrorFeedback.className = 'edit-profile-error';
    const btnUpdate = document.createElement('button');
    btnUpdate.type = 'submit';
    btnUpdate.className = 'btn-update';
    btnUpdate.textContent = 'Update';
    btnUpdate.onclick = handleSubmit;
  
    btnContainer.appendChild(updateErrorFeedback);
    btnContainer.appendChild(btnUpdate);

    // Append các input vào form
    form.appendChild(nameInputContainer);
    form.appendChild(emailInputContainer);
    form.appendChild(birthdayInputContainer);
    form.appendChild(genderInputContainer);
    form.appendChild(btnContainer);

    // Append các thành phần vào content
    editProfileContent.appendChild(title);
    editProfileContent.appendChild(form);
    content.appendChild(editProfileContent);
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function  SettingContent ({setActivePage, setActiveTab}) {
    const logOut = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('data');
        window.location.href = "/login";
    };
    const handleButtonClick = (name) => () => {
        switch (name) {
            case 'View Profile':
                setActivePage('profile');
                break;
            case 'Edit Profile':
                setActiveTab('editprofile');
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
      ACCOUNT: ['View Profile', 'Edit Profile', 'Go Premium', 'Log out'],
      APP:['Privacy Policy', 'Share this app', 'Rate this app', 'Help']
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

function SettingPage ({setActivePage}) {
    const [activeTab, setActiveTab] = useState('setting');
    
    return (
        <>
            {activeTab === 'setting' && <SettingContent setActivePage={setActivePage} setActiveTab={setActiveTab} />}
            {activeTab === 'editprofile' && <EditProfile setActiveTab={setActiveTab} />}
        </>
      );
  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////

export default SettingPage;