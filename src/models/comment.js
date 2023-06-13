const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    uploader: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    read:{
        type:Boolean
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;