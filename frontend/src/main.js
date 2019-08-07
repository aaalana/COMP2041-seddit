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
        
    // APPENDING ELEMENTS TO HEADER
    header.appendChild(headerH1);
    
    headerLiSearch.appendChild(headerSearch);
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
    postBtn.id = 'post-btn';
    
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
    feedDate.className = 'post-date'
    
    const feedThumbsUp = document.createElement('span');
    feedThumbsUp.className = 'material-icons';
    feedThumbsUp.id = 'thumbs-up';
    feedThumbsUp.textContent = 'thumb_up';
        
    const feedDescript = document.createElement('p');
    feedDescript.textContent = 'description: text 7';
    feedDescript.className = 'post-description'
    
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
    content.appendChild(feedThumbsUp);
    content.appendChild(feedDescript);
    content.appendChild(feedComments);
    content.appendChild(feedSubseddit);
    
    feedLi.appendChild(content);
    feedUl.appendChild(feedLi);
    main.appendChild(feedUl);
   
    // APPENDING MAIN TO DOCUMENT
    document.getElementById('root').appendChild(main);
    
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
   
    // buttons functionality for login
    
    // open the login form and close the sign up form (if open) when
    // the login button is clicked
    headerButtonL.onclick = () => {
        document.getElementById('login').style.display = 'block';
        document.getElementById('sign-up').style.display = 'none';
    }
  
    // log the user in
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
                if (!username || !password) {
                    inputError.textContent = 'Missing Username/Password';
                } else if (json.message == 'Invalid Username/Password') {
                    inputError.textContent = json.message;
                } else {
                    localStorage.setItem('token', `${json.token}`);
                    localStorage.setItem('user', `${username}`);
                    localStorage.setItem('login', true);
                    document.getElementById('login-form').submit();
                }
            });
    }
    
    // close the login form when the close button is clicked
    loginClose.onclick = () => {
        document.getElementById('login').style.display = 'none';
    }
    
    // REGISTRATION
    // duplicate login form and modify to make the signup form
    const signDiv = loginDiv.cloneNode(true);
    signDiv.id = 'sign-up';
    let children = signDiv.firstChild.childNodes;
    signDiv.firstChild.id = 'signup-form';
    
    // Change login title to signUp
    const signTitle = children[0];
    signTitle.textContent = 'Sign Up';
    // Change the class names of the login buttons 
    const signUsername = children[1].childNodes[1];
    const signPassword = children[2].childNodes[1];
    signUsername.id = 'sign-username';
    signPassword.id = 'sign-password';
    
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
    signDiv.firstChild.childNodes[2].insertAdjacentElement('afterend',emailLabel);
   
    const signName = document.createElement('input');
    signName.placeholder = 'Enter Name';
    signName.type = 'text';
    signName.required = true;
    signName.id = 'sign-name';
    nameLabel.appendChild(signName);
    signDiv.firstChild.childNodes[3].insertAdjacentElement('afterend', nameLabel);
    
    children = signDiv.firstChild.childNodes;
    const inputError2 = children[5];
    const signSubmit = children[6];
    const signClose = children[7];
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
        if (signValidate(username, password, email, name) == true) {
            fetch(`${apiUrl}/auth/signup`, options)
                .then(response => response.json())
                .then(json => {
                    if (json.message) {
                        inputError2.textContent= `Error: ${json.message}`;
                    // create new user
                    } else {
                        localStorage.setItem('token', `${json.token}`);
                        localStorage.setItem('user', `${username}`);
                        localStorage.setItem('login', true);
                        document.getElementById('signup-form').submit();
                    }
                }); 
        }
    }
    
    // basic input validation 
            
    // 'require' attribute is already in sign up fields so that 
    // usernames and passwords must contain at least one character
    
    function signValidate(username, password, email, name) {
        // check if inputs are valid
        const legalChars = /\w/;
        const legalName = /^[a-zA-Z]+-?[a-zA-Z]+$/;
        const legalEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       
        // input fields must contain at least one character
        if (!username || !password || !email || !name) {
            inputError2.textContent = 'Missing Username/Password';
            return false;
        } else if (!username.match(legalChars) || 
                   !password.match(legalChars) ||
                   !name.match(legalName) ||
                   !email.match(legalEmail)) {
	        inputError2.textContent = 'Error: Invalid input';
	        return false;
        } 
        return true;
    }
      
    // close the sign up form when the close button is clicked
    signClose.onclick = () => {
        document.getElementById('sign-up').style.display = 'none';
    }
    
    // LOGOUT - log the user out
    logout.onclick = () => {
        localStorage.clear(); 
        location.reload();
        logout.style.display = 'none';
        headerButtonL.style.display = 'inline-block';
        headerButtonS.style.display = 'inline-block';
        loggedUser.textContent = '';
    }                
    
    // FEED INTERFACE AND PAGE REMODELLING (WHEN USER LOGS IN/OUT)
    
    // renders the page according to whether or not a user is logged in 
    function checkUserLoggedIn() {
        // check if a token exists 
        if (localStorage.getItem('token') === null) {
            fetchPublicFeed();
            localStorage.setItem('login', false);
        } else {
            var userToken = localStorage.getItem('token');
            let optionsUserFeed = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
	                'Authorization': 'Token '+ userToken
                }
            }
            fetch(`${apiUrl}/user/feed`, optionsUserFeed)
                .then(response => response.json())
                .then(json => {
                    if (json.message && 
                        json.message == "Invalid Authorization Token") {
                        localStorage.clear(); 
                        localStorage.setItem('login', false);
                    } else {
                        let username = localStorage.getItem('user');
                        loggedUser.textContent = `Logged in as ${username}`;
                        logout.style.display = 'inline-block';
                        headerButtonL.style.display = 'none';
                        headerButtonS.style.display = 'none';
                      
                        document.getElementById('post-btn').style.visibility = 'visible';
                        let thumbs = document.querySelectorAll('#thumbs-up');
                        for (let thumb of thumbs)
                            thumb.style.visibility = 'visible';
                        makeFeed(json);
                        localStorage.setItem('login', true);
                    }
                });
        }  
    }
    checkUserLoggedIn();
    
    function fetchPublicFeed() {
        fetch(`${apiUrl}/post/public`)
            .then(response => response.json())
            .then(json => makeFeed(json))
    }
    
    // generates the user's feed
    function makeFeed(json) {
        // make sure the user id is stored in local storage
        getUserId();
        let userId = localStorage.getItem('userId');
        
        
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
            feedPost.id = post.id;
           
            let title = feedPost.childNodes[1].childNodes[0];
            title.textContent = post.title;
            let author = feedPost.childNodes[1].childNodes[1];
            author.textContent = "Posted by " + post.meta.author;
            let upvotes = feedPost.firstChild;
            upvotes.textContent = post.meta.upvotes.length;
            let date = feedPost.childNodes[1].childNodes[2];
            date.textContent = timeConverter(post.meta.published);
            date.className = 'post-date';
            let thumb = feedPost.childNodes[1].childNodes[3];
            // change the thumbs to blue if the user has already upvoted
            // on the post
            if (localStorage.getItem('login') == 'true')
                checkUserInUpvotes(post.id, userId, thumb);
           
            let description = feedPost.childNodes[1].childNodes[4];
            description.textContent = post.text;
            let comments = feedPost.childNodes[1].childNodes[5];
            comments.textContent = post.comments.length + ' comments';
            let subseddit = feedPost.childNodes[1].childNodes[6];
            if (post.meta.subseddit)
                subseddit.textContent = 's/' + post.meta.subseddit;
            else
                subseddit.textContent = '';
                
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
    }
   
    // converts UNIX timestamps to date timestamps
    function timeConverter(UNIX_timestamp){
        let date = new Date(UNIX_timestamp * 1000);
        let months = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul', 'Aug', 'Sep','Oct','Nov','Dec'];
        let year = date.getFullYear();
        let month = months[date.getMonth()];
        let day = date.getDate();
        let hour = '0' + date.getHours();
        let min = '0' + date.getMinutes();
        let time = ' at '+ hour.substr(-2) + ':' + min.substr(-2) + ', ' + day + ' ' + month + ' ' + year;
        return time;
    }
    
    // SEE UPVOTES AND COMMENTS
    
    // make modal window for upvotes 
    const modalUpvotes = document.createElement('div');
    modalUpvotes.className = 'black-bg';
    modalUpvotes.id = 'upvotes-screen';
    
    const modalWindow = document.createElement('div');
    modalWindow.className = 'upvote-content';
    
    const closeUpvote = document.createElement('span');
    closeUpvote.className = 'material-icons';
    closeUpvote.id = 'close-button';
    closeUpvote.textContent = 'close';
    
    const voteTitle = document.createElement('h1');
    voteTitle.textContent = 'Users who upvoted'
    voteTitle.className = 'title';
    
    const message = document.createElement('p');
    message.textContent = '';
    message.id = 'empty-message';
      
    const groupedUsers = document.createElement('ul');
    groupedUsers.className = 'grouped-users';
    
    const upvoteUsers = document.createElement('li');
    upvoteUsers.className = 'upvote-users';
    
    modalWindow.appendChild(closeUpvote);
    modalWindow.appendChild(voteTitle);
    modalWindow.appendChild(message);
    groupedUsers.appendChild(upvoteUsers);
    modalWindow.appendChild(groupedUsers);
    modalUpvotes.appendChild(modalWindow);
    document.getElementById('root').appendChild(modalUpvotes);
    
    // make modal window for comments
    const modalComments = modalUpvotes.cloneNode(true);
    modalComments.id = 'comments-screen';
    document.getElementById('root').appendChild( modalComments);
    modalComments.getElementsByTagName('h1')[0].textContent = 'Comments';
    modalComments.getElementsByTagName('li')[0].className = 'comment-users';
    modalComments.getElementsByTagName('ul')[0].className = 'grouped-comments';
  
    // functions for when the user is logged in
    
    // when the upvotes/comments are clicked on, open its modal window
    function openModal(className, id) {
        if (localStorage.getItem('login') === 'true') {
            let btns = document.getElementsByClassName(className);
            for (let btn of btns) 
                btn.style.cursor = 'pointer';
                
            window.addEventListener('mouseover', function(e) {
                for (let btn of btns) {
                    if (btn === e.target) {
                        btn.style.opacity = "0.5";
                        btn.onclick = () => {   
                            // add the users into the modal window
                            getPost(btn, className);
                            document.getElementById(id).style.visibility = 'visible';
                        }  
                    } else {
                        btn.style.opacity = "1";
                    }                
                }
            }); 
        }
    }
    openModal('vote', 'upvotes-screen');
    openModal('feed-comments', 'comments-screen');
    
    // closes the modal window for upvotes
    // clear the modal window
    closeUpvote.onclick = () => {
        modalUpvotes.style.visibility = 'hidden';
        let users = document.getElementsByClassName('grouped-users')[0];
        users.innerText = '';
        document.getElementById('empty-message').textContent = '';
        
        // remake the template user
        const upvoteUsers = document.createElement('li');
        upvoteUsers.className = 'upvote-users';
        users.appendChild(upvoteUsers);
    } 
    
    // closes the modal window for comments
    // clear the modal window
    let closeComments = modalComments.getElementsByTagName("span")[0];
    closeComments.onclick = () => {
        modalComments.style.visibility = 'hidden';
        let comments = modalComments.getElementsByTagName("ul")[0];
        comments.innerText = '';
        
        // remake the template comment
        const comment = document.createElement('li');
        comment.className = 'comment-users';
        comments.appendChild(comment);
    } 
    
    // extracts data of a particular post given a post id
    // performs feed functionalities via other functions executed
    // (show upvotes/show comment)
    function getPost(element, className) {
        // get the user's token
        var userToken = localStorage.getItem('token');
        
        // extract the post id
        if (className === 'vote')
            var postId = element.parentNode.id;
        else if (className === 'feed-comments') 
            var postId = element.parentNode.parentNode.id;
         
        let postOptions = {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ userToken
            }
        }
        
        fetch(`${apiUrl}/post?id=${postId}`, postOptions)
            .then(response => response.json())
            .then(json => {
                let upvoteUsers = json.meta.upvotes;
                let postComments = json.comments;
                if (className === 'vote')
                    showUpvotes(upvoteUsers);
                else if (className === 'feed-comments') 
                    showComments(postComments);
            });
    } 
    
    // adds the users who upvoted on a post to the upvotes modal window
    function showUpvotes(usersId) {
        var userToken = localStorage.getItem('token');
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token '+ userToken
            }
        }
        
        if (usersId.length != 0) {
            // search users by id
            for (let id of usersId) {
                fetch(`${apiUrl}/user?id=${id}`, options)
                        .then(response => response.json())
                        .then(json => {
                            // add each user onto the modal window
                            let templateUser = document.getElementsByClassName('upvote-users')[0];
                            let user = templateUser.cloneNode(true);
                            user.textContent = json.username;
                            templateUser.insertAdjacentElement('afterend', user);
                            
                            // remove the template user element
                            if (templateUser.textContent == '') 
                                templateUser.remove();
                        });
            }
        } else {
             message.textContent = 'No one has upvoted this post.';
        }
    }
    
    // shows the comments on the modal window
    function showComments(commentsArray) {
        // sort comments starting from the most recent comment
        let sortedComments = commentsArray.sort(function(a, b){
            return b.published-a.published
        });
        if (commentsArray.length != 0) {
            for (let commentObj of sortedComments) {
                // making each comment for the comment section
                let templateComment = document.getElementsByClassName('comment-users')[0];
                let commentContainer = templateComment.cloneNode(true);
                let author = document.createElement('span');
                author.textContent = commentObj.author;
                author.className = 'comment-author'
                let date = document.createElement('span');
                date.textContent = ' ' + timeConverter(commentObj.published);
                date.className = 'comment-date';
                let comment = document.createElement('p');
                comment.textContent = commentObj.comment;
                
                // appending comment onto the modal window
                commentContainer.appendChild(author);
                commentContainer.appendChild(date);
                commentContainer.appendChild(comment);
                templateComment.insertAdjacentElement('afterend', commentContainer);
            }
        } else {
            let message = modalComments.getElementsByTagName('p')[0]
            message.textContent = 'No one has commented on this post';
        }
        
        // remove the template comment
        document.getElementsByClassName('comment-users')[0].remove();
    }
    
    // USER UPVOTE
    
    // allows the user to upvote posts and delete their votes
    if (localStorage.getItem('login') === 'true') {
        window.addEventListener('click', function(e) {
            let thumbs = document.querySelectorAll('#thumbs-up');
            for (let thumb of thumbs) {
                if (thumb.style.color != 'rgb(0, 121, 211)') {
                    upvotePost(e, thumb);
                } else {
                    deleteVote(e, thumb);
                }
            }
        })  
    } 
    
    // allows the user to upvote on a post
    // the thumb changes to blue when voted and the upvote count increases
    function upvotePost(e, thumb) {
        if (thumb === e.target) {
            var userToken = localStorage.getItem('token');
            
            let options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token '+ userToken
                }
            }
            
            let id = thumb.parentNode.parentNode.id;
            fetch(`${apiUrl}/post/vote?id=${id}`, options)
                .then(response => response.json())
                .then(json => {
                    getUserId();
                    // increase the upvote count if the user 
                    // hasn't already voted
                    if (thumb.style.color != 'rgb(0, 121, 211)')
                        thumb.parentNode.previousSibling.textContent++;
                    thumb.style.color = 'rgb(0, 121, 211)';
                })
        }
    }  
    
    // allows the user to delete their upvote on a post
    // the thumb changes to grey when the vote is deleted and the upvote
    // count decreases
    function deleteVote(e, thumb) {
        if (thumb === e.target) {
            var userToken = localStorage.getItem('token');
            let options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token '+ userToken
                }
            }
            
            let id = thumb.parentNode.parentNode.id;
            fetch(`${apiUrl}/post/vote?id=${id}`, options)
                .then(response => response.json())
                .then(json => {
                    getUserId();
                    // decrease the upvote count
                    if (thumb.style.color == 'rgb(0, 121, 211)')
                        thumb.parentNode.previousSibling.textContent--;
                    thumb.style.color = 'rgb(80,80,80)';
                })
        }   
    }  
    
    // change the colour of the thumbs up icons to blue if the user
    // has voted on a particular post
    function checkUserInUpvotes(postId, userId, thumb) {
        var userToken = localStorage.getItem('token');
        let postOptions = {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ userToken
            }
        }
       
        fetch(`${apiUrl}/post?id=${postId}`, postOptions)
            .then(response => response.json())
            .then(json => {
                let upvoteUsers = json.meta.upvotes;
                let voted = upvoteUsers.find(function(voterId) {
                    return voterId == userId;
                });
                
                if (voted) 
                    thumb.style.color = 'rgb(0, 121, 211)';
            });
    } 
    
    // finds the logged in user's id and stores it in local storage
    function getUserId() {
        var userToken = localStorage.getItem('token');
        var username = localStorage.getItem('user');
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token '+ userToken
            }
        }
        
        fetch(`${apiUrl}/user?username=${username}`, options)
            .then(response => response.json())
            .then(json => {
                localStorage.setItem('userId', json.id);  
            });
    }     
    
    // POST NEW CONTENT
    
    // make a modal window to post new content 
    const modalPost = modalUpvotes.cloneNode(true);
    modalPost.id = 'post-screen';
    modalPost.getElementsByTagName("h1")[0].textContent = 'Make a new post';
    modalPost.getElementsByTagName("ul")[0].remove();
    
    modalPost.firstChild.className = 'post-content'; 
    
    // make form elements for user input when posting
    const postDiv = document.createElement('div');
    postDiv.className = 'post-form';
    
    const postTitle = document.createElement('p');
    postTitle.textContent = 'Title';
    const inputTitle = document.createElement('input');
    inputTitle.id = 'post-title';
    inputTitle.placeholder = 'Enter Title';
    inputTitle.type = 'text';
    inputTitle.required = true;
    
    const postDescript = document.createElement('p');
    postDescript.textContent = 'Description';
    const inputDescript = document.createElement('textarea');
    inputDescript.id = 'post-description';
    inputDescript.placeholder = 'Enter Description';
    inputDescript.required = true;
    
    const postSubseddit = document.createElement('p');
    postSubseddit.textContent = 'Subseddit';
    const inputSubseddit = document.createElement('input');
    inputSubseddit.id = 'post-subseddit';
    inputSubseddit.placeholder = 'Enter Subseddit';
    inputSubseddit.type = 'text';
    
    //const postImage = document.createElement('canvas');
    const postImage = document.createElement('p');
    postImage.textContent = 'Upload Image';
    const inputImage = document.createElement('input');
    inputImage.id = 'post-image';
    inputImage.type = 'file';
    
    const postError = document.createElement('p');
    postError.className = 'input-error';
    
    const postSubmit = document.createElement('button');
    postSubmit.type = 'button';
    postSubmit.className = 'publish-btn';
    postSubmit.textContent = 'PUBLISH';
    
    // append elements of the making post form
    postImage.appendChild(inputImage);
    postSubseddit.appendChild(inputSubseddit);
    postDescript.appendChild(inputDescript);
    postTitle.appendChild(inputTitle);
    
    postDiv.appendChild(postTitle);
    postDiv.appendChild(postDescript);
    postDiv.appendChild(postSubseddit);
    postDiv.appendChild(postImage);
    postDiv.appendChild(postError);
    postDiv.appendChild(postSubmit);
    
    modalPost.getElementsByTagName("h1")[0].appendChild(postDiv);
    document.getElementById('root').appendChild(modalPost);
    
    let closePost = modalPost.firstChild.firstChild;
    closePost.onclick = () => {
        modalPost.style.visibility = 'hidden';
    }
    
    postSubmit.onclick = () => {
        var userToken = localStorage.getItem('token');
        let title = document.getElementById('post-title').value;
        let text = document.getElementById('post-description').value;
        let subseddit = document.getElementById('post-subseddit').value;
     
        // input validation 
        if (!title || !text) {
            postError.textContent = 'Title/Description missing';
            return
        }
        
        // if an image is uploaded - convert to base 64
        let img = new Image();
        let image = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();
       
        if (image) {
           // convert to base64
           reader.readAsDataURL(image);
        }
        reader.onloadend = function() {
            let url = reader.result.split(',')[1];
            //console.log(url);
            localStorage.setItem('image',url);
        }
        
        // get the base 64 url of the image
        let url = localStorage.getItem('image');
        localStorage.removeItem('image');
      
        // continue with publishing the user's post
        // if an image is not provided, don't put it in the payload
        let payload = undefined;
        if (url != null) {
            payload = {
                "title": `${title}`,
                "text": `${text}`,
                "subseddit": `${subseddit}`,
                "image": `${url}`
            } 
        } else {
           payload = {
                "title": `${title}`,
                "text": `${text}`,
                "subseddit": `${subseddit}`
            } 
        } 
        
        let postOptions = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ userToken
            },
            body: JSON.stringify(payload)
        }
       
        fetch(`${apiUrl}/post/`, postOptions)
            .then(response => response.json())
            .then(json => {
                // close the window upon successful publishing
                // and reload the page
                if (!json.message) {
                    modalPost.style.visibility = 'hidden';
                    location.reload();
                } else 
                    postError.textContent = json.message;
            });
    }
   
    postBtn.onclick = () => {
        modalPost.style.visibility = 'visible';
    }
    
 
}

export default initApp;
