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

    getHtml() {
        return `
        <div class="${this.status}" id="${this.messageID}-message" data-idSender="${this.senderID}" data-idReceiver="${this.receiverID}" data-statusReceived="${this.statusReceived}" data-statusRead="${this.statusRead}">
            <span>${this.createAT}</span>
            <p>${this.content}</p>
         </div>
        `
    }
}