import { setHomePage, setLoginRegisterPage } from "./setPage.js";
import { getwayURL, wsURL, app } from "./constants.js";
import { getCookieValue, onClose, onOpen, onError, onMessage } from "./tools.js";

document.addEventListener("DOMContentLoaded", async function () {
    const sessionId = getCookieValue("sessionID")
    console.log("sessionId: ", sessionId);
    if (sessionId) {
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
            const result = await response.json()
            console.log(result)
            if (response.status === 202) {
                app.ws = new WebSocket(wsURL);
                
                setHomePage()
                console.log("Here log setHome");
                
                app.ws.onopen = onOpen

                app.ws.onmessage = onMessage

                app.ws.onerror = onError

                app.ws.onclose = onClose
            }
        } catch (error) {
            console.error(`Error while sending data`, error);
        }
    } else {
        setLoginRegisterPage()
        console.log("Here log setLoginRegister");

        console.log("no cookie named 'sessionID'");
    }

})
