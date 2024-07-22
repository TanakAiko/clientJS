import { setHomePage } from "./setPage.js";
import { onClose, onOpen, onError, onMessage, strToInt } from "./tools.js";
import { getwayURL, wsURL, app } from "./constants.js";

export async function setLoginRegister() {
    const registerFormID = document.getElementById("registerFormID")
    registerFormID?.addEventListener("submit", async (event) => {
        event.preventDefault()
        const urlRegister = `${getwayURL}/register`
        const data = getDataForm(registerFormID, 'register')
        if (data === 'error') {
            return
        }

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
        } catch (error) {
            console.error(`Error while register: `, error);
        }

        toggleForms()

    })

    const loginFormID = document.getElementById("loginFormID")
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
                createPopup('Username or Password incorrect.')
                throw new Error(`HTTP error status: ${response.status}`);
            }
            const result = await response.json()
            app.user = result

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

        } catch (error) {
            console.error(`Error while login: `, error);
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

export const loginRegisterPage = `<div id="loginRegister">

    <div id="welcomText">
        <h1>Welcome to our <br> Real Time Forum</h1>
    </div>
    <div class="container">

        <!-- Login Form -->
        <div id="loginForm" class="form-container">
            <h2>Login</h2>

            
            <form id="loginFormID">
                <p id="loginError" style="color:red; display:none;">Username or Password incorrect.</p>
                <div class="form-group">
                    <label for="email_username">E-mail or Username</label>
                    <input type="text" id="email_username" name="identifier" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="passwordLogin" name="password" required>
                </div>
                <button id="loginButton" type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="" id="goToRegister">Register</a></p>
        </div>

        <!-- Register Form -->
        <div id="registerForm" class="form-container" style="display: none;">
            <h2>Register</h2>
            <form id="registerFormID">
                <div class="form-group">
                    <label for="nickname">Nickname</label>
                    <input type="text" id="nickname" name="nickname" required>
                </div>
                <div class="form-group">
                    <label for="age">Age</label>
                    <input type="number" id="age" name="age" required min="7" max="100">
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" name="gender" required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" id="first_name" name="firstName" required>
                </div>
                <div class="form-group">
                    <label for="last_name">Last Name</label>
                    <input type="text" id="last_name" name="lastName" required>
                </div>
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="passwordRegister" name="password" required minlength="4">
                </div>
                <button id="registerButton" type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="" id="goToLogin">Login</a></p>
        </div>

    </div>

</div>`

function toggleForms() {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    if (loginForm.style.display === "none") {
        const registerFormID = document.getElementById('registerFormID')
        loginForm.classList.remove('fade-out');
        loginForm.classList.add('fade-in');
        registerForm.classList.remove('fade-in');
        registerForm.classList.add('fade-out');
        setTimeout(function () {
            loginForm.style.display = "block";
            registerForm.style.display = "none";
            registerFormID.reset();
        }, 500);
    } else {
        const loginFormID = document.getElementById('loginFormID')
        loginForm.classList.remove('fade-in');
        loginForm.classList.add('fade-out');
        registerForm.classList.remove('fade-out');
        registerForm.classList.add('fade-in');
        setTimeout(function () {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
            loginFormID.reset();
        }, 500);
    }
}

function getDataForm(form, action) {
    const dataForm = new FormData(form)
    var data = Object.fromEntries(dataForm.entries())

    if (action === 'register') {
        if (7 > data.age && data.age > 100) {
            createPopup(`The age selected is not valid`)
            return 'error'
        }
    
        if (data.password.length < 4) {
            createPopup(`The password is too short`)
            return 'error'
        }
    
        if (!validateEmail(data.email)) {
            createPopup(`The email is not valid`)
            return 'error'
        }
    }

    return data
}

function validateEmail(email) {
    // Expression régulière pour valider une adresse e-mail
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function createPopup(text) {
    let el = document.createElement('div');
    el.classList.add('popup');
    el.innerHTML = text;
    document.body.appendChild(el);
    setTimeout(() => {
      el.remove();
    },5000);
  }