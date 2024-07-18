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
            <div>
                <p>${nicknameSender}</p>
                <span>${this.createAT}</span>
            </div>
            <p>${this.content}</p>
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