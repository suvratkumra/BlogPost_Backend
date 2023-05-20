const { default: mongoose } = require("mongoose");
const database = require("../utils/dbConnect");
const User = require("./userModel");


const postModel = new mongoose.Schema({
    file: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    subcaption: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comments: {
        type: Array
    },
});

// adding the User model to our database.
const Post = mongoose.model("Post", postModel);

module.exports = Post;

