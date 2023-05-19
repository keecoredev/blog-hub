const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        maxlength: 64,
        required: true
    },
    description: {
        type: String,
        maxlength: 1024,
        required: true
    },
    createdDate: {
        type: Date.now()
    },
    likes: {
        type:Number,
        required: true
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }
});


module.exports = mongoose.model('Post',postSchema);