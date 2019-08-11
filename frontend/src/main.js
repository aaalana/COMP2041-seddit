/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import {header} from './header.js';
import {makeLoginForm, loginFunctionality} from './login.js';
import {makeSignUpForm, signUpFunctionality} from './signUp.js';
import {infiniteScroll,
        createFeedTemplate, 
        fetchPublicFeed, 
        timeConverter, 
        makeFeed,
        togglePost} from './feed.js';
import {makeUpvotesWindow,
        makeCommentsWindow, 
        loadVotesComments} from './showVotesComments.js';
import {getUser, thumbsButtonFunctionality} from './upvote.js';
import {postForm, makePost} from './createPost.js';
import {makeFollowingWindow,
        makeProfileWindow, 
        showProfile} from './showProfile.js';
import comment from './comment.js';
import {updateProfile} from './updateProfile.js';
import {makeUserPage, mainUserPage} from './userPage.js';

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {   
    // making the website
    // make header
    header();
    
    // add in login functionality
    makeLoginForm();
    loginFunctionality(apiUrl);
    
    // add in sign up functionality
    makeSignUpForm();
    signUpFunctionality(apiUrl);
    
    // make the feed 
    createFeedTemplate();
    
    // PAGE REMODELLING (WHEN USER LOGS IN/OUT)
    
    // Logged in users can: see profile, has a personal feed, can upvote,
    // comment, log out, see upvotes/comments, see the number of 
    // comments/upvotes
    
    // Users that are not logged in can: log in or sign up, see a public
    // feed, see the number of comments/upvotes
    
    // clear local storage, feed, 'logged as <user>' and logout button
    // add the login and sign up button to the header
   
    // LOGOUT - log the user out
    let loginBtn = document.getElementById('login-button');
    let signBtn = document.getElementById('sign-up-btn');
    let logout = document.getElementById('logout');
    let loggedUser = document.getElementById('logged-user');
    logout.onclick = () => {
        localStorage.clear(); 
        document.getElementsByTagName('Ul')[0].innerText = ''; 
        location.reload();
        logout.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        signBtn.style.display = 'inline-block';
        loggedUser.textContent = '';
    }    
    
    // renders the page according to whether or not a user is logged in 
    function checkUserLoggedIn() {
        // check if a token exists 
        if (localStorage.getItem('token') === null) {
            fetchPublicFeed(apiUrl);
            localStorage.setItem('login', false);
        } else {
            let userToken = localStorage.getItem('token');
            let optionsUserFeed = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
	                'Authorization': 'Token '+ userToken
                }
            }
            let username = localStorage.getItem('user');
            getUser(apiUrl, username);
            
            fetch(`${apiUrl}/user/feed`, optionsUserFeed)
                .then(response => response.json())
                .then(json => {
                    // remove any invalid tokens 
                    if (json.message && 
                        json.message == "Invalid Authorization Token") {
                        localStorage.clear(); 
                        localStorage.setItem('login', false);
                        fetchPublicFeed(apiUrl);
                        location.reload();
                    // loads the website for a logged in user
                    } else {
                        //record that the user is logged in
                        localStorage.setItem('login', true);
                        // show the username that has been logged in
                        loggedUser.textContent = `Logged in as ${username}`;
                        // show the logout button
                        logout.style.display = 'inline-block';
                        // hide the login and sign up button
                        let loginBtn = document.getElementById('login-button');
                        let signBtn = document.getElementById('sign-up-btn');
                        loginBtn.style.display = 'none';
                        signBtn.style.display = 'none';
                        // show the post button
                        document.getElementById('post-btn').style.visibility = 'visible';
                        // show the thumbs up on each post
                        let thumbs = document.querySelectorAll('#thumbs-up');
                        for (let thumb of thumbs)
                            thumb.style.visibility = 'visible';
                        // generate the user's personal feed
                        makeFeed(json, apiUrl);
                    }
                });
        }  
    }
    checkUserLoggedIn();
    
    // allow the description to be expanded/collapsed
    togglePost();
    
    // show upvotes and comments
    makeUpvotesWindow();
    makeCommentsWindow();
    loadVotesComments(apiUrl);
    
    // allow a logged in user to upvote or remove their upvote
    thumbsButtonFunctionality(apiUrl);
    
    // allowed a logged user to make a post
    postForm();
    makePost(apiUrl);
    
    // allow the user to see and edit their profile
    makeProfileWindow();
    makeFollowingWindow();
    showProfile(apiUrl);
    updateProfile(apiUrl);
    
    // infinite scroll of feed
    if (localStorage.getItem('login') === 'true') 
        infiniteScroll(apiUrl);
    
    // scroll to the top of the page when the page refreshes
    window.onbeforeunload = function() {
        window.scrollTo(0, 0);
    }
    
    // allow users to comment
    comment(apiUrl);
    
    // allows the user to open user pages
    makeUserPage();
    mainUserPage(apiUrl);
}

export default initApp;
