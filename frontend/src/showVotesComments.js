import {timeConverter} from './feed.js'

function makeUpvotesWindow() {    
    // SEE UPVOTES AND COMMENTS
    
    // make modal window for upvotes 
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
    // make modal window for comments
    const modalUpvotes = document.getElementById('upvotes-screen');
    const modalComments = modalUpvotes.cloneNode(true);
    modalComments.id = 'comments-screen';
    document.getElementById('root').appendChild( modalComments);
    modalComments.getElementsByTagName('h1')[0].textContent = 'Comments';
    modalComments.getElementsByTagName('li')[0].className = 'comment-users';
    modalComments.getElementsByTagName('ul')[0].className = 'grouped-comments';
}

function loadVotesComments(apiUrl) {
    // functions for when the user is logged in
    
    // when the upvotes/comments are clicked on, open its modal window
    function openModal(className, id, apiUrl) {
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
                            getPost(btn, className, apiUrl);
                            let modalWindow = document.getElementById(id);
                            modalWindow.style.visibility = 'visible';
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
    
    // closes the modal window for upvotes
    // clear the modal window
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
    
    // closes the modal window for comments
    // clear the modal window
    let modalComments = document.getElementById('comments-screen');
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
    function getPost(element, className, apiUrl) {
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
                            if (templateUser && templateUser.textContent == '') 
                                templateUser.remove();
                        });
            }
        } else {
             let message = document.getElementById('empty-message');
             message.textContent = 'No one has upvoted this post.';
        }
    }
    
    // shows the comments on the modal window
    function showComments(commentsArray) {
        // sort comments starting from the most recent comment
        let sortedComments = commentsArray.sort(function(a, b){
            return a.published - b.published
        });
        if (commentsArray.length != 0) {
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
                
                // appending comment onto the modal window
                commentContainer.appendChild(author);
                commentContainer.appendChild(date);
                commentContainer.appendChild(comment);
                templateComment.insertAdjacentElement('afterend', commentContainer);
            }
        } else {
            let message = modalComments.getElementsByTagName('p')[0];
            message.textContent = 'No one has commented on this post';
        }
        
        // remove the template comment
        let template = document.getElementsByClassName('comment-users')[0];
        if (template && template.hasChildNodes() === false) {
            template.remove();
        }
    }
}

export {makeUpvotesWindow, makeCommentsWindow, loadVotesComments};
