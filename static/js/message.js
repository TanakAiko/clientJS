    import { formatDate } from "./tools.js";

export class Message {
    constructor(messageID, senderID, receiverID, content, statusReceived, statusRead, createAT, status){
        this.messageID = messageID
        this.senderID = senderID
        this.receiverID = receiverID
        this.content = content
        this.statusReceived = statusReceived
        this.statusRead = statusRead
        this.createAT = createAT
        this.status = status
    }

    getHtml(nicknameSender) {
        return `
            <div class="${this.status}" id="${this.messageID}-message" data-idSender="${this.senderID}" data-idReceiver="${this.receiverID}" data-statusReceived="${this.statusReceived}" data-statusRead="${this.statusRead}">
                <div class="user-prfile">
                    <img src="${this.status === "receive" ? "./static/images/user-alt-receive.svg" : "./static/images/user-alt-send.svg"}">
                    <div>
                        <p class="senderNickname">${nicknameSender}</p>
                        <span>${formatDate(this.createAT)}</span>
                    </div>
                </div>
                <p class="msgContent">${this.content}</p>
            </div>
        `
    }

    static fromObject(obj) {
        return new Message(
            obj.messageID,
            obj.senderID,
            obj.receiverID,
            obj.content,
            obj.statusReceived,
            obj.statusRead,
            obj.createAT,
            obj.status
        );
    }
}