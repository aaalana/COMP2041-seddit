/* THIS FILE MAKES THE HEADER ELEMENTS */

// renders the header for the website
function header() {
   
    // step 1: creating elements for the header
    const header = document.createElement('header');
    header.className = 'banner';
    header.id = 'nav';
    
    // logo
    const headerH1 = document.createElement('h1');
    headerH1.id = 'logo';
    headerH1.className = 'flex-center';
    headerH1.textContent = 'Seddit';
    
    // header
    const headerUl = document.createElement('ul');
    headerUl.className = 'nav'
    
    const headerLiSearch = document.createElement('li');
    headerLiSearch.className = 'nav-item';
    
    // search input field
    const headerSearch = document.createElement('input');
    headerSearch.id = 'search';
    const searchAttribute = document.createAttribute('data-id-search');
    headerSearch.setAttributeNode(searchAttribute);    
    headerSearch.placeholder = 'Search posts by title';
    headerSearch.type = 'search';
    headerSearch.textContent = 'Seddit';
    headerSearch.style.visibility = 'hidden';
    
    // enter search
    const searchBtn = document.createElement('button');
    searchBtn.className = 'button button-secondary';
    searchBtn.textContent = 'search';
    searchBtn.id = 'search-btn';
    searchBtn.style.visibility = 'hidden';
   
    // login button
    const headerLiLogin = headerLiSearch.cloneNode(true);
    const headerButtonL = document.createElement('button');
    headerButtonL.className = 'button button-primary';
    headerButtonL.id = 'login-button';
    headerButtonL.textContent = 'Log In';
    const loginAttribute = document.createAttribute('data-id-login');
    headerButtonL.setAttributeNode(loginAttribute);    
    
    // sign up button
    const headerLiSignUp = headerLiSearch.cloneNode(true);
    const headerButtonS = document.createElement('button');
    headerButtonS.className = 'button button-secondary';
    headerButtonS.textContent = 'Sign Up';
    headerButtonS.id = 'sign-up-btn';
    const signUpAttribute = document.createAttribute('data-id-signup');
    headerButtonS.setAttributeNode(signUpAttribute);    
    
    // logged in as <user>
    const headerLiUser = headerLiSearch.cloneNode(true);
    const loggedUser = document.createElement('span');
    loggedUser.id = 'logged-user';
   
    // log out button
    const headerLiLogout = headerLiSearch.cloneNode(true);
    const headerLogout = headerButtonL.cloneNode(true);
    headerLogout.id = 'logout';
    headerLogout.textContent = 'Log Out';
    headerLogout.removeAttribute('data-id-login');
        
    // step 2: appending elements to the header and document
    header.appendChild(headerH1);
    
    headerLiSearch.appendChild(headerSearch);
    headerLiSearch.appendChild(searchBtn);
    headerLiLogin.appendChild(headerButtonL);
    headerLiSignUp.appendChild(headerButtonS);
    headerLiUser.appendChild(loggedUser);
    headerLiLogout.appendChild(headerLogout);
 
    headerUl.appendChild(headerLiSearch);
    headerUl.appendChild(headerLiLogin);
    headerUl.appendChild(headerLiSignUp);
    headerUl.appendChild(loggedUser);
    headerUl.appendChild(headerLogout);
    
    header.appendChild(headerUl);
    
    document.getElementById('root').appendChild(header);
   
}

export {header};
