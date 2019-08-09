import {getUser, checkUserInUpvotes} from './upvote.js'

function createFeedTemplate() {    
    // MAKING THE FEED 
    
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
               
    const feedPara = document.createElement('span');
    feedPara.className = 'post-author'; 
    const authorAttribute = document.createAttribute('data-id-author');
    feedPara.setAttributeNode(authorAttribute);        
    
    const feedDate = document.createElement('span');
    feedDate.className = 'post-date'
    
    const feedThumbsUp = document.createElement('span');
    feedThumbsUp.className = 'material-icons';
    feedThumbsUp.id = 'thumbs-up';
    feedThumbsUp.textContent = 'thumb_up';
        
    const feedDescript = document.createElement('p');
    feedDescript.className = 'post-description'
    
    const feedComments = document.createElement('span');
    feedComments.className = 'feed-comments';
    
    const feedSubseddit = document.createElement('span');
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
}

// allow a description of a post to expand/collapsed when clicked on
function togglePost(){
    window.addEventListener('click', function(e) {
        let descriptions = document.getElementsByClassName('post-description');
        for (let description of descriptions) {
            if (description == e.target) {
                if (description.style.textOverflow == 'ellipsis') {
                    description.style.textOverflow = 'clip';
                    description.style.overflow = 'visible';
                    description.style.whiteSpace = 'normal';
                } else {
                    description.style.textOverflow = 'ellipsis';
                    description.style.overflow = 'hidden';
                    description.style.whiteSpace = 'nowrap';
                }
            }
        }
    });
}

// generate the public feed for a user who is not logged in 
function fetchPublicFeed(apiUrl) {
    fetch(`${apiUrl}/post/public`)
        .then(response => response.json())
        .then(json => makeFeed(json))
}

// generates the user's feed (for users logged in or not)
function makeFeed(json, apiUrl) {
    // make sure the user id is stored in local storage
    let userId = '';
    if (localStorage.getItem('login') == 'true') {
        getUser(apiUrl);
        userId = localStorage.getItem('userId');
    }
    
    // sorting posts from most recent to least
    let sortedPosts = sortPosts(json.posts);

    // adding posts to the feed
    let feedLi = document.getElementsByClassName('post')[0];
    for(let post of sortedPosts) {
        loadPost(post, userId, apiUrl);
    }
    // remove the fake template post
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

// clones the template post element and modifies the text of 
// the post
function loadPost(post, userId, apiUrl) {
    let feedLi = document.getElementsByClassName('post')[0];
    let feedPost = feedLi.cloneNode(true);
    feedPost.id = post.id;
   
    let title = feedPost.childNodes[1].childNodes[0];
    title.textContent = post.title;
    let author = feedPost.childNodes[1].childNodes[1];
    author.textContent = 'Posted by ' + post.meta.author;
    let upvotes = feedPost.firstChild;
    upvotes.textContent = post.meta.upvotes.length;
    let date = feedPost.childNodes[1].childNodes[2];
    date.textContent = timeConverter(post.meta.published);
    date.className = 'post-date';
    let thumb = feedPost.childNodes[1].childNodes[3];
    
    // change the thumbs to blue if the user has already upvoted
    // on the post
    if (localStorage.getItem('login') == 'true')
        checkUserInUpvotes(post.id, userId, thumb, apiUrl);
   
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
        image.src = 'data:image/png;base64,' + post.image;
        image.className = 'post-image';
        
        let container = document.createElement('div');
        container.className = 'post-container';
      
        container.appendChild(image);
        feedPost.appendChild(container);
    }
    
    let feedUl = document.getElementById('feed');
    feedUl.appendChild(feedPost);
    let main = document.getElementsByTagName('main')[0];
    main.appendChild(feedUl);
    
    document.getElementById('root').appendChild(main);
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
        // calculates an approximate percentage of how much the user has 
        // scrolled through the page
        let scrolledHeight = pageYOffset;
        let lastPost = document.getElementById('feed').lastChild;
        let lastPostOffset = lastPost.offsetTop + lastPost.clientHeight;
        let scrollOffset = pageYOffset + window.innerHeight;
      
        // load more posts
        // adjust where the posts start loading from
        if (scrollOffset > lastPostOffset - 10) {
            start = start + 10;
            loadMorePosts(apiUrl, start)
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
            makeFeed(json, apiUrl);
        });
}
export {infiniteScroll, loadPost, createFeedTemplate, fetchPublicFeed, timeConverter, makeFeed, togglePost};