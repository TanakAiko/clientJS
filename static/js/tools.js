import { setLoginRegisterPage } from "./setPage.js";
import { getwayURL } from "./constants.js";
import { Post } from "./post.js";

export function onMessage(event) {
    const msg = JSON.parse(event.data);
    console.log('Message from server:', msg);
    if (msg.data === "error") return
    switch (msg.action) {
        case 'reply':
            console.log('Server replied (', msg.action, '): ', msg.data);
            break;
        case 'logout':
            console.log('Server replied (', msg.action, '): ', msg.data);
            deleteCookie("sessionID")
            setLoginRegisterPage()
            break;
        case 'postCreate':
            console.log('Server replied (', msg.action, '): ', msg.data);
            break;
        case 'getAllPost':
            //console.log('Server replied (', msg.action, '): ', msg.data);
            updatePost(msg.data)
            break;

        case 'updatePosts':
            updatePost(msg.data)
            break
        default:
            console.log('Unknown action:', msg.action);
    }
}

async function updatePost(jsonData) {
    const mainContainer = document.getElementsByClassName('main-content')[0]
    var newContent = ""

    const tabData = JSON.parse(jsonData)

    const posts = tabData.map(item => new Post(
        item.postID,
        item.userID,
        item.nickname,
        item.categorie,
        item.content,
        item.img,
        item.imgBase64,
        item.nbrLike,
        item.nbrDislike,
        item.createAt
    ));


    for (const post of posts) {
        newContent += post.getHtml(`data:image/jpeg;base64,${post.imgBase64}`)
    }
    mainContainer.insertAdjacentHTML('afterbegin', newContent)

    var postRow = document.getElementsByClassName('postRow');

    addListenerToLike(postRow, 'click')

    addListenerToDislike(postRow, 'click')

    console.log("\n\n The posts: ", posts);
}

export function onError(error) {
    console.error('WebSocket error:', error);
}

export function onOpen() {
    console.log("Connection is open...");
}

export function onClose() {
    console.log("Connection closed !!!");
}

export function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function testSession(sessionId) {
    const urlAuthorized = `${getwayURL}/authorized`
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionID: sessionId }),
            credentials: 'include',
        };
        const response = await fetch(urlAuthorized, requestOptions)

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        if (response.status === 202) {
            const resp = await response.json()
            console.log(resp)
            return resp
        } else return 0
    } catch (error) {
        console.error(`Error while sending data`, error);
    }
}

export async function getUserData(sessionId) {
    const urlAuthorized = `${getwayURL}/getUserData `
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionID: sessionId }),
            credentials: 'include',
        };
        const response = await fetch(urlAuthorized, requestOptions)

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        if (response.status === 200) {
            const userData = await response.json()
            return userData
        } else return 0
    } catch (error) {
        console.error(`Error while sending data`, error);
    }
}


export function addListenerToLike(collection, action) {
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

export function addListenerToDislike(collection, action) {
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