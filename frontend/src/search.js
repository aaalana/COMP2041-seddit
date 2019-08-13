import {sortPosts, loadPost,loadMorePosts} from './feed.js';

// gets all the posts from the user's feed
function getAllPosts(apiUrl) {
    let userToken = localStorage.getItem('token');
   
    let optionsUserFeed = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ userToken
        }
    }
    
    // fetch a very large number of posts
    fetch(`${apiUrl}/user/feed?n=1000000`, optionsUserFeed)
        .then(response => response.json())
        .then(json => {
            // get matching posts
            let matched = searchPosts(json.posts);
            console.log(matched);
         
            // sorting posts from most recent to least
            let sortedPosts = sortPosts(matched);
            
            // clear the feed
            clearFeed();
            
            // load matched posts onto the feed
            let userId = localStorage.getItem('loggedUserInfo').id;
            for (let post of sortedPosts) 
                loadPost(post, userId, apiUrl, 'feed'); 
            // disable infini
        })
}

// clears the user's feed 
function clearFeed() {
    // clear the feed
    console.log("here");
    let feed = document.getElementById('feed');
    let posts = feed.getElementsByTagName('li');
    let header = feed.firstChild.cloneNode(true);
  
    let i = 0;
    while (posts.length) 
        posts[i].remove();
}

function startSearch(apiUrl) {
    // start searching through posts when the user searches
    let searchBtn = document.getElementById('search-btn');
    searchBtn.onclick = () => {
        localStorage.setItem('search', 'true');
        getAllPosts(apiUrl);
    }
    
    // when the search is cleared, rebuilt the feed back to normal
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        if (searchInput.value == '') {
            localStorage.setItem('search', 'false');
            reconstructFeed(apiUrl);
        } 
    });
}

// resets search results back to the normal state of the user's feed
function reconstructFeed(apiUrl) {
    // clear search results
    let feed = document.getElementById('feed');
    clearFeed();                 
 
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

