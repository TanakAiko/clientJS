import { app } from "./constants.js";
import { getCookieValue } from "./tools.js";

export async function setHome() {
    const modalCreatePost = document.getElementById('createPostModal');
    const categorieError = document.getElementById('categorieError');
    const modalNotif = document.getElementById('notifModal');
    var postRow = document.getElementsByClassName('postRow');

    addListenerToLike(postRow, 'click')

    addListenerToDislike(postRow, 'click')

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
        if (event.target === modalCreatePost || event.target === modalNotif) {
            closeModal();
        }
    }

    initPage();


    function openNotifModal() {
        modalNotif.style.display = "block";
    }

    function openCreatePostModal() {
        modalCreatePost.style.display = 'block';
    }

    function closeModal() {
        modalCreatePost.style.display = 'none';
        modalNotif.style.display = 'none';
    }

    function initPage() {
        const profileName = document.getElementById('profileName')
        profileName.textContent = app.user.nickname

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

            const data = getDataForm(createPostForm)


            data.img = await processFile(data.img)

            console.log(data);
            app.ws.send(JSON.stringify({ action: "postCreate", data: JSON.stringify(data) }));
        })

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
        console.log(base64data);
        return base64data
    }


    function getDataForm(form) {
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

    async function submitPost(event) {

    }

}

function addListenerToLike(collection, action) {
    for (let i = 0; i < collection.length; i++) {

        const upDiv = collection[i].getElementsByClassName('upDiv')[0]
        const downDiv = collection[i].getElementsByClassName('downDiv')[0]


        const imgUp = upDiv.getElementsByTagName('img')[0]
        const imgDown = downDiv.getElementsByTagName('img')[0]

        const p = upDiv.getElementsByTagName('p')[0]
        imgUp.addEventListener(action, (event) => {
            if (imgUp.src.includes("thumbs-up.svg")) {

                if (imgDown.src.includes("thumbs-down.svg")) {
                    imgUp.src = "./static/images/thumbs-up-green.svg";
                    const count = parseInt(upDiv.textContent.trim()) || 0;
                    p.textContent = count + 1;
                }

            } else {
                imgUp.src = "./static/images/thumbs-up.svg";
                const count = parseInt(upDiv.textContent.trim()) || 0;
                p.textContent = count - 1;
            }
        });

    }
}

function addListenerToDislike(collection, action) {
    for (let i = 0; i < collection.length; i++) {
        const divUp = collection[i].getElementsByClassName('upDiv')[0];
        const divDown = collection[i].getElementsByClassName('downDiv')[0];
        const imgUp = divUp.getElementsByTagName('img')[0];
        const imgDown = divDown.getElementsByTagName('img')[0];
        const p = divDown.getElementsByTagName('p')[0];
        imgDown.addEventListener(action, (event) => {
            if (imgDown.src.includes("thumbs-down.svg")) {
                if (imgUp.src.includes("thumbs-up.svg")) {
                    imgDown.src = "./static/images/thumbs-down-green.svg";
                    const count = parseInt(divDown.textContent.trim()) || 0;
                    p.textContent = count + 1;
                }
            } else {
                imgDown.src = "./static/images/thumbs-down.svg";
                const count = parseInt(divDown.textContent.trim()) || 0;
                p.textContent = count - 1;
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


                <div class="main-content">

                    <!-- ***************************************************************** -->

                    <div class="post-container">
                        <div class="user-prfile">
                            <img src="./static/images/user-alt.svg">
                            <div>
                                <p>Uchiwa Itachi</p>
                                <span>November 09 2025, 10:09 am</span>
                            </div>
                        </div>

                        <div class="postCategories">Here are the categories</div>

                        <p class="postText">Red moon, run</p>

                        <img src="./static/images/posts/Itachi.jpg" class="postImage">

                        <div class="postRow">
                            <div class="upDiv"> <img data-count="1403" class="shrink up"
                                    src="./static/images/thumbs-up.svg">
                                <p>1403</p>
                            </div>
                            <div class="downDiv"> <img class="shrink down" src="./static/images/thumbs-down-green.svg">
                                <p>102</p>
                            </div>
                            <div> <img class="shrink" src="./static/images/comments-regular.svg">1315</div>
                        </div>
                    </div>

                    <!-- ***************************************************************** -->

                    <div class="post-container">
                        <div class="user-prfile">
                            <img src="./static/images/user-alt.svg">
                            <div>
                                <p>JELEE</p>
                                <span>October 29 2025, 6:53 am</span>
                            </div>
                        </div>

                        <div class="postCategories">Here are the categories</div>

                        <p class="postText">Who is this bg !!!</p>

                        <img src="./static/images/posts/JELEE.png" class="postImage">

                        <div class="postRow">
                            <div class="upDiv"><img class="shrink up" src="./static/images/thumbs-up-green.svg">
                                <p>925</p>
                            </div>
                            <div class="downDiv"> <img class="shrink down" src="./static/images/thumbs-down.svg">
                                <p>456</p>
                            </div>
                            <div> <img class="shrink" src="./static/images/comments-regular.svg"> 355</div>
                        </div>
                    </div>

                    <!-- ***************************************************************** -->

                    <div class="post-container">
                        <div class="user-prfile">
                            <img src="./static/images/user-alt.svg">
                            <div>
                                <p>Tanaka Aiko</p>
                                <span>June 18 2025, 6:03 pm</span>
                            </div>
                        </div>

                        <div class="postCategories">Here are the categories</div>

                        <p class="postText">I'm good, it seems.</p>

                        <img src="./static/images/posts/TanakAiko.jpeg" class="postImage">

                        <div class="postRow">
                            <div class="upDiv"> <img class="shrink up" src="./static/images/thumbs-up-green.svg">
                                <p>121</p>
                            </div>
                            <div class="downDiv"> <img class="shrink down" src="./static/images/thumbs-down.svg">
                                <p>32</p>
                            </div>
                            <div> <img class="shrink" src="./static/images/comments-regular.svg"> 39</div>
                        </div>
                    </div>

                    <!-- ***************************************************************** -->

                    <div class="post-container">
                        <div class="user-prfile">
                            <img src="./static/images/user-alt.svg">
                            <div>
                                <p>Amiya</p>
                                <span>February 21 2025, 12:40 pm</span>
                            </div>
                        </div>

                        <div class="postCategories">Here are the categories</div>

                        <p class="postText">I'm sorry. I would save this city.</p>

                        <img src="./static/images/posts/Amiya.jpg" class="postImage">

                        <div class="postRow">
                            <div class="upDiv"> <img class="shrink up" src="./static/images/thumbs-up.svg">
                                <p>21</p>
                            </div>
                            <div class="downDiv"> <img class="shrink down" src="./static/images/thumbs-down.svg">
                                <p>0</p>
                            </div>
                            <div> <img class="shrink" src="./static/images/comments-regular.svg"> 2</div>
                        </div>
                    </div>

                </div>


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