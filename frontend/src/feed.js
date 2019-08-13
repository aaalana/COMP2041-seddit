/* This file is responsible for loading a list/feed of posts. 
 * This can be on a user's page or the user's feed.
 */

import {getUser, checkUserInUpvotes} from './upvote.js'

// creates a blank template for the list of posts to append to later on
// also creates the feed header (the block of elements just above the 
// feed
function createFeedTemplate() {   
    // CREATING THE ELEMENTS OF POST - making a post template
    // image element not added (added in makeFeed.js)
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
    
    const publicBtn = document.createElement('button');
    publicBtn.className = 'button button-primary';
    publicBtn.textContent = 'See Public Feed';
    publicBtn.id = 'public-btn';
    
    const postBtn = document.createElement('button');
    postBtn.className = 'button button-secondary';
    postBtn.textContent = 'Post';
    postBtn.id = 'post-btn';
    
    const feedLi = makePostTemplate();
    
    // APPENDING ELEMENTS TO HEADER
    feedHeader.appendChild(popularPosts);
    feedHeader.appendChild(publicBtn);
    feedHeader.appendChild(postBtn);
    feedUl.appendChild(feedHeader);
    feedUl.appendChild(feedLi);
    main.appendChild(feedUl);
   
    // APPENDING MAIN TO DOCUMENT
    document.getElementById('root').appendChild(main);
}

// makes a modal for showing the public feed 
// this can only be accessed by a logged in user
function makePublic() {
    
    // create modal elements
    
    // black screen
    const modalPub = document.createElement('div');
    modalPub.className = 'black-bg';
    modalPub.id = 'public-screen';
    
    // modal
    const modalWindow = document.createElement('div');
    modalWindow.className = 'modal-content';
    
    // close button
    const close = document.createElement('span');
    close.className = 'material-icons';
    close.id = 'close-pub-button';
    close.textContent = 'close';
    
    // title
    const title = document.createElement('h1');
    title.textContent = 'Public Feed'
    title.className = 'title';
     
    // ul element to group posts together 
    const feedUl = document.createElement('ul');
    feedUl.id = 'pub-feed';
    const feedAttribute = document.createAttribute('data-id-feed');
    feedUl.setAttributeNode(feedAttribute); 
    
    // append elements
    modalWindow.appendChild(close);
    modalWindow.appendChild(title);
    modalWindow.appendChild(feedUl);
    modalPub.appendChild(modalWindow);
    
    document.getElementById('root').appendChild(modalPub); 
}

// opens and closes the public feed modal
// this can only be accessed by a logged in user
function showPublic(apiUrl) {
    
    // defining variables for easier access
    let pubModal = document.getElementById('public-screen');
    let publicBtn = document.getElementById('public-btn');
    let feedUl = document.getElementById('pub-feed');
    
    // open the public modal
    publicBtn.onclick = () => {
        pubModal.style.visibility = 'visible';
        
        // load the public posts into the public modal
        fetchPublicFeed(apiUrl, 'pub-feed');
    }
   
    // close the public modal
    let closeBtn = document.getElementById('close-pub-button');
    closeBtn.onclick = () => {
        pubModal.style.visibility = 'hidden';
        // clear the public feed
        feedUl.innerText = '';
        location.reload();
    }
}

// returns a post template of elements that will have their textContent 
// filled when the feed is loaded
function makePostTemplate() {
    
    // CREATE THE ELEMENTS
    
    // element to group the post data
    const feedLi = document.createElement('li');
    feedLi.className = 'post';
    const postAttribute = document.createAttribute('data-id-post');
    feedLi.setAttributeNode(postAttribute); 
    
    // used for viewing the upvotes of a post
    const vote = document.createElement('div');
    vote.className = 'vote';
    const upvoteAttribute = document.createAttribute('data-id-upvotes');
    vote.setAttributeNode(upvoteAttribute); 
    
    // content grouping of the post
    const content = document.createElement('div');
    content.className = 'content';
    
    // title
    const feedTitle = document.createElement('h4');
    const titleAttribute = document.createAttribute('data-id-title');
    feedTitle.setAttributeNode(titleAttribute); 
    feedTitle.className = 'post-title alt-text';
    
    // description           
    const feedPara = document.createElement('span');
    feedPara.className = 'post-author'; 
    const authorAttribute = document.createAttribute('data-id-author');
    feedPara.setAttributeNode(authorAttribute);        
    
    // date
    const feedDate = document.createElement('span');
    feedDate.className = 'post-date'
    
    // thumbs up
    const feedThumbsUp = document.createElement('span');
    feedThumbsUp.className = 'material-icons';
    feedThumbsUp.id = 'thumbs-up';
    feedThumbsUp.textContent = 'thumb_up';
      
    // delete post
    const feedDelete = document.createElement('span');
    feedDelete.className = 'material-icons';
    feedDelete.id = 'delete';
    feedDelete.textContent = 'delete';  
    
    // edit post
    const feedEdit = document.createElement('span');
    feedEdit.className = 'material-icons';
    feedEdit.id = 'edit';
    feedEdit.textContent = 'edit'; 
    
    // description
    const feedDescript = document.createElement('p');
    feedDescript.className = 'post-description'
    
    // number of comments
    const feedComments = document.createElement('span');
    feedComments.className = 'feed-comments';
    
    // subseddit
    const feedSubseddit = document.createElement('span');
    feedSubseddit.className = 'feed-subseddit';
    feedSubseddit.textContent = 'all';
    
    // APPENDING ELEMENTS TO HEADER
    feedLi.appendChild(vote);
    content.appendChild(feedTitle);
    content.appendChild(feedPara);
    content.appendChild(feedDate);
    content.appendChild(feedThumbsUp);
    content.appendChild(feedDelete);
    content.appendChild(feedEdit);
    content.appendChild(feedDescript);
    content.appendChild(feedComments);
    content.appendChild(feedSubseddit);
    feedLi.appendChild(content);
    
    // RETURN THE TEMPLATE
    return feedLi;
}

// allow a description of a post to expand/collapsed when clicked on
function togglePost() {

    // check if the description of a post is being clicked on
    window.addEventListener('click', function(e) {
        let descriptions = document.getElementsByClassName('post-description');
        for (let description of descriptions) {
            if (description == e.target) {
                // show the full description
                if (description.style.textOverflow == 'ellipsis') {
                    description.style.textOverflow = 'clip';
                    description.style.overflow = 'visible';
                    description.style.whiteSpace = 'normal';
                // only show part of the description
                } else {
                    description.style.textOverflow = 'ellipsis';
                    description.style.overflow = 'hidden';
                    description.style.whiteSpace = 'nowrap';
                }
            }
        }
    });
}

// generate the public feed for a user who is not logged in via the api
function fetchPublicFeed(apiUrl, ul) {
    fetch(`${apiUrl}/post/public`)
        .then(response => response.json())
        .then(json => makeFeed(json, apiUrl, ul))
}

// generates the user's feed (for users logged in or not)
function makeFeed(json, apiUrl, ul) {
    
    // gets the user's id via the logged in <user> element
    let userId = '';
    if (localStorage.getItem('login') == 'true') 
        userId = JSON.parse(localStorage.getItem('loggedUserInfo')).id;
 
    // sorting posts from most recent to least
    let sortedPosts = sortPosts(json.posts);

    // adding posts to the feed
    for(let post of sortedPosts) {
        loadPost(post, userId, apiUrl, ul);
    }
    
    // remove the fake template post
    let feedLi = document.getElementsByClassName('post')[0];
    let title = feedLi.childNodes[1].firstChild;
    if (title.textContent == '') {
        feedLi.remove();  
    }       
}

// sorts posts from most recent to least
function sortPosts(posts) {
    let sortedPosts = posts.sort(function(a, b) {
        return b.meta.published-a.meta.published
    });
    return sortedPosts;
}

// clones the template post element
// modifies the elements to fill in the information of the post
function loadPost(post, userId, apiUrl, elementId) {
   
    let feedPost = makePostTemplate();
    feedPost.id = post.id;
    
    // remove any images that were previously attached on the template post
    if (feedPost.lastChild.className == 'post-container') 
        feedPost.getElementsByClassName('post-container')[0].remove();
    
    let title = feedPost.childNodes[1].childNodes[0];
    title.textContent = post.title;
    
    let author = feedPost.childNodes[1].childNodes[1];
    author.textContent = 'Posted by ' + post.meta.author;
    
    let upvotes = feedPost.firstChild;
    upvotes.textContent = post.meta.upvotes.length;
    
    let date = feedPost.childNodes[1].childNodes[2];
    date.textContent = timeConverter(post.meta.published);
    date.className = 'post-date';
    
    let username = author.textContent.substring(10);
    let loggedUser = localStorage.getItem('user');
    
    let edit = feedPost.childNodes[1].childNodes[5];
    let feedDelete = feedPost.childNodes[1].childNodes[4];
    let thumb = feedPost.childNodes[1].childNodes[3];
    
    if (localStorage.getItem('login') == 'true') {
        
        // only allow edit and delete post options when the user is 
        // logged in and is the author
        if (username == loggedUser) {
            edit.style.visibility = 'visible';
            feedDelete.style.visibility = 'visible';      
        }
        
        // change the thumbs to blue if the user has already upvoted
        // on the post
        thumb.style.visibility = 'visible';
        checkUserInUpvotes(post.id, userId, thumb, apiUrl);
    }
    
    let description = feedPost.childNodes[1].childNodes[6];
    description.textContent = post.text;
    
    let comments = feedPost.childNodes[1].childNodes[7];
    comments.textContent = post.comments.length + ' comments';
    
    let subseddit = feedPost.childNodes[1].childNodes[8];
    if (post.meta.subseddit)
        subseddit.textContent = 's/' + post.meta.subseddit;
    else
        subseddit.textContent = '';
        
    // add in the image only if it exists 
    if (post.image !== null) {
        let image = new Image();
        image.src = 'data:image/png;base64,' + post.image;
        image.className = 'post-image';
        
        let container = document.createElement('div');
        container.className = 'post-container';
      
        container.appendChild(image);
        feedPost.appendChild(container);
    }
    
    let feedUl = document.getElementById(elementId);
    feedUl.appendChild(feedPost);
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

// controls when more posts are loaded into the user's feed
// allows for infinite scroll
function infiniteScroll(apiUrl) {
    
    let scroll = document.createElement('div'); 
    let root = document.getElementById('root');
    let percentage;
    let start = 0;
    
    window.addEventListener('scroll', function() {
        
        // calculates an approximate height of how much the user has 
        // scrolled through the page
        // does not infinite scroll when the user is searching
        if (localStorage.getItem('search') == 'false') {
            let scrolledHeight = pageYOffset;
            let lastPost = document.getElementById('feed').lastChild;
            
            // calculates the distance from the first post to the last post
            // including the height of the posts themselves
            let firstToLastPost = lastPost.offsetTop + lastPost.clientHeight;
          
            // calculates the height from the top to the bottom of the page
            let pageScrollHeight = pageYOffset + window.innerHeight;
           
            // load more posts when the scroll bar reaches around the bottom
            // of the page         
            if (pageScrollHeight > firstToLastPost + 20) {
                // only load 10 posts at a time
                start = start + 10;
                loadMorePosts(apiUrl, start);
            }
        }
    });
}

// loads more posts into the user's feed 
function loadMorePosts(apiUrl, start) {
    let userToken = localStorage.getItem('token');
    let optionsUserFeed = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ userToken
        }
    }
    
    fetch(`${apiUrl}/user/feed?p=${start}`, optionsUserFeed)
        .then(response => response.json())
        .then(json => {
            // show the thumbs up on each post
            let thumbs = document.querySelectorAll('#thumbs-up');
            for (let thumb of thumbs)
                thumb.style.visibility = 'visible';
            makeFeed(json, apiUrl, 'feed');
        });
}

export {makePostTemplate, infiniteScroll, makePublic, loadPost, sortPosts, 
        createFeedTemplate, showPublic, fetchPublicFeed, timeConverter, 
        makeFeed, loadMorePosts, togglePost};
