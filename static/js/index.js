import { getCookieValue, onClose, onOpen, onError, onMessage, testSession, getUserData } from "./tools.js";
import { setHomePage, setLoginRegisterPage } from "./setPage.js";
import { wsURL, app } from "./constants.js";

document.addEventListener("DOMContentLoaded", async function () {
    const sessionId = getCookieValue("sessionID")
    if (sessionId) {
        const response = await testSession(sessionId)
        if (response !== 0) {
            const userData = await getUserData(sessionId)
            if (userData !== 0) {
                app.user = userData

                await new Promise((resolve, reject) => {
                    app.ws = new WebSocket(wsURL);
                    app.ws.onopen = () => {
                        console.log("Connection is open...");
                        resolve();
                    }
                    app.ws.onerror = (error) => {
                        console.error('WebSocket error:', error);
                        reject();
                    }
                })

                setHomePage()

                app.ws.onopen = onOpen

                app.ws.onmessage = onMessage

                app.ws.onerror = onError

                app.ws.onclose = onClose
            }
        }
    } else {
        setLoginRegisterPage()
    }
})
