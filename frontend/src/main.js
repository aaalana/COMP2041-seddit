/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import {header} from './header.js';
import {makeLoginForm, 
        loginFunctionality, 
        logout, 
        checkUserLoggedIn} from './login.js';
import {makeSignUpForm, signUpFunctionality} from './signUp.js';
import {infiniteScroll,
        createFeedTemplate,
        makePublic,
        showPublic, 
        togglePost} from './feed.js';
import {makeUpvotesWindow,
        makeCommentsWindow, 
        loadVotesComments} from './showVotesComments.js';
import {thumbsButtonFunctionality} from './upvote.js';
import {postForm, makePost, postBtnOptions, editPostForm} from './post.js';
import {makeFollowingWindow,
        makeProfileWindow, 
        showProfile} from './showProfile.js';
import comment from './comment.js';
import {updateProfile} from './updateProfile.js';
import {makeUserPage, mainUserPage} from './userPage.js';
import {startSearch} from './search.js';

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
    makePublic();
    showPublic(apiUrl);
    
    // PAGE REMODELLING (WHEN USER LOGS IN/OUT)
    logout();
    checkUserLoggedIn(apiUrl);
 
    // allow users to search posts
    startSearch(apiUrl);
    
    // allow the description to be expanded/collapsed
    togglePost();
 
    // show upvotes and comments
    makeUpvotesWindow();
    makeCommentsWindow();
    loadVotesComments(apiUrl);
    
    // allow a logged in user to upvote or remove their upvote
    thumbsButtonFunctionality(apiUrl);
    
    // allowed a logged user to make, edit or delete a post
    postForm();
    editPostForm();
    makePost(apiUrl);
    postBtnOptions(apiUrl);
    
    // allow the user to see and edit their profile
    makeProfileWindow();
    makeFollowingWindow();
    showProfile(apiUrl);
    updateProfile(apiUrl);
    
    // infinite scroll of user feed
    // do not infinite scroll when the user is searching
    if (localStorage.getItem('login') === 'true') {
        infiniteScroll(apiUrl);
    }
    
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
