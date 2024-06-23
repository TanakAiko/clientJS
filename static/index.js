var ws

document.addEventListener("DOMContentLoaded", async function () {
    const sessionId = getCookieValue("sessionID")
    console.log("sessionId: ", sessionId);
    if (sessionId) {
        const urlAuthorized = 'http://localhost:8080/authorized'
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
                ws = new WebSocket("ws://localhost:8080/ws");

                ws.onopen = function () {
                    console.log("Connection is open...");
                };
            }
        } catch (error) {
            console.error(`Error while sending data`, error);
        }
    } else console.log("no cookie named 'sessionID'");

})

console.log("AAAAA");

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

var registerFormID = document.getElementById("registerFormID")
registerFormID.addEventListener("submit", async (event) => {
    event.preventDefault()
    const urlRegister = 'http://localhost:8080/register'
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
loginFormID.addEventListener("submit", async (event) => {
    event.preventDefault()
    urlLogin = 'http://localhost:8080/login'
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

        ws = new WebSocket("ws://localhost:8080/ws");

        ws.onopen = function () {
            console.log("Connection is open...");
        };

        ws.onmessage = onMessage

        ws.onerror = onError

        ws.onclose = function () {
            console.log("Connection closed !!!");
        };

    } catch (error) {
        console.error(error);
    }
})

//********************************************************************************************************************** */

var logoutButton = document.getElementById("logoutButton")
logoutButton.addEventListener("click", (event) => {
    event.preventDefault()
    sessionId = getCookieValue("sessionID")

    if (ws && sessionId) {
        ws.send(JSON.stringify({ action: "logout", data: sessionId }));
    } else {
        console.error("WebSocket is not initialized or sessionID is null.");
    }
})

//********************************************************************************************************************** */

function onMessage(event) {
    const msg = JSON.parse(event.data);
    console.log('Message from server:', msg);

    switch (msg.action) {
        case 'reply':
            console.log('Server replied (', msg.action, '): ', msg.data);
            break;
        case 'logout':
            console.log('Server replied (', msg.action, '): ', msg.data);
            deleteCookie("sessionID")
            break;
        default:
            console.log('Unknown action:', msg.action);
    }
}

function onError(error) {
    console.error('WebSocket error:', error);
}

//********************************************************************************************************************** */

function getDataForm(form) {
    const dataForm = new FormData(form)
    var data = Object.fromEntries(dataForm.entries())
    return data
}

function strToInt(str) {
    num = Number(str)
    return parseInt(num, 10)
}

function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}