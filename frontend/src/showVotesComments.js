import {timeConverter} from './feed.js';

function makeUpvotesWindow() {    
    // SEE UPVOTES AND COMMENTS
    
    // make modal for upvotes 
    const modalUpvotes = document.createElement('div');
    modalUpvotes.className = 'black-bg';
    modalUpvotes.id = 'upvotes-screen';
    
    const modalWindow = document.createElement('div');
    modalWindow.className = 'modal-content';
   
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
}

function makeCommentsWindow() {    
    // make modal for comments
    const modalUpvotes = document.getElementById('upvotes-screen');
    const modalComments = modalUpvotes.cloneNode(true);
    modalComments.id = 'comments-screen';
    document.getElementById('root').appendChild(modalComments);
    const title = modalComments.getElementsByTagName('h1')[0]
    title.textContent = 'Comments';
    modalComments.getElementsByTagName('li')[0].className = 'comment-users';
    modalComments.getElementsByTagName('ul')[0].className = 'grouped-comments';
    
    // making the comment input field
    const commentForm = document.createElement('form');
    commentForm.method = 'post';
    commentForm.id = 'comment-form';
    const makeComment = document.createElement('textarea');
    makeComment.placeholder = 'Join the conversation...'
    makeComment.id = 'comment-input';
    const commentBtnDiv = document.createElement('div');
    commentBtnDiv.id = 'comment-btns';
    const commentBtn = document.createElement('button');
    commentBtn.type = 'button';
    commentBtn.textContent = 'COMMENT';
    commentBtn.className = 'button button-secondary';
    commentBtn.id = 'comment-btn';
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'CANCEL';
    cancelBtn.className = 'button button-primary';
    cancelBtn.id = 'cancel-btn';
    
    commentForm.appendChild(makeComment);
    commentBtnDiv.appendChild(commentBtn);
    commentBtnDiv.appendChild(cancelBtn);
    commentForm.appendChild(commentBtnDiv);
    title.appendChild(commentForm);
}

function loadVotesComments(apiUrl) {
    // when the upvotes/comments are clicked on, open its modal 
    // only open when the user is logged in
    function openModal(className, id, apiUrl) {
        if (localStorage.getItem('login') === 'true') {
            let btns = document.getElementsByClassName(className);
            for (let btn of btns) 
                btn.style.cursor = 'pointer';
            
            window.addEventListener('mouseover', function(e) {
                for (let btn of btns) {
                    if (btn === e.target) {
                        btn.style.opacity = '0.5';
                        btn.onclick = () => {   
                            // load content onto the modal 
                             
                            // extract the post id 
                            if (className === 'vote')
                                var postId = btn.parentNode.id;
                            else if (className === 'feed-comments') 
                                var postId = btn.parentNode.parentNode.id;
                            
                            localStorage.setItem('postId-comment', postId);
                            getPost(postId, className, apiUrl);
                            
                            let modalWindow = document.getElementById(id);
                            modalWindow.style.visibility = 'visible';
                            
                            // allows for the modal to show in front of
                            // other modals
                            document.getElementById('root').appendChild(modalWindow);
                        }  
                    } else {
                        btn.style.opacity = "1";
                    }                
                }
            }); 
        }
    }
    openModal('vote', 'upvotes-screen', apiUrl);
    openModal('feed-comments', 'comments-screen', apiUrl);
    
    // closes the modal for upvotes
    // clear the modal
    let closeUpvote = document.getElementById('close-button');
    closeUpvote.onclick = () => {
        let modalUpvotes = document.getElementById('upvotes-screen');
        modalUpvotes.style.visibility = 'hidden';
        let users = document.getElementsByClassName('grouped-users')[0];
        users.innerText = '';
        document.getElementById('empty-message').textContent = '';
        
        // remake the template user
        const upvoteUsers = document.createElement('li');
        upvoteUsers.className = 'upvote-users';
        users.appendChild(upvoteUsers);
    } 
    
    // closes the modal for comments
    // clear the modal
    let modalComments = document.getElementById('comments-screen');
    let closeComments = modalComments.getElementsByTagName('span')[0];
    closeComments.onclick = () => {
        modalComments.style.visibility = 'hidden';
        // remake the template comment
        makeCommentTemplate();
        document.getElementById('empty-message').textContent = '';
    } 
}

// makes an element for a comment to contain in
function makeCommentTemplate() {
    let modalComments = document.getElementById('comments-screen');
    let comments = modalComments.getElementsByTagName('ul')[0];
    comments.innerText = '';
    const comment = document.createElement('li');
    comment.className = 'comment-users';
    comments.appendChild(comment);
}

// extracts data of a particular post given a post id
// performs feed functionalities via other functions executed
// (show upvotes/show comment)
function getPost(postId, className, apiUrl) {
    // get the user's token
    var userToken = localStorage.getItem('token');
   
    let postOptions = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ userToken
        }
    }
    
    // store postId in local storage (to extract later for user
    // commenting)
    localStorage.setItem('postId', postId);
    
    // load the comments/upvote users onto the modal
    fetch(`${apiUrl}/post?id=${postId}`, postOptions)
        .then(response => response.json())
        .then(json => {
            let upvoteUsers = json.meta.upvotes;
            let postComments = json.comments;
            if (className === 'vote')
                showUpvotes(upvoteUsers, apiUrl);
            else if (className === 'feed-comments') 
                showComments(postComments);
        });
} 

 // adds the users who upvoted on a post to the upvotes modal 
function showUpvotes(usersId, apiUrl) {
    // load the users who have voted
    // otherwise, show a message indicating that no one has upvoted on 
    // the post
    if (usersId.length != 0) {
        let modalUpvotes = document.getElementById('upvotes-screen');
        let message = modalUpvotes.getElementsByTagName('p')[0];
        message.textContent = '';
        loadUsers(usersId, 'upvote-users', apiUrl);
    } else {
         let modalUpvotes = document.getElementById('upvotes-screen');
         let message = modalUpvotes.getElementsByTagName('p')[0];
         message.style.color = 'black';
         message.textContent = 'No one has upvoted this post.';
    }
}

// loads a list of users onto a modal
function loadUsers(usersId, className, apiUrl) {
    // search users by id
    for (let id of usersId) {
        // convert the userId into a username
        userIdToUsername(id, apiUrl, className);
    }
}

// converts a userId to a username and attaches it to an element on the
// modal
function userIdToUsername(id, apiUrl, className) {
    var userToken = localStorage.getItem('token');
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ userToken
        }
    }
   
    fetch(`${apiUrl}/user?id=${id}`, options)
        .then(response => response.json())
        .then(json => {
            // add each username onto the modal
            let templateUser = document.getElementsByClassName(className)[0];
            let user = templateUser.cloneNode(true);
            user.textContent = json.username;
            
            templateUser.insertAdjacentElement('afterend', user);
                        
            // remove the template user element
            if (templateUser && templateUser.textContent == '') 
                templateUser.remove(); 
        });
}

// shows the comments on the modal
function showComments(commentsArray) {
    // sort comments starting from the most recent comment
    let sortedComments = commentsArray.sort(function(a, b){
        return a.published - b.published
    });
    
    // load comments into the comment section
    // otherwise show a message indicating that there are no comments
    let modalComments = document.getElementById('comments-screen');
    let message = modalComments.getElementsByTagName('p')[0];
    if (commentsArray.length != 0) {
        message.textContent = '';
        for (let commentObj of sortedComments) {
            // making elements for each comment in the comment section
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
            
            // appending comment onto the modal
            commentContainer.appendChild(author);
            commentContainer.appendChild(date);
            commentContainer.appendChild(comment);
            templateComment.insertAdjacentElement('afterend', commentContainer);
        }
    } else {
        message.style.color = 'black';
        message.textContent = 'No one has commented on this post';
    }
    
    // remove the template comment
    let template = document.getElementsByClassName('comment-users')[0];
    if (template && template.hasChildNodes() === false) {
        template.remove();
    }
}

export {userIdToUsername,
        loadUsers,  
        makeCommentTemplate, 
        getPost, 
        makeUpvotesWindow, 
        makeCommentsWindow, 
        loadVotesComments};
