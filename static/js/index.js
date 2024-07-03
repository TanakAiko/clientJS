import { getCookieValue, onClose, onOpen, onError, onMessage, testSession, getUserData } from "./tools.js";
import { setHomePage, setLoginRegisterPage } from "./setPage.js";
import { wsURL, app } from "./constants.js";

document.addEventListener("DOMContentLoaded", async function () {
    const sessionId = getCookieValue("sessionID")
    console.log("sessionId: ", sessionId);
    if (sessionId) {
        const response = await testSession(sessionId)
        if (response !== 0) {
            const userData = await getUserData(sessionId)
            if (userData !== 0) {
                console.log("GetUserData (new) : ", userData);
                app.user = userData

                // await new Promise((resolve) => {
                    app.ws = new WebSocket(wsURL);
                //     resolve();                   
                // })
                
                setHomePage()

                app.ws.onopen = onOpen

                app.ws.onmessage = onMessage

                app.ws.onerror = onError

                app.ws.onclose = onClose
            }
        }
    } else {
        setLoginRegisterPage()
        console.log("no cookie named 'sessionID'");
    }
})
