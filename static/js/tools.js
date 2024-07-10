import { setLoginRegisterPage } from "./setPage.js";
import { app, getwayURL } from "./constants.js";
import { Post } from "./post.js";
import { addListenerToDislike, addListenerToLike, addListenerToComment } from "./home.js";

export function onMessage(event) {
    const msg = JSON.parse(event.data);
    switch (msg.action) {
        case 'reply':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            break;
        case 'logout':
            console.log('Server replied (', msg.action, '): ', msg.data);
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            deleteCookie("sessionID")
            setLoginRegisterPage()
            break;
        case 'postCreate':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            } break;
        case 'getAllPost':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            updatePost(msg.data)
            break;

        case 'updatePosts':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            updateLastPost(msg.data)
            break

        case 'updateLike':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            break;

        case 'sendNewLikes':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            sendNewLikes(msg.data)
            break

        default:
            console.log('Unknown action:', msg.action);
    }
}

function sendNewLikes(data) {
    const postData = JSON.parse(data)

    const post = document.getElementById(postData.postID).getElementsByClassName('postRow')[0]

    const upDiv = post.getElementsByClassName('upDiv')[0];
    const downDiv = post.getElementsByClassName('downDiv')[0];

    const upP = upDiv.getElementsByTagName('p')[0];
    const downP = downDiv.getElementsByTagName('p')[0];

    var newLikedByString = postData.likedBy.join(', ');
    post.setAttribute('data-likedBy', newLikedByString);

    var newDislikedByString = postData.dislikedBy.join(', ');
    post.setAttribute('data-dislikedBy', newDislikedByString);

    upP.textContent = postData.nbrLike
    downP.textContent = postData.nbrDislike
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
        item.likedBy,
        item.dislikedBy,
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

    console.log("app.user.nickname: ", app.user.nickname);

    initThumbs(postRow, app.user.nickname)

    addListenerToLike(postRow, 'click')

    addListenerToDislike(postRow, 'click')

    addListenerToComment(postRow, 'click')
}

async function updateLastPost(jsonData) {
    const mainContainer = document.getElementsByClassName('main-content')[0]
    var newContent = ""

    const tabData = JSON.parse(jsonData)

    const posts = tabData.map(item => new Post(
        item.postID,
        item.userID,
        item.nickname,
        item.categorie,
        item.likedBy,
        item.dislikedBy,
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

    console.log("app.user.nickname: ", app.user.nickname);

    var newCollection = new Array();
    if (postRow.length > 0) {
        var firstElement = postRow.item(0);
        newCollection.push(firstElement);
    }

    initThumbs(newCollection, app.user.nickname)

    addListenerToLike(newCollection, 'click')

    addListenerToDislike(newCollection, 'click')

    addListenerToComment(newCollection, 'click')
}

function initThumbs(collection, userNickname) {
    for (let i = 0; i < collection.length; i++) {
        const upDiv = collection[i].getElementsByClassName('upDiv')[0]
        const downDiv = collection[i].getElementsByClassName('downDiv')[0]


        const imgUp = upDiv.getElementsByTagName('img')[0]
        const imgDown = downDiv.getElementsByTagName('img')[0]

        var likedByString = collection[i].getAttribute('data-likedBy')
        var likedByArray = likedByString.split(',').map(name => name.trim());
        if (likedByArray.includes(userNickname)) {
            imgUp.src = "./static/images/thumbs-up-green.svg";
        } else {
            imgUp.src = "./static/images/thumbs-up.svg";
        }

        var dislikedByString = collection[i].getAttribute('data-dislikedBy')
        var dislikedByArray = dislikedByString.split(',').map(name => name.trim());
        if (dislikedByArray.includes(userNickname)) {
            imgDown.src = "./static/images/thumbs-down-green.svg";
        } else {
            imgDown.src = "./static/images/thumbs-down.svg";
        }
    }
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
        console.log("response.status: ", response.status)

        /* if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        } */

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
