import {sortPosts, loadPost,loadMorePosts} from './feed.js';

function getAllPosts(apiUrl) {
    let userToken = localStorage.getItem('token');
   
    let optionsUserFeed = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ userToken
        }
    }
    
    fetch(`${apiUrl}/user/feed?n=10000`, optionsUserFeed)
        .then(response => response.json())
        .then(json => {
            // get matching posts
            let matched = searchPosts(json.posts);
            console.log(matched);
         
            // sorting posts from most recent to least
            let sortedPosts = sortPosts(matched);
            
            // clear the feed
            let feed = document.getElementById('feed');
            feed.innerText = '';
            
            // load matched posts onto the feed
            let userId = localStorage.getItem('loggedUserInfo').id;
            for (let post of sortedPosts) 
                loadPost(post, userId, apiUrl, 'feed'); 
            // disable infini
        })
}

function startSearch(apiUrl) {
    // start searching through posts when the user searches
    let searchBtn = document.getElementById('search-btn');
    searchBtn.onclick = () => {
        console.log('triggered');
        getAllPosts(apiUrl);
    }
    
    // when the search is cleared, rebuilt the feed back to normal
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        if (searchInput.value == '') 
            reconstructFeed(apiUrl); 
    });
}

// resets search results back to the normal state of the user's feed
function reconstructFeed(apiUrl) {
    // clear search results
    let feed = document.getElementById('feed');
    feed.innerText = '';
                
    // return the feed back to normal
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
    
    feedHeader.appendChild(popularPosts);
    feedHeader.appendChild(publicBtn);
    feedHeader.appendChild(postBtn);
    feed.appendChild(feedHeader);
    loadMorePosts(apiUrl, 0); 
}

// returns an array of posts that match the search by title
function searchPosts(posts) {
    let searchInput = document.getElementById('search').value;
    // search the posts by title
    return posts.filter((post) => {
        return post.title.toLowerCase().match(searchInput.toLowerCase());
    });
}

export {startSearch};

