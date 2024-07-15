import { app } from "./constants.js";
import { getCookieValue, strToInt, initThumbs } from "./tools.js";

export async function setHome() {
    const modalCreatePost = document.getElementById('createPostModal');
    const modalOnePost = document.getElementById('onePostModal')
    const categorieError = document.getElementById('categorieError');
    const modalNotif = document.getElementById('notifModal');
    var postRow = document.getElementsByClassName('postRow');

    addListenerToLike(postRow, 'click', 'post')

    addListenerToDislike(postRow, 'click', 'post')

    addListenerToComment(postRow, 'click')

    const logoutButton = document.getElementById("logoutButton")
    logoutButton?.addEventListener("click", (event) => {
        event.preventDefault()
        const sessionId = getCookieValue("sessionID")

        if (app.ws && sessionId) {
            app.ws.send(JSON.stringify({ action: "logout", data: sessionId }));
        } else {
            console.error("WebSocket is not initialized or sessionID is null.");
        }
    })

    const createPostButton = document.getElementById('createPostButton')
    createPostButton.addEventListener('click', function (event) {
        event.preventDefault();
        openCreatePostModal();
    })

    const notif = document.getElementById('notif');
    notif.addEventListener("click", (event) => {
        event.preventDefault();
        openNotifModal();
    });


    window.onclick = function (event) {
        if (event.target === modalCreatePost || event.target === modalNotif || event.target === modalOnePost) {
            closeModal();
        }
    }

    initPage();

    function initPage() {
        const profileName = document.getElementById('profileName')
        profileName.textContent = app.user.nickname

        listenSubmitPost();
        listenSubmitComment();

        app.ws.send(JSON.stringify({ action: "getAllPost" }));
    }

    async function listenSubmitPost() {
        const createPostForm = document.getElementById('createPostForm')
        createPostForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const checkboxes = createPostForm.querySelectorAll('input[name="categorie"]:checked');
            if (checkboxes.length === 0) {
                categorieError.style.display = 'block';
                return; // Empêcher la soumission du formulaire
            } else {
                categorieError.style.display = 'none';
            }
            closeModal()

            const data = getDataCreatePostForm(createPostForm)
            data.nickname = app.user.nickname

            data.img = await processFile(data.img)

            app.ws.send(JSON.stringify({ action: "postCreate", data: JSON.stringify(data) }));

            createPostForm.reset()
        })
    }

    async function listenSubmitComment() {
        const createCommentForm = document.getElementById('createCommentForm')
        createCommentForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            closeModal()

            const data = getDataCreateCommentForm(createCommentForm)

            data.postId = strToInt(modalOnePost.getAttribute('data-postId'))
            data.userId = app.user.userId
            data.nickname = app.user.nickname

            // console.log("data submit comment :", data);

            app.ws.send(JSON.stringify({ action: "commentCreate", data: JSON.stringify(data) }));

            createCommentForm.reset()
        })
    }

    function openNotifModal() {
        modalNotif.style.display = "block";
    }

    function openCreatePostModal() {
        modalCreatePost.style.display = 'block';
    }

    function closeModal() {
        modalCreatePost.style.display = 'none';
        modalNotif.style.display = 'none';
        modalOnePost.style.display = 'none';
    }

}

function encodeImageFileAsURL(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onloadend = function () {
            var base64data = reader.result;
            resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function processFile(data) {
    const base64data = await encodeImageFileAsURL(data);
    return base64data
}

function getDataCreatePostForm(form) {
    const dataForm = new FormData(form);
    const data = Object.fromEntries(dataForm.entries());

    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    data.categorie = Array.from(checkboxes).map(checkbox => checkbox.value);

    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput.files.length > 0) {
        data.img = fileInput.files[0];
    }

    return data;
}

function getDataCreateCommentForm(form) {
    const dataForm = new FormData(form);
    const data = Object.fromEntries(dataForm.entries());
    return data;
}

function updateLike(id, nbrLike, nbrDislike, likedByArray, dislikedByArray, action) {
    if (action === 'post') {
        const data = {
            postID: id,
            nbrLike: nbrLike,
            nbrDislike: nbrDislike,
            likedBy: likedByArray,
            dislikedBy: dislikedByArray
        }

        // console.log('data to send to the server (POST) : ', data);
        app.ws.send(JSON.stringify({ action: "updatePostLike", data: JSON.stringify(data) }));
    } else if (action === 'comment') {
        const data = {
            commentID: id,
            nbrLike: nbrLike,
            nbrDislike: nbrDislike,
            likedBy: likedByArray,
            dislikedBy: dislikedByArray
        }
        console.log('data to send to the server (COMMENT) : ', data);
        app.ws.send(JSON.stringify({ action: "updateCommentLike", data: JSON.stringify(data) }));
    }
}

export function addListenerToComment(collection, action) {
    const modalOnePost = document.getElementById('onePostModal')
    const imgPostModal = document.getElementById('comment-post-image')
    const postAuthorModal = document.getElementById('comment-post-author')
    const postDateModal = document.getElementById('comment-post-date')
    const postCategoriesModal = document.getElementById('comment-post-categories')
    const postContentModal = document.getElementById('comment-post-text')

    for (let i = 0; i < collection.length; i++) {

        const commentDiv = collection[i].getElementsByClassName('commentDiv')[0]
        const imgComment = commentDiv.getElementsByTagName('img')[0]
        const idPost = parseInt(collection[i].getAttribute('data-id'))

        imgComment.addEventListener(action, (event) => {

            const blockComment = document.getElementById(`${idPost}-blockComment`)
            if (blockComment.style.display === 'none') {
                blockComment.style.display = 'block'

                const buttonOpenModal = document.getElementById(`${idPost}-openModal`)
                buttonOpenModal.addEventListener(action, (event) => {
                    const imgPost = document.getElementById(`${idPost}`).getElementsByClassName('postImage')[0]
                    const authorNickname = document.getElementById(`${idPost}`).getElementsByClassName('user-prfile')[0].getElementsByTagName('div')[0].getElementsByTagName('p')[0]
                    const postCreate = document.getElementById(`${idPost}`).getElementsByClassName('user-prfile')[0].getElementsByTagName('div')[0].getElementsByTagName('span')[0]
                    const categories = document.getElementById(`${idPost}`).getElementsByClassName('postCategories')[0]
                    const content = document.getElementById(`${idPost}`).getElementsByClassName('postText')[0]

                    modalOnePost.setAttribute('data-postId', idPost);

                    imgPostModal.src = imgPost.src
                    postAuthorModal.innerHTML = authorNickname.innerHTML
                    postDateModal.innerHTML = postCreate.innerHTML
                    postCategoriesModal.innerHTML = categories.innerHTML
                    postContentModal.innerHTML = content.innerHTML

                    modalOnePost.style.display = 'flex';
                })

            } else if (blockComment.style.display === 'block') {
                blockComment.style.display = 'none'
            }
        })
    }
}


function addNewLikedUser(commentRow, Array) {
    var newString = Array.join(', ');
    commentRow.setAttribute('data-likedBy', newString);
    // console.log("Here it's set ******************", commentRow);
}

export function addListenerToLike(collection, action, element) {
    for (let i = 0; i < collection.length; i++) {

        const id = parseInt(collection[i].getAttribute('data-id'))

        const upDiv = collection[i].getElementsByClassName('upDiv')[0]
        const downDiv = collection[i].getElementsByClassName('downDiv')[0]

        const imgUp = upDiv.getElementsByTagName('img')[0]
        const imgDown = downDiv.getElementsByTagName('img')[0]

        const p = upDiv.getElementsByTagName('p')[0]

        imgUp.addEventListener(action, (event) => {
            var likedByString = collection[i].getAttribute('data-likedBy')
            if (likedByString === null) likedByString = ''
            var likedByArray = likedByString.split(',').map(name => name.trim());

            var dislikedByString = collection[i].getAttribute('data-dislikedBy')
            if (dislikedByString === null) dislikedByString = ''
            var dislikedByArray = dislikedByString.split(',').map(name => name.trim());

            if (imgUp.src.includes("thumbs-up.svg")) {

                if (imgDown.src.includes("thumbs-down.svg")) {

                    likedByArray.push(app.user.nickname)

                    imgUp.src = "./static/images/thumbs-up-green.svg";

                    const countLike = parseInt(upDiv.textContent.trim()) || 0;
                    p.textContent = countLike + 1;

                    const countDislike = parseInt(downDiv.textContent.trim()) || 0;

                    console.log("id: ", id);
                    updateLike(id, countLike + 1, countDislike, likedByArray, dislikedByArray, element)
                    addNewLikedUser(collection[i], likedByArray)

                }

            } else {

                likedByArray = likedByArray.filter(name => name !== app.user.nickname);

                imgUp.src = "./static/images/thumbs-up.svg";
                const countLike = parseInt(upDiv.textContent.trim()) || 0;
                p.textContent = countLike - 1;

                const countDislike = parseInt(downDiv.textContent.trim()) || 0;

                updateLike(id, countLike - 1, countDislike, likedByArray, dislikedByArray, element)
                addNewLikedUser(collection[i], likedByArray)
            }
        });

    }
}

export function addListenerToDislike(collection, action, element) {
    for (let i = 0; i < collection.length; i++) {

        const id = parseInt(collection[i].getAttribute('data-id'))

        const divUp = collection[i].getElementsByClassName('upDiv')[0];
        const divDown = collection[i].getElementsByClassName('downDiv')[0];
        const imgUp = divUp.getElementsByTagName('img')[0];
        const imgDown = divDown.getElementsByTagName('img')[0];
        const p = divDown.getElementsByTagName('p')[0];
        imgDown.addEventListener(action, (event) => {
            var likedByString = collection[i].getAttribute('data-likedBy')
            if (likedByString === null) likedByString = ''
            var likedByArray = likedByString.split(',').map(name => name.trim());

            var dislikedByString = collection[i].getAttribute('data-dislikedBy')
            if (dislikedByString === null) dislikedByString = ''
            var dislikedByArray = dislikedByString.split(',').map(name => name.trim());

            if (imgDown.src.includes("thumbs-down.svg")) {
                if (imgUp.src.includes("thumbs-up.svg")) {

                    dislikedByArray.push(app.user.nickname)

                    imgDown.src = "./static/images/thumbs-down-green.svg";
                    const countDislike = parseInt(divDown.textContent.trim()) || 0;
                    p.textContent = countDislike + 1;

                    const countLike = parseInt(divUp.textContent.trim()) || 0;

                    updateLike(id, countLike, countDislike + 1, likedByArray, dislikedByArray, element)

                    addNewLikedUser(collection[i], dislikedByArray)

                }
            } else {
                dislikedByArray = dislikedByArray.filter(name => name !== app.user.nickname);

                imgDown.src = "./static/images/thumbs-down.svg";
                const countDislike = parseInt(divDown.textContent.trim()) || 0;
                p.textContent = countDislike - 1;

                const countLike = parseInt(divUp.textContent.trim()) || 0;

                updateLike(id, countLike, countDislike - 1, likedByArray, dislikedByArray, element)

                addNewLikedUser(collection[i], dislikedByArray);
            }
        });

    }
}

export const homePage = `<div id="home">

<div id="createPostModal" class="modal">
    <div class="createPost">
        <form id="createPostForm">
            <div class="containerFormCreatePost">
                <h1 id="createPostTitle">Create a Post</h1>
                <hr>

                <label for="psw"><b>Description:</b></label>
                <input type="text" placeholder="Enter Description" name="content" id="psw" required>


                <div class="categorieCreatePost">
                    <fieldset>
                        <legend>Choose categories</legend>
                        <div class="createPostCheckboxContainer">
                            <label>
                                <input type="checkbox" name="categorie" value="Anime">
                                Anime
                            </label>
                            <label>
                                <input type="checkbox" name="categorie" value="Manga">
                                Manga
                            </label>
                            <label>
                                <input type="checkbox" name="categorie" value="Politique">
                                Politique
                            </label>
                            <label>
                                <input type="checkbox" name="categorie" value="Sport">
                                Sport
                            </label>
                            <label>
                                <input type="checkbox" name="categorie" value="Science">
                                Science
                            </label>
                            <label>
                                <input type="checkbox" name="categorie" value="Culture">
                                Culture
                            </label>
                            <label>
                                <input type="checkbox" name="categorie" value="Gaming">
                                Gaming
                            </label>
                        </div>
                    </fieldset>
                    <p id="categorieError" style="color:red; display:none;">Please select at least one
                        category.</p>
                </div>

                <div class="fileCreatePost">
                    <label for="file-upload"><b>Choose a file:</b></label>
                    <input type="file" name="img" id="file" aria-label="File browser example">
                    <span class="file-custom"></span>
                </div>

                <button type="submit" id="createPostSubmitButton">SUBMIT</button>
            </div>
        </form>
    </div>
</div>

<div id="notifModal" class="modal">
    <div class="notifBlock">
        <div class="containerFormNotif">
            <h1 id="notifTitle">Notif Page</h1>
            <hr id="hrNotif">
            <div class="allNotif">
                <div class="notifInfo">
                    Vous avez reçu un message de JELEE!
                </div>
                <div class="notifInfo">
                    Vous avez reçu un message de JELEE!
                </div>
                <div class="notifInfo">
                    Vous avez reçu un message de JELEE!
                </div>
                <div class="notifInfo">
                    Vous avez reçu un message de JELEE!
                </div>
                <div class="notifInfo">
                    Vous avez reçu un message de JELEE!
                </div>
                <div class="notifInfo">
                    Vous avez reçu un message de JELEE!
                </div>
            </div>
        </div>
    </div>
</div>

<div id="onePostModal" class="modal">
    <div class="OnePostBlock">

        <div id="post-zone">
            <div id="comment-post-image-zone">
                <img id="comment-post-image" src="" alt="">
            </div>
            <div id="comment-post-content">
                <span id="comment-post-author"></span>
                <span id="comment-post-date"></span>
                <span id="comment-post-categories"></span>
                <span id="comment-post-text"></span>
            </div>
        </div>
        
        <form id="createCommentForm">

            <label for="inputCommentContent"><b>New comment:</b></label>
            <input type="text" id="inputCommentContent" placeholder="Enter your comment here" name="content">
            <button type="submit" id="createCommentSubmitButton">SUBMIT</button>

        </form>
    </div>
</div>

<div id="chatModal" class="modal">
    <div class="chat">
        <form id="chatForm">
            <div class="containerChatForm">
                <h1 id="createPostTitle">Chat Page</h1>
                <hr>
                <div class="chatStuff">
                    <div class="oldMessage">Here old message</div>
                    <input type="text" name="messageField" id="messageField">
                    <img src="./static/images/send.svg">
                </div>
            </div>
        </form>
    </div>
</div>

<nav>
    <div class="nav-left">
        <h1 id="titleHome">Forum</h&>
    </div>
    <div class="nav-right">
        <ul>
            <li><img class="shrink" src="./static/images/notification.svg" id="notif"></li>
            <li><img class="shrink" src="./static/images/log-out.svg" id="logoutButton"></li>
        </ul>
    </div>
</nav>

<div class="container">

    <div class="left-sidebar">
        <div id="profile">
            <img id="profilePic" src="./static/images/user-alt.svg">
            <p id="profileName"></p>
        </div>
        <button id="createPostButton">Create post</button>
    </div>


    <div class="main-content"></div>


    <div class="right-sidebar">

        <div class="chat-content">

            <div class="sidebarTitle">
                <h4>Messages</h4>
            </div>

            <div class="onlineList shrink user">
                <div class="online">
                    <img src="./static/images/user-alt.svg">
                </div>
                <p>Tanaka Aiko</p>
            </div>

            <div class="onlineList shrink user">
                <div class="online">
                    <img src="./static/images/user-alt.svg">
                </div>
                <p>JELEE</p>
            </div>

            <div class="onlineList shrink user">
                <div class="online">
                    <img src="./static/images/user-alt.svg">
                </div>
                <p>Uchiwa Itachi</p>
            </div>

        </div>
    </div>
</div>

</div>`