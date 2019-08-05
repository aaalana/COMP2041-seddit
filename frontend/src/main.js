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
   
    // MAKING THE BASIC WEBPAGE SKELETON 
    
    // MAKING THE HEADER //
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
    
    // MAKING THE FEED //
    // CREATING THE ELEMENTS OF POST - making a post template
    const main = document.createElement('main');
    main.role = 'main';
    
    const feedUl = document.createElement('ul');
    feedUl.id = 'feed';
    const feedAttribute = document.createAttribute('data-id-feed');
    feedUl.setAttributeNode(feedAttribute); 
    
    const feedHeader = document.createElement('div');
    feedHeader.className = 'feed-header';
   
    const popularPosts = document.createElement('h3');
    popularPosts.className = 'feed-title alt-text';
    popularPosts.textContent = 'Popular posts';
    
    const postBtn = document.createElement('button');
    postBtn.className = 'button button-secondary';
    postBtn.textContent = 'Post';
    
    const feedLi = document.createElement('li');
    feedLi.className = 'post';
    const postAttribute = document.createAttribute('data-id-post');
    feedLi.setAttributeNode(postAttribute); 
    
    const vote = document.createElement('div');
    vote.className = 'vote';
    const upvoteAttribute = document.createAttribute('data-id-upvotes');
    vote.setAttributeNode(upvoteAttribute); 
    
    const content = document.createElement('div');
    content.className = 'content';
    
    const feedTitle = document.createElement('h4');
    const titleAttribute = document.createAttribute('data-id-title');
    feedTitle.setAttributeNode(titleAttribute); 
    feedTitle.className = 'post-title alt-text';
    feedTitle.textContent = `Avenger’s Endgame Officially Passes Avatar To
                             Become The Highest Grossing Movie Of All Time`;
                     
    const feedPara = document.createElement('span');
    feedPara.className = 'post-author'; 
    const authorAttribute = document.createAttribute('data-id-author');
    feedPara.setAttributeNode(authorAttribute);              
    feedPara.textContent = 'Posted by @some_dude69';
    
    // other...
    // images not added
    const feedDate = document.createElement('span');
    feedDate.textContent = '4/08/2019';
    
    const feedDescript = document.createElement('p');
    feedDescript.textContent = 'description: text 7';
    
    const feedComments = document.createElement('span');
    feedComments.textContent = '0 comments';
    feedComments.className = 'feed-comments';
    
    const feedSubseddit = document.createElement('span');
    feedSubseddit.textContent = '/s/meme';
    feedSubseddit.className = 'feed-subseddit';
    
    // APPENDING ELEMENTS TO HEADER
    feedHeader.appendChild(popularPosts);
    feedHeader.appendChild(postBtn);
    feedUl.appendChild(feedHeader);
    feedLi.appendChild(vote);
    content.appendChild(feedTitle);
    content.appendChild(feedPara);
    
    content.appendChild(feedDate);
    content.appendChild(feedDescript);
    content.appendChild(feedComments);
    content.appendChild(feedSubseddit);
    
    feedLi.appendChild(content);
    feedUl.appendChild(feedLi);
    main.appendChild(feedUl);
   
    // APPENDING MAIN TO DOCUMENT
    document.getElementById('root').appendChild(main);
    
    // SUBSET 0 //
    // LOGIN
    
    // creating elements of the login form
    const loginDiv = document.createElement('div');
    loginDiv.className = 'form-popup';
    loginDiv.id = 'login';
    const loginForm = document.createElement('form');
    loginForm.className = 'form-container';
    loginForm.id = 'login-form';
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
    loginUserField.id = 'login-username';
   
    const loginPasswordField = document.createElement('input');
    loginPasswordField.placeholder = 'Enter Password';
    loginPasswordField.type = 'text';
    loginPasswordField.required = true;
    loginPasswordField.id = 'login-password';
    
    const inputError = document.createElement('p');
    inputError.className = 'input-error';
    
    const loginSubmit = document.createElement('button');
    loginSubmit.type = 'button';
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
    loginForm.appendChild(inputError);
    loginForm.appendChild(loginSubmit);
    loginForm.appendChild(loginClose);
    loginDiv.appendChild(loginForm);
    
    document.getElementById('root').appendChild(loginDiv);
    
   // Login The login form now communicates with the backend (POST /login) after input validation to verify whether the provided credentials are valid for an existing user. Once the user has logged in, they should see their own news feed (the home page).

//NB. This is slightly different to what they will see as a non-logged in user. A non-logged in user should still see posts from GET /post/public.

    // buttons functionality for login
    
    // open the login form and close the sign up form (if open) when
    // the login button is clicked
    headerButtonL.onclick = () => {
        document.getElementById('login').style.display = 'block';
        document.getElementById('sign-up').style.display = 'none';
    }
 
    let username = document.getElementById('login-username').value;
    let password = document.getElementById('login-password').value;
       
    //let userUrl = `${apiUrl}/auth/login`;
    //const request = new XMLHttpRequest();
    //request.open('POST', userUrl);
    //request.setRequestHeader('Content-Type', 'application/json');
    //request.responseType = 'json';
    //request.send(JSON.stringify(payload));
    //request.onload = function() {
    //    console(request.response);
    //}
    /*
     request.onreadystatechange = function() { 
            if (this.readyState == 4 && this.status == 200) {
                let userData = JSON.parse(this.responseText);
                console.log(userData);
              
            }
        }
        request.send(JSON.stringify(payload));
    */
    // log the user in
    
    loginSubmit.onclick = () => {
        inputError.textContent = '';
        
        let username = document.getElementById('login-username').value;
        let password = document.getElementById('login-password').value;
        //console.log(username);
        //console.log(password);
        let payload = {
            "username": `${username}`,
            "password": `${password}`
         }
        
         let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
	            //'Authorization': 'Token '+ userToken
            },
            body: JSON.stringify(payload)
        }
     
        fetch(`${apiUrl}/auth/login`, options)
            .then(response => response.json())
            .then(json => {
                //console.log(json);
                if (!username || !password) {
                    inputError.textContent = 'Missing Username/Password';
                } else if (json.message == 'Invalid Username/Password') {
                    inputError.textContent = json.message;
                } else {
                    //console.log(json);
                    let token = json.token;
                    document.getElementById('login-form').submit();
                }
               // console.log(json.token);  
               // console.log(t.status);
            });
      
        //alert("Login has failed! :(");
         //   let userExists = request.response.find(function(user) { 
         //       return user.username == username 
         //   });
        //}    
        //document.getElementById('login-form').submit();
    }
    
    // close the login form when the close button is clicked
    loginClose.onclick = () => {
        document.getElementById('login').style.display = 'none';
    }
    
    // REGISTRATION
    // duplicate login form and modify to make the signup form
    const signDiv = loginDiv.cloneNode(true);
    signDiv.id = 'sign-up';
    const children = signDiv.firstChild.childNodes;
    signDiv.firstChild.id = 'signup-form';
    
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
    
    // open the sign up form and close the login form (if open) when
    // the sign up button is clicked
    headerButtonS.onclick = () => {
        document.getElementById('sign-up').style.display = 'block';
        document.getElementById('login').style.display = 'none';
    }
     
    // submit user details into user data base when the submit button 
    // is clicked
    // note: sign up is failing for subset 0
    signSubmit.onclick = () => {
        let username = document.getElementById('sign-username').value;
        let password = document.getElementById('sign-password').value;
       
        // extract data from the user database for sign up validation
        let userUrl = "../data/users.json";
        const request = new XMLHttpRequest();
        request.open('GET', userUrl);
        request.responseType = 'json';
        request.send();
        request.onload = function() {
            let userData = request.response;
            let user = userData.find(function(user) { 
                return user.username == username 
            });
            signValidate(user, username, password);
        }
        
        // submit new user information
        document.getElementById('signup-form').submit();
    }
   
    // basic input validation 
            
    // 'require' attribute is already in sign up fields so that 
    // usernames and passwords must contain at least one character
    function signValidate(user, username, password) {
        // usernames must contain letters and numbers
        const legalChars = /\w/;
        if (!username.match(legalChars) || !password.match(legalChars)) {
	        let error = `Error: The username/password contains illegal
	                     characters.`;
	        alert(error);
        // check if the username signed up exists in the user database
        } else if (typeof user !== 'undefined') {
            let error = "Error: This username has been taken.";
	        alert(error);
        } else {
            alert("Error: Sign up has failed! :(");
        }
    }
    
    // close the sign up form when the close button is clicked
    signClose.onclick = () => {
        document.getElementById('sign-up').style.display = 'none';
    }
   
    // FEED INTERFACE
    // getting data from feed.json
    fetch(`${apiUrl}/post/public`,)
        .then(response => response.json())
        .then(json => {
    
    /*
    let url = "../data/feed.json";
        const request2 = new XMLHttpRequest();
        request2.open('GET', url);
        request2.responseType = 'json';
        request2.send();
        request2.onload = function() {*/
            // sorting posts from most recent to least
            let postData = json.posts;
            let sortedPosts = postData.sort(function(a, b){
                return b.meta.published-a.meta.published
            });
            
            // adding the post to the feed
            for(let post of sortedPosts) {
                // clone the template post element and modify details for 
                // each post
                let feedPost = feedLi.cloneNode(true);
                
                // use console.log to check which childNode should be 
                // picked to get a specific element of the post
                // console.log(feedPost);
                let title = feedPost.childNodes[1].childNodes[0];
                title.textContent = post.title;
                let author = feedPost.childNodes[1].childNodes[1];
                author.textContent = "Posted by " + post.meta.author;
                let upvotes = feedPost.firstChild;
                upvotes.textContent = post.meta.upvotes.length;
                let date = feedPost.childNodes[1].childNodes[2];
                date.textContent = timeConverter(post.meta.published);
                date.className = 'post-date';
                let description = feedPost.childNodes[1].childNodes[3];
                description.textContent = post.text;
                let comments = feedPost.childNodes[1].childNodes[4];
                comments.textContent = post.comments.length + ' comments';
                let subseddit = feedPost.childNodes[1].childNodes[5];
                subseddit.textContent = post.meta.subseddit;
                
                // add in the image only if it exists 
                if (post.image !== null) {
                    let image = new Image();
                    image.src = 'data:image/png;base64,' + post.thumbnail;
                    image.className = 'post-image';
                    
                    let container = document.createElement('div');
                    container.className = 'post-container';
                  
                    container.appendChild(image);
                    feedPost.appendChild(container);
                }
                
                feedUl.appendChild(feedPost);
                main.appendChild(feedUl);
                
                document.getElementById('root').appendChild(main);
                
            }
            // remove the fake template post
            feedLi.remove();
        })
   
    // converts UNIX timestamps to date timestamps
    function timeConverter(UNIX_timestamp){
        let date = new Date(UNIX_timestamp * 1000);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = date.getFullYear();
        let month = months[date.getMonth()];
        let day = date.getDate();
        let hour = '0' + date.getHours();
        let min = '0' + date.getMinutes();
        let time = ' at '+ hour.substr(-2) + ':' + min.substr(-2) + ', ' + day + ' ' + month + ' ' + year;
        return time;
    }
}

export default initApp;
