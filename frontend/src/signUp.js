import {makeLoginForm} from './login.js';

function makeSignUpForm() {   
    // REGISTRATION
    // duplicate login form and modify to make the signup form
    const signDiv = document.getElementById('login').cloneNode(true);
    signDiv.id = 'sign-up';
    let children = signDiv.firstChild.childNodes;
    signDiv.firstChild.id = 'signup-form';
    
    // Change login title to signUp
    const signTitle = children[0];
    signTitle.textContent = 'Sign Up';
    
    // Change the class names from starting with login to sign up
    const signUsername = children[1].childNodes[1];
    const signPassword = children[2].childNodes[1];
    signUsername.id = 'sign-username';
    signPassword.id = 'sign-password';
    signPassword.type = 'text';
    
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email';
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name';
    
    const signEmail = document.createElement('input');
    signEmail.placeholder = 'Enter Email';
    signEmail.type = 'text';
    signEmail.required = true;
    signEmail.id = 'sign-email';
    emailLabel.appendChild(signEmail);
    signDiv.firstChild
           .childNodes[2]
           .insertAdjacentElement('afterend', emailLabel);
   
    const signName = document.createElement('input');
    signName.placeholder = 'Enter Name';
    signName.type = 'text';
    signName.required = true;
    signName.id = 'sign-name';
    nameLabel.appendChild(signName);
    signDiv.firstChild
           .childNodes[3]
           .insertAdjacentElement('afterend', nameLabel);
    
    children = signDiv.firstChild.childNodes;
    const inputError = children[5];
    inputError.id = 'sign-input-error';
    const signSubmit = children[6];
    const signClose = children[7];
    signSubmit.className = 'sign-up-btn';
    signSubmit.id = 'sign-up-submit';
    signClose.className = 'sign-up-btn';
    signClose.id = 'sign-close';
    document.getElementById('root').appendChild(signDiv);
}

function signUpFunctionality(apiUrl) {
    // buttons functionality for sign up
    
    // open the sign up form and close the login form (if open) when
    // the sign up button is clicked
    let signBtn = document.getElementById('sign-up-btn');
    signBtn.onclick = () => {
        document.getElementById('sign-up').style.display = 'block';
        document.getElementById('login').style.display = 'none';
    }
     
    // submit user details into user data base when the submit button 
    // is clicked
    // note: sign up is failing for subset 0
    let signSubmit = document.getElementsByClassName('sign-up-btn')[0];
    let inputError = document.getElementById('sign-input-error');
    signSubmit.onclick = () => {
        inputError.textContent = '';
        
        let username = document.getElementById('sign-username').value;
        let password = document.getElementById('sign-password').value;
        let email = document.getElementById('sign-email').value;
        let name = document.getElementById('sign-name').value;
        
        // extract data from the user database for sign up validation
        let payload = {
            "username": `${username}`,
            "password": `${password}`,
            "email": `${email}`,
            "name": `${name}`
        }
        
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
        if (signValidate(username, password, email, name, inputError) == true) {
            fetch(`${apiUrl}/auth/signup`, options)
                .then(response => response.json())
                .then(json => {
                    if (json.message) {
                        inputError.textContent= `Error: ${json.message}`;
                    // create new user
                    } else {
                        localStorage.setItem('token', `${json.token}`);
                        localStorage.setItem('user', `${username}`);
                        localStorage.setItem('login', true);
                        localStorage.setItem('password', `${password}`);
                        location.reload();
                    }
                }); 
        }
    }
    
    // close the sign up form when the close button is clicked
    let signClose = document.getElementsByClassName('sign-up-btn')[1];
    let signForm = document.getElementById('signup-form');
    signClose.onclick = () => {
        document.getElementById('sign-up').style.display = 'none';
        inputError.textContent = '';
        signForm.reset();
    }
}

// performs basic input validation on user's details
// 'require' attribute is already in sign up fields so that 
// usernames and passwords must contain at least one character
function signValidate(username, password, email, name, inputError) {
    // check if inputs are valid
    const legalChars = /\w/;
    const legalName = /(^[A-Z]{1}[a-z]+$|^[A-Z]{1}[a-z]+-[A-Z]{1}[a-z]+$)/;
    const legalEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
   
    // input fields must contain at least one character
    if (!username || !password || !email || !name) {
        inputError.textContent = 'Missing Username/Password/Email/Name';
        return false;
    // username must contain letters, numbers or _ only
    } else if (!username.match(legalChars)) {
        inputError.textContent = 'Error: Invalid username';
        return false;
    // password must contain letters, numbers or _ only
    } else if (!password.match(legalChars)) {
        inputError.textContent = 'Error: Invalid password';
        return false;
    // emails must be in a valid form e.g. email@something.com
    } else if (!email.match(legalEmail)) {
        inputError.textContent = 'Error: Invalid email';
        return false;
    // names must have at least two letters and start with a capital
    // letter
    // one '-' is allowed in between letters
    // e.g. Mary-Jane is a valid name
    } else if (!name.match(legalName)) {
        inputError.textContent = 'Error: Invalid name';
        return false;
    }
    return true;
}
var signUpForm = document.getElementById('sign-up');

export {signValidate, makeSignUpForm, signUpFunctionality, signUpForm};
