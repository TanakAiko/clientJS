import { setHomePage } from "./setPage.js";
import { onClose, onOpen, onError, onMessage } from "./tools.js";
import { getwayURL, wsURL, app } from "./constants.js";

export async function setLoginRegister() {
    var registerFormID = document.getElementById("registerFormID")
    registerFormID?.addEventListener("submit", async (event) => {
        event.preventDefault()
        const urlRegister = `${getwayURL}/register`
        const data = getDataForm(registerFormID)
        data.age = strToInt(data.age)

        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            };
            const response = await fetch(urlRegister, requestOptions)

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const result = await response.json()
            console.log(result);
        } catch (error) {
            console.error(`Error while sending data`, error);
        }

        toggleForms()

    })

    var loginFormID = document.getElementById("loginFormID")
    loginFormID?.addEventListener("submit", async (event) => {
        event.preventDefault()
        const urlLogin = `${getwayURL}/login`
        const data = getDataForm(loginFormID)

        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            };
            const response = await fetch(urlLogin, requestOptions)

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const result = await response.json()
            console.log(result);

            setHomePage()
            
            app.ws = new WebSocket(wsURL);

            app.ws.onopen = onOpen

            app.ws.onmessage = onMessage

            app.ws.onerror = onError

            app.ws.onclose = onClose

        } catch (error) {
            console.error(error);
        }
    })

    var linkGotoLogin = document.getElementById("goToLogin")
    linkGotoLogin?.addEventListener("click", (event) => {
        event.preventDefault()
        toggleForms()
    })

    var linkGotoRegister = document.getElementById("goToRegister")
    linkGotoRegister?.addEventListener("click", (event) => {
        event.preventDefault()
        toggleForms()
    })
}

function toggleForms() {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    if (loginForm.style.display === "none") {
        loginForm.classList.remove('fade-out');
        loginForm.classList.add('fade-in');
        registerForm.classList.remove('fade-in');
        registerForm.classList.add('fade-out');
        setTimeout(function () {
            loginForm.style.display = "block";
            registerForm.style.display = "none";
        }, 500);
    } else {
        loginForm.classList.remove('fade-in');
        loginForm.classList.add('fade-out');
        registerForm.classList.remove('fade-out');
        registerForm.classList.add('fade-in');
        setTimeout(function () {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
        }, 500);
    }
}

function getDataForm(form) {
    const dataForm = new FormData(form)
    var data = Object.fromEntries(dataForm.entries())
    return data
}

function strToInt(str) {
    var num = Number(str)
    return parseInt(num, 10)
}