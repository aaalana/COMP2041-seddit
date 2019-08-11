import {fetchPublicFeed} from './feed.js';

// USER UPVOTE

// allows the user to upvote posts and delete their votes when the thumbs
// up button is clicked
// uses upvotePost and deleteVote functions
function thumbsButtonFunctionality(apiUrl) { 
    if (localStorage.getItem('login') === 'true') {
        window.addEventListener('click', function(e) {
            let thumbs = document.querySelectorAll('#thumbs-up');
            for (let thumb of thumbs) {
                if (thumb.style.color != 'rgb(0, 121, 211)') {
                    upvotePost(e, thumb, apiUrl);
                } else {
                    deleteVote(e, thumb, apiUrl);
                }
            }
        })  
    } 
}

// allows the user to upvote on a post
// the thumb changes to blue when voted and the upvote count increases
function upvotePost(e, thumb, apiUrl) {
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
                getUser(apiUrl, localStorage.getItem('user'));
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
function deleteVote(e, thumb, apiUrl) {
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
                getUser(apiUrl, localStorage.getItem('user'));
                // decrease the upvote count
                if (thumb.style.color == 'rgb(0, 121, 211)')
                    thumb.parentNode.previousSibling.textContent--;
                thumb.style.color = 'rgb(80,80,80)';
            })
    }   
}  

// change the colour of the thumbs up icons to blue if the user
// has voted on a particular post 
// (function is used when the page/feed is reloaded)
function checkUserInUpvotes(postId, userId, thumb, apiUrl) {
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

// finds the logged in user's info and stores the user's information and 
// id in local storage
function getUser(apiUrl, username) {
    var userToken = localStorage.getItem('token');
   
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ userToken
        }
    }
    if (userToken != null) {
        fetch(`${apiUrl}/user?username=${username}`, options)
            .then(response => response.json())
            .then(json => {
                localStorage.setItem('userId', json.id); 
                localStorage.setItem('userInfo', JSON.stringify(json));
            });
    }
} 

export {getUser, checkUserInUpvotes, thumbsButtonFunctionality};
