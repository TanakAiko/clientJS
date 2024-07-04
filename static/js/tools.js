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
