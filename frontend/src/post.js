function postForm() {    
    // 'MAKE A NEW POST' FORM CREATED
    
    // make a modal to post new content 
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
    
    // append elements to the 'make a new post' modal
    postDiv.appendChild(postTitle);
    postDiv.appendChild(inputTitle);
    postDiv.appendChild(postDescript);
    postDiv.appendChild(inputDescript);
    postDiv.appendChild(postSubseddit);
    postDiv.appendChild(inputSubseddit);
    postDiv.appendChild(postImage);
    postDiv.appendChild(inputImage);
    postDiv.appendChild(postError);
    postDiv.appendChild(postSubmit);
    
    modalPost.firstChild.appendChild(postDiv);
    document.getElementById('root').appendChild(modalPost);
}

// allows the user to create a post
function makePost(apiUrl) {   
    let modalPost = document.getElementById('post-screen');
    let closePost = modalPost.firstChild.firstChild;
    
    // close the modal and reset all input fields
    closePost.onclick = () => {
        modalPost.style.visibility = 'hidden';
        document.getElementsByClassName('post-form')[0].reset();
    }
  
    // publish post
    let postSubmit = document.getElementsByClassName('publish-btn')[0];
  
    postSubmit.onclick = () => {
        let postError = document.getElementsByClassName('post-input-error')[0];
        let title = document.getElementById('post-title').value;
        let text = document.getElementById('post-description').value;
        let image = modalPost.querySelector('input[type=file]').files[0];
        preparePublishing(apiUrl, image, title, text, postError, 'create', '');
    }
    
    // when the post button is clicked, open the modal for making
    // a new post
    let postBtn = document.getElementById('post-btn');
    postBtn.onclick = () => {
        modalPost.style.visibility = 'visible';
    }
}

// function that prepares for publishing 
// checks each of the input fields and performs input validation 
// (title/description)
// any image uploaded is converted to base64
function preparePublishing(apiUrl, image, title, text, message, option, postId) {
    // input validation 
    if (!title || !text) {
        message.textContent = 'Title/Description missing';
        return
    }
    
    // if an image is uploaded - convert to base 64
    if (image) {
        toBase64(apiUrl, image, title, text, option, postId);
    } else {
        if (option == 'create') {
            // otherwise publish the post without an image
            let payload = definePayload(null, title, text, option);
            publish(apiUrl, payload);
        } else {
            updatePost(apiUrl, postId, null, title, text);
        }
    }
}

// converts a png image into base64 for later publishing of a post
function toBase64(apiUrl, image, title, text, option, postId) {
    var reader = new FileReader();
    // convert to base64
    // extract the image url when reader finishes loading
    reader.readAsDataURL(image);
    reader.onloadend = function() {
        let url = reader.result.split(',')[1];
        let payload = definePayload(url, title, text, option);
        if (option == 'create') {
            publish(apiUrl, payload);
        } else {
            updatePost(apiUrl, postId, title, text);
        }
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
            // close the upon successful publishing and reload the page
            if (!json.message) {
                modalPost.style.visibility = 'hidden';
                location.reload();
            // give an error message if there's an problem with the
            // user's post
            } else 
                postError.textContent = json.message;
        });
}
                  
// return the payload for fetch which used when making/updating a post
function definePayload(url, title, text, option) {
    let subseddit = document.getElementById('post-subseddit').value;
    
    // if an image is not provided, don't put it in the payload
    // i.e. when url is null
    let payload = undefined;
    if (option == 'create') {
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
    } else if (option == 'update') {
        if (url != null) {
            payload = {
                "title": `${title}`,
                "text": `${text}`,
                "image": `${url}`
            } 
        } else {
           payload = {
                "title": `${title}`,
                "text": `${text}`
            } 
        } 
    }
    return payload;
}

// makes a modal for editing the post
function editPostForm() {
    // only have title, description and image as input fields
    let editForm = document.getElementById('post-screen').cloneNode(true);
    editForm.id = 'edit-screen';
    editForm.getElementsByTagName("h1")[0].textContent = 'Update Post'; 
   
    // (remove subseddit field)
    let form = editForm.getElementsByClassName('post-form')[0];
    form.getElementsByTagName('p')[2].remove();
    form.getElementsByTagName('input')[1].remove();
    form.className = 'edit-form';
    
    // rename class names of elements
    form.childNodes[1].id = 'edit-title';
    form.childNodes[3].id = 'edit-description';
    form.childNodes[5].id = 'edit-image';
    form.getElementsByTagName('p')[2].textContent = 'Replace/Upload New Image';
     const inputImage = document.createElement('input');
    inputImage.id = 'post-image';
    inputImage.type = 'file';
    
    // add an option buttom that will remove the image
    let div = document.createElement('div');
    div.className = 'grouped-edit-btns';
  
    let errorMessage = editForm.firstChild.childNodes[2];
    errorMessage.id = 'edit-error-2';
    
    // append elements 
    div.appendChild(form.childNodes[7]);
    form.appendChild(div);
    div.insertAdjacentElement('beforebegin', errorMessage);
    
    document.getElementById('root').appendChild(editForm);
}

// loads the text from the post into the edit post form
// the user can update their post when the update button is clicked on
function loadEditForm(apiUrl, originalPost) {
    let form = document.getElementsByClassName('edit-form')[0];
    let title = form.getElementsByTagName('input')[0];
    let origTitle = originalPost.childNodes[1].firstChild;
    title.value = origTitle.textContent;
    
    let description = form.getElementsByTagName('textarea')[0];
    let origDescription = originalPost.getElementsByClassName('post-description')[0];
    description.value = origDescription.textContent;
    
    let message = form.lastChild.previousSibling;
   
    // get the image of the original post
    let editScreen = document.getElementById('edit-screen');
    let publishBtn = form.getElementsByTagName('div')[0].lastChild;
    publishBtn.onclick = () => {
        let image = editScreen.querySelector('input[type=file]').files[0];
        preparePublishing(apiUrl, image, title.value, description.value, message, 'update', originalPost.id)
    }
}

// detects when the logged in user want to delete or edit their post
function postBtnOptions(apiUrl) {
    let editBtn = document.getElementById('edit');
    let deleteBtn = document.getElementById('delete');
    let editForm = document.getElementById('edit-screen');
    let closeBtn = editForm.getElementsByTagName('span')[0];
    closeBtn.onclick = () => {
        editForm.style.visibility = 'hidden';
        document.getElementsByClassName('edit-form')[0].reset();
    }
    
    if (localStorage.getItem('login') === 'true') {
        window.addEventListener('click', function(e) {
            let deleteBtns = document.querySelectorAll('#delete');
            let editBtns = document.querySelectorAll('#edit');
            for (let deleteBtn of deleteBtns) {
                if (deleteBtn == e.target) {
                    let li = deleteBtn.parentNode.parentNode; 
                    let postId = li.id;
                    li.remove();   
                    deletePost(apiUrl, postId);
                    
                }
            }
            
            for (let editBtn of editBtns) {
                if (editBtn == e.target) {
                    let li = editBtn.parentNode.parentNode; 
                    let postId = li.id;
                    loadEditForm(apiUrl, li);
                    editForm.style.visibility = 'visible';
                }
            }
        });
    }  
}

// deletes a logged in user's post
function deletePost(apiUrl, postId) {
    let userToken = localStorage.getItem('token');
    //let modalPost = document.getElementById('post-screen');

    let options = {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ userToken
        }
    }
       
    fetch(`${apiUrl}/post?id=${postId}`, options)
        .then(response => response.json())
        .then(json => {
            console.log(json);
        });
}

// updates a logged in user's post
function updatePost(apiUrl, postId, url, title, text) {
    let userToken = localStorage.getItem('token');
    let payload = definePayload(url, title, text, 'update');
    
    let options = {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ userToken
        },
        body: JSON.stringify(payload)
    }
       
    fetch(`${apiUrl}/post?id=${postId}`, options)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            location.reload();
        });
}

export {postForm, postBtnOptions, editPostForm, makePost};
