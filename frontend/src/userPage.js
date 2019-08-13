import {getPostInfo, showFollowing} from './showProfile.js';
import {getUser} from './upvote.js';
import {loadMorePosts} from './feed.js';
import {checkUserLoggedIn} from './login.js';

// make a template user page - user data has not been filled in yet
function makeUserPage() {
    const modalUpvotes = document.getElementById('upvotes-screen');
    const userPage = modalUpvotes.cloneNode(true);
    userPage.id = 'user-screen';
    userPage.getElementsByTagName("h1")[0].textContent = 'User Page';
    userPage.getElementsByTagName("ul")[0].remove();
    userPage.getElementsByTagName("p")[0].remove();
    
    const btnDiv = document.createElement('div');
    btnDiv.id = 'user-btn-div';
    
    const followingBtn = document.createElement('button');
    followingBtn.type = 'button';
    followingBtn.textContent = 'FOLLOWING';
    followingBtn.className = 'button button-secondary';
    followingBtn.id = 'following-btn-2';
   
    const followBtn = document.createElement('button');
    followBtn.type = 'button';
    followBtn.textContent = 'UNFOLLOW -';
    followBtn.className = 'button button-primary';
    followBtn.id = 'follow-btn-2';
 
    const usernameTitle = document.createElement('label');
    usernameTitle.textContent = 'Username';
    const numFollowed = document.createElement('label');
    numFollowed.textContent = 'Number of Followers';
    const numFollowing = document.createElement('label');
    numFollowing.textContent = 'Number of Following';
    const numPosts = document.createElement('label');
    numPosts.textContent = 'Number of Posts';
    const posts = document.createElement('label');
    posts.textContent = 'Posts';
    
    const message = document.createElement('p');
    message.className = 'message-posts';
    const username = document.createElement('p');
    username.className = 'user-page-info';
    const followers = document.createElement('p');
    followers.className = 'user-page-info';
    const following = document.createElement('p');
    following.className = 'user-page-info';
    const num = document.createElement('p');
    num.className = 'user-page-info';
    const postGroup = document.createElement('ul');
    postGroup.id = 'page-posts';
    
    btnDiv.appendChild(followingBtn);
    btnDiv.appendChild(followBtn);
    userPage.firstChild.appendChild(btnDiv);
    userPage.firstChild.appendChild(usernameTitle);
    userPage.firstChild.appendChild(username);
    userPage.firstChild.appendChild(numFollowed);
    userPage.firstChild.appendChild(followers);
    userPage.firstChild.appendChild(numFollowing);
    userPage.firstChild.appendChild(following);
    userPage.firstChild.appendChild(numPosts);
    userPage.firstChild.appendChild(num);
    userPage.firstChild.appendChild(posts);
    userPage.firstChild.appendChild(postGroup);
    userPage.firstChild.appendChild(message);
    
    document.getElementById('root').appendChild(userPage);   
}

// main control system of the user page 
// it manages the actions of buttons found on the user page
function mainUserPage(apiUrl) {
    let userPage = document.getElementById('user-screen');
    if (localStorage.getItem('login') === 'true') {
        // open the user page when a name/image is clicked 
        window.addEventListener('mouseover', function(e) {
            let authors = document.getElementsByClassName('post-author');
            let images = document.getElementsByClassName('post-image');
            openUserPage(authors, images, e, apiUrl);
        })
        
        // close the user page and clear the posts on the user page
        // when the cross is clicked on 
        let followBtn = document.getElementById('follow-btn-2');
        let close = userPage.firstChild.firstChild;
        close.onclick = () => {
            userPage.style.visibility = 'hidden';
            document.getElementById('page-posts').innerText = '';
            let publicFeed = document.getElementById('public-screen');
            // live update the user feed accordingly if the logged in user 
            // unfollowed a user 
            if (followBtn.textContent == 'FOLLOW +' &&
                publicFeed.style.visibility != 'visible') {
                // refresh the feed
                location.reload();
            }
        }
        
        // let the logged in user to follow/unfollow other users 
        followBtn.onclick = () => {
            // switch the follow button to unfollow and vice versa
            // use the api to send the user unfollowing/following to 
            // the backend
            let followUser = followBtn.parentNode.nextSibling.nextSibling.textContent;
            if (followBtn.textContent == 'FOLLOW +') {
                followBtn.textContent = 'UNFOLLOW -';
                follow(apiUrl, followUser);
            } else {
                followBtn.textContent = 'FOLLOW +';
                unfollow(apiUrl, followUser);
            }
        }
        
        // show who the user follows when the following button
        // is clicked
        let following = document.getElementById('following-btn-2');
        following.onclick = () => {
            showFollowing(apiUrl, 'open', 'unlogged');
        }
    } 
}

// check if the logged in user follows the user
function checkFollowing(apiUrl) {
    // extract a list of user ids that the user is followed by
    let userId = localStorage.getItem('userId');
    let json = JSON.parse(localStorage.getItem('loggedUserInfo'));
    
    // follow button from the public feed
    let followBtn2 = document.getElementById('user-btn-div').childNodes[1];
    
    // follow button from the user's feed
    let followBtn = document.getElementById('follow-btn-2');
    
    // search through the list of followers for logged in user's id
    // if found, the logged in user follows the user 
    // (set button to unfollow)
    // if not found, the logged in user does not follow the user 
    // (set button to follow)
    if (json != null) {
        let findUser = json.following.find(function(id) { return id == userId });
        let publicFeed = document.getElementById('public-screen');
        if (findUser != undefined) {
            if (publicFeed.style.visibility != 'visible') 
                followBtn.textContent = 'UNFOLLOW -'; 
            else 
                followBtn2.textContent = 'UNFOLLOW -'; 
        } else 
            if (publicFeed.style.visibility != 'visible') 
                followBtn.textContent == 'FOLLOW +';
            else 
                followBtn2.textContent = 'FOLLOW +'; 
    }
}

// opens the user's page when the author or image is clicked on 
function openUserPage(authors, images, e, apiUrl) {
    let userPage = document.getElementById('user-screen');
    for (let author of authors) {
        // only open the user page when we are clicking the author from 
        // the feed
        if (author == e.target && 
            author.parentNode.parentNode.parentNode.id != 'page-posts') {
            author.style.textDecoration = 'underline'; 
            
            // get information about the author and store it into
            // local storage
            let username = author.textContent.substring(10);
            getUser(apiUrl, username);
            
            // store the id of the post clicked on into local storage
            let postId = author.parentNode.parentNode.id;
            localStorage.setItem('postId', postId);
            
            author.onclick = () => {
                userPage.style.visibility = 'visible';
                // load the user's data onto the user's page
                loadUserPage(username, apiUrl);
            }
           
            // create a hover effect when the user's mouse is over the 
            // author's username
            author.onmouseout = () => {
                author.style.textDecoration = 'none'; 
            }
        }
    }
    
    for (let image of images) {
        // only open the user page when we are clicking the image from 
        // the feed
        if (image == e.target &&
            image.parentNode.parentNode.parentNode.id != 'page-posts') {
            image.style.opacity = '0.8';
            
            // get information about the author and store it into
            // local storage
            let author = image.parentNode.previousSibling.childNodes[1];
            let username = author.textContent.substring(10);
            getUser(apiUrl, username);
            
            // store the id of the post clicked on into local storage
            let postId = image.parentNode.parentNode.id;
            localStorage.setItem('postId', postId);
            
            image.onclick = () => {
                userPage.style.visibility = 'visible';
                // load the user's data onto the user's page
                loadUserPage(username, apiUrl);
            }
            
            // create a hover effect when the user's mouse is over the 
            // image
            image.onmouseout = () => {
                image.style.opacity = '1';
            }
        }
    }
}

// loads data of a user onto the user page
function loadUserPage(username, apiUrl) {
    // check if the logged in user follows the user from the extracted
    // information 
    // if so, change the follow button to unfollow 
  
    checkFollowing(apiUrl);
    let json = JSON.parse(localStorage.getItem('userInfo'));
    let userPage = document.getElementById('user-screen');
    let details = document.getElementsByClassName('user-page-info');
    
    // load the user's username, number of followers, number of posts
    details[0].textContent = json.username;
    details[1].textContent = json.followed_num;
    details[2].textContent = json.following.length;
    details[3].textContent = json.posts.length;
     
    // load the user's posts
    if (json.posts.length === 0) {
        let message = document.getElementsByClassName('message-posts')[0];
        message.textContent = 'You have no posts';
    } else {
        getPostInfo(apiUrl, json.posts, 'page-posts', 'loadPost');
    }
}

// allows the logged in user to follow another user
function follow(apiUrl, userName) {
    var userToken = localStorage.getItem('token');
    let options = {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ userToken
        }
    }
    
    fetch(`${apiUrl}/user/follow?username=${userName}`, options)
        .then(response => response.json())
        .then(json => {
            console.log(json);
        });
}

// allows the logged in user to unfollow another user
function unfollow(apiUrl, username) {
    var userToken = localStorage.getItem('token');
    let options = {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ userToken
        }
    }
    console.log(username);
    fetch(`${apiUrl}/user/unfollow?username=${username}`, options)
        .then(response => response.json())
        .then(json => {
            console.log(json);
        });
}

export {makeUserPage, mainUserPage, checkFollowing};
