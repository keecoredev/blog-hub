module.exports = class PostDTO {

    id;
    title;
    description;
    content;
    createdDate;
    username;
    likes_count;

    constructor(postObject){
        this.id = postObject._id;
        this.title = postObject.title;
        this.description = postObject.description;
        this.content = postObject.content;
        this.createdDate = postObject.createdDate;
        this.username = postObject.owner.username;
        this.likes_count = this.likes_count;
    }
}