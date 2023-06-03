const mongoose = require('mongoose');

const postLike = new mongoose.Schema({
    post: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Post"
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('PostLike', postLike);