import {makeCommentTemplate, getPost, loadVotesComments} from './showVotesComments.js';
import {getUser} from './upvote.js';
import {getPostInfo} from './showProfile.js';

// posts the user's comment into the comment's section
// only lets logged in users to comment
function comment(apiUrl) {
    // submit comment
    let commentBtn = document.getElementById('comment-btn');
    commentBtn.onclick = () => {
        let userComment = document.getElementById('comment-input').value;
        let userToken = localStorage.getItem('token');
        let postId = localStorage.getItem('postId');
       
        let payload = {
            'comment': userComment
        } 
        
        if (userComment) {
            let options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token '+ userToken
                },
                body: JSON.stringify(payload)
            }
            
            fetch(`${apiUrl}/post/comment?id=${postId}`, options)
                .then(response => response.json())
                .then(json => {
                    // remove comment section
                    let ul = document.getElementsByClassName('grouped-comments')[0];
                    if (ul.hasChildNodes) {
                        for (let comment of ul.childNodes) 
                            comment.remove();
                    }
                    // make a comment template
                    makeCommentTemplate();
                   
                    // reload comments
                    getPost(postId, 'feed-comments', apiUrl);
                    
                    // remove the 'no comment' message if it exists
                    let modalComments = document.getElementById('comments-screen');
                    let message = modalComments.getElementsByTagName('p')[0];
                    message.textContent = '';
                    
                    // update comments number in the feed
                    let post = document.getElementById(postId);
                    let commentElement = post.childNodes[1].childNodes[5];
                    let numComments = commentElement.textContent.split(' ')[0];
                    numComments++;
                    commentElement.textContent = numComments + ' comments';
                  
                    //commentElement.textContent
                    // reset comment input field
                    let form = document.getElementById('comment-form');
                    form.reset();
                    
                    // clear any posts on the userpage
                    // increase the comments count by reloading the
                    // posts in profile page
                    document.getElementById('page-posts').innerText = '';
                    getUser(apiUrl, localStorage.getItem('user'));
                    let json2 = JSON.parse(localStorage.getItem('userInfo'));
                    getPostInfo(apiUrl, json2.posts, 'page-posts', 'loadPost');
                });
        } else {
            let commentWindow = document.getElementById('comments-screen');
            let message = commentWindow.getElementsByTagName('p')[0]
            message.textContent = 'Cannot publish an empty comment.';
            message.style.color = 'red';
        }
    }
    
    // when cancel is clicked on, clear the user's draft comment
    let cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.onclick = () => {
        let form = document.getElementById('comment-form');
        form.reset();
    }
}

export default comment;
