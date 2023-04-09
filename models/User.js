const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        maxlength: 32,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        maxlength: 124,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User',userSchema);