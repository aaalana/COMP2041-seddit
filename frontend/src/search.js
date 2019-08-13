/* THIS FILE IS RESPONSIBLE FOR ALLOWING THE USER TO SEARCH POSTS BY TITLE
 */
 
import {sortPosts, loadPost,loadMorePosts} from './feed.js';

// gets all the posts from the user's feed
function getAllPosts(apiUrl) {
    
    // defining parameters use of the feed api
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
       
            // sorting posts from most recent to least
            let sortedPosts = sortPosts(matched);
            
            // clear the feed
            clearFeed();
            
            // load matched posts onto the feed
            let userId = localStorage.getItem('loggedUserInfo').id;
            for (let post of sortedPosts) 
                loadPost(post, userId, apiUrl, 'feed'); 
        })
}

// clears the posts on the user's feed 
function clearFeed() {

    // defining variables for easier referencing of elements
    let feed = document.getElementById('feed');
    let posts = feed.getElementsByTagName('li');
    let header = feed.firstChild.cloneNode(true);
    
    // remove all posts on the feed
    let i = 0;
    while (posts.length) 
        posts[i].remove();
}

// controls all the buttons responsible for searching: 
// -submits the search
// -listens to the search input field to determine when the return the feed
//  back to normal
function startSearch(apiUrl) {
    
    // variables defined for easier referencing of elements
    let searchBtn = document.getElementById('search-btn');
    let searchInput = document.getElementById('search');
    
    // start searching through posts when the user searches
    searchBtn.onclick = () => {
        localStorage.setItem('search', 'true');
        getAllPosts(apiUrl);
    }
    
    // check when the user stops and starts search 
    searchInput.addEventListener('input', function() {
        
        // when the user is no longer searching, reload the user's feed 
        // i.e when the search field value is empty
        if (searchInput.value == '') {
            localStorage.setItem('search', 'false');
            reconstructFeed(apiUrl);
        } 
        
    });
}

// removes search results and returns the feed back to its normal state 
function reconstructFeed(apiUrl) {
    
    // clear search results
    let feed = document.getElementById('feed');
    clearFeed();                 
    
    // load the user's feed
    loadMorePosts(apiUrl, 0); 
}

// returns an array of posts that match the search by title
function searchPosts(posts) {
    
    // extract the user's search keywords
    let searchInput = document.getElementById('search').value;
    
    // search the posts by title
    return posts.filter((post) => {
        return post.title.toLowerCase().match(searchInput.toLowerCase());
    });
}

export {startSearch};

