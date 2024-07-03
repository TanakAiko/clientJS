export class Post {
    constructor(id, userId, categorie, content, img, nbrLike, nbrDislike, createAt,nickName) {
        this.id = id
        this.userId = userId
        this.categorie = categorie
        this.content = content
        this.img = img
        this.nbrLike = nbrLike
        this.nbrDislike = nbrDislike
        this.createAt = createAt
        this.nickName = nickName
    }

    getHtml() {
        return `<div class="post-container">
                    <div class="user-prfile">
                        <img src="./static/images/user-alt.svg">
                        <div>
                            <p>${this.nickName}</p>
                            <span>${this.createAt}</span>
                        </div>
                    </div>

                    <div class="postCategories">Here are the categories</div>

                    <p class="postText">${this.content}</p>

                    <img src="${this.img}" class="postImage">

                    <div class="postRow">
                        <div class="upDiv"> <img class="shrink up"
                                src="./static/images/thumbs-up.svg">
                            <p>${this.nbrLike}</p>
                        </div>
                        <div class="downDiv"> <img class="shrink down" src="./static/images/thumbs-down-green.svg">
                            <p>${this.nbrDislike}</p>
                        </div>
                        <div> <img class="shrink" src="./static/images/comments-regular.svg">1315</div>
                    </div>
                </div>`
    }

}


