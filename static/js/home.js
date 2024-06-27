import { app } from "./constants.js";
import { getCookieValue } from "./tools.js";

export async function setHome() {
    var logoutButton = document.getElementById("logoutButton")
    logoutButton?.addEventListener("click", (event) => {
        event.preventDefault()
        const sessionId = getCookieValue("sessionID")

        if (app.ws && sessionId) {
            app.ws.send(JSON.stringify({ action: "logout", data: sessionId }));
        } else {
            console.error("WebSocket is not initialized or sessionID is null.");
        }
    })
}