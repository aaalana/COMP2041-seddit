import {getUser, checkUserInUpvotes} from './upvote.js';
import {loadPost, sortPosts, makePostTemplate, timeConverter} from './feed.js';
import {editProfileMode} from './updateProfile.js';
import {loadUsers, userIdToUsername} from './showVotesComments.js';

function makeProfileWindow() {
    // SHOW USER PROFILE
    // make the modal window for the user's profile
    const modalUpvotes = document.getElementById('upvotes-screen');
    const modalProfile = modalUpvotes.cloneNode(true);
    modalProfile.id = 'profile-screen';
    modalProfile.getElementsByTagName("h1")[0].textContent = 'My Profile';
    modalProfile.getElementsByTagName("ul")[0].remove();
   
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
    
    const profileUsername = document.createElement('p');
    let username = localStorage.getItem('user');
    profileUsername.textContent = username;
    const profileName = document.createElement('p');
    profileName.className = 'userDetails';
    const profileEmail = document.createElement('p');
    profileEmail.className = 'userDetails';
    const profilePassword = document.createElement('p');
    profilePassword.className = 'userDetails';
    
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
    
    // elements used when updating profile
    let editName = document.createElement('input');
    editName.type = 'text';
    editName.id = 'edit-name'
    let editEmail = document.createElement('input');
    editEmail.type = 'text';
    editEmail.id = 'edit-email';
    let editPassword = document.createElement('input');
    editPassword.type = 'text';
    editPassword.id = 'edit-password';
   
    const error = document.createElement('p');
    error.id = 'edit-error';
    
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
    
    editName.style.display = 'none';
    editEmail.style.display = 'none';
    editPassword.style.display = 'none';
    update.style.display = 'none';
    cancel.style.display = 'none';
    
    // appending elements
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

// make the modal window to show who the user is following
function makeFollowingWindow() {
    const profileFollowing = document.getElementById('upvotes-screen')
                                     .cloneNode(true);
    profileFollowing.id = 'following-screen';
    document.getElementById('root').appendChild(profileFollowing);
    
    const title = profileFollowing.getElementsByTagName('h1')[0]
    title.textContent = 'Following';
    const message = document.createElement('p');
    message.id = 'empty-message-following';
    message.textContent = 'You are following no one.';
    message.style.display = 'block';
    title.parentNode.appendChild(message);

    profileFollowing.getElementsByTagName('li')[0].className = 'following-users';
    profileFollowing.getElementsByTagName('ul')[0].className = 'grouped-following';
}
  
// allows buttons on the user's profile to open and close modal windows
// displays the user's profile  
function showProfile(apiUrl) {
    // when the 'logged in as <username>' is clicked from the header
    // the user's profile is shown
    let loggedUser = document.getElementById('logged-user');
    let modalProfile = document.getElementById('profile-screen');
    loggedUser.onclick = () => {
        modalProfile.style.visibility = 'visible';
        modalProfile.style.display = 'block';
        
        // extract the user's information via localStorage
        getUser(apiUrl, localStorage.getItem('user'));
        let json = JSON.parse(localStorage.getItem('userInfo'));
       
        // add the total number of upvotes to profile
        getPostInfo(apiUrl, json.posts, 'profile-upvotes', 'upvotes');
        
        // fill in the user's details
        let numFollowers = document.getElementsByClassName('profile-followers')[0];
        numFollowers.textContent = json.followed_num;
        let numPosts = document.getElementsByClassName('profile-num-posts')[0];
        numPosts.textContent = json.posts.length;
        let Uname = document.getElementsByClassName('userDetails')[0];
        Uname.textContent = json.name;
        let email = document.getElementsByClassName('userDetails')[1];
        email.textContent = json.email;
        let password = document.getElementsByClassName('userDetails')[2];
        let pass = localStorage.getItem('password');
        password.textContent = '*'.repeat(pass.length);
    }
    
    // close the modal window when the cross is clicked on
    let closeProfile = modalProfile.firstChild.firstChild;
    closeProfile.onclick = () => {
        modalProfile.style.visibility = 'hidden';
        modalProfile.style.display = 'none';
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
    getUser(apiUrl, localStorage.getItem('user'));
    following.onclick = () => {
        showFollowing(apiUrl, 'open');
    }
    
    // close the modal following window when the cross is clicked on
    let closeFollowing = modalFollowing.getElementsByTagName('span')[0];
    closeFollowing.onclick = () => {
        showFollowing(apiUrl, 'close');
    }
}

// function which controls the 'following' button found on user's profile
// and user pages
// it opens/closes a modal window contains a list of users that a certain  
// user follows
function showFollowing(apiUrl, option) {
    let modalFollowing = document.getElementById('following-screen');
    if (option == 'open') {
        document.getElementById('root').appendChild(modalFollowing);
        modalFollowing.style.visibility = 'visible';
        // get a list of users that the user follows
        let json = JSON.parse(localStorage.getItem('userInfo'));
       
        // load users onto the following modal window
        let message = document.getElementById('empty-message-following');
        if (json.following.length != 0) {
            message.style.display = 'none';
            loadUsers(json.following, 'following-users', apiUrl);
        } else {
            message.style.display = 'block';
        }
    } else {
        modalFollowing.style.visibility = 'hidden';
        
        // clear out the list of users from the modal window
        let users = document.getElementsByClassName('grouped-following')[0];
        users.innerText = '';
        
        // remake the template user
        const templateUser = document.createElement('li');
        templateUser.className = 'following-users';
        users.appendChild(templateUser);
    }
}

// gets a json object of the user's information
// depending on the the option stated, 
// it passes the object into a function that load the user's posts
// or it total the number of upvotes a user has across all posts
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
    URLS = URLS.map(url => fetch(url, postOptions).then(response => response.json()));
    
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
                // get the user id
                let userId = '';
                if (localStorage.getItem('login') == 'true') {
                    let username = localStorage.getItem('user');
                    getUser(apiUrl, username);
                    userId = localStorage.getItem('userId');
                }
                
                // sorting posts from most recent to least
                let sortedPosts = sortPosts(json);
                
                // adding posts to the feed
                for (let post of sortedPosts) 
                    loadPost(post, userId, apiUrl, elementId); 
            }
    });
}

export {makeFollowingWindow, 
        getPostInfo, 
        makeProfileWindow, 
        showProfile,
        showFollowing};
