import {signUpForm} from './signUp.js';
import {getUser, thumbsButtonFunctionality} from './upvote.js';
import {makeFeed, fetchPublicFeed} from './feed.js';

function makeLoginForm() {
    // LOGIN
    // creating elements of the login form
    const loginDiv = document.createElement('div');
    loginDiv.className = 'form-popup';
    loginDiv.id = 'login';
    const loginForm = document.createElement('form');
    loginForm.className = 'form-container';
    loginForm.id = 'login-form';
    const loginTitle = document.createElement('h2');
    loginTitle.id = 'title-form';
    loginTitle.textContent = 'Login';
    const loginUser = document.createElement('label');
    loginUser.textContent = 'Username';
    const loginPassword = document.createElement('label');
    loginPassword.textContent = 'Password';
    
    const loginUserField = document.createElement('input');
    loginUserField.placeholder = 'Enter Username';
    loginUserField.type = 'text';
    loginUserField.required = true;
    loginUserField.id = 'login-username';
   
    const loginPasswordField = document.createElement('input');
    loginPasswordField.placeholder = 'Enter Password';
    loginPasswordField.type = 'password';
    loginPasswordField.required = true;
    loginPasswordField.id = 'login-password';
    
    const inputError = document.createElement('p');
    inputError.className = 'input-error';
    
    const loginSubmit = document.createElement('button');
    loginSubmit.type = 'button';
    loginSubmit.className = 'login-btn';
    loginSubmit.textContent = 'Submit';
    loginSubmit.id = 'login-submit';
    const loginClose = document.createElement('button');
    loginClose.type = 'button';
    loginClose.textContent = 'Close';
    loginClose.className = 'login-btn';
    loginClose.id = 'login-close';
    
    // appending elements of login form
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

function loginFunctionality(apiUrl) {
    // buttons functionality for login
    
    // open the login form and close the sign up form (if open) when
    // the login button is clicked
    var loginBtn = document.getElementById('login-button');
    loginBtn.onclick = () => {
        document.getElementById('login').style.display = 'block';
        document.getElementById('sign-up').style.display = 'none';
    }
  
    // log the user in
    let inputError = document.getElementsByClassName('input-error')[0];
    let loginSubmit = document.getElementById('login-submit');
     
    loginSubmit.onclick = () => {
        inputError.textContent = '';
        let username = document.getElementById('login-username').value;
        let password = document.getElementById('login-password').value;
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
     
        fetch(`${apiUrl}/auth/login`, options)
            .then(response => response.json())
            .then(json => {
                // perform basic login input validation
                if (!username || !password) {
                    inputError.textContent = 'Missing Username/Password';
                } else if (json.message == 'Invalid Username/Password') {
                    inputError.textContent = json.message;
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
    let loginClose = document.getElementById('login-close');
    let loginForm = document.getElementById('login-form');
    loginClose.onclick = () => {
        document.getElementById('login').style.display = 'none';
        inputError.textContent = '';
        loginForm.reset();
    }
}

// logs the logged in user out 
function logout() {  
    // LOGOUT - log the user out
    // clear local storage, feed, 'logged as <user>' and logout button
    // add the login and sign up button to the header
    let loginBtn = document.getElementById('login-button');
    let signBtn = document.getElementById('sign-up-btn');
    let logout = document.getElementById('logout');
    let loggedUser = document.getElementById('logged-user');
    let publicBtn =document.getElementById('public-btn');
             
    logout.onclick = () => {
        localStorage.clear(); 
        document.getElementsByTagName('main')[0].innerText = ''; 
        logout.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        signBtn.style.display = 'inline-block';
        publicBtn.style.visibility = 'hidden';
        loggedUser.textContent = '';
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
   
    // check if a token exists 
    let logout = document.getElementById('logout');
    let loggedUser = document.getElementById('logged-user');
    
    if (localStorage.getItem('token') === null) {
        console.log('null ran');
        fetchPublicFeed(apiUrl, 'feed');
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
                // log the user out if the the token is invalid 
                if (json.message && 
                    json.message == 'Invalid Authorization Token') {
                    console.log(userToken);
                    console.log(json.message);
                    logout.click();
                // loads the website for a logged in user
                } else {
                    //record that the user is logged in
                    localStorage.setItem('login', true);
                    // show the username that has been logged in
                    loggedUser.textContent = `Logged in as ${username}`;
                    // show the logout button
                    logout.style.display = 'inline-block';
                    // hide the login and sign up button
                    // show the 'see public feed' button
                    let loginBtn = document.getElementById('login-button');
                    let signBtn = document.getElementById('sign-up-btn');
                    let publicBtn =document.getElementById('public-btn');
                    loginBtn.style.display = 'none';
                    signBtn.style.display = 'none';
                    publicBtn.style.visibility = 'visible';
                    // show the post button
                    document.getElementById('post-btn').style.visibility = 'visible';
                    // show the thumbs up on each post
                    let thumbs = document.querySelectorAll('#thumbs-up');
                    for (let thumb of thumbs)
                        thumb.style.visibility = 'visible';
                    // generate the user's personal feed
                    makeFeed(json, apiUrl, 'feed');
                }
            });
    }  
}
    
export {logout, checkUserLoggedIn, makeLoginForm, loginFunctionality};
