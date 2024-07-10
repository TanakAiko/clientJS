export class Post {
    constructor(id, userId, nickName, categorie, likedBy, dislikedBy, content, img, imgBase64, nbrLike, nbrDislike, createAt) {
        this.id = id
        this.userId = userId
        this.nickName = nickName
        this.categorie = categorie
        this.likedBy = likedBy
        this.dislikedBy = dislikedBy
        this.content = content
        this.img = img
        this.imgBase64 = imgBase64
        this.nbrLike = nbrLike
        this.nbrDislike = nbrDislike
        this.createAt = createAt
    }

    getHtml(src) {
        return `<div class="post-container" id="${this.id}">
                    <div class="user-prfile">
                        <img src="./static/images/user-alt.svg">
                        <div>
                            <p>${this.nickName}</p>
                            <span>${this.createAt}</span>
                        </div>
                    </div>

                    <div class="postCategories">${this.categorie}</div>

                    <p class="postText">${this.content}</p>

                    <img src="${src}" class="postImage">

                    <div class="postRow" data-id="${this.id}" data-likedBy="${this.likedBy}" data-dislikedBy="${this.dislikedBy}">
                        <div class="upDiv"> <img class="shrink up" src="./static/images/thumbs-up.svg">
                            <p>${this.nbrLike}</p>
                        </div>
                        <div class="downDiv"> <img class="shrink down" src="./static/images/thumbs-down.svg">
                            <p>${this.nbrDislike}</p>
                        </div>
                        <div class="commentDiv"> <img class="shrink" src="./static/images/comments-regular.svg">0</div>
                    </div>
                </div>`
    }

}


