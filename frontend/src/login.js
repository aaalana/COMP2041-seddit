import {signUpForm} from './signUp.js';

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
                    document.getElementById('login-form').submit();
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

export {makeLoginForm, loginFunctionality};
