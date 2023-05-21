const { default: mongoose } = require("mongoose");
const database = require("../utils/dbConnect");
const { Timestamp } = require("mongodb");

const commentModel = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

// adding the User model to our database.
const Comment = mongoose.model("Comment", commentModel);

module.exports = Comment;

