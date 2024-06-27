export var app = {
    ws: null
}
export const getwayURL = "http://localhost:8080"
export const wsURL = "ws://localhost:8080/ws"

export const loginRegisterPage = `<div class="title">
    <h1>Welcome to our <br> Real Time Forum</h1>
</div>
<div class="container">
    <!-- Login Form -->
    <div id="loginForm" class="form-container">
        <h2>Login</h2>
        <form id="loginFormID">
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
        <p>Don't have an account? <a id="goToRegister">Register</a></p>
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
                <input type="number" id="age" name="age" required>
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
                <input type="password" id="passwordRegister" name="password" required>
            </div>
            <button id="registerButton" type="submit">Register</button>
        </form>
        <p>Already have an account? <a id="goToLogin">Login</a></p>
    </div>
</div>`

export const homePage = `<button id="logoutButton" type="submit">Logout</button>
`