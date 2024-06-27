import { setPage } from "./setPage.js";
import { loginRegisterPage} from "./constants.js";

export function onMessage(event) {
    const msg = JSON.parse(event.data);
    console.log('Message from server:', msg);

    switch (msg.action) {
        case 'reply':
            console.log('Server replied (', msg.action, '): ', msg.data);
            break;
        case 'logout':
            console.log('Server replied (', msg.action, '): ', msg.data);
            if (msg.data !== "error") {
                deleteCookie("sessionID")
                setPage(loginRegisterPage)
            }

            break;
        default:
            console.log('Unknown action:', msg.action);
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