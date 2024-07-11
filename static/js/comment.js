export class Comment {
    constructor(id, postId, userId, nickname, likedBy, dislikedBy, content, nbrLike, nbrDislike, createAt) {
        this.id = id
        this.postId = postId
        this.userId = userId
        this.nickname = nickname
        this.likedBy = likedBy
        this.dislikedBy = dislikedBy
        this.content = content
        this.nbrLike = nbrLike
        this.nbrDislike = nbrDislike
        this.createAt = createAt
    }

    getHtml() {
        return `<div id="${this.id}" data-postId="${this.postId}">
                    <div class="user-prfile">
                        <img src="./static/images/user-alt.svg">
                        <div>
                            <p>${this.nickname}</p>
                            <span>${this.createAt}</span>
                        </div>
                    </div>

                    <p class="commentText">${this.content}</p>

                    <div class="postRow" data-id="${this.id}" data-likedBy="${this.likedBy}" data-dislikedBy="${this.dislikedBy}">
                        <div class="upDiv">
                            <img class="shrink up" src="./static/images/thumbs-up.svg">
                            <p>${this.nbrLike}</p>
                        </div>
                        <div class="downDiv">
                            <img class="shrink down" src="./static/images/thumbs-down.svg">
                            <p>${this.nbrDislike}</p>
                        </div>
                    </div>
                </div>
        `
    }

}