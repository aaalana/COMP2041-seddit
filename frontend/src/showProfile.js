/* This file is responsible for showing a logged in user's profile. 
 * This file also includes code for showing who a user follows.
 */

import {getUser, checkUserInUpvotes} from './upvote.js';
import {loadPost, sortPosts, makePostTemplate, timeConverter} from './feed.js';
import {editProfileMode} from './updateProfile.js';
import {loadUsers, userIdToUsername} from './showVotesComments.js';

// makes the modal for a logged in user's profile
function makeProfileWindow() {

    // step 1: define the elements for the logged in user
   
    // elements used when showing the profile //
    // modal
    const modalUpvotes = document.getElementById('upvotes-screen');
    const modalProfile = modalUpvotes.cloneNode(true);
    modalProfile.id = 'profile-screen';
    modalProfile.getElementsByTagName("h1")[0].textContent = 'My Profile';
    modalProfile.getElementsByTagName("ul")[0].remove();
    
    // labels for the profile (username, name, email, password, 
    // no. followers, no. posts, total upvotes)
    const usernameTitle = document.createElement('label');
    usernameTitle.textContent = 'Username';
    const nameTitle = document.createElement('label');
    nameTitle.textContent = 'Name';
    const usernameEmail = document.createElement('label');
    usernameEmail.textContent = 'Email Address';
    const usernamePassword = document.createElement('label');
    usernamePassword.textContent = 'Password';
    const numFollowed = document.createElement('label');
    numFollowed.textContent = 'Number of Followers';
    const numPosts = document.createElement('label');
    numPosts.textContent = 'Number of Posts';
    const numUpvotes = document.createElement('label');
    numUpvotes.textContent = 'Number of upvotes';
    
    // values that will go below the labels
    const profileUsername = document.createElement('p');
    let username = localStorage.getItem('user');
    profileUsername.textContent = username;
    const profileName = document.createElement('p');
    profileName.className = 'userDetails';
    const profileEmail = document.createElement('p');
    profileEmail.className = 'userDetails';
    const profilePassword = document.createElement('p');
    profilePassword.className = 'userDetails';
    
    // buttons (who the user's following, editing profile)
    
    // group button into a div so that it stays on the same line
    const btnDiv = document.createElement('div');
    btnDiv.id = 'profile-btn-div';
    
    const followingBtn = document.createElement('button');
    followingBtn.type = 'button';
    followingBtn.textContent = 'FOLLOWING';
    followingBtn.className = 'button button-secondary';
    followingBtn.id = 'following-btn';
   
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'EDIT PROFILE';
    editBtn.className = 'button button-primary';
    editBtn.id = 'edit-btn';
    
    const profileFollowed = document.createElement('p');
    profileFollowed.className = 'profile-followers';
    const profileNumPosts = document.createElement('p');
    profileNumPosts.className = 'profile-num-posts';
    const profileUpvotes = document.createElement('p');
    profileUpvotes.id = 'profile-upvotes';
    profileUpvotes.textContent = '0';
    
    // elements used when updating profile //
    
    // input fields (name, email, password)
    let editName = document.createElement('input');
    editName.type = 'text';
    editName.id = 'edit-name'
    let editEmail = document.createElement('input');
    editEmail.type = 'text';
    editEmail.id = 'edit-email';
    let editPassword = document.createElement('input');
    editPassword.type = 'text';
    editPassword.id = 'edit-password';
   
    // any error message (for input validation when saving changes)
    const error = document.createElement('p');
    error.id = 'edit-error';
    
    // buttons (save changes, cancel changes)
    const update = document.createElement('button');
    update.type = 'button';
    update.textContent = 'UPDATE';
    update.className = 'button button-secondary';
    update.id = 'update-btn';
    
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'CANCEL';
    cancel.className = 'button button-primary';
    cancel.id = 'profile-cancel-btn';
    
    // hide the elements used for editing the profile by default 
    // since the profile first needs to be shown before editing mode
    // of the user's profile can be switched to
    editName.style.display = 'none';
    editEmail.style.display = 'none';
    editPassword.style.display = 'none';
    update.style.display = 'none';
    cancel.style.display = 'none';
    
    // step 2: appending elements together and putting it on the doc 
    btnDiv.appendChild(followingBtn);
    btnDiv.appendChild(editBtn);
    modalProfile.firstChild.appendChild(btnDiv);
    modalProfile.firstChild.appendChild(usernameTitle);
    modalProfile.firstChild.appendChild(profileUsername);
    modalProfile.firstChild.appendChild(nameTitle);
    modalProfile.firstChild.appendChild(profileName);
    modalProfile.firstChild.appendChild(usernameEmail);
    modalProfile.firstChild.appendChild(profileEmail);
    modalProfile.firstChild.appendChild(usernamePassword);
    modalProfile.firstChild.appendChild(profilePassword);
    modalProfile.firstChild.appendChild(numFollowed);
    modalProfile.firstChild.appendChild(profileFollowed);
    modalProfile.firstChild.appendChild(numPosts);
    modalProfile.firstChild.appendChild(profileNumPosts);
    modalProfile.firstChild.appendChild(numUpvotes);
    modalProfile.firstChild.appendChild(profileUpvotes);
   
    profileName.insertAdjacentElement('afterend', editName);
    profileEmail.insertAdjacentElement('afterend', editEmail);
    profilePassword.insertAdjacentElement('afterend', editPassword);
    editPassword.insertAdjacentElement('afterend', error);
    error.insertAdjacentElement('afterend', update);
    update.insertAdjacentElement('afterend', cancel);
    
    document.getElementById('root').appendChild(modalProfile);
}

// make the modal to show who the user is following
function makeFollowingWindow() {

    // clone a pre-existing modal and modify it //
    
    const profileFollowing = document.getElementById('upvotes-screen')
                                     .cloneNode(true);
    profileFollowing.id = 'following-screen';
    document.getElementById('root').appendChild(profileFollowing);
    
    // change the title 'following'
    const title = profileFollowing.getElementsByTagName('h1')[0];
    title.textContent = 'Following';
    
    // add in an message element for when the following modal has no users
    const message = document.createElement('p');
    message.id = 'empty-message-following';
    message.textContent = 'You are following no one.';
    message.style.display = 'block';
    title.parentNode.appendChild(message);
    
    // more rename of classnames
    profileFollowing.getElementsByTagName('li')[0]
                    .className = 'following-users';
    profileFollowing.getElementsByTagName('ul')[0]
                    .className = 'grouped-following';
}
  
// controls all the buttons related to the user's profile. Uses include:
// -opening/closing the user's profile 
// -opening/closing the following modal
//  (shows who the user is following)
function showProfile(apiUrl) {
    
    // defining variables for easier referencing of elements
    let loggedUser = document.getElementById('logged-user');
    let modalProfile = document.getElementById('profile-screen');
    
    // add the user's info into the localstorage if not done so already
    getUser(apiUrl,localStorage.getItem('user'));
     
    // when the 'logged in as <username>' is clicked from the header
    // the user's profile is shown
    loggedUser.onclick = () => {
        // show the user's profile
        modalProfile.style.visibility = 'visible';
        modalProfile.style.display = 'block';
        loadProfile(apiUrl);
    }
    
    // close the modal when the cross is clicked on
    let closeProfile = modalProfile.firstChild.firstChild;
    closeProfile.onclick = () => {
        modalProfile.style.visibility = 'hidden';
        modalProfile.style.display = 'none';
        // store any updates made to the user profile to local storage
        getUser(apiUrl, localStorage.getItem('user'));
    }
    
    // When the edit profile button is clicked, the user can edit
    // details by switching the profile mode to an editing mode
    let editBtn = document.getElementById('edit-btn');
    editBtn.onclick = () => {
        editProfileMode();
    }
    
    // when the following button is clicked, a list of users followed
    // is shown
    let following = document.getElementById('following-btn');
    let modalFollowing = document.getElementById('following-screen');
    following.onclick = () => {
        showFollowing(apiUrl, 'open', 'logged');
    }
    
    // close the modal when the cross is clicked on
    let closeFollowing = modalFollowing.getElementsByTagName('span')[0];
    closeFollowing.onclick = () => {
        showFollowing(apiUrl, 'close', 'logged');
    }
}

// load the user's information onto the user's profile modal
function loadProfile(apiUrl) {
    
    // define variable for easier referencing
    let numFollowers = document.getElementsByClassName('profile-followers')[0];
    let numPosts = document.getElementsByClassName('profile-num-posts')[0];
    let Uname = document.getElementsByClassName('userDetails')[0];
    let email = document.getElementsByClassName('userDetails')[1];
    let password = document.getElementsByClassName('userDetails')[2];
    
    // extract the user's information via localStorage
    let json = JSON.parse(localStorage.getItem('loggedUserInfo'));
   
    // add the total number of upvotes and add it to the profile
    getPostInfo(apiUrl, json.posts, 'profile-upvotes', 'upvotes');
    
    // fill in other user details
    numFollowers.textContent = json.followed_num;
    numPosts.textContent = json.posts.length;
    Uname.textContent = json.name;
    email.textContent = json.email;
    
    // encrypt the user's password for extra security
    let pass = localStorage.getItem('password');
    password.textContent = '*'.repeat(pass.length);
}

// function which controls the 'following' button found on user's profile
// and user pages
// it opens/closes a modal that contains a list of users that a certain  
// user follows
function showFollowing(apiUrl, option, userType) {
    
    // define variables for easier referencing
    let modalFollowing = document.getElementById('following-screen');
    
    // opens the following modal
    if (option == 'open') {
        // make the following modal opens on top of other modals
        document.getElementById('root').appendChild(modalFollowing);
        modalFollowing.style.visibility = 'visible';
       
        // get a list of users that the user follows
        let json;
        if (userType == 'logged') {
            json = JSON.parse(localStorage.getItem('loggedUserInfo'));
        } else {
            json = JSON.parse(localStorage.getItem('userInfo'));
        }
        
        // load users onto the following modal 
        // load a message onto the modal if the user is following no one
        let message = document.getElementById('empty-message-following');
        if (json.following.length != 0) {
            message.style.display = 'none';
            loadUsers(json.following, 'following-users', apiUrl);
        } else {
            message.style.display = 'block';
        }
    // closes the following modal
    } else {
        modalFollowing.style.visibility = 'hidden';
        
        // clear out the list of users from the modal 
        let users = document.getElementsByClassName('grouped-following')[0];
        users.innerText = '';
        
        // remake an empty template element to load a user in
        // which is used when we need to open following modal again
        const templateUser = document.createElement('li');
        templateUser.className = 'following-users';
        users.appendChild(templateUser);
    }
}

// gets a json object of the user's information
// depending on the the option stated:

// it passes the object into a function that load the user's posts 
// onto an element specified by the parameter elementId

// or it sums the number of upvotes a user has across all posts and 
// updates that number onto the user's profile
function getPostInfo(apiUrl, postIds, elementId, option) {
    
    // get the user's token
    var userToken = localStorage.getItem('token');
    let postOptions = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ userToken
        }
    }
  
    // make an array of urls to fetch
    let URLS = [];
    for(let postId of postIds) 
        URLS.push(`${apiUrl}/post?id=${postId}`);
    
    // change the array of URLS into json objects is mapped to fetch 
    // requests and converts the data obtained to json
    URLS = URLS.map(url => fetch(url, postOptions)
               .then(response => response.json()));
    
    // The promise returns an array of post objects
    let total = 0;
    Promise.all(URLS)
        .then(json => {
            // calculate the total upvotes across all the user's posts
            // and put it on the user's profile
            if (option == 'upvotes') {
                for (let post of json) 
                    total += post.meta.upvotes.length;
                let upVotes = document.getElementById('profile-upvotes');
                upVotes.textContent = total;
            // load posts into the user page   
            } else if (option == 'loadPost') {
                // sorting posts from most recent to least
                let sortedPosts = sortPosts(json);
                
                // adding posts to the feed
                let userId = localStorage.getItem('loggedUserInfo').id;
                for (let post of sortedPosts) 
                    loadPost(post, userId, apiUrl, elementId); 
            }
    });
}

export {makeFollowingWindow, getPostInfo,  makeProfileWindow, showProfile,
        showFollowing};
