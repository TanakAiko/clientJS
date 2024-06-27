import { homePage, loginRegisterPage } from "./constants.js";
import { setHome } from "./home.js";
import { setLoginRegister } from "./loginRegister.js";


export function setHomePage() {
    var app = document.getElementById("app")
    app.innerHTML = homePage
    setHome()
    //history.pushState(null, "", "home")
}

export function setLoginRegisterPage() {
    var app = document.getElementById("app")
    app.innerHTML = loginRegisterPage
    setLoginRegister()
    //history.pushState(null, "", "auth")
}