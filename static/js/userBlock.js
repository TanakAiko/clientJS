export class UserBlock {
    constructor(nickname, userId, status) {
        this.nickname = nickname
        this.userId = userId
        this.status = status
    }

    getHtml() {
        return `
        <div class="onlineList shrink user" data-userId="${this.userId}">
                <div class="${this.status}">
                    <img src="./static/images/user-alt.svg">
                </div>
                <p>${this.nickname}</p>
            </div>
        `
    }

    static fromObject(obj) {
        return new UserBlock(
            obj.nickname,
            obj.userId,
            obj.status
        );
    }
}