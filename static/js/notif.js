import { formatDate } from "./tools.js";

export class Notif {
    constructor(message, createAt){
        this.message = message
        this.createAt = createAt
    }

    getHtml(){
        return `
            <div class="notifInfo">
                <span>${formatDate(this.createAt)}</span>
                <p>${this.message}</p>
            </div>
        `
    }
}
