const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        maxlength: 128,
        required: true
    },
    description: {
        type: String,
        maxlength: 1024,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdDate: {
        type:Date,
        default: Date.now()
    },
    likes_count: {
        type:Number,
        required: true,
        default: 0
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    liked: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Post',postSchema);