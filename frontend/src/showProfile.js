import {getUser, checkUserInUpvotes} from './upvote.js';
import {timeConverter} from './feed.js';

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
    const numPosts = document.createElement('label');
    numPosts.textContent = 'Number of Posts';
    const numUpvotes = document.createElement('label');
    numUpvotes.textContent = 'Number of upvotes';
    
    const profileUsername = document.createElement('p');
    let username = localStorage.getItem('user');
    profileUsername.textContent = username;
    const profileNumPosts = document.createElement('p');
    profileNumPosts.className = 'profile-num-posts';
    const profilePosts = document.createElement('ul');
    profilePosts.className = 'profile-posts';
    
    modalProfile.firstChild.appendChild(usernameTitle);
    modalProfile.firstChild.appendChild(profileUsername);
    modalProfile.firstChild.appendChild(numPosts);
    modalProfile.firstChild.appendChild(profileNumPosts);
    modalProfile.firstChild.appendChild(numUpvotes);
    modalProfile.firstChild.appendChild(profilePosts);
    document.getElementById('root').appendChild(modalProfile);
}
    
// opens and closes the modal window for the user's profile    
function showProfile(apiUrl) {
    // when the 'logged in as <username>' is clicked from the header
    // the user's profile is shown
    let loggedUser = document.getElementById('logged-user');
    let modalProfile = document.getElementById('profile-screen');
    loggedUser.onclick = () => {
        modalProfile.style.visibility = 'visible';
        getUser(apiUrl);
        let json = JSON.parse(localStorage.getItem('userInfo'));
        getPostInfo(apiUrl, json.posts);
        let numPosts = document.getElementsByClassName('profile-num-posts')[0];
        numPosts.textContent = json.posts.length;
    }
    
    // close the modal window when the cross is clicked on
    let closeProfile = modalProfile.firstChild.firstChild;
    closeProfile.onclick = () => {
        modalProfile.style.visibility = 'hidden';
         // clear any posts before re-rendering into profile
        document.getElementsByClassName('profile-posts')[0].innerText = '';
    
    }
}

// gets a json object of the user's information
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
    
    for(let postId of postIds) {
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
    let feedPost = document.getElementsByClassName('post')[0].cloneNode(true);
    feedPost.id = post.id;
    
    let title = feedPost.childNodes[1].childNodes[0];
    title.textContent = post.title;
    let author = feedPost.childNodes[1].childNodes[1];
    author.textContent = "Posted by " + post.meta.author;
    let upvotes = feedPost.firstChild;
    upvotes.textContent = post.meta.upvotes.length;
    let date = feedPost.childNodes[1].childNodes[2];
    date.textContent = timeConverter(post.meta.published);
    date.className = 'post-date';
    let thumb = feedPost.childNodes[1].childNodes[3];
    
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

export {makeProfileWindow, showProfile};
