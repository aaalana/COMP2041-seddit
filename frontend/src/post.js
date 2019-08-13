/* THIS FILE IS RESPONSIBLE FOR THE CREATING, UPDATING AND DELETING OF A
 * POST 
 */

// creates an empty modal which is used when the user clicks on the post
// button and wants to create a new post 
// the modal contains several input field and a publish button
function postForm() { 
    
    // Step 1: clone a previously made modal //
    let modalUpvotes = document.getElementById('upvotes-screen');
    const modalPost = modalUpvotes.cloneNode(true);
    modalPost.id = 'post-screen';
    modalPost.getElementsByTagName("h1")[0].textContent = 'Make a new post';
    modalPost.getElementsByTagName("ul")[0].remove();
    
    modalPost.firstChild.className = 'post-content'; 
    
    
    // Step 2: modify the modal for post creation //
    
    // create titles and input fields (title, description, subseddit, image)
    // ids/classnames are defined so that it would be easier to get these
    // elements in other functions
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

    const postImage = document.createElement('p');
    postImage.textContent = 'Upload Image';
    const inputImage = document.createElement('input');
    inputImage.id = 'post-image';
    inputImage.type = 'file';
    
    // this element is used for input validation which will pop up as 
    // an error when the user's draft post is missing details (e.g. title)
    const postError = document.createElement('p');
    postError.className = 'post-input-error';
    postError.style.fontWeight = 'normal';
    
    const postSubmit = document.createElement('button');
    postSubmit.type = 'button';
    postSubmit.className = 'publish-btn';
    postSubmit.textContent = 'PUBLISH';
    
    
    // Step 3: append elements to the 'make a new post' modal then 
    // to the document //
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

// this function contains all the buttons that trigger making a post
// and give the buttons functionality which include;
// -opening/closing the create post modal
// -publishing the post
function makePost(apiUrl) {   
   
    // define the buttons used for creating a post
    let modalPost = document.getElementById('post-screen');
    let closePost = modalPost.firstChild.firstChild;
    let postSubmit = document.getElementsByClassName('publish-btn')[0];
    let postBtn = document.getElementById('post-btn');
    
    // close the post modal and reset all input fields so when the user 
    // restarts again, they will open to new blank input form
    closePost.onclick = () => {
        modalPost.style.visibility = 'hidden';
        document.getElementsByClassName('post-form')[0].reset();
    }
  
    // responsible for post publishing
    postSubmit.onclick = () => {
        // get the user's input from the post form and process the inputs
        // for publishing
        let postError = document.getElementsByClassName('post-input-error')[0];
        let title = document.getElementById('post-title').value;
        let text = document.getElementById('post-description').value;
        let image = modalPost.querySelector('input[type=file]').files[0];
        preparePublishing(apiUrl, image, title, text, postError, 'create', '');
    }
    
    // when the post button is clicked, open the modal for making
    // a new post
    postBtn.onclick = () => {
        modalPost.style.visibility = 'visible';
    }
}

// function that processes inputs for post publishing:
// -checks each of the input fields and performs input validation 
// i.e. if any required input fields (title/description) are left blank
// -any image uploaded is converted to base64
function preparePublishing(apiUrl, image, title, text, message, option, postId) {
   
    // if the title/description is left blank, give an error
    // and store the user from publishing 
    if (!title || !text) {
        message.textContent = 'Title/Description missing';
        return
    }
    
    // if an image is uploaded - convert to base 64
    if (image) {
        toBase64(apiUrl, image, title, text, option, postId);
    // otherwise publish the post without an image
    } else {
        // make a new post 
        if (option == 'create') {
            let payload = definePayload(null, title, text, option);
            publish(apiUrl, payload);
        // update a pre-existing post 
        } else {
            updatePost(apiUrl, postId, null, title, text);
        }
    }
}

// converts a png image into base64 for later publishing of a post
function toBase64(apiUrl, image, title, text, option, postId) {
   
    // user a reader to convert png to base64
    var reader = new FileReader();
    reader.readAsDataURL(image);
    
    // extract the image url when reader finishes loading via 
    // reader.result
    reader.onloadend = function() {
        let url = reader.result.split(',')[1];
        let payload = definePayload(url, title, text, option);
        
        // makes new post
        if (option == 'create') {
            publish(apiUrl, payload);
        // update pre-existing post
        } else {
            updatePost(apiUrl, postId, title, text);
        }
    }
}

// uses the api to publish the user's post
function publish(apiUrl, payload) {
    
    // preparing for fetching 
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
    
    // call api to publish post
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
                  
// return the payload for fetch which is used when making/updating a post
function definePayload(url, title, text, option) {
    
    // define the subseddit
    // if a subseddit has not been defined by the user, the post 
    // belongs to s/all
    let subseddit = document.getElementById('post-subseddit').value;
    if (!subseddit)
        subseddit = 'all';
    
    // define the payload depending on whether the user wants to
    // update/create a post 
    // (update cannot have subseddit the its pageload as it's metadata)
    let payload = {
        'title': `${title}`,
        'text': `${text}`,
    }
    
    if (option == 'create') 
        payload['subseddit'] = `${subseddit}`;
   
    // if an image is not provided, don't put it in the payload
    // i.e. when url is null     
    if (url != null) 
        payload['image'] = `${url}`
       console.log(payload);
    return payload;
}

// makes a modal for editing the post (when the user wants to update post)
function editPostForm() {
    
    // clone the 'create a new post modal' and modify it
    // only have title, description and image as input fields
    let editForm = document.getElementById('post-screen').cloneNode(true);
    editForm.id = 'edit-screen';
    editForm.getElementsByTagName("h1")[0].textContent = 'Update Post'; 
   
    // remove subseddit field (since the user cannot update post metadata)
    let form = editForm.getElementsByClassName('post-form')[0];
    form.getElementsByTagName('p')[2].remove();
    form.getElementsByTagName('input')[1].remove();
    form.className = 'edit-form';
    
    // rename id/className of elements (title, description, image, error)
    form.childNodes[1].id = 'edit-title';
    form.childNodes[3].id = 'edit-description';
    form.childNodes[5].id = 'edit-image';
    form.getElementsByTagName('p')[2].textContent = 'Replace/Upload New Image';
    const inputImage = document.createElement('input');
    inputImage.id = 'post-image';
    inputImage.type = 'file';
    
    // error message for input validation 
    let errorMessage = editForm.firstChild.childNodes[2];
    errorMessage.id = 'edit-error-2';
    
    // put the publish button into a div to put the button on a new line
    let div = document.createElement('div');
    div.className = 'grouped-edit-btns';
    let publishBtn = form.childNodes[7];
    
    // append elements to the modal and attach it to the document
    div.appendChild(publishBtn);
    form.appendChild(div);
    div.insertAdjacentElement('beforebegin', errorMessage);
    
    document.getElementById('root').appendChild(editForm);
}

// loads the data from the post into the edit post form for post editing 
// the user can update their post when the update button is clicked on
function loadEditForm(apiUrl, originalPost) {
    
    // put the title of the post into the title input field
    let form = document.getElementsByClassName('edit-form')[0];
    let title = form.getElementsByTagName('input')[0];
    let origTitle = originalPost.childNodes[1].firstChild;
    title.value = origTitle.textContent;
    
    // put the description of the post into the description input field
    let description = form.getElementsByTagName('textarea')[0];
    let origDescription = originalPost.getElementsByClassName('post-description')[0];
    description.value = origDescription.textContent;
 
    // defining input parameters for preparePublishing()
    let editScreen = document.getElementById('edit-screen');
    let publishBtn = form.getElementsByTagName('div')[0].lastChild;
    let errorMessage = form.lastChild.previousSibling;
   
    publishBtn.onclick = () => {
        // get the image of the original post 
        let image = editScreen.querySelector('input[type=file]').files[0];
        
        // process and check the user's post edits before publishing 
        preparePublishing(apiUrl, image, title.value, description.value, 
                          errorMessage, 'update', originalPost.id)
    }
}

// detects when the logged in user want to delete or edit their post
// controls all the buttons responsible for editing/deleting posts
function postBtnOptions(apiUrl) {

    // define buttons and other variables for easier reference
    let editBtn = document.getElementById('edit');
    let deleteBtn = document.getElementById('delete');
    let editForm = document.getElementById('edit-screen');
    let closeBtn = editForm.getElementsByTagName('span')[0];
    let deleteBtns = document.querySelectorAll('#delete');
    let editBtns = document.querySelectorAll('#edit');
    
    // close the edit post modal when the cross is clicked
    // reset input values to that of the original post
    closeBtn.onclick = () => {
        editForm.style.visibility = 'hidden';
        document.getElementsByClassName('edit-form')[0].reset();
    }
    
    // only allow logged in users to edit/delete posts
    if (localStorage.getItem('login') === 'true') {
        window.addEventListener('click', function(e) {
            // when the bin icon is clicked, remove the post 
            for (let deleteBtn of deleteBtns) {
                if (deleteBtn == e.target) {
                    // live update removal of post
                    let li = deleteBtn.parentNode.parentNode; 
                    let postId = li.id;
                    li.remove();  
                    
                    // deleting the post via the api 
                    deletePost(apiUrl, postId);
                }
            }
            
            // when the pencil icon is clicked, open the edit post modal
            // so the user can update their post
            for (let editBtn of editBtns) {
                if (editBtn == e.target) {
                    // load the post data into modal and make the modal 
                    // visible
                    let li = editBtn.parentNode.parentNode; 
                    loadEditForm(apiUrl, li);
                    editForm.style.visibility = 'visible';
                }
            }
        });
    }  
}

// deletes a logged in user's post via the api
function deletePost(apiUrl, postId) {
    
    // define values of parameters for fetch
    let userToken = localStorage.getItem('token');
  
    let options = {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ userToken
        }
    }
     
    // check the console to see if deletion was successful  
    fetch(`${apiUrl}/post?id=${postId}`, options)
        .then(response => response.json())
        .then(json => { console.log(json) })
}

// updates a logged in user's post via the api
function updatePost(apiUrl, postId, url, title, text) {
    
    // define values of parameters for fetch
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
      
    // refresh the page after updating
    fetch(`${apiUrl}/post?id=${postId}`, options)
        .then(response => response.json())
        .then(json => { location.reload() });
}

export {postForm, postBtnOptions, editPostForm, makePost};
