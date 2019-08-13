/* This file is responsible for login (and log out) functionality */

import {signUpForm} from './signUp.js';
import {getUser, thumbsButtonFunctionality} from './upvote.js';
import {makeFeed, fetchPublicFeed} from './feed.js';

// make the login form
function makeLoginForm() {
    // step 1: creating elements of the login form //
    
    // login container/popup
    const loginDiv = document.createElement('div');
    loginDiv.className = 'form-popup';
    loginDiv.id = 'login';
    
    // login form
    const loginForm = document.createElement('form');
    loginForm.className = 'form-container';
    loginForm.id = 'login-form';
    
    // login title
    const loginTitle = document.createElement('h2');
    loginTitle.id = 'title-form';
    loginTitle.textContent = 'Login';
    
    // defining input fields and their respective labels
    
    // username
    const loginUser = document.createElement('label');
    loginUser.textContent = 'Username';
    const loginPassword = document.createElement('label');
    loginPassword.textContent = 'Password';
    
    const loginUserField = document.createElement('input');
    loginUserField.placeholder = 'Enter Username';
    loginUserField.type = 'text';
    loginUserField.required = true;
    loginUserField.id = 'login-username';
    
    // password
    const loginPasswordField = document.createElement('input');
    loginPasswordField.placeholder = 'Enter Password';
    loginPasswordField.type = 'password';
    loginPasswordField.required = true;
    loginPasswordField.id = 'login-password';
    
    // error message (for input validation during login) 
    const inputError = document.createElement('p');
    inputError.className = 'input-error';
    
    // submit button
    const loginSubmit = document.createElement('button');
    loginSubmit.type = 'button';
    loginSubmit.className = 'login-btn';
    loginSubmit.textContent = 'Submit';
    loginSubmit.id = 'login-submit';
    
    // close button of the login form
    const loginClose = document.createElement('button');
    loginClose.type = 'button';
    loginClose.textContent = 'Close';
    loginClose.className = 'login-btn';
    loginClose.id = 'login-close';
    
    // appending elements to the login form and then to the document
    loginForm.appendChild(loginTitle);
    loginUser.appendChild(loginUserField);
    loginPassword.appendChild(loginPasswordField);
    loginForm.appendChild(loginUser);
    loginForm.appendChild(loginPassword);
    loginForm.appendChild(inputError);
    loginForm.appendChild(loginSubmit);
    loginForm.appendChild(loginClose);
    loginDiv.appendChild(loginForm);
    
    document.getElementById('root').appendChild(loginDiv);
}

// controls all the buttons responsible for login. This includes:
// -opening/close the login form
// -logging the user in
function loginFunctionality(apiUrl) {
   
    // define variables for easier referencing of elements
    let loginBtn = document.getElementById('login-button');
    let inputError = document.getElementsByClassName('input-error')[0];
    let loginSubmit = document.getElementById('login-submit');
    let loginClose = document.getElementById('login-close');
    let loginForm = document.getElementById('login-form');
    
    // opens the login form and closes the sign up form (if open) when
    // the login button is clicked
    loginBtn.onclick = () => {
        document.getElementById('login').style.display = 'block';
        document.getElementById('sign-up').style.display = 'none';
    }
  
    // logs the user in 
    loginSubmit.onclick = () => {
        // reset any error messages from any incorrect attempts of logging in 
        inputError.textContent = '';
        
        // extract the user's details 
        let username = document.getElementById('login-username').value;
        let password = document.getElementById('login-password').value;
        
        // prepare variables for login via the api
        let payload = {
            "username": `${username}`,
            "password": `${password}`
         }
        
         let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
        
        // login via the api
        // perform basic login input validation and throw error messages
        // upon failing to login
        fetch(`${apiUrl}/auth/login`, options)
            .then(response => response.json())
            .then(json => {
                // when the username/password does not have at least 1
                // character, give an error message
                if (!username || !password) {
                    inputError.textContent = 'Missing Username/Password';
                // when the username/password does not match the user
                // database, give an error message
                } else if (json.message == 'Invalid Username/Password') {
                    inputError.textContent = json.message;
                // store the user's details into local storage for 
                // later use and refresh the page
                } else {
                    localStorage.setItem('token', `${json.token}`);
                    localStorage.setItem('user', `${username}`);
                    localStorage.setItem('login', true);
                    localStorage.setItem('password', `${password}`);
                    location.reload();
                }
            });
    }
    
    // close the login form when the close button is clicked
    loginClose.onclick = () => {
        // hide the login form 
        document.getElementById('login').style.display = 'none';
        
        // reset all elements of the login form
        inputError.textContent = '';
        loginForm.reset();
    }
}

// logs a logged in user out 
function logout() {  
    
    // defining elements for easier referencing
    let loginBtn = document.getElementById('login-button');
    let signBtn = document.getElementById('sign-up-btn');
    let logout = document.getElementById('logout');
    let loggedUser = document.getElementById('logged-user');
    let publicBtn = document.getElementById('public-btn');
    let searchInput = document.getElementById('search');
    let searchBtn = document.getElementById('search-btn');
    
    // clear out features that a user not logged in cannot access
    logout.onclick = () => {
       
        // clear local storage, search, feed, 'logged as <user>' message
        // and logout button
        // add the login and sign up button to the header
        localStorage.clear(); 
        document.getElementsByTagName('main')[0].innerText = ''; 
        logout.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        signBtn.style.display = 'inline-block';
        publicBtn.style.visibility = 'hidden';
        searchInput.style.visibility = 'hidden';
        searchBtn.style.visibility = 'hidden';
        loggedUser.textContent = '';
        
        // refresh the page
        location.reload();
    }    
}
       
// renders the page according to whether or not a user is logged in

// Logged in users can: see profile, has a personal feed, can upvote,
// comment, log out, see upvotes/comments, see the number of 
// comments/upvotes

// Users that are not logged in can: log in or sign up, see a public
// feed, see the number of comments/upvotes 
function checkUserLoggedIn(apiUrl) {
   
    // if a token does not exist, load the page for a logged out user
    if (localStorage.getItem('token') === null) {
        fetchPublicFeed(apiUrl, 'feed');
        let publicBtn = document.getElementById('public-btn');
        publicBtn.style.visibility = 'hidden';
        localStorage.setItem('login', false);
    // otherwise load the page for a logged in user
    } else {
        let userToken = localStorage.getItem('token');
        let optionsUserFeed = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token '+ userToken
            }
        }
        
        // store the logged in user's data into local storage
        let username = localStorage.getItem('user');
        getUser(apiUrl, username);
        
        // use fetch to load the user's feed
        fetch(`${apiUrl}/user/feed`, optionsUserFeed)
            .then(response => response.json())
            .then(json => {
                // log the user out if the the token is invalid 
                if (json.message && 
                    json.message == 'Invalid Authorization Token') {
                    let logout = document.getElementById('logout');
                    logout.click();
                // load the page for a logged in user
                } else {
                    //record that the user is logged in
                    localStorage.setItem('login', true);
                    
                    // render for page for a logged in user
                    renderLoggedInPage();
                   
                    // generate the user's personal feed
                    makeFeed(json, apiUrl, 'feed');
                }
            });
    }  
}

// renders the page for a logged in user (excluding feed);
function renderLoggedInPage() {
   
    // define variables for easier referencing
    let logout = document.getElementById('logout');
    let loggedUser = document.getElementById('logged-user');
    let searchInput = document.getElementById('search');
    let searchBtn = document.getElementById('search-btn');
    let loginBtn = document.getElementById('login-button');
    let signBtn = document.getElementById('sign-up-btn');
    let publicBtn = document.getElementById('public-btn');
    let username = localStorage.getItem('user');
    
    // show the username that has been logged in
    loggedUser.textContent = `Logged in as ${username}`;

    // show the logout button
    logout.style.display = 'inline-block';

    // hide the login and sign up button
    loginBtn.style.display = 'none';
    signBtn.style.display = 'none';
    
    // show the 'see public feed' button and search
    publicBtn.style.visibility = 'visible';
    searchInput.style.visibility = 'visible';
    searchBtn.style.visibility = 'visible';

    // show the post button
    document.getElementById('post-btn').style.visibility = 'visible';

    // show the thumbs up on each post
    let thumbs = document.querySelectorAll('#thumbs-up');
    for (let thumb of thumbs)
        thumb.style.visibility = 'visible';
}
    
export {logout, checkUserLoggedIn, makeLoginForm, loginFunctionality};
