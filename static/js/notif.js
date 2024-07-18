export class Notif {
    constructor(message){
        this.message = message
    }

    getHtml(){
        return `
            <div class="notifInfo">
               ${this.message}
            </div>
        `
    }
}