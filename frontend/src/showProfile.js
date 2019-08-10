import {getUser, checkUserInUpvotes} from './upvote.js';
import {makePostTemplate, timeConverter} from './feed.js';
import {editProfileMode} from './updateProfile.js';

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
    
    const followedBtn = document.createElement('button');
    followedBtn.type = 'button';
    followedBtn.textContent = 'FOLLOWED';
    followedBtn.className = 'button button-secondary';
    followedBtn.id = 'followed-btn';
   
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'EDIT PROFILE';
    editBtn.className = 'button button-primary';
    editBtn.id = 'edit-btn';
   
    const profileNumPosts = document.createElement('p');
    profileNumPosts.className = 'profile-num-posts';
    const message = document.createElement('p');
    message.id = 'empty-message-profile';
    const profilePosts = document.createElement('ul');
    profilePosts.className = 'profile-posts';
    
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
    btnDiv.appendChild(followedBtn);
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
    modalProfile.firstChild.appendChild(numPosts);
    modalProfile.firstChild.appendChild(profileNumPosts);
    modalProfile.firstChild.appendChild(numUpvotes);
    modalProfile.firstChild.appendChild(message);
    modalProfile.firstChild.appendChild(profilePosts);
   
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
    message.textContent = 'You are following no one';
    title.parentNode.appendChild(message);

    profileFollowing.getElementsByTagName('li')[0].className = 'following-users';
    profileFollowing.getElementsByTagName('ul')[0].className = 'grouped-following';
}

// make the modal window to show who the user is followed by
function makeFollowedWindow() {
    const profileFollowed = document.getElementById('upvotes-screen')
                                    .cloneNode(true);
    profileFollowed.id = 'followed-screen';
    document.getElementById('root').appendChild(profileFollowed);
    
    const title = profileFollowed.getElementsByTagName('h1')[0]
    title.textContent = 'Followed';
    const message = document.createElement('p');
    message.id = 'empty-message-followed';
    message.textContent = 'You are followed by no one';
    title.parentNode.appendChild(message);
    
    profileFollowed.getElementsByTagName('li')[0].className = 'followed-users';
    profileFollowed.getElementsByTagName('ul')[0].className = 'grouped-followed';
}
    
// opens and closes the modal window for the user's profile    
function showProfile(apiUrl) {
    // when the 'logged in as <username>' is clicked from the header
    // the user's profile is shown
    let loggedUser = document.getElementById('logged-user');
    let modalProfile = document.getElementById('profile-screen');
    loggedUser.onclick = () => {
        modalProfile.style.visibility = 'visible';
        modalProfile.style.display = 'block';
        getUser(apiUrl);
        let json = JSON.parse(localStorage.getItem('userInfo'));
        
        if (json.posts.length == 0) {
            let message = document.getElementById('empty-message-profile');
            message.textContent = `No upvotes can be shown because you 
                                   have no posts.`;
        } else {
            getPostInfo(apiUrl, json.posts);
        }
        
        // fill in the user's details
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
        // clear any posts before re-rendering into profile
        document.getElementsByClassName('profile-posts')[0].innerText = '';
        // clear any messages that were on the user's profile
        document.getElementById('empty-message-profile').textContent = '';
    }
    
    let editBtn = document.getElementById('edit-btn');
    editBtn.onclick = () => {
        editProfileMode() 
    }
}

// gets a json object of the user's information
// and passes it into a function that load the user's posts
function getPostInfo(apiUrl, postIds) {
    // get the user's token
    var userToken = localStorage.getItem('token');
    
    let postOptions = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ userToken
        }
    }
    
    let userId = '';
    if (localStorage.getItem('login') == 'true') {
        getUser(apiUrl);
        userId = localStorage.getItem('userId');
    }
    
    let sortPostIds = postIds.sort(function(a,b) { return b-a });
  
    for(let postId of sortPostIds) {
        fetch(`${apiUrl}/post?id=${postId}`, postOptions)
            .then(response => response.json())
            .then(json => {
                showUserPosts(json, userId, apiUrl); 
            });
    }
}

// generates elements for the user's post and displays them on the 
// user's profile
function showUserPosts(post, userId, apiUrl) {
    let feedPost = makePostTemplate().cloneNode(true);
    feedPost.id = post.id;
    
    // remove any images that were previously attached on the template post
    if (feedPost.lastChild.className == 'post-container') 
        feedPost.getElementsByClassName('post-container')[0].remove();
   
    let title = feedPost.childNodes[1].childNodes[0];
    title.textContent = post.title;
    let author = feedPost.childNodes[1].childNodes[1];
    author.textContent = 'Posted by ' + post.meta.author;
    let upvotes = feedPost.firstChild;
    upvotes.textContent = post.meta.upvotes.length;
    let date = feedPost.childNodes[1].childNodes[2];
    date.textContent = timeConverter(post.meta.published);
    date.className = 'post-date';
    let thumb = feedPost.childNodes[1].childNodes[3];
    thumb.style.visibility = 'visible';
    
    // change the thumbs to blue if the user has already upvoted
    // on the post
    if (localStorage.getItem('login') == 'true')
        checkUserInUpvotes(post.id, userId, thumb, apiUrl);
   
    let description = feedPost.childNodes[1].childNodes[4];
    description.textContent = post.text;
    let comments = feedPost.childNodes[1].childNodes[5];
    comments.textContent = post.comments.length + ' comments';
    let subseddit = feedPost.childNodes[1].childNodes[6];
    if (post.meta.subseddit)
        subseddit.textContent = 's/' + post.meta.subseddit;
    else
        subseddit.textContent = '';
        
    // add in the image only if it exists 
    if (post.image !== null) {
        let image = new Image();
        image.src = 'data:image/png;base64,' + post.image;
        image.className = 'post-image';
        
        let container = document.createElement('div');
        container.className = 'post-container';
      
        container.appendChild(image);
        feedPost.appendChild(container);
    }
    
    let feedUl = document.getElementsByClassName('profile-posts')[0];
    feedUl.appendChild(feedPost);
}

export {makeFollowingWindow, makeFollowedWindow, getPostInfo, makeProfileWindow, showProfile};
