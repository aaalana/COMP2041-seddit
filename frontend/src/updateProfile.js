import {signValidate} from './signUp.js';

// changes the profile page to an editing profile page
function editProfileMode() {
    // show editing fields 
    let profile = document.getElementById('profile-screen');
    let Uname = profile.getElementsByClassName('userDetails')[0];
    let email = profile.getElementsByClassName('userDetails')[1];
    let password = profile.getElementsByClassName('userDetails')[2];
  
    let editName = Uname.nextSibling;
    editName.value = Uname.textContent;
    let editEmail = email.nextSibling;
    editEmail.value = email.textContent;
    let editPassword = password.nextSibling;
    editPassword.value = localStorage.getItem('password');
    let update = editPassword.nextSibling.nextSibling;
    let cancel = update.nextSibling;
    
    update.style.display= 'inline-block';
    cancel.style.display= 'inline-block';
    editName.style.display= 'block';
    editEmail.style.display= 'block';
    editPassword.style.display= 'block';
    
    // hide profile information that is not edited
    let btns = document.getElementById('profile-btn-div');
    btns.style.visibility = 'hidden';
    
    Uname.style.display = 'none';
    email.style.display = 'none';
    password.style.display = 'none';
    
    let followers = profile.getElementsByTagName('label')[4];
    let followersNo = followers.nextSibling;
    let postNum = profile.getElementsByTagName('label')[5];
    let postNumValue = postNum.nextSibling;
    let postUpvotes = postNumValue.nextSibling;
    let posts = postUpvotes.nextSibling;
    let username = Uname.previousSibling.previousSibling;
    let usernameTitle = username.previousSibling;
    let profileUpvotes = document.getElementById('profile-upvotes');
    
    username.style.display = 'none';
    usernameTitle.style.display = 'none';
    profileUpvotes.style.display = 'none';
    
    followers.style.display = 'none';
    followersNo.style.display = 'none';
    postNum.style.display = 'none';
    postNumValue.style.display = 'none';;
    postUpvotes.style.display = 'none';
    posts.style.display = 'none';
}

// switch from editing profile mode to showing the user's profile
function profileMode() {
    let profile = document.getElementById('profile-screen').firstChild.childNodes;
    
    for (let element of profile) {
        if (element.id === 'empty-message-profile') {
            element.style.display = 'none';
        } else if (element.id === 'profile-btn-div') { 
            element.style.visibility = 'visible';
        } else if (element.tagName === 'INPUT' || 
            element.style.display === 'inline-block') {
            element.style.display = 'none';
        } else if (element.style.display === 'none') { 
            element.style.display = 'block';
        } 
    }
   
    let message = document.getElementById('edit-error'); 
    message.textContent = '';
}

// updates the user's profile
function updateProfile(apiUrl) {
    let update = document.getElementById('update-btn');
    update.onclick = () => {
        let Uname = document.getElementById('edit-name').value;
        let email = document.getElementById('edit-email').value;
        let password = document.getElementById('edit-password').value;
        let message = document.getElementById('edit-error'); 
        message.style.color = 'red';
        let userToken = localStorage.getItem('token');
        
        // input validation
        // editing fields cannot be empty
        if (!Uname || !email || !password) {
            message.textContent = 'Error: missing user details';
            return
        // editing fields must contain valid characters
        } else if (signValidate('none', password, email, Uname, message) === false) {
            return
        } else {
            message.textContent = '';
        }
      
        let payload = {
          "email": email,
          "name":  Uname,
          "password": password
        }
        
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token '+ userToken
            },
            body: JSON.stringify(payload)
        }
      
        fetch(`${apiUrl}/user`, options)
            .then(response => response.json())
            .then(json => {
                // give a confirmation message that the user's details
                // have been updated
                message.textContent = 'Done!';
                message.style.color = 'green';
                
                // update details without page refresh
                let Pname = document.getElementsByClassName('userDetails')[0];
                Pname.textContent = Uname;
                let Pemail = document.getElementsByClassName('userDetails')[1];
                Pemail.textContent = email;
                let Ppassword = document.getElementsByClassName('userDetails')[2];
                localStorage.setItem('password', `${password}`);
                Ppassword.textContent = '*'.repeat(password.length);
                
                // go back to profile mode
                setTimeout(function() { profileMode() } , 1000);
            });
    } 
    
    // switch back to the user's profile if the cancel button is clicked
    let cancel = document.getElementById('profile-cancel-btn');
    cancel.onclick = () => {  
        profileMode();
    }
}

export {editProfileMode, updateProfile} 
