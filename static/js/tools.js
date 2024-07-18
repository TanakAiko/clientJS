import { setLoginRegisterPage } from "./setPage.js";
import { app, getwayURL } from "./constants.js";
import { Post } from "./post.js";
import { Comment } from "./comment.js";
import { UserBlock } from "./userBlock.js";
import { addListenerToDislike, addListenerToLike, addListenerToComment, addListenerToUser } from "./home.js";

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

        case 'updatePostLike':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            break;

        case 'sendNewPostLikes':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            sendNewLikes(msg.data, 'post')
            break

        case 'commentCreate':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            /* updateNbrComment(msg.data) */
            break

        case 'updateLastComment':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            updateLastComment(msg.data)
            break

        case 'updateCommentLike':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            break

        case 'sendNewCommentLikes':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            sendNewLikes(msg.data, 'comment')
            break

        case 'getAllUser':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            setAllUser(msg.data, 'yes')
            break

        case 'sendNewUsertoAll':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            setAllUser(msg.data, 'non')
            break

        case 'messageCreate':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            console.log('Server replied (', msg.action, '): ', msg.data);
            break

        case 'newMessage':
            if (msg.data === "error") {
                console.log('Server replied (', msg.action, '): ', msg.data);
                return
            }
            console.log('Server replied (', msg.action, '): ', msg.data);
            break

        default:
            console.log('Unknown action:', msg.action);
    }
}

function setAllUser(jsonData, neww) {
    if (neww === 'yes') app.ws.send(JSON.stringify({ action: "sendNewUsertoAll" }));

    var newContent = ''
    var tabUser = JSON.parse(jsonData)

    console.log("tabUser: ", tabUser);

    if (!tabUser) return

    console.log("app.user: ", app.user);

    for (const user of tabUser) {
        const userBlockU = UserBlock.fromObject(user)
        if (userBlockU.nickname === app.user.nickname) continue;
        newContent += userBlockU.getHtml()
    }

    const allUserDiv = document.getElementById('User-view')
    allUserDiv.innerHTML = newContent

    addListenerToUser()
}

async function updateLastComment(jsonData) {
    const comment = Comment.fromObject(JSON.parse(jsonData))

    console.log('comment: ', comment);

    const post = document.getElementById(`${comment.postId}`)
    const commentContainer = post.getElementsByClassName('commentContainer')[0]

    commentContainer.insertAdjacentHTML('afterbegin', comment.getHtml())

    const commentHTML = document.getElementById(`${comment.id}-comment`)
    const commentRow = commentHTML.getElementsByClassName('commentRow')

    if (commentRow.length === 0) return;

    initThumbs(commentRow, app.user.nickname)

    addListenerToLike(commentRow, 'click', 'comment')

    addListenerToDislike(commentRow, 'click', 'comment')

    updateNbrComment(comment.postId)
}

function sendNewLikes(data, action) {
    const elementData = JSON.parse(data)
    var element
    if (action === 'post') {
        element = document.getElementById(elementData.postID).getElementsByClassName('postRow')[0]
    } else if (action === 'comment') {
        element = document.getElementById(`${elementData.commentID}-comment`).getElementsByClassName('commentRow')[0]
    }

    const upDiv = element.getElementsByClassName('upDiv')[0];
    const downDiv = element.getElementsByClassName('downDiv')[0];

    const upP = upDiv.getElementsByTagName('p')[0];
    const downP = downDiv.getElementsByTagName('p')[0];

    var newLikedByString = elementData.likedBy.join(', ');
    element.setAttribute('data-likedBy', newLikedByString);

    var newDislikedByString = elementData.dislikedBy.join(', ');
    element.setAttribute('data-dislikedBy', newDislikedByString);

    upP.textContent = elementData.nbrLike
    downP.textContent = elementData.nbrDislike
}

async function updateNbrComment(postId) {
    const post = document.getElementById(postId)
    const commentDiv = post.getElementsByClassName('postRow')[0].getElementsByClassName('commentDiv')[0]
    const p = commentDiv.getElementsByTagName('p')[0];

    const countComment = parseInt(commentDiv.textContent.trim()) || 0;
    p.textContent = countComment + 1;
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
        item.comments,
        item.createAt
    ));


    for (const post of posts) {
        var commentsContent = ""
        var tabComments
        var nbrComment = 0
        console.log('post: ', post);
        if (post.comments !== 'null') {
            tabComments = JSON.parse(post.comments)
            const comments = tabComments.map(item => new Comment(
                item.commentID,
                item.postID,
                item.userID,
                item.nickname,
                item.likedBy,
                item.dislikedBy,
                item.content,
                item.nbrLike,
                item.nbrDislike,
                item.createAt
            ));
            nbrComment = comments.length;

            for (const comment of comments) {
                commentsContent += comment.getHtml()
            }
        }

        newContent += post.getHtml(`data:image/jpeg;base64,${post.imgBase64}`, nbrComment, commentsContent)
    }
    mainContainer.insertAdjacentHTML('afterbegin', newContent)

    var postRow = document.getElementsByClassName('postRow');
    var commentRow = document.getElementsByClassName('commentRow');

    initThumbs(postRow, app.user.nickname)

    addListenerToLike(postRow, 'click', 'post')

    addListenerToDislike(postRow, 'click', 'post')

    addListenerToComment(postRow, 'click')

    if (commentRow.length === 0) return;

    initThumbs(commentRow, app.user.nickname)

    addListenerToLike(commentRow, 'click', 'comment')

    addListenerToDislike(commentRow, 'click', 'comment')
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
        item.comments,
        item.createAt
    ));


    for (const post of posts) {
        console.log('post: ', post);
        var commentsContent = ""
        var tabComments
        var nbrComment = 0
        if (post.comments !== 'null') {
            tabComments = JSON.parse(post.comments)
            const comments = tabComments.map(item => new Comment(
                item.commentID,
                item.postID,
                item.userID,
                item.nickname,
                item.likedBy,
                item.dislikedBy,
                item.content,
                item.nbrLike,
                item.nbrDislike,
                item.createAt
            ));
            nbrComment = comments.length;

            for (const comment of comments) {
                commentsContent += comment.getHtml()
            }
        }

        newContent += post.getHtml(`data:image/jpeg;base64,${post.imgBase64}`, nbrComment, commentsContent)
    }
    mainContainer.insertAdjacentHTML('afterbegin', newContent)

    var postRow = document.getElementsByClassName('postRow');

    console.log("app.user.nickname: ", app.user.nickname);

    var newCollectionPost = new Array();
    if (postRow.length > 0) {
        var firstElement = postRow.item(0);
        newCollectionPost.push(firstElement);
    }


    /* var commentRow = document.getElementsByClassName('commentRow');
    var newCollectionComment = new Array();
    if (postRow.length > 0) {
        var firstElement = commentRow.item(0);
        newCollectionComment.push(firstElement);
    } */

    initThumbs(newCollectionPost, app.user.nickname)

    addListenerToLike(newCollectionPost, 'click', 'post')

    addListenerToDislike(newCollectionPost, 'click', 'post')

    addListenerToComment(newCollectionPost, 'click')

    /* initThumbs(newCollectionComment, app.user.nickname)

    addListenerToLike(newCollectionComment, 'click', 'comment')

    addListenerToDislike(newCollectionComment, 'click', 'comment') */

}

export function initThumbs(collection, userNickname) {
    for (let i = 0; i < collection.length; i++) {
        const upDiv = collection[i].getElementsByClassName('upDiv')[0]
        const downDiv = collection[i].getElementsByClassName('downDiv')[0]


        const imgUp = upDiv.getElementsByTagName('img')[0]
        const imgDown = downDiv.getElementsByTagName('img')[0]

        var likedByString = collection[i].getAttribute('data-likedBy')
        if (likedByString !== null) {
            var likedByArray = likedByString.split(',').map(name => name.trim());

            if (likedByArray.includes(userNickname)) {
                imgUp.src = "./static/images/thumbs-up-green.svg";
                // console.log("imgUp.src = green");
            } else {
                imgUp.src = "./static/images/thumbs-up.svg";
                // console.log("imgUp.src = void");
            }
        }

        var dislikedByString = collection[i].getAttribute('data-dislikedBy')

        if (dislikedByString !== null) {
            var dislikedByArray = dislikedByString.split(',').map(name => name.trim());

            if (dislikedByArray.includes(userNickname)) {
                imgDown.src = "./static/images/thumbs-down-green.svg";
                // console.log("imgDown.src = green");
            } else {
                imgDown.src = "./static/images/thumbs-down.svg";
                // console.log("imgDown.src = void");
            }
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
    app.ws.send(JSON.stringify({ action: "removeMyself" }));
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

export function strToInt(str) {
    var num = Number(str)
    return parseInt(num, 10)
}