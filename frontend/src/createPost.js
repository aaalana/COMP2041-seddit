function postForm() {    
    // 'MAKE A NEW POST' FORM CREATED
    
    // make a modal window to post new content 
    let modalUpvotes = document.getElementById('upvotes-screen');
    const modalPost = modalUpvotes.cloneNode(true);
    modalPost.id = 'post-screen';
    modalPost.getElementsByTagName("h1")[0].textContent = 'Make a new post';
    modalPost.getElementsByTagName("ul")[0].remove();
    
    modalPost.firstChild.className = 'post-content'; 
    
    // make form elements for user input when posting
    const postDiv = document.createElement('form');
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
    postError.className = 'post-input-error';
    postError.style.fontWeight = 'normal';
    
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
}

// allows the user to create a post
function makePost(apiUrl) {   
    let modalPost = document.getElementById('post-screen');
    let closePost = modalPost.firstChild.firstChild;
    
    // close the modal window and reset all input fields
    closePost.onclick = () => {
        modalPost.style.visibility = 'hidden';
        document.getElementsByClassName('post-form')[0].reset();
    }
  
    // publish post
    let postSubmit = document.getElementsByClassName('publish-btn')[0];
    let postError = document.getElementsByClassName('post-input-error')[0];
    postSubmit.onclick = () => {
        let title = document.getElementById('post-title').value;
        let text = document.getElementById('post-description').value;
    
        // input validation 
        if (!title || !text) {
            postError.textContent = 'Title/Description missing';
            return
        }
       
        // converts any uploaded images to base64
        let image = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();
        
        // if an image is uploaded - convert to base 64
        if (image) {
           // convert to base64
            reader.readAsDataURL(image);
            reader.onloadend = function() {
                let url = reader.result.split(',')[1];
                let payload = definePayload(url, title, text);
                publish(apiUrl, payload);
            }
        // otherwise publish the post without an image
        } else {
            let payload = definePayload(null, title, text);
            publish(apiUrl, payload);
        }
     
    }
    
    // when the post button is clicked, open the modal window for
    // making a new post
    let postBtn = document.getElementById('post-btn');
    postBtn.onclick = () => {
        modalPost.style.visibility = 'visible';
    }
}

// publishes the user's post via the api
function publish(apiUrl, payload) {
    let userToken = localStorage.getItem('token');
    let modalPost = document.getElementById('post-screen');
    let postError = document.getElementsByClassName('post-input-error')[0];
    
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
            // give an error message if there's an problem with the
            // user's post
            } else 
                postError.textContent = json.message;
        });
}
                  
// return the payload for fetch which used when making a post
function definePayload(url, title, text) {
    // if an image is not provided, don't put it in the payload
    let subseddit = document.getElementById('post-subseddit').value;
 
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
    return payload;
}

export {postForm, makePost};
