/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
     // your app initialisation goes here
    
    // CREATING ELEMENT FOR THE HEADER
    const header = document.createElement('header');
    header.className = 'banner';
    header.id = 'nav';
    
    // logo
    const headerH1 = document.createElement('h1');
    headerH1.id = 'logo';
    headerH1.className = 'flex-center';
    headerH1.textContent = 'Seddit';
    
    const headerUl = document.createElement('ul');
    headerUl.className = 'nav'
    
    const headerLiSearch = document.createElement('li');
    headerLiSearch.className = 'nav-item';
    
    // search input field
    const headerSearch = document.createElement('input');
    headerSearch.id = 'search';
    const searchAttribute = document.createAttribute('data-id-search');
    headerSearch.setAttributeNode(searchAttribute);    
    headerSearch.placeholder = 'Search Seddit';
    headerSearch.type = 'search';
    headerSearch.textContent = 'Seddit';
    
    // login button
    const headerLiLogin = headerLiSearch.cloneNode(true);
    const headerButtonL = document.createElement('button');
    headerButtonL.className = 'button button-primary';
    headerButtonL.textContent = 'Log In';
    const loginAttribute = document.createAttribute('data-id-login');
    headerButtonL.setAttributeNode(loginAttribute);    
    
    // sign up button
    const headerLiSignUp = headerLiSearch.cloneNode(true);
    const headerButtonS = document.createElement('button');
    headerButtonS.className = 'button button-secondary';
    headerButtonS.textContent = 'Sign Up';
    const signUpAttribute = document.createAttribute('data-id-signup');
    headerButtonS.setAttributeNode(signUpAttribute);    
    
    // APPENDING ELEMENTS TO HEADER
    header.appendChild(headerH1);
    
    headerLiSearch.appendChild(headerSearch);
    headerLiLogin.appendChild(headerButtonL);
    headerLiSignUp.appendChild(headerButtonS);
 
    headerUl.appendChild(headerLiSearch);
    headerUl.appendChild(headerLiLogin);
    headerUl.appendChild(headerLiSignUp);
 
    header.appendChild(headerUl);
    
    // APPENDING HEADER TO DOCUMENT
    document.getElementById('root').appendChild(header);
    
    // SUBSET 0 //
    // LOGIN
    
    // creating elements of the login form
    const loginDiv = document.createElement('div');
    loginDiv.className = 'form-popup';
    loginDiv.id = 'login';
    const loginForm = document.createElement('form');
    loginForm.className = 'form-container';
    const loginTitle = document.createElement('h1');
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
     
    const loginPasswordField = document.createElement('input');
    loginPasswordField.placeholder = 'Enter Password';
    loginPasswordField.type = 'text';
    loginPasswordField.required = true;
    
    const loginSubmit = document.createElement('button');
    loginSubmit.type = 'submit';
    loginSubmit.className = 'login-btn';
    loginSubmit.textContent = 'Submit';
    
    const loginClose = document.createElement('button');
    loginClose.type = 'button';
    loginClose.textContent = 'Close';
    loginClose.className = 'login-btn';
    
    // appending elements of login form
    loginForm.appendChild(loginTitle);
    loginUser.appendChild(loginUserField);
    loginPassword.appendChild(loginPasswordField);
    loginForm.appendChild(loginUser);
    loginForm.appendChild(loginPassword);
    loginForm.appendChild(loginSubmit);
    loginForm.appendChild(loginClose);
    loginDiv.appendChild(loginForm);
    
    document.getElementById('root').appendChild(loginDiv);
    
    // buttons functionality for login
    headerButtonL.onclick = () => {
        document.getElementById('login').style.display = 'block';
    }
 
    loginSubmit.onclick = () => {
        alert("Login has failed! :(");
    }
    
    loginClose.onclick = () => {
        document.getElementById('login').style.display = 'none';
    }
    
    // REGISTRATION
    // duplicate login form and modify to make the signup form
    const signDiv = loginDiv.cloneNode(true);
    signDiv.id = 'sign-up';
    const children = signDiv.firstChild.childNodes;
    
    // Change login title to signUp
    const signTitle = children[0];
    signTitle.textContent = 'Sign Up';
    // Change the class names of the login buttons 
    const signUsername = children[1].childNodes[1];
    const signPassword = children[2].childNodes[1];
    signUsername.id = 'sign-username';
    signPassword.id = 'sign-password';
    const signSubmit = children[3];
    const signClose = children[4];
    signSubmit.className = 'sign-up-btn';
    signClose.className = 'sign-up-btn';
    document.getElementById('root').appendChild(signDiv);
 
    // buttons functionality for sign up
    headerButtonS.onclick = () => {
        document.getElementById('sign-up').style.display = 'block';
    }
   
    signSubmit.onclick = () => {
        // basic input validation 
        const illegalChars = /\W/;
        
        let username = document.getElementById('sign-username').value;
        let password = document.getElementById('sign-password').value;
        /*
        // parses the json file into a JS object
        // only works via node and will not work in the browser
        
        const users = require('../data/users.json');
        const data = JSON.parse(data)
        console.log(data);
        */
        
        let user = '';
        let url = "../data/users.json";
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.send();
        request.onload = function() {
          let userData = request.response;
          user = userData.find(function(user) { 
            return user.username == username 
          });
        }

        /*fetch('../data/users.json')
        	.then(res => res.json())
	        .then(json => {
	            console.log("yes");
	            //let sameUsername = json.filter(user => user.username === username);
	        })*/
	        
        if (illegalChars.test(username) || illegalChars.test(password)) {
		    let error = "The username/password contains illegal characters.\n";
		    alert(error);
        } else if (user.username !== '') {
            let error = "This username has been taken.\n";
		    alert(error);
        } else {
            alert("Sign up has failed! :(");
        }
    }
    
    signClose.onclick = () => {
        document.getElementById('sign-up').style.display = 'none';
    }
}

export default initApp;
